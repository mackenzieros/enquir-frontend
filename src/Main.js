import React, { Component } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showModal, deleteNote, loadNotes } from './actions/MainActions';
import { loadData } from './actions/NotecardActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import NotecardModal from './components/NotecardModal/NotecardModal';
import { Storage } from './services/Storage';
import { PushNotification } from './services/PushNotification';
import { search } from './helpers/BinarySearch';
import { containers, buttons, text } from './MainStyles';

const NOTECARD_DESC_LIMIT = 75;

// Used to paraphrase notes for display
const ellipseSubstr = (str) => {
  if (str.length <= NOTECARD_DESC_LIMIT) {
    return str;
  }
  var index = NOTECARD_DESC_LIMIT;
  while (str[index++] !== ' ');
  return str.substring(0, index - 1).concat('...');
};

// For displaying created notes
const Notecard = ({ parent, item }) => {
  return (
    <TouchableNativeFeedback
      onPress={() => {
        parent.props.loadData(item);
        parent.props.showModal();
      }}>
      <View style={containers.notecard}>
        <View style={containers.topicContainer}>
          <Text style={text.topic}>{item.topic}</Text>
          <TouchableOpacity onPress={() => { parent.props.deleteNote(item.id) }}>
            <Icon name='trash' size={15} />
          </TouchableOpacity>
        </View>
        <View tyle={containers.notesContainer}>
          <Text style={text.notes}>{ellipseSubstr(item.notes)}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

class Main extends Component {
  notecardRef = React.createRef();

  // Update the notecard modal's state with the item
  loadModal = (item) => {
    this.notecardRef.current.loadData(item);
  };

  deleteNote = async (id) => {
    const index = search(id, this.props.notes, "id");
    if (index == -1) {
      console.log('err trying to delete notecard');
      return;
    }

    // Cancel all of the notifications this notecard had
    const noteObj = this.props.notes[index];
    (noteObj.questions).forEach(questionObj => {
      const notifId = ((noteObj.id).toString()).concat((questionObj.id).toString());
      PushNotification.cancelLocalNotification(notifId);
    });

    // Call reducer to delete note
    this.props.deleteNote(index);
  };

  // Close modal and update notes
  saveNote = async () => {
    this.props.showModal();
    const notes = await Storage.getNotes();
    this.props.loadNotes(notes);
  };

  async componentDidUpdate(prevProps) {
    if (this.props.notes !== prevProps.notes) {
      await Storage.addNotes(this.props.notes);
    }
  }

  render() {
    const { notes, showingModal } = this.props;

    return (
      <SafeAreaView style={containers.wrapper}>
        <View style={containers.menu}>
          <Text style={text.title} />
        </View>
        <View style={containers.content}>
          {(notes == undefined || notes.length < 1) &&
            <Text style={text.nonotes}>No notes yet...</Text>
          }
          <FlatList
            data={notes}
            renderItem={({ item }) => <Notecard parent={this} item={item} />}
            keyExtractor={item => (item.id).toString()}
            style={containers.flatlist}
            ListFooterComponent={() => <View />}
            ListFooterComponentStyle={containers.emptyBlock}
          />
        </View>
        <NotecardModal
          show={showingModal}
          onClose={this.props.showModal}
          onSave={this.saveNote}
        />
        <TouchableOpacity
          style={buttons.addButton}
          onPress={() => {
            this.props.loadData(null)
            this.props.showModal();
          }}>
          <Icon name='plus' size={30} style={{ marginLeft: 17.5, color: '#f0f0f0' }} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
};

const mapStateToProps = (state) => {
  const { showingModal, notes } = state.mainReducer;
  return { showingModal, notes };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    showModal,
    deleteNote,
    loadData,
    loadNotes,
  }, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);