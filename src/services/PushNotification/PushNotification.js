import PushNotification from 'react-native-push-notification';

const configure = () => {
  PushNotification.configure({
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};

const localNotification = (topic, msg) => {
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    color: "green",
    vibrate: true,
    vibration: 300,
    title: topic,
    message: msg,
    playSound: true,
    soundName: 'default',
  });
};

export {
  configure,
  localNotification,
};