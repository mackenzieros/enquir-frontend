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

export default notecardReducer = (state = INITIAL_STATE, action) => {
  const currState = { ...state };

  switch (action.type) {
    case 'LOAD_NOTECARD':
      const { item } = action.payload

      if (item == null) {
        return { ...INITIAL_STATE };
      } else {
        currState.noteObj = item;
        currState.topicInput = item.topic;
        currState.notesInput = item.notes;
        currState.showingQuestions = false;
        currState.questions = item.questions;
        currState.notificationsPrev = item.notifications;
        currState.notifications = item.notifications;
        currState.hasChanges = false;
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
      const { hasChanges } = action.payload;
      currState.hasChanges = hasChanges;
      return currState;
    case 'TOPIC': {
      const { text } = action.payload;
      currState.topicInput = text;
      return currState;
    }
    case 'NOTES': {
      const { text } = action.payload;
      currState.notesInput = text;
      return currState;
    }
    case 'CONFIRMATION':
      currState.needsConfirmation = !currState.needsConfirmation;
      return currState;
    case 'ADD_QUESTIONS':
      const { questions } = action.payload;
      currState.questions = currState.questions.concat(questions);
      return currState;
    case 'UPDATE_QUESTION': {
      const { index, question } = action.payload;
      currState.questions[index].question = question;
      return currState;
    }
    case 'DELETE_QUESTION': {
      const { index } = action.payload;
      currState.questions = [
        ...currState.questions.slice(0, index),
        ...currState.questions.slice(index + 1)
      ];
      return currState;
    }
    case 'SHOW_ADD_BUTTON':
      const { show } = action.payload;
      currState.showingAddQuestionButton = show;
      return currState;
    case 'TOGGLE_NOTIF':
      const { toggle } = action.payload;
      currState.notifications = toggle;
      return currState;
    default:
      return state;
  }
};