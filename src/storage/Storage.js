import AsyncStorage from '@react-native-community/async-storage';

// Class for communicating with local storage
export default class Storage {
    constructor() {}

    retrieveNotes = async () => {
        try {
            const notes = await AsyncStorage.getItem('notes');
            if (notes !== null) {
                return JSON.parse(notes);
            }
            console.log('Err: no notes found');
        } catch (err) {
            console.log('Err fetching data ', err)
        }

    };

    addNotes = async (data) => {
        try {
            await AsyncStorage.setItem('notes', JSON.stringify(data));
        } catch (err) {
            console.log('Err saving data ', err);
        }
    }

    appendNotes = async (data) => {
        try {
            await AsyncStorage.mergeItem('notes', JSON.stringify(data));
        } catch (err) {
            console.log('Err appending data ', err);
        }
    };
}