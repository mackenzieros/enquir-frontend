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
  TextInput,
} from 'react-native';
import { containers, buttons, inputs, text } from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Question from '../Question/Question';
import { Storage } from '../../services/Storage';
import { PushNotification } from '../../services/PushNotification';
import Loader from '../Loader/Loader';

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
        showingQuestions: false,
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
    // PushNotification.localNotification('Test Topic', 'When was I born?');
    PushNotification.localNotificationSchedule('Schedule Test', 'Where am I?');
    this.setState({
      isLoading: true,    // show loader while request is performing
      loadingState: 'Saving...',
    });

    // get existing notes
    const existingNotes = await Storage.retrieveNotes();

    // default topic name
    const topic = this.state.topicInput.length > 0 ? this.state.topicInput : 'Untitled';

    // overwrite notecard
    if (this.state.noteItem) {
      const index = existingNotes.findIndex((note) => note.id == this.state.noteItem.id);
      existingNotes[index] = {
        id: index,
        topic: topic,
        notes: this.state.notesInput,
        questions: this.state.questions,
      }
    } else {
      // add new notecard
      const newIndex = existingNotes.length == 0 ? 0 : existingNotes[existingNotes.length - 1].id + 1;

      existingNotes.push({
        id: newIndex,
        topic: topic,
        notes: this.state.notesInput,
        questions: this.state.questions,
      });
    }

    // write to storage
    await Storage.addNotes(existingNotes);

    // reset modal
    this.resetNotecard();

    this.props.onSave && this.props.onSave();
  };

  // Scrape web page for content on a topic
  autoPop = async () => {
    const { topicInput, notesInput } = this.state;
    if (topicInput.length < 1) {
      Alert.alert('To use the auto notecard maker, a topic must be provided');
      return;
    }

    try {
      this.setState({
        isLoading: true,    // show loader while request is performing
        loadingState: 'Gathering notes...',
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
        loadingState: 'Creating questions...',
      });

      const res = await axios.post(QUESTION_GENERATOR_API_URL, {
        blurb: this.state.notesInput,
      });

      const { questions } = res.data;

      if (questions.length < 1) {
        Alert.alert('Sorry!', 'Could not generate questions for this notecard');
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

  // Add an empty question
  addQuestion = () => {
    const { questions } = this.state;
    const id = questions.length == 0 ? 0 : questions[questions.length - 1].id + 1;
    this.setState({
      questions: this.state.questions.concat({
        id,
        question: '',
      }),
    });
  };

  // Overwrite an existing questions content
  saveQuestion = (id, newQuestion) => {
    var questions = null;
    for (var i = 0; i < this.state.questions.length; ++i) {
      if (this.state.questions[i].id == id) {
        questions = [...this.state.questions];
        questions[i].question = newQuestion;
        break;
      }
    }

    if (questions == null) {
      console.log('Error occurred while trying to save question.');
      return;
    }

    this.setState({
      questions: questions,
    });
  };

  // Removes a question
  deleteQuestion = (id) => {
    var questions = null;
    for (var i = 0; i < this.state.questions.length; ++i) {
      if (this.state.questions[i].id == id) {
        var questions = [
          ...this.state.questions.slice(0, i),
          ...this.state.questions.slice(i + 1)
        ];
        break;
      }
    }

    if (questions == null) {
      console.log('Error occurred: could not find question to delete');
      return;
    }

    this.setState({
      questions: questions,
    });
  };

  // Keyboard listener for hiding/showing a button if keyboard is active/inactive
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

    const { isLoading, loadingState, showingQuestions, showingAddQuestionButton, topicInput, notesInput, questions } = this.state;

    return (
      <Modal
        animationType='slide'
        onRequestClose={this.onClose} >
        <DismissKeyboard>
          <View style={{ flex: 1 }}>
            <Loader
              loading={isLoading}
              loadText={loadingState}
            />
            <View style={containers.menu}>
              <TouchableOpacity
                style={buttons.closeButton}
                onPress={this.onClose} >
                <View style={containers.closeContainer}>
                  <Icon name='chevron-left' size={30} />
                </View>
              </TouchableOpacity>
              <View style={containers.saveContainer}>
                <TouchableOpacity
                  onPress={this.onSave} >
                  <Text style={text.saveButtonText}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={containers.content}>
              <View style={containers.topicContainer}>
                <TextInput
                  style={inputs.topicInput}
                  onChangeText={(topicInput) => this.setState({ topicInput })}
                  value={topicInput}
                  placeholder={'Enter topic'}
                />
              </View>
              <View style={containers.tabContainer}>
                <TouchableOpacity
                  onPress={this.autoPop} >
                  <View style={buttons.autoPopButtonContainer}>
                    <Icon name='magic' size={30} color='#fffdf9' style={{ marginTop: 5.5 }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.showQuestions} >
                  <View style={buttons.questionTab}>
                    <TabIcon showingQuestions={showingQuestions} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={containers.notesContainer}>
                {
                  showingQuestions &&
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={questions}
                      renderItem={({ item }) =>
                        <Question
                          id={item.id}
                          question={item.question}
                          save={this.saveQuestion}
                          delete={this.deleteQuestion}
                        />
                      }
                      keyExtractor={item => (item.id).toString()}
                      stickyHeaderIndices={[0]}
                      ListHeaderComponent={() =>
                        <View style={containers.questionsHeader}>
                          <Text style={text.questionHeaderText}>Questions</Text>
                          <View style={buttons.questionHeaderButtons}>
                            <TouchableOpacity
                              onPress={this.generateQuestions} >
                              <View style={buttons.questionGenButton}>
                                <Icon name='question-circle' size={25} />
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View style={buttons.notifButton}>
                                <Icon name='bell' size={20} />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      }
                      ListFooterComponent={() => <View />}
                      ListFooterComponentStyle={containers.emptyBlock}
                    />
                    {
                      showingAddQuestionButton &&
                      <TouchableOpacity
                        style={buttons.addQuestionButton}
                        onPress={this.addQuestion} >
                        <Icon name='plus' size={30} style={{ marginLeft: 16, }} />
                      </TouchableOpacity>
                    }
                  </View>
                }

                {
                  !showingQuestions &&
                  <TextInput
                    style={inputs.notesInput}
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