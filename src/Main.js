import React, { Component } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NotecardModal from './components/NotecardModal/NotecardModal';
import { Storage } from './services/Storage';
import { containers, buttons, text } from './MainStyles';
import { PushNotification } from './services/PushNotification';
import { search } from './helpers/BinarySearch';
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
        parent.loadModal(item);
        parent.showModal();
      }}>
      <View style={containers.notecard}>
        <View style={containers.topicContainer}>
          <Text style={text.topic}>{item.topic}</Text>
          <TouchableOpacity onPress={() => { parent.deleteNote(item) }}>
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

export default class Main extends Component {
  notecardRef = React.createRef();
  state = {
    showingModal: false,
    notes: [],
  };

  // Set visibility of note-adding modal
  showModal = () => {
    this.setState({
      showingModal: !this.state.showingModal
    });
  };

  // Update the notecard modal's state with the item
  loadModal = (item) => {
    this.notecardRef.current.loadData(item);
  };

  deleteNote = async (item) => {
    const index = search(item.id, this.state.notes, "id");
    if (index == -1) {
      console.log('err trying to delete notecard');
      return;
    }

    // Splice out the note item
    const notes = [
      ...this.state.notes.slice(0, index),
      ...this.state.notes.slice(index + 1)
    ];

    const noteObj = this.state.notes[index];
    // Cancel all of the notifications this notecard had
    (noteObj.questions).forEach(questionObj => {
      const notifId = ((noteObj.id).toString()).concat((questionObj.id).toString());
      PushNotification.cancelLocalNotification(notifId);
    });

    await Storage.addNotes(notes);
    this.loadNotes();
  };

  // Updates notes and the last index
  loadNotes = () => {
    Storage.retrieveNotes()
      .then(notes => this.setState({
        notes: notes,
      }));
  };

  // Close modal and update notes
  saveNote = () => {
    this.showModal();
    this.loadNotes();
  };

  // Load notes data from storage
  componentDidMount() {
    this.loadNotes();
  }

  render() {
    const { notes, showingModal } = this.state;

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
          ref={this.notecardRef}
          show={showingModal}
          onClose={this.showModal}
          onSave={this.saveNote}
        />
        <TouchableOpacity
          style={buttons.addButton}
          onPress={() => {
            this.loadModal(null)
            this.showModal();
          }}>
          <Icon name='plus' size={30} style={{ marginLeft: 17.5, color: '#f0f0f0' }} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
};