import { StyleSheet } from 'react-native';

const containers = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
      },
      activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 120,
        width: 130,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
});

const text = StyleSheet.create({
    loadText: {
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export { containers, text };