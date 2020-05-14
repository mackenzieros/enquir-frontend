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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  showQuestions,
  toggleLoader,
  loadData,
  changes,
  toggleConfirmation,
  topicChange,
  notesChange,
  addQuestions,
  updateQuestion,
  deleteQuestion as deleteQuestionRedux,
  showAddQuestionButton,
  toggleNotifications as toggleNotificationsRedux,
} from '../../actions/NotecardActions';
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

class NotecardModal extends Component {
  validChanges = new Set(["topicInput", "notesInput", "questions", "notifications"]);

  // Called within confirmer to handle unsaved changes
  onConfirmation = async (decision) => {
    this.props.toggleConfirmation();
    if (decision === "save") {
      await this.onSave();
    } else if (decision == "discard") {
      this.props.changes(false);
      this.props.loadData(null);
      this.props.onClose && this.props.onClose();
    }
  };

  // Close the modal in parent component
  onClose = () => {
    if (this.props.hasChanges) {
      this.props.toggleConfirmation();
    } else {
      this.props.onClose && this.props.onClose();
    }
  };

  // Saves notecard and generates questions
  onSave = async () => {
    this.props.toggleLoader('Saving...', true);

    // get existing notes
    var existingNotes = await Storage.getNotes();

    // default topic name
    const topic = this.props.topicInput.length > 0 ? this.props.topicInput : 'Untitled';
    var id = -1;
    // overwrite notecard
    if (this.props.noteObj) {
      id = existingNotes.findIndex((note) => note.id == this.props.noteObj.id);
      existingNotes[id] = {
        id: id,
        topic: topic,
        notes: this.props.notesInput,
        questions: this.props.questions,
        notifications: this.props.notifications,
      }
    } else {
      // add new notecard
      if (!existingNotes || !existingNotes.length) {
        existingNotes = [];
        id = 0;
      } else {
        id = existingNotes[existingNotes.length - 1].id + 1;
      }

      existingNotes.push({
        id: id,
        topic: topic,
        notes: this.props.notesInput,
        questions: this.props.questions,
        notifications: this.props.notifications,
      });
    }

    // write to storage
    await Storage.addNotes(existingNotes);

    // persist notification setting
    this._toggleNotifications(id);

    // reset modal
    this.props.loadData(null);
    this.props.onSave && await this.props.onSave();
    this.props.toggleLoader('', false);
  };

  // Scrape web page for content on a topic
  autoPop = async () => {
    const { topicInput, notesInput } = this.props;
    if (topicInput.length < 1) {
      Alert.alert('Uh oh!', 'To use the auto notecard maker, a topic must be provided');
      return;
    }

    try {
      this.props.toggleLoader('Gathering notes...', true);

      const res = await axios.post(WEB_SCRAPER_API_URL, {
        query: this.props.topicInput,
      });

      if (res.status !== 200 && res.status !== 201) {
        throw Error;
      }

      if (!res.data || !res.data.blurb) {
        throw Error;
      }

      const { data } = res;

      // Add a couple newlines if notes already exist
      const text = notesInput.length ? notesInput.concat(`\n\n${data.blurb}`) : data.blurb
      this.props.notesChange(text);
    } catch (err) {
      console.log('Err occurred communicating with scraper: ', err);
      Alert.alert('Sorry!', `Couldn\'t find notes for "${topicInput}"`);
    }
    this.props.toggleLoader('', false);
  };

  // Generate questions given content
  generateQuestions = async () => {
    try {
      if (this.props.notesInput.length < 1) {
        Alert.alert('Whoops!', 'To generate questions, please write some notes.');
        return;
      }

      this.props.toggleLoader('Creating questions...', true);

      const res = await axios.post(QUESTION_GENERATOR_API_URL, {
        blurb: this.props.notesInput,
      });

      if (res.status !== 201) {
        throw Error;
      }

      const { questions } = res.data;
      if (questions.length < 1) {
        Alert.alert('Sorry!', 'We were unable to create questions from your notes.');
      } else {
        var lastId = this.props.questions.length ? this.props.questions[this.props.questions.length - 1].id : -1;
        const newQuestions = questions.map(question => ({
          id: ++lastId,
          question: question,
        }));
        this.props.addQuestions(newQuestions);
      }
    } catch (err) {
      console.log('Err occurred communicating with question generator: ', err);
      Alert.alert('Whoops!', 'We\'re having trouble connecting to our servers.');
    }
    this.props.toggleLoader('', false);
  };

