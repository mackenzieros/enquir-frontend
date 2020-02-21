import React, { Component } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text, Button, Modal, Alert, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import NotecardModal from './components/NotecardModal';
import Storage from './storage/Storage';

const storage = new Storage();
const NOTECARD_DESC_LIMIT = 75;

export const colors = {
    "secondary": '#0686E4',
    "tertiary": '#ffffff',
    "background_dark": '#F0F0F0',
    "text_light": '#ffffff',
    "text_medium": '#464646',
    "text_dark": '#263238',
    "weather_text_color": '#464646',
    "transparent_white": '#FFFFFF00',
    "separator_background": '#E2E2E2',
};

let DATA = [
    {
        id: '0',
        topic: 'First Item',
        notes: 'first blurb blah blah blah',
        questions: ['What is this?'],
    },
    {
        id: '1',
        topic: 'Second Item',
        notes: 'second blurb blah blah blah',
        questions: ['What is this?'],
    },
    {
        id: '2',
        topic: 'Marine biology',
        notes: 'Marine biology is the study of marine organisms, their behaviors and interactions with the environment. Marine biologists study biological oceanography and the associated fields of chemical, physical, and geological oceanography to understand marine organisms.',
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
        <TouchableNativeFeedback onPress={() => {parent.showModal(item)}}>
            <View style={styles.notecard}>
                <View style={styles.topicContainer}>
                    <Text style={styles.topicText}>{item.topic}</Text>
                    <TouchableOpacity onPress={() => {parent.deleteNote(item)}}>
                        <Text style={styles.deleteNoteButton}>x</Text>
                    </TouchableOpacity>
                </View>
                <View tyle={styles.notesContainer}>
                    <Text style={styles.notesText}>{ellipseSubstr(item.notes)}</Text>
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

    // Set visibility of note-adding modal and if passed a note item,
    // update the notecard modal's state with the item
    showModal = (item) => {
        var newState = {
            showingModal: !this.state.showingModal
        };

        this.notecardRef.current.loadData(item);
        this.setState(newState);
    };

    deleteNote = async (item) => {
        for (var i = 0; i < this.state.notes.length; ++i) {
            if (this.state.notes[i].id == item.id) {
                this.state.notes = [
                    ...this.state.notes.slice(0, i),
                    ...this.state.notes.slice(i+1)
                ];
                break;
            }
        }

        await storage.addNotes(this.state.notes);
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
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.menu} />
                <View style={styles.content}>
                    <FlatList
                        data={notes}
                        renderItem={({ item }) => <Notecard parent={this} item={item} />}
                        keyExtractor={item => item.id}
                        style={styles.flatlist} 
                    />
                </View>
                <NotecardModal
                    ref={this.notecardRef}
                    show={showingModal}
                    onClose={this.showModal}
                    onSave={this.saveNote}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.showModal()} >
                        <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    menu: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: 'blue',
    },
    content: {
        paddingHorizontal: 14,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 60/2,
        backgroundColor: '#00BCD4',
        position: 'absolute',
        bottom: 40,
        right: 30,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        elevation: 7,
    },
    addButtonText: {
        alignSelf: 'center',
        fontSize: 40,
        color: 'white',
        marginBottom: 5,
    },
    notecard: {
        flex: 0,
        flexDirection: 'column',  // main axis
        justifyContent: 'flex-start', // main axis
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 16,
        marginTop: 0,
        marginBottom: 8,
        elevation: 1,
        borderRadius: 3,
        backgroundColor: colors.tertiary,
    },
    topicContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topicText: {
        // fontFamily: 'notoserif',
        fontSize: 17,
        fontWeight: 'bold',
    },
    deleteNoteButton: {
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        fontSize: 18,
    },
    notesContainer: {
        flex: 1, 
        flexDirection: 'row',
    },
    notesText: {
        // fontFamily: 'Roboto',
        fontSize: 16,
    },
    flatlist: {
        marginTop: 14,
        alignSelf: 'stretch',
    }
});
