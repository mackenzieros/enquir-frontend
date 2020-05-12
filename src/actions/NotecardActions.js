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
    payload: val,
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
    payload: text,
  }
);

export {
  showQuestions,
  toggleLoader,
  loadData,
  changes,
  toggleConfirmation,
  topicChange,
};