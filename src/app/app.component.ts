import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SubscriptionPage } from '../pages/subscription/subscription';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import * as admin from "firebase-admin";
import request from 'request'
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListPage;
  // CreateRoomPage: {title: string, component: any};
  currentUser = {
    displayName: 'LOADING....',
    photoURLCustom64: null
  };
  Gituser = false
  counter = 0



  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public afAuth: AngularFireAuth,
    public afDB: AngularFirestore
  ) {

    this.initializeApp();


    // if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('firebase-messaging-sw.js').then(registration =>  {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        firebase.messaging().useServiceWorker(registration)
      })
    // };


      firebase.messaging().onMessage(payload=> {
        console.log("Message received. app - notification: ", Notification.permission, payload);
          const notificationTitle = 'AVALON';
          const notificationOptions = {
              body: payload.data.message,
              icon: '/firebase-logo.png'
          };

          // Let's check if the browser supports notifications
          if (!("Notification" in window)) {
            // alert("This browser does not support system notifications");
          }

          // Let's check whether notification permissions have already been granted
          else if (Notification.permission == "granted") {
            // If it's okay let's create a notification
            console.log('permission granted')
            // var notification = new Notification(payload.data.message);
            navigator.serviceWorker.ready.then(serviceWorkerRegistration =>  {
              console.log('navigator.serviceWorker.ready')
              serviceWorkerRegistration.showNotification(notificationTitle,notificationOptions)
              // serviceWorkerRegistration.active.postMessage(payload.data.message);
            })    
          }

          // Otherwise, we need to ask the user for permission
          else if (Notification.permission == 'denied') {
            console.log("granted denied")
            // alert("permission denied");
            Notification.requestPermission( permission => {
              // If the user accepts, let's create a notification
              if (permission == "granted") {
                navigator.serviceWorker.ready.then(serviceWorkerRegistration =>  {
                  console.log('navigator.serviceWorker.ready')
                  serviceWorkerRegistration.showNotification(notificationTitle,notificationOptions)
                })    
              }
            });
          }


      
        // console.log(notificationTitle,notificationOptions)
        // var notification = new Notification(notificationTitle,notificationOptions);

      });
  

    afAuth.authState.subscribe(user => {
      if (!user) {
        this.currentUser = null
      }else {
        this.CreateUserProfile()
        this.currentUser = null
        this.currentUser = user
        this.afDB.collection("users").doc(user.uid).valueChanges().subscribe(result => {
          this.currentUser = result
        })
        this.FCMGetToken(user.uid)
      }
      console.log(this.currentUser)
    })

    // this.CreateRoomPage = {title: 'Create Room', component: HomePage };

  }



  FCMGetToken(uid){
      // this.afAuth.authState.subscribe(user => {
        firebase.messaging().requestPermission().then( () => {
          firebase.messaging().getToken().then(FCMToken => {
            console.log('Notification permission granted.', 'UID: ' + uid, 'Token: ' + FCMToken);
            this.afDB.collection('users').doc(uid).update({token: FCMToken})
          })
        })
        .catch(err => {
          console.log('Unable to get permission to notify.', err);
        });
      // })
  }

  FCMTokenRefresh(){
    firebase.messaging().onTokenRefresh(function() {
      this.afAuth.authState.subscribe(user => {
        firebase.messaging().getToken().then(FCMToken => {
          console.log('Notification permission granted.', 'UID: ' + user.uid, 'Token: ' + FCMToken);
          this.afDB.collection('users').doc(user.uid).update({token: FCMToken})
        })
        .catch(err => {
          console.log('Unable to retrieve refreshed token ', err);
        });
      })
    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  } 

  HiddenMenu(){
    this.counter = this.counter +1
    // console.log(this.counter)
    
    if (this.counter>10){
      this.Gituser = true
      // console.log(this.Gituser)
    }
  }


  openCreateRoomPage() {
    this.nav.setRoot(HomePage);
  }

  openRoomPage() {
    this.nav.setRoot(ListPage);
  }


//CombineArray==================================================
  combineArray(Array1,Array2){
    var ArrayCombine = Object.assign({}, Array1, Array2);
    return ArrayCombine
  }
//==============================================================


//SIGNOUT ====================================================
  Signout(){
    this.afAuth.auth.signOut();
  }
//============================================================
//FACEBOOK SIGNIN=============================================
  SigninWithFacebook(){
    console.log('function FirebaseSignInWithFacebook Called');
    var provider = new firebase.auth.FacebookAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(authData) {
	    console.log(authData);
    }).catch(function(error) {
	    console.log(error);
    });
  }
//============================================================
//GOOGLE SIGNIN===============================================
  SigninWithGoogle(){
    console.log('function FirebaseSignInWithGoogle Called');
    var provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(authData) {
	    console.log(authData);
    }).catch(function(error) {
	    console.log(error);
    });
  }
//============================================================

//GITHUB SIGNIN===============================================
  SigninWithGithub(){
    console.log('function FirebaseSignInWithGithub Called');
    var provider = new firebase.auth.GithubAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(authData) {
	    console.log(authData);
    }).catch(function(error) {
	    console.log(error);
    });
  }
//============================================================


//CREATECURRENTUSER===================================================
  CreateUserProfile(){  
    this.afAuth.authState.subscribe(user => {
      // console.log(user)
      const userData = {
        phonenumber: user.phoneNumber,
        userID: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        photoURLCustom64: user.photoURL
      }
      this.afDB.collection("users").doc(user.uid).ref.get().then(userInfo => {
          console.log("Profile exist:", userInfo) 
        if (userInfo.exists==false){
          console.log("create profile") 
          this.afDB.collection("users").doc(user.uid).set(userData)
        }
      })
    })
  }
//===============================================================


ProfilePic(event){
  this.afAuth.authState.subscribe(user => {
    var fileCaptured = event.target.files[0];
    console.log(fileCaptured)
    if (fileCaptured != null){
      this.base64Converter(fileCaptured).then(data => {
        this.ImageResize('data:image/jpeg;base64,' + data).then(ResizedImg => {
            ResizedImg = 'data:image/jpeg;base64,' + ResizedImg 
            this.afDB.collection("users").doc(user.uid).update({photoURLCustom64: ResizedImg})
        })
     })
    }
  })
}

base64Converter(file){
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.onload = (event) => {
        var Base64Img = event.target.result;
        var ConvertedBase64Img = Base64Img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      };
      reader.readAsDataURL(file);
    })
}

ImageResize(fileCaptured){    
  return new Promise((resolve) => {
    var img = document.createElement("img");
    var canvas = document.createElement('canvas')
    img.src = fileCaptured
  
    img.onload = function() {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var MAX_WIDTH = 800;
      var MAX_HEIGHT = 600;
      var width = img.width;
      var height = img.height;

      if (width <= MAX_WIDTH && height <= MAX_HEIGHT){
        console.log('No need to resize')
        var ConvertedBase64Img = fileCaptured.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      } else {
        console.log('Need to resize')
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var Base64Img = canvas.toDataURL("image/png");
        var ConvertedBase64Img = Base64Img.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        resolve (ConvertedBase64Img)
      }
    }
  })
}


}
