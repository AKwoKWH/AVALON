import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html'
})
export class SubscriptionPage {

  userList;
  searchUserForm={};

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {} 
  
  GetUserList(){  
      this.userList = this.afDB.collection('users').valueChanges()
  }

  UploadTestData(){
    var pushkey = this.afDB.createId();
    var RandPhoneNumber  = 90000000 + Math.round(Math.random()*10000000)
    var TestName = "USER #" + Math.round(Math.random()*100)
    
    if (RandPhoneNumber % 2 == 1) {var RandGender = 'M'}
    else {var RandGender = 'F'}

    const userData = {
        phonenumber: RandPhoneNumber,
        userID: pushkey,
        selfDescription: "This is a auto-gen test user " + RandPhoneNumber,
        userName: TestName,
        gender: RandGender
    }
    console.log(userData)
    this.afDB.collection("users").doc(pushkey).set(userData)
      
  }


}