  // Add an empty question
  addQuestion = () => {
    const { questions } = this.props;
    const id = questions.length == 0 ? 0 : questions[questions.length - 1].id + 1;
    this.props.addQuestions({
      id,
      question: '',
    });
  };

  // Overwrite an existing questions content
  saveQuestion = (id, newQuestion) => {
    const index = search(id, this.props.questions, "id");
    if (index == -1) {
      console.log('Error occurred while trying to save question.');
      return;
    }
    this.props.updateQuestion(index, newQuestion);
  };

  // Removes a question
  deleteQuestion = (id) => {
    const index = search(id, this.props.questions, "id");
    if (index == -1) {
      console.log('Error occurred: could not find question to delete');
      return;
    }
    this.props.deleteQuestionRedux(index);

    // Remove the notification associated with the question
    const notifId = (this.props.noteObj.id.toString()).concat((id).toString());
    PushNotification.cancelLocalNotification(notifId);
  };

  // Schedules or cancels notifications depending on toggle value (called on-save)
  _toggleNotifications = (id) => {
    const { notificationsPrev, notifications, topicInput } = this.props;
    if (notificationsPrev === notifications) {
      return;
    }

    var fn = null;
    if (notifications) {
      fn = PushNotification.localNotificationSchedule;
    } else {
      fn = PushNotification.cancelLocalNotification;
    }

    this.props.questions.forEach(questionObj => {
      const notifId = (id.toString()).concat((questionObj.id).toString());
      const { question } = questionObj;
      fn(notifId, topicInput, question);
    });
  };

  // Toggles notification setting
  toggleNotifications = () => {
    const { notifications } = this.props;
    this.props.toggleNotificationsRedux(!notifications);
  };

  // Keyboard listener for hiding/showing a button if keyboard is active/inactive
  _keyboardDidShow = () => {
    this.props.showAddQuestionButton(false);
  }

  _keyboardDidHide = () => {
    this.props.showAddQuestionButton(true);
  }

  // Checks when the notecard updates, if any changes to topic input, notes input, questions, or notifications settings occurred.
  // If so, then we set the state of having changes to be true so we can notify the user.
  componentDidUpdate(prevProps) {        // the following are state changes describing a valid update
    if ((!prevProps.noteObj && !this.props.noteObj)  // case 1: update on empty card
      || ((prevProps.noteObj && this.props.noteObj) && (prevProps.noteObj.id === this.props.noteObj.id))) {  // case 2: update on existing card
      const difference = Object.keys(prevProps).filter(k => prevProps[k] !== this.props[k] && this.validChanges.has(k));
      if (difference.length && !this.props.hasChanges) {
        this.props.changes(true);
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
    } = this.props;

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
                  onChangeText={(topicInput) => this.props.topicChange(topicInput)}
                  value={topicInput}
                  placeholder={'Enter topic'}
                />
              </View>
              <View style={containers.tabContainer}>
                <TouchableOpacity
                  onPress={this.autoPop}
                  style={buttons.autoPopButtonContainer} >
                  <Icon name='magic' size={30} color='#fffdf9' style={{ marginTop: 5.5 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.props.showQuestions}
                  style={buttons.questionTab} >
                  <TabIcon showingQuestions={showingQuestions} />
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
                    onChangeText={(notesInput) => this.props.notesChange(notesInput)}
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

const mapStateToProps = (state) => {
  const {
    isLoading,
    noteObj,
    showingQuestions,
    showingAddQuestionButton,
    topicInput,
    notesInput,
    questions,
    notificationsPrev,
    notifications,
    hasChanges,
    needsConfirmation,
    loadingState,
  } = state.notecardReducer;

  return {
    isLoading,
    noteObj,
    showingQuestions,
    showingAddQuestionButton,
    topicInput,
    notesInput,
    questions,
    notificationsPrev,
    notifications,
    hasChanges,
    needsConfirmation,
    loadingState,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    showQuestions,
    toggleLoader,
    loadData,
    changes,
    toggleConfirmation,
    topicChange,
    notesChange,
    addQuestions,
    updateQuestion,
    deleteQuestionRedux,
    showAddQuestionButton,
    toggleNotificationsRedux,
  }, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotecardModal);