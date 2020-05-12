import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './src/reducers/RootReducer';
import Main from './src/Main';
import { PushNotification } from './src/services/PushNotification';

const store = createStore(rootReducer);

PushNotification.configure();

function App() {
  return (<Provider store={store}>
    <Main />
  </Provider>);
}

export default App;