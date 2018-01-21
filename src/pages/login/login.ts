import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier
  // currentUser = null;
  currentUser = {displayName: 'LOADING....'};
  userInfo = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public alertCtrl:AlertController,
    public afDB: AngularFirestore
  ) {
      afAuth.authState.subscribe(user => {
        if (!user) {this.currentUser = null}
        else {this.currentUser = user}
        console.log(this.currentUser)
      })
    }

//FACEBOOK SIGNIN===========================================
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

//GOOGLE SIGNIN===========================================
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



//MOBILEPHONE SIGNIN===========================================
  // SigninWithMoblie(PhoneNumber){
  // const appVerifier = this.recaptchaVerifier;
  // const phoneNumberString = "+852" + PhoneNumber;
  // console.log("SIGNIN: ", PhoneNumber)

  // firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
  //   .then( confirmationResult => {
  //     console.log("SMS sent", phoneNumberString)
  //     // SMS sent. Prompt user to type the code from the message, then sign the
  //     // user in with confirmationResult.confirm(code).
  //     let prompt = this.alertCtrl.create({
  //     title: 'Enter the Confirmation code',
  //     inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
  //     buttons: [
  //       { text: 'Cancel',
  //         handler: data => { console.log('Cancel clicked'); }
  //       },
  //       { text: 'Send',
  //         handler: data => {
  //           confirmationResult.confirm(data.confirmationCode)
  //           .then(function (result) {
  //             this.CreateUserProfile
  //             console.log(result.user);
  //           }).catch(function (error) {
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // })
  // .catch(function (error) {
  //   console.error("SMS not sent", error);
  // });
  // }
//===============================================================

//SIGNOUT =======================================================
  Signout(){
    this.afAuth.auth.signOut();
  }
//===============================================================

//CURRENTUSER===================================================
  GetCurrentUser(){  
    this.afAuth.authState.subscribe(user => {
      return user;
    })
  }
//===============================================================

//CREATECURRENTUSER===================================================
  // CreateUserProfile(){  
  //   this.afAuth.authState.subscribe(user => {
  //     const userData = {
  //       phonenumber: user.phoneNumber,
  //       userID: user.uid,
  //       dummy: true
  //     }
  //     this.afDB.collection('users').doc(user.uid).valueChanges().subscribe(userInfo => {
  //       if (userInfo==null){
  //         this.afDB.collection("users").doc(user.uid).set(userData)
  //         console.log('profile created:', userData)
  //       }
  //       else {
  //         console.log('profile already exist')
  //       }
  //     })
  //   })
  // }
//===============================================================



  // ionViewDidLoad() {
  //   this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  // }

}
