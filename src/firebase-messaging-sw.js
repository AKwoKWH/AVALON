importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');

console.log("[firebase-messaging-sw.js] init")

var config = {
    apiKey: "AIzaSyAKC1QBxrKsYVoROebkrDfh17XnAe_F-Js",
    authDomain: "avalon-991ac.firebaseapp.com",
    databaseURL: "https://avalon-991ac.firebaseio.com",
    projectId: "avalon-991ac",
    storageBucket: "avalon-991ac.appspot.com",
    messagingSenderId: "352103684706"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

// messaging.onMessage(function(payload) {
//   console.log("Message received. ", payload);
//   // ...
//     return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

messaging.setBackgroundMessageHandler(payload=> {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'AVALON';
    const notificationOptions = {
        // body: JSON.stringify(payload),
        body: "Game Start",
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,notificationOptions);
});