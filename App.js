import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import notecardReducer from './src/reducers/NotecardReducer';
import Main from './src/Main';
import { PushNotification } from './src/services/PushNotification';

const store = createStore(notecardReducer);

PushNotification.configure();

function App() {
  return (<Provider store={store}>
    <Main />
  </Provider>);
}

export default App;