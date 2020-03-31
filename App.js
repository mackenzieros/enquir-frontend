import React from 'react';
import Main from './src/Main';
import { PushNotification } from './src/services/PushNotification';

PushNotification.configure();

function App() {
  return <Main />
}

export default App;