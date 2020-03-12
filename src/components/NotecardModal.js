import React, { Component } from 'react';
import axios from 'axios';
import {
    Alert,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Text,
    Keyboard,
    View,
    StyleSheet,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Question from './Question';
import Storage from '../storage/Storage';
import Loader from './Loader';

const storage = new Storage();
const WEB_SCRAPER_API_URL = 'https://czx2q94gxb.execute-api.us-west-1.amazonaws.com/dev/autopopcontent';
const QUESTION_GENERATOR_API_URL = 'https://rocky-caverns-51964.herokuapp.com/genquest';

// Dismiss keyboard when touching anywhere
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

// For displaying tab icon
const TabIcon = ({ showingQuestions }) => {
    if (showingQuestions) {
        return <Icon name="pencil" size={35} color='#fffdf9' style={{ marginTop: 5 }} />;
    }
    return <Icon name="question" size={35} color='#fffdf9' style={{ marginTop: 5 }} />;
};

export default class NotecardModal extends Component {
    state = {
        isLoading: false,
        noteItem: null,
        showingQuestions: false,
        showingAddQuestionButton: true,
        topicInput: '',
        notesInput: '',
        questions: [],
    };

    resetNotecard = () => {
        this.setState({
            isLoading: false,
            noteItem: null,
            showingQuestions: false,
            showingAddQuestionButton: true,
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
        const { topicInput, notesInput } = this.state;
        if (topicInput.length < 1) {
            Alert.alert('To use the auto notecard maker, a topic must be provided!');
            return;
        }

        try {
            this.setState({
                isLoading: true,    // show loader while request is performing
            });

            const res = await axios.post(WEB_SCRAPER_API_URL, {
                query: this.state.topicInput,
            });

            if (res.status !== 200) {
                throw Error;
            }

            const { data } = res;

            // Add a couple newlines if notes already exist
            this.setState({
                notesInput: notesInput.length ? notesInput.concat(`\n\n${data.blurb}`) : data.blurb,
            });
        } catch (err) {
            console.log('Err occurred communicating with scraper: ', err);
            Alert.alert('Sorry!', `Couldn\'t find notes for "${topicInput}"`);
        }
        this.setState({
            isLoading: false,
        });
    };

    // Generate questions given content
    generateQuestions = async () => {
        try {
            this.setState({
                isLoading: true,    // show loader while request is performing
            });

            const res = await axios.post(QUESTION_GENERATOR_API_URL, {
                blurb: this.state.notesInput,
            });

            const { questions } = res.data;

            if (questions.length < 1) {
                Alert.alert('Sorry!', 'Wasn\'t able to generate questions for this notecard');
            } else {
                this.setState({
                    questions: this.state.questions.concat(res.data.questions),    // add to existing questions
                });
            }
        } catch (err) {
            console.log('Err occurred communicating with question generator: ', err);
            Alert.alert('ERROR', 'Unable to generate questions');
        }
        this.setState({
            isLoading: false,
        });
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

    _keyboardDidShow = () => {
        this.setState({
            showingAddQuestionButton: false,
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            showingAddQuestionButton: true,
        });
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        const { isLoading, showingQuestions, showingAddQuestionButton, notesInput, questions } = this.state;

        return (
            <Modal
                animationType='slide'
                onRequestClose={this.onClose} >
                <DismissKeyboard>
                    <View style={{ flex: 1 }}>
                        <Loader
                            loading={isLoading}
                        />
                        <View style={styles.menu}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={this.onClose} >
                                <View style={styles.closeContainer}>
                                    <Icon name='chevron-left' size={30} />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.saveContainer}>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={this.onSave} >
                                    <Text style={styles.saveButtonText}>SAVE</Text>
                                </TouchableOpacity>
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
                                <TouchableOpacity
                                    onPress={this.autoPop} >
                                    <View style={styles.autoPopButtonContainer}>
                                        <Icon name='magic' size={30} color='#fffdf9' style={{ marginTop: 5.5 }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.showQuestions} >
                                    <View style={styles.questionTab}>
                                        <TabIcon showingQuestions={showingQuestions} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.notesContainer}>
                                {
                                    showingQuestions &&
                                    <View style={{ flex: 1 }}>
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
                                            stickyHeaderIndices={[0]}
                                            ListHeaderComponent={() =>
                                                <View style={styles.questionsHeader}>
                                                    <Text style={styles.questionHeaderText}>Questions</Text>
                                                    <View style={styles.questionHeaderButtons}>
                                                        <TouchableOpacity
                                                            onPress={this.generateQuestions} >
                                                            <View style={styles.questionGenButton}>
                                                                <Icon name='question-circle' size={25} />
                                                            </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity>
                                                            <View style={styles.notifButton}>
                                                                <Icon name='bell' size={20} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                            ListFooterComponent={() => <View />}
                                            ListFooterComponentStyle={styles.emptyBlock}
                                        />
                                        {
                                            showingAddQuestionButton &&
                                            <TouchableOpacity
                                                style={styles.addQuestionButton}
                                                onPress={this.addQuestion} >
                                                <Icon name='plus' size={30} style={{ marginLeft: 16, }} />
                                            </TouchableOpacity>
                                        }
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
                </DismissKeyboard>
            </Modal>
        );
    }
};

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    closeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 65,
        height: 30,
        marginTop: 5,
        backgroundColor: 'white',
    },
    closeButton: {
        marginLeft: 16,
        marginVertical: 7,
    },
    saveContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveButtonText: {
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        marginRight: 18,
    },
    container: {
        flex: 1,
    },
    topicContainer: {
        flexDirection: 'row',
        backgroundColor: "#eaeaea",
        marginHorizontal: 25,
        marginBottom: 10,
    },
    topicInput: {
        flex: 1,
        borderColor: "#ccc",
        margin: 10,
        fontSize: 19,
        fontFamily: 'Roboto-Medium',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
    },
    autoPopButtonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        marginLeft: 37,
        marginBottom: 5,
        height: 40,
        width: 40,
        borderRadius: 40,
        backgroundColor: '#8ac6d1',
    },
    questionTab: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        width: 50,
        height: 45,
        marginTop: 5,
        marginRight: 6,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
        backgroundColor: '#35477d',
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
        marginBottom: 35,
        elevation: 10,
    },
    notesInput: {
        flex: 1,
        margin: 10,
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
    questionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        elevation: 5,
        backgroundColor: '#d1d1d1',
    },
    questionHeaderText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        fontSize: 22,
        fontFamily: 'Roboto-Medium',
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
    },
    emptyBlock: {
        paddingVertical: 36,
        paddingLeft: 18,
        paddingRight: 16,
        marginTop: 0,
        marginBottom: 8,
    },
    addQuestionButton: {
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        backgroundColor: '#00BCD4',
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        elevation: 7,
    },
});
