import React, { Component } from 'react';
import { Modal, Text, FlatList, Button, View, StyleSheet, TextInput, TouchableHighlight } from 'react-native';

const Question = ({ item }) => {
    return (
        <TouchableHighlight>
            <View style={styles.notecard}>
                <Text>{item}</Text>
            </View>
        </TouchableHighlight>
    );
}

export default class QuestionModal extends Component {
    // Close the modal in parent component
    onClose = () => {
        this.props.onClose && this.props.onClose();
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <Modal
                animationType='slide' 
                onRequestClose={this.onClose} >
                <View style={styles.menu}>
                    <View style={styles.closeContainer}>
                        <Button
                            style={styles.closeButton}
                            onPress={this.onClose}
                            title='Cancel'
                        />
                    </View>
                    <FlatList
                        data={this.props.questions}
                        renderItem={({ item }) => <Question item={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.flatlist} 
                    />
                </View>
            </Modal>
        );
    }
}

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

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    closeButton: {
    },
    notecard: {
        elevation: 1,
        borderRadius: 2,
        backgroundColor: colors.tertiary,
        flex: 1,
        flexDirection: 'row',  // main axis
        justifyContent: 'flex-start', // main axis
        alignItems: 'center', // cross axis
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 16,
        marginLeft: 14,
        marginRight: 14,
        marginTop: 0,
        marginBottom: 6,
    },
    flatlist: {
        marginTop: 14,
        alignSelf: 'stretch',
    }
});