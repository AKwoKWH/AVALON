importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');


var config = {
    apiKey: "AIzaSyAKC1QBxrKsYVoROebkrDfh17XnAe_F-Js",
    authDomain: "avalon-991ac.firebaseapp.com",
    databaseURL: "https://avalon-991ac.firebaseio.com",
    projectId: "avalon-991ac",
    storageBucket: "avalon-991ac.appspot.com",
    messagingSenderId: "439691655002"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

return self.registration.showNotification(notificationTitle,
    notificationOptions);
});