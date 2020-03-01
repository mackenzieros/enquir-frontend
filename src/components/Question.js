import React, { Component } from 'react';
import { Modal, Text, FlatList, Button, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Question extends Component {
    state = {
        question: this.props.question,
        editing: false,
    };

    edit = () => {
        this.setState({
            editing: !this.state.editing,
        });
    };

    render() {
        const { question, editing } = this.state;

        return (
            <View style={styles.questionContainer}>
                <TextInput
                    style={styles.questionText}
                    value={question.item}
                    editable={editing}
                />
                <View style={styles.questionEditContainer}>
                    <TouchableOpacity onPress={this.edit}>
                        <View style={styles.editQuestion}>
                            <Icon name='pencil' size={20} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.delete(question)}>
                        <View style={styles.deleteQuestion}>
                            <Icon name='trash' size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    questionContainer: {
        flexDirection: 'row',  // main axis
        justifyContent: 'space-between', // main axis
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 16,
        marginTop: 0,
        marginBottom: 8,
        elevation: 1,
        borderRadius: 3,
        backgroundColor: 'grey',
    },
    questionText: {
        justifyContent: 'flex-start',
    },
    questionEditContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    editQuestion: {
        marginRight: 12,
    },
    deleteQuestion: {},
});