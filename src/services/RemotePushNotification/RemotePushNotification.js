import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
const SENDER_ID = '271670903453';

// credit: https://medium.com/@Jscrambler/implementing-react-native-push-notifications-in-android-apps-7e0234dee7b7
// used primarily for testing connectivity to firebase
// export default RemotePushController = () => {
//     useEffect(() => {
//         PushNotification.configure({
//             // (optional) Called when Token is generated (iOS and Android)
//             onRegister: function (token) {
//                 console.log('TOKEN:', token)
//             },
//             // (required) Called when a remote or local notification is opened or received
//             onNotification: function (notification) {
//                 console.log('REMOTE NOTIFICATION ==>', notification)
//                 // process the notification here
//             },
//             // Android only: GCM or FCM Sender ID
//             senderID: SENDER_ID,
//             popInitialNotification: true,
//             requestPermissions: true
//         })
//     }, [])
//     return null
// }