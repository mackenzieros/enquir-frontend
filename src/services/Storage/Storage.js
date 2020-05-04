import AsyncStorage from '@react-native-community/async-storage';

const retrieveNotes = async () => {
  try {
    const notes = await AsyncStorage.getItem('notes');
    if (notes !== null) {
      return JSON.parse(notes);
    }
  } catch (err) {
    console.log('Err fetching data ', err)
  }

};

const addNotes = async (data) => {
  try {
    await AsyncStorage.setItem('notes', JSON.stringify(data));
  } catch (err) {
    console.log('Err saving data ', err);
  }
};

const appendNotes = async (data) => {
  try {
    await AsyncStorage.mergeItem('notes', JSON.stringify(data));
  } catch (err) {
    console.log('Err appending data ', err);
  }
};

export {
  retrieveNotes,
  addNotes,
  appendNotes,
};