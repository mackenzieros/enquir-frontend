import { StyleSheet } from 'react-native';

const containers = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f2eee9',
    },
    menu: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: '#3056ff',
        elevation: 3,
        borderBottomColor: 'grey',
        borderBottomWidth: .5,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 14,
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
        backgroundColor: '#fcfcfc',
    },
    emptyBlock: {
        paddingVertical: 38,
        paddingLeft: 18,
        paddingRight: 16,
        marginTop: 0,
        marginBottom: 8,
    },
    topicContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    notesContainer: {
        flex: 1, 
        flexDirection: 'row',
    },
    flatlist: {
        marginTop: 14,
        alignSelf: 'stretch',
    },
});

const buttons = StyleSheet.create({
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 60/2,
        backgroundColor: '#3056ff',
        bottom: 20,
        right: 30,
        alignSelf: 'flex-end',
        position: 'absolute',
        justifyContent: 'center',
        elevation: 7,
    },
});

const text = StyleSheet.create({
    topic: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
    },
    notes: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
});

export { containers, buttons, text }; 