import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Question extends Component {
    state = {
        question: this.props.question,
    };

    render() {
        const { question } = this.state;

        return (
            <View style={styles.questionContainer}>
                <View style={styles.questionTextContainer}>
                    <TextInput
                        style={styles.questionText}
                        value={question.item}
                        multiline={true}
                    />
                </View>
                <View style={styles.editMenu}>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    questionTextContainer: {
        flex: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    questionText: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    editMenu: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteQuestion: {},
});