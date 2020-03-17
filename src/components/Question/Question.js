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
        id: this.props.id,
        questionInput: this.props.question,
    };

    render() {
        const { id, questionInput } = this.state;

        return (
            <View style={containers.questionContainer}>
                <View style={containers.questionTextContainer}>
                    <TextInput
                        style={text.questionText}
                        onChangeText={(questionInput) => this.setState({ questionInput })}
                        onEndEditing={() => this.props.save(id, questionInput)}
                        value={questionInput}
                        multiline={true}
                    />
                </View>
                <View style={containers.editMenu}>
                    <TouchableOpacity onPress={() => this.props.delete(id)}>
                        <View>
                            <Icon name='trash' size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};