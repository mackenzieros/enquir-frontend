import React, { Component } from 'react';
import { 
    SafeAreaView, 
    FlatList, 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NotecardModal from './components/NotecardModal/NotecardModal';
import Storage from './storage/Storage';
import { containers, buttons, text } from './MainStyles';
const storage = new Storage();
const NOTECARD_DESC_LIMIT = 75;

let DATA = [
    {
        id: '0',
        topic: 'First Item',
        notes: 'first blurb blah blah blah',
        questions: [{
            id: 0,
            question: 'What is this?'
        }],
    },
    {
        id: '1',
        topic: 'Second Item',
        notes: 'second blurb blah blah blah',
        questions: [{
            id: 0,
            question: 'What is this?'
        }],
    },
    {
        id: '2',
        topic: 'Marine biology',
        notes: 'Marine biology is the study of marine organisms, their behaviors and interactions with the environment. Marine biologists study biological oceanography and the associated fields of chemical, physical, and geological oceanography to understand marine organisms.',
        questions: [
            {
                id: 0,
                question: 'What is marine biology?'
            }, 
            {
                id: 1,
                question: 'What do marine biologists study?',
            }
        ],
    },
];

// Used to paraphrase notes for display
const ellipseSubstr = (str) => {
    if (str.length <= NOTECARD_DESC_LIMIT) {
        return str;
    }
    var index = NOTECARD_DESC_LIMIT;
    while (str[index++] !== ' ');
    return str.substring(0, index-1).concat('...');
};

// For displaying created notes
const Notecard = ({ parent, item }) => {
    return (
        <TouchableNativeFeedback 
            onPress={() => {
                parent.loadModal(item)
                parent.showModal();
            }}>
            <View style={containers.notecard}>
                <View style={containers.topicContainer}>
                    <Text style={text.topicText}>{item.topic}</Text>
                    <TouchableOpacity onPress={() => {parent.deleteNote(item)}}>
                        <Icon name='trash' size={15} />
                    </TouchableOpacity>
                </View>
                <View tyle={containers.notesContainer}>
                    <Text style={text.notesText}>{ellipseSubstr(item.notes)}</Text>
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
        var notes = null;
        for (var i = 0; i < this.state.notes.length; ++i) {
            if (this.state.notes[i].id == item.id) {
                notes = [
                    ...this.state.notes.slice(0, i),
                    ...this.state.notes.slice(i+1)
                ];
                break;
            }
        }

        if (notes == null) {
            console.log('err trying to delete notecard');
            return;
        }

        await storage.addNotes(notes);
        this.loadNotes();
    };

    // Updates notes and the last index
    loadNotes = () => {
        storage.retrieveNotes()
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
        storage.addNotes(DATA).then();  // TODO: FOR TESTING
        this.loadNotes();
    }
    
    render() {
        const { notes, showingModal } = this.state;

        return (
            <SafeAreaView style={containers.wrapper}>
                <View style={containers.menu} />
                <View style={containers.content}>
                    <FlatList
                        data={notes}
                        renderItem={({ item }) => <Notecard parent={this} item={item} />}
                        keyExtractor={item => item.id}
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
                            <Icon name='plus' size={30} style={{ marginLeft: 17.5, }} />
                    </TouchableOpacity>
            </SafeAreaView>
        );
    }
};