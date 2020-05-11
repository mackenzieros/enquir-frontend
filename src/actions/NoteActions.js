const showModal = () => (
  {
    type: 'TOGGLE_MODAL',
    payload: null,
  }
);

const deleteNote = index => (
  {
    type: 'DEL_NOTE',
    payload: index,
  }
);

// const loadNotes = (notes) => (
//   {
//     type: 'LOAD_NOTES',
//     payload: notes,
//   }
// );

export {
  showModal,
  deleteNote,
  // loadNotes,
};