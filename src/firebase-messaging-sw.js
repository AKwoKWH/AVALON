importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');

console.log("[firebase-messaging-sw.js] init www")

var config = {
    apiKey: "AIzaSyDhPrYaymeIAeCCZEdwR3Zs5YYsjyTo_YA",
    authDomain: "avalon-905dd.firebaseapp.com",
    databaseURL: "https://avalon-905dd.firebaseio.com",
    projectId: "avalon-905dd",
    storageBucket: "avalon-905dd.appspot.com",
    messagingSenderId: "352103684706"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

// messaging.onMessage(payload=> {
  // console.log("Message received. ", payload);
  //   const notificationTitle = 'FOREGROUND';
  //   const notificationOptions = {
  //       // body: JSON.stringify(payload),
  //       body: "FOREGROUND",
  //       icon: '/firebase-logo.png'
  //   };
    // return self.registration.showNotification(notificationTitle,notificationOptions);
// });

messaging.setBackgroundMessageHandler(payload=> {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'AVALON';
    const notificationOptions = {
        body: payload.data.message,
        // body: "GameStart",
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,notificationOptions);
});