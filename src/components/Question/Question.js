import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity,
} from 'react-native';
import { containers, text } from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Question extends Component {
    state = {
        question: this.props.question,
        questionInput: this.props.question.item,
    };

    render() {
        const { question, questionInput } = this.state;

        return (
            <View style={containers.questionContainer}>
                <View style={containers.questionTextContainer}>
                    <TextInput
                        style={text.questionText}
                        onChangeText={(questionInput) => this.setState({ questionInput })}
                        onEndEditing={() => this.props.save(question.index, questionInput)}
                        value={questionInput}
                        multiline={true}
                    />
                </View>
                <View style={containers.editMenu}>
                    <TouchableOpacity onPress={() => this.props.delete(question.index)}>
                        <View>
                            <Icon name='trash' size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};