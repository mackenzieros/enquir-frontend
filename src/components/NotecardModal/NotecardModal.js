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
import Loader from '../Loader/Loader';
import Confirmer from '../Confirmer/Confirmer';
import { Storage } from '../../services/Storage';
import { PushNotification } from '../../services/PushNotification';
import { search } from '../../helpers/BinarySearch';

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
  } else {
    return <Icon name="question" size={35} color='#fffdf9' style={{ marginTop: 5 }} />;
  }
};

const NotifIcon = ({ notifications }) => {
  if (notifications) {
    return <Icon name='bell' size={20} style={buttons.notifButton} />;
  } else {
    return <Icon name='bell-slash' size={20} style={buttons.notifButton} />;
  }
};

export default class NotecardModal extends Component {
  state = {
    isLoading: false,
    noteObj: null,
    showingQuestions: false,
    showingAddQuestionButton: true,
    topicInput: '',
    notesInput: '',
    questions: [],
    notificationsPrev: false, // used for scheduling notifications on state change only; to avoid scheduling notifs on every save
    notifications: true,
    hasChanges: false,
    needsConfirmation: false,
  };
  validChanges = new Set(["topicInput", "notesInput", "questions", "notifications"]);

  resetNotecard = () => {
    this.state.questions.length = 0;
    this.setState({
      isLoading: false,
      noteObj: null,
      showingQuestions: false,
      showingAddQuestionButton: true,
      topicInput: '',
      notesInput: '',
      questions: this.state.questions,
      notificationsPrev: false,
      notifications: true,
      hasChanges: false,
      needsConfirmation: false,
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
        noteObj: item,
        topicInput: item.topic,
        notesInput: item.notes,
        showingQuestions: false,
        questions: item.questions,
        notificationsPrev: item.notifications,
        notifications: item.notifications,
      });
    }
  };

  // Called within confirmer to handle unsaved changes
  onConfirmation = async (decision) => {
    this.setState({
      needsConfirmation: false,
    });
    if (decision === "discard") {
      this.setState({
        hasChanges: false,
      });
      this.resetNotecard();
      this.props.onClose && this.props.onClose();
    } else if (decision === "save") {
      await this.onSave();
    }
  };

  // Close the modal in parent component
  onClose = () => {
    if (this.state.hasChanges) {
      this.setState({
        needsConfirmation: true,
      });
    } else {
      this.props.onClose && this.props.onClose();
    }
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
      loadingState: 'Saving...',
    });

    // get existing notes
    const existingNotes = await Storage.retrieveNotes();

    // default topic name
    const topic = this.state.topicInput.length > 0 ? this.state.topicInput : 'Untitled';
    var id = -1;
    // overwrite notecard
    if (this.state.noteObj) {
      id = existingNotes.findIndex((note) => note.id == this.state.noteObj.id);
      existingNotes[id] = {
        id: id,
        topic: topic,
        notes: this.state.notesInput,
        questions: this.state.questions,
        notifications: this.state.notifications,
      }
    } else {
      // add new notecard
      id = existingNotes.length == 0 ? 0 : existingNotes[existingNotes.length - 1].id + 1;

      existingNotes.push({
        id: id,
        topic: topic,
        notes: this.state.notesInput,
        questions: this.state.questions,
        notifications: this.state.notifications,
      });
    }

    // write to storage
    await Storage.addNotes(existingNotes);

    // persist notification setting
    this._toggleNotifications(id);

    // reset modal
    this.resetNotecard();

    this.props.onSave && this.props.onSave();
  };

  // Scrape web page for content on a topic
  autoPop = async () => {
    const { topicInput, notesInput } = this.state;
    if (topicInput.length < 1) {
      Alert.alert('Uh oh!', 'To use the auto notecard maker, a topic must be provided');
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

      if (res.status !== 200 && res.status !== 201) {
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
      if (this.state.notesInput.length < 1) {
        Alert.alert('Whoops!', 'To generate questions, please write some notes.');
        return;
      }

      this.setState({
        isLoading: true,    // show loader while request is performing
        loadingState: 'Creating questions...',
      });

      const res = await axios.post(QUESTION_GENERATOR_API_URL, {
        blurb: this.state.notesInput,
      });

      if (res.status !== 201) {
        throw Error;
      }

      const { questions } = res.data;
      if (questions.length < 1) {
        Alert.alert('Sorry!', 'We were unable to create questions from your notes.');
      } else {
        var lastId = this.state.questions.length ? this.state.questions[this.state.questions.length - 1].id : -1;
        const newQuestions = questions.map(question => ({
          id: ++lastId,
          question: question,
        }));
        this.setState({
          questions: this.state.questions.concat(newQuestions),    // add to existing questions
        });
      }
    } catch (err) {
      console.log('Err occurred communicating with question generator: ', err);
      Alert.alert('Whoops!', 'We\'re having trouble connecting to the our servers.');
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
    const index = search(id, this.state.questions, "id");
    if (index == -1) {
      console.log('Error occurred while trying to save question.');
      return;
    }

    const questions = [...this.state.questions];
    questions[index].question = newQuestion;

    this.setState({
      questions: questions,
    });
  };

  // Removes a question
  deleteQuestion = (id) => {
    const index = search(id, this.state.questions, "id");
    if (index == -1) {
      console.log('Error occurred: could not find question to delete');
      return;
    }

    const questions = [
      ...this.state.questions.slice(0, index),
      ...this.state.questions.slice(index + 1)
    ];

    // Remove the notification associated with the question
    const notifId = (this.state.noteObj.id.toString()).concat((id).toString());
    PushNotification.cancelLocalNotification(notifId);

    this.setState({
      questions: questions,
    });
  };

  // Schedules or cancels notifications depending on toggle value (called on-save)
  _toggleNotifications = (id) => {
    const { notificationsPrev, notifications, topicInput } = this.state;
    if (notificationsPrev === notifications) {
      return;
    }

    var fn = null;
    if (notifications) {
      fn = PushNotification.localNotificationSchedule;
    } else {
      fn = PushNotification.cancelLocalNotification;
    }

    this.state.questions.forEach(questionObj => {
      const notifId = (id.toString()).concat((questionObj.id).toString());
      const { question } = questionObj;
      fn(notifId, topicInput, question);
    });
  };

  // Toggles notification setting
  toggleNotifications = () => {
    const { notifications } = this.state;
    this.setState({
      notifications: !notifications,
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

  // Checks when the notecard updates, if any changes to topic input, notes input, questions, or notifications settings occurred.
  // If so, then we set the state of having changes to be true so we can notify the user.
  componentDidUpdate(prevProps, prevState) {        // the following are state changes describing a valid update
    if ((!prevState.noteObj && !this.state.noteObj)  // case 1: update on empty card
      || ((prevState.noteObj && this.state.noteObj) && (prevState.noteObj.id === this.state.noteObj.id))) {  // case 2: update on existing card
      const difference = Object.keys(prevState).filter(k => prevState[k] !== this.state[k] && this.validChanges.has(k));
      if (difference.length && !this.state.hasChanges) {
        this.setState({
          hasChanges: true,
        });
      }
    }
  };

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

    const {
      isLoading,
      loadingState,
      showingQuestions,
      showingAddQuestionButton,
      topicInput,
      notesInput,
      questions,
      notifications,
      needsConfirmation,
    } = this.state;

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
            <Confirmer
              confirming={needsConfirmation}
              confirmation={this.onConfirmation}
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
                              <View style={containers.questionGenButtonContainer}>
                                <Icon name='question-circle' size={28} color={'white'} />
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={this.toggleNotifications}>
                              <View style={containers.notifButtonContainer}>
                                <NotifIcon notifications={notifications} />
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
                        <Icon name='plus' size={30} style={{ marginLeft: 16, color: 'white', }} />
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