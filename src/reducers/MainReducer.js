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

Storage.getNotes()
  .then(notes => {
    INITIAL_STATE.notes = notes;
  });

export default mainReducer = (state=INITIAL_STATE, action) => {
  const currState = {...state};

  switch (action.type) {
    case 'TOGGLE_MODAL':
      currState.showingModal = !currState.showingModal;
      return currState;
    case 'DEL_NOTE':
      const index = action.payload;
      // Splice out the note item
      const newNotes = [
        ...currState.notes.slice(0, index),
        ...currState.notes.slice(index + 1)
      ];
      currState.notes = newNotes;
      return currState;
    case 'LOAD_NOTES':
      currState.notes = action.payload;
      return currState;
    default:
      return state;
  }
};