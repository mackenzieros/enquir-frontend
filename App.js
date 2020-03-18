import React from 'react';
import Main from './src/Main';
import BackgroundTask from 'react-native-background-task';
import { PushNotification } from './src/services/PushNotification';
import { Storage } from './src/services/Storage';

PushNotification.configure();
BackgroundTask.define(async () => {
  const notes = await Storage.retrieveNotes();
  BackgroundTask.finish();
});

function App() {

  return <Main />

}

export default App;