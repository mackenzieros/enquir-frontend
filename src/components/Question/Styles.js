import { StyleSheet } from 'react-native';

const containers = StyleSheet.create({
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
    editMenu: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

const text = StyleSheet.create({
    questionText: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
});

export { containers, text };