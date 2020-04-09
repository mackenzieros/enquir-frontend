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

const localNotification = (id, topic, msg) => {
  PushNotification.localNotification({
    id,
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

const localNotificationSchedule = (id, topic, msg) => {
  const schedDate = new Date(Date.now());
  schedDate.setHours(Math.floor(Math.random()*6) + 12);

  PushNotification.localNotificationSchedule({
    id,
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
    date: schedDate,
    repeatType: 'day',
  });
};

const cancelLocalNotification = (id) => {
  PushNotification.cancelLocalNotifications({ id: id });
};

export {
  configure,
  localNotification,
  localNotificationSchedule,
  cancelLocalNotification,
};