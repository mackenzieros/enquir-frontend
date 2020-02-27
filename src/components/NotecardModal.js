import React, { Component } from 'react';
import axios from 'axios';
import { Modal, TouchableOpacity, FlatList, Text, KeyboardAvoidingView, Button, View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Question from './Question';
import Storage from '../storage/Storage';

const storage = new Storage();
const WEB_SCRAPER_API_URL = 'EC2Co-EcsEl-WJW99ZSC6W4S-1501695430.us-west-1.elb.amazonaws.com:5000/autopopcontent';
const QUESTION_GENERATOR_API_URL = 'https://rocky-caverns-51964.herokuapp.com/genquest';

export default class NotecardModal extends Component {
    state = {
        isLoading: false,
        noteItem: null,
        showingQuestions: false,
        topicInput: '',
        notesInput: '',
        questions: [],
    };

    resetNotecard = () => {
        this.setState({
            isLoading: false,
            noteItem: null,
            topicInput: '',
            notesInput: '',
            questions: [],
        });
    };

    // Called by Main component to pass data to modal
    loadData = (item) => {
        // If no item is passed, reset state of modal to represent an empty notecard,
        // otherwise populate the notecard with info
        if (item == null) {
            this.resetNotecard();
        } else {
            this.setState({
                noteItem: item,
                topicInput: item.topic,
                notesInput: item.notes,
                questions: item.questions,
            });
        }
    };

    // Close the modal in parent component
    onClose = () => {
        // TODO: modal asking 'Are you sure? Unsaved changes will be lost!'
        this.props.onClose && this.props.onClose();
    };

    // Handles display of questions
    showQuestions = () => {
        this.setState({
            showingQuestions: !this.state.showingQuestions,
        });
    };

    // Saves notecard and generates questions
    onSave = async () => {
        this.setState({
            isLoading: true,    // show loader while request is performing
        });

        // get existing notes
        const existingNotes = await storage.retrieveNotes();

        // default topic name
        const topic = this.state.topicInput.length > 0 ? this.state.topicInput : 'Untitled';

        // overwrite notecard
        if (this.state.noteItem) {
            const index = (existingNotes.findIndex((note) => note.id == this.state.noteItem.id)).toString();
            existingNotes[index] = {
                id: index,
                topic: topic,
                notes: this.state.notesInput,
                questions: this.state.questions,
            }
        } else {
            // add new notecard
            const lastIndex = existingNotes.length > 0 ? existingNotes[existingNotes.length - 1].id : -1;
            const newIndex = (Number.parseInt(lastIndex) + 1).toString();

            existingNotes.push({
                id: newIndex,
                topic: topic,
                notes: this.state.notesInput,
                questions: this.state.questions,
            });
        }

        // write to storage
        await storage.addNotes(existingNotes);

        // reset modal
        this.resetNotecard();

        this.props.onSave && this.props.onSave();
    };

    // Scrape web page for content on a topic
    autoPop = async () => {
        try {
            this.setState({
                isLoading: true,    // show loader while request is performing
            });

            const res = await axios.post(WEB_SCRAPER_API_URL, {
                query: this.state.topicInput,
            });

            this.setState({
                isLoading: false,
                notesInput: res,
            });
        } catch (err) {
            console.log('Err occurred communicating with scraper: ', err);
        }
    };

    // Generate questions given content
    generateQuestions = async () => {
        try {
            // TODO: show progress modal
            const res = await axios.post(QUESTION_GENERATOR_API_URL, {
                blurb: this.state.notesInput,
            });

            this.setState({
                questions: this.state.questions.concat(res.data.questions),    // add to existing questions
            });
        } catch (err) {
            console.log('Err occurred communicating with question generator: ', err);
        }
    };

    // For displaying icon of tab
    tab = () => {
        if (this.state.showingQuestions) {
            return 'N';
        }
        return '?';
    };

    addQuestion = () => {
        this.setState({
            questions: this.state.questions.concat(['']),
        });
    };

    deleteQuestion = (item) => {
        var questions = null;
        for (var i = 0; i < this.state.questions.length; ++i) {
            if (i == item.index) {
                questions = [
                    ...this.state.questions.slice(0, i),
                    ...this.state.questions.slice(i + 1)
                ];
                break;
            }
        }

        if (!questions) {
            console.log('err deleting question');
            return;
        }

        this.setState({
            questions: questions,
        });
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        const { isLoading, showingQuestions, notesInput, questions } = this.state;

        return (
            <Modal
                animationType='slide'
                onRequestClose={this.onClose} >
                {
                    isLoading &&
                    <ActivityIndicator size='large' color='#0064e1' />
                }

                {
                    !isLoading &&
                    <View style={{ flex: 1 }}>
                        <View style={styles.menu}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={this.onClose} >
                                <View style={styles.closeContainer}>
                                    <Text style={styles.closeButtonText}>{'<'}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.saveContainer}>
                                <Button
                                    syle={styles.saveButton}
                                    onPress={this.onSave}
                                    title='Save'
                                />
                            </View>
                        </View>
                        <View style={styles.container}>
                            <View style={styles.topicContainer}>
                                <TextInput
                                    style={styles.topicInput}
                                    onChangeText={(topicInput) => this.setState({ topicInput })}
                                    value={this.state.topicInput}
                                    placeholder={'Enter topic'}
                                />
                            </View>
                            <View style={styles.tabContainer}>
                                <Button
                                    style={styles.autoPopButton}
                                    onPress={this.autoPop}
                                    title='auto'
                                />
                                <TouchableOpacity
                                    onPress={this.showQuestions} >
                                    <View style={styles.questionTab}>
                                        <Text style={styles.questionButtonText}>{this.tab()}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.notesContainer}>
                                {
                                    showingQuestions &&
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.questionsHeader}>
                                            <Text style={styles.questionHeaderText}>Question Bank</Text>
                                            <View style={styles.questionHeaderButtons}>
                                                <TouchableOpacity
                                                    onPress={this.generateQuestions} >
                                                    <View style={styles.questionGenButton}>
                                                        <Text>{'G'}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity>
                                                    <View style={styles.notifButton}>
                                                        <Text>{'N'}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <FlatList
                                            data={questions}
                                            renderItem={(question) =>
                                                <Question
                                                    question={question}
                                                    delete={this.deleteQuestion}
                                                />
                                            }
                                            keyExtractor={(item, index) => index.toString()}
                                            style={styles.questionsList}
                                        />
                                        <TouchableOpacity
                                            style={styles.addQuestionButton}
                                            onPress={this.addQuestion} >
                                            <Text style={styles.addButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                                {
                                    !showingQuestions &&
                                    <TextInput
                                        style={styles.notesInput}
                                        multiline={true}
                                        onChangeText={(notesInput) => this.setState({ notesInput })}
                                        value={notesInput}
                                        placeholder={'Enter notes'}
                                        textAlignVertical={'top'}
                                    />
                                }
                            </View>
                        </View>
                    </View>
                }
            </Modal>
        );
    }
};

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 65,
        height: 40,
        backgroundColor: 'white',
    },
    closeButton: {
        marginLeft: 20,
    },
    closeButtonText: {
        fontSize: 50,
        alignSelf: 'center',
        color: 'grey',
    },
    saveContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveButton: {
    },
    container: {
        flex: 1,
    },
    topicContainer: {
        flexDirection: 'row',
        backgroundColor: "#eaeaea",
        marginHorizontal: 25,
        marginTop: 20,
        marginBottom: 10,
    },
    topicInput: {
        flex: 1,
        borderColor: "#ccc",
        margin: 10,
        // fontFamily: 'Roboto',
        fontSize: 19,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
    },
    autoPopButton: {
    },
    questionTab: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        width: 40,
        marginRight: 6,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
        backgroundColor: 'green',
    },
    questionButtonText: {
        fontSize: 24,
    },
    notesContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: "#eaeaea",
        borderRadius: 4,
        marginHorizontal: 25,
        // marginTop: 10,
        marginBottom: 35,
        elevation: 10,
    },
    notesInput: {
        flex: 1,
        margin: 10,
        // fontFamily: 'Roboto',
        fontSize: 18,
    },
    questionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        elevation: 5,
    },
    questionHeaderText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    questionHeaderButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    questionGenButton: {
    },
    notifButton: {
    },
    questionsList: {
        marginTop: 14,
    },
    addQuestionButton: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        backgroundColor: '#00BCD4',
        position: 'absolute',
        bottom: 40,
        right: 30,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        elevation: 7,
    },
});
