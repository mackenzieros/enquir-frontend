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

const localNotificationSchedule = (topic, msg) => {
  PushNotification.localNotificationSchedule({
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
    date: new Date(Date.now() + 60*100),
  });
};

export {
  configure,
  localNotification,
  localNotificationSchedule,
};