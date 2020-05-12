const INITIAL_STATE = {
  isLoading: false,
  noteObj: null,
  showingQuestions: false,
  showingAddQuestionButton: true,
  topicInput: '',
  notesInput: '',
  questions: [],
  notificationsPrev: false, // used for scheduling notifications on state change only; to avoid scheduling notifs on every save
  notifications: true,
  hasChanges: false,
  needsConfirmation: false,
};

export default notecardReducer = (state=INITIAL_STATE, action) => {
  const currState = {...state};

  switch (action.type) {
    case 'LOAD_NOTECARD':
      const { item } = action.payload

      if (item == null) {
        return {...INITIAL_STATE};
      } else {
        currState.noteObj = item;
        currState.topicInput = item.topic;
        currState.notesInput = item.notes;
        currState.showingQuestions = false;
        currState.questions = item.questions;
        currState.notificationsPrev = item.notifications;
        currState.notifications = item.notifications;
        return currState;
      }
    case 'TOGGLE_LOADER':
      const { text, isLoading } = action.payload;
      currState.isLoading = isLoading;
      currState.loadingState = text;
      return currState;
    case 'SHOW_QUESTIONS':
      currState.showingQuestions = !currState.showingQuestions;
      return currState;
    case 'CHANGES':
      currState.hasChanges = action.payload;
      return currState;
    case 'TOPIC': 
      currState.topicInput = action.payload;
      return currState;
    case 'CONFIRMATION':
      currState.needsConfirmation = !currState.needsConfirmation;
      return currState;
    default:
      return state;
  }
};