import { combineReducers } from 'redux';
import { Storage } from '../services/Storage';

const INITIAL_STATE = {
  showingModal: false,
  notes: [{
    id: 0,
    topic: 'Test Topic',
    notes: 'Blah blah blah stuff here',
    questions: [{
      id: 0,
      question: 'Where am I?',
    }],
    notifications: true,
  }],
};

Storage.retrieveNotes()
  .then(notes => {
    INITIAL_STATE.notes = notes;
  });

const mainReducer = (state = INITIAL_STATE, action) => {
  const { showingModal, notes } = state;
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return { showingModal: !showingModal, notes };
    case 'DEL_NOTE':
      const index = action.payload;
      // Splice out the note item
      const newNotes = [
        ...notes.slice(0, index),
        ...notes.slice(index + 1)
      ];

      const newState = { showingModal, notes: newNotes };
      return newState;
    // case 'LOAD_NOTES':
    //   return { showingModal, notes: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  main: mainReducer,
});