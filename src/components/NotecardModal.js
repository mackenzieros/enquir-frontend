import React, { Component } from 'react';
import axios from 'axios';
import { Modal, TouchableOpacity, Text, KeyboardAvoidingView, Button, View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import QuestionModal from './QuestionModal';
import Storage from '../storage/Storage';

const storage = new Storage();
const WEB_SCRAPER_API_URL = 'EC2Co-EcsEl-3QPW7ZVE3WXS-1593988200.us-west-1.elb.amazonaws.com:5000/autopopcontent';
const QUESTION_GENERATOR_API_URL = 'https://rocky-caverns-51964.herokuapp.com/genquest';

export default class NotecardModal extends Component {
    state = {
        isLoading: false,
        noteItem: null,
        showingQuestionModal: false,
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
        if (item == undefined) {
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

    // Handles opening of question modal
    showQuestionModal = () => {
        this.setState({
            showingQuestionModal: !this.state.showingQuestionModal
        });
    };

    // Saves notecard and generates questions
    onSave = async () => {
        this.setState({
            isLoading: true,    // show loader while request is performing
        });

        // get existing notes
        const existingNotes = await storage.retrieveNotes();

        // generate questions
        await this.generateQuestions();

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
            const res = await axios.post(QUESTION_GENERATOR_API_URL, {
                blurb: this.state.notesInput,
            });

            this.setState({
                questions: res.data.questions,
            });
        } catch (err) {
            console.log('Err occurred communicating with question generator: ', err);
        }
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        const { isLoading, showingQuestionModal, notesInput, questions } = this.state;

        return (
            <Modal
                animationType='slide'
                onRequestClose={this.onClose} >
                <QuestionModal
                    show={showingQuestionModal}
                    onClose={this.showQuestionModal}
                    questions={questions}
                />
                {
                    isLoading &&
                    <ActivityIndicator size='large' color='#0064e1' />
                }

                {
                    !isLoading &&
                    <View style={{ flex: 1 }}>
                        <View style={styles.menu}>
                            <View style={styles.closeContainer}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={this.onClose} >
                                    <Text style={styles.closeButtonText}>{'<'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.questionContainer}>
                                <TouchableOpacity
                                    syle={styles.questionButton}
                                    onPress={this.showQuestionModal} >
                                    <Text style={styles.questionButtonText}>?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.saveContainer}>
                                <Button
                                    syle={styles.saveButton}
                                    onPress={this.onSave}
                                    title='Save'
                                />
                            </View>
                        </View>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                            enabled >
                            <View style={styles.container}>
                                <View style={styles.topicContainer}>
                                    <TextInput
                                        style={styles.topicInput}
                                        onChangeText={(topicInput) => this.setState({ topicInput })}
                                        value={this.state.topicInput}
                                        placeholder={'Enter topic'}
                                    />
                                </View>
                                <View style={styles.autoPopContainer}>
                                    <Button
                                        style={styles.autoPopButton}
                                        onPress={this.autoPop}
                                        title='auto'
                                    />
                                </View>
                                <View style={styles.notesContainer}>
                                    <TextInput
                                        style={styles.notesInput}
                                        multiline={true}
                                        onChangeText={(notesInput) => this.setState({ notesInput })}
                                        value={notesInput}
                                        placeholder={'Enter notes'}
                                        textAlignVertical={'top'}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
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
    },
    closeButton: {
        width: 65,
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 50,
        alignSelf: 'center',
        color: 'grey',
    },
    questionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    questionButton: {
        // overflow: 'hidden',
        width: 60,
        height: 60,
        position: 'absolute',
        // left: 80,
        // bottom: 62,
        // borderTopLeftRadius: 150,
        // borderBottomLeftRadius: 150,
        backgroundColor: 'black'
    },
    questionButtonText: {
        fontSize: 24,
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
    autoPopContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 20,
    },
    autoPopButton: {
    },
    notesContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: "#eaeaea",
        borderRadius: 4,
        marginHorizontal: 25,
        marginTop: 10,
        marginBottom: 35,
        elevation: 10,
    },
    notesInput: {
        flex: 1,
        margin: 10,
        // fontFamily: 'Roboto',
        fontSize: 18,
    }
});
