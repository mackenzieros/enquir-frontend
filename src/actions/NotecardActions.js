const showQuestions = () => (
  {
    type: 'SHOW_QUESTIONS',
    payload: null,
  }
);

const toggleLoader = (text, isLoading) => (
  {
    type: 'TOGGLE_LOADER',
    payload: {
      text,
      isLoading
    }
  }
);

const loadData = (item) => (
  {
    type: 'LOAD_NOTECARD',
    payload: {
      item
    },
  }
);

const changes = (val) => (
  {
    type: 'CHANGES',
    payload: {
      hasChanges: val,
    }
  }
);

const toggleConfirmation = () => (
  {
    type: 'CONFIRMATION',
    payload: null,
  }
);

const topicChange = (text) => (
  {
    type: 'TOPIC',
    payload: {
      text,
    }
  }
);

const notesChange = (text) => (
  {
    type: 'NOTES',
    payload: {
      text,
    }
  }
);

const addQuestions = (questions) => (
  {
    type: 'ADD_QUESTIONS',
    payload: {
      questions,
    }
  }
);

const updateQuestion = (index, question) => (
  {
    type: 'UPDATE_QUESTION',
    payload: {
      index,
      question,
    }
  }
);

const deleteQuestion = (index) => (
  {
    type: 'DELETE_QUESTION',
    payload: {
      index,
    }
  }
);

const showAddQuestionButton = (show) => (
  {
    type: 'SHOW_ADD_BUTTON',
    payload: {
      show,
    }
  }
);

const toggleNotifications = (toggle) => (
  {
    type: 'TOGGLE_NOTIF',
    payload: {
      toggle,
    }
  }
);

export {
  showQuestions,
  toggleLoader,
  loadData,
  changes,
  toggleConfirmation,
  topicChange,
  notesChange,
  addQuestions,
  updateQuestion,
  deleteQuestion,
  showAddQuestionButton,
  toggleNotifications,
};