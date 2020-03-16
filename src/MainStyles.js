import { StyleSheet } from 'react-native';
const colors = {
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

const containers = StyleSheet.create({
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
        backgroundColor: colors.tertiary,
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
        backgroundColor: '#00BCD4',
        bottom: 20,
        right: 30,
        alignSelf: 'flex-end',
        position: 'absolute',
        justifyContent: 'center',
        elevation: 7,
    },
});

const text = StyleSheet.create({
    topicText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
    },
    notesText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
});

export { containers, buttons, text }; 