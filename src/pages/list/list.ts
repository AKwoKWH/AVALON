import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFirestoreDocument } from 'angularfire2/firestore';
// import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as admin from "firebase-admin";
import firebase from 'firebase';
import request from 'request'
// import { Http } from '@angular/http';

// export interface Item {}


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  currentUser = {displayName: 'LOADING....'};
  RoomData = {Name: '' , RoleData: ''};
  joingame = false;
  PlayerStatus = null;
  RoomPlayer;
  MyRole;
  TotalPlayer;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDB: AngularFirestore,
    // public http: Http
  ) {
      afAuth.authState.subscribe(user => {
        if (!user) {this.currentUser = null}
        else {
          this.currentUser = user
          this.afDB.collection("users").doc(user.uid).valueChanges().subscribe(result => {
            console.log(result)
            if(result!=null){
              if (result.photoURLCustom64!=null){
              this.currentUser = this.combineArray(user,{photoURL:result.photoURLCustom64})
              }else { this.currentUser = user}
            }
          })
        }
        console.log(this.currentUser)
      })
      this.GetRoomData()
      this.checkStatus()
      this.AssignRole()
      // this.Trigger()

      // firebase.messaging().onMessage(payload => {
      //   console.log("Message received. ", payload);
      //   // return self.registration.showNotification(notificationTitle,notificationOptions);
      // });
    }




  GetRoomData(){
    console.log("GetPlayerListCalled")
    this.afDB.collection("games").doc('DEFAULT ROOM').valueChanges().subscribe(result => {
      console.log(result)
      this.RoomData = result      
    })

    this.afDB.collection("games").doc('DEFAULT ROOM').collection('PLAYERS').valueChanges().subscribe(result => {
      // console.log(result)
      var count = 0 
      for (var key in result) {
        console.log(result[key])
        if (result[key].status == "READY" || result[key].status == "SHOW"){
        console.log(result[key].PlayerRole)
        count = count + 1
        }
      }
      console.log('TOTAL: ',count)      
      this.TotalPlayer = count
      this.RoomPlayer = result 
      if (count == this.RoomData.Number){ 
        console.log("START")
        this.FCMGetToken()
      }   
    })

  }


//CombineArray==================================================
  combineArray(Array1,Array2){
    var ArrayCombine = Object.assign({}, Array1, Array2);
    return ArrayCombine
  }

//==============================================================

//CHECKSTATUS====================================================
  checkStatus(){
  this.afAuth.authState.subscribe(user => {
    this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(user.uid).valueChanges().subscribe(playerInfo => {
        if (playerInfo==null){
          console.log('profile not in room');
        }
        else {
          this.PlayerStatus = playerInfo.status
          this.MyRole = playerInfo.PlayerRole
          console.log('profile in room', playerInfo.status)
        }
    })

    // this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').valueChanges().subscribe(playerInfo => {

    //   var count = 0 
    //   for (var key in playerInfo) {
    //     count = count + 1
    //     // console.log('temp: ',count)
    //   }
    //     console.log('TOTAL: ',count)      
    //     this.TotalPlayer = count
    // })

  })
  }
//===============================================================



//FCM====================================================================

  FCMTokenRefresh(){
    firebase.messaging().onTokenRefresh(function() {
      firebase.messaging().getToken()
      .then(function(refreshedToken) {
        console.log('Token refreshed.');
      })
      .catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
      });
    });
  }

  FCMGetToken(){
    firebase.messaging().getToken()
      .then(currentToken => {
        if (currentToken) {
            console.log(currentToken);
            this.SENDFCM(currentToken)
            // this.scope.testing()
          } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            //Request Permission
            firebase.messaging().requestPermission().then(function() {
              console.log('Notification permission granted.');
              //Re-get Token
              firebase.messaging().getToken().then(function(currentToken) {
                if (currentToken) {
                  console.log(currentToken);
                  this.SENDFCM(currentToken)
                }
              }) 
            }).catch(function(err) {
              console.log('Unable to get permission to notify.', err);
            });
          }
      })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  SENDFCMAPP(userFcmToken){
    console.log("SENDFCM - GameStart")
      const payload = {
        notification: {
          title: "Game Start",
          body: "Game Start - Lets Go",
          icon: "https://placeimg.com/250/250/people"
        }
      };

    // return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + FirebaseEnvironment.firebaseConfig.googleCloudAPIKey, body);
  }


  SENDFCM(deviceId){

      // firebase.messaging().onMessage(payload => {
      //   console.log("Message received. ", payload);
      // // return self.registration.showNotification(notificationTitle,notificationOptions);
      // });

      request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
          'Content-Type' :' application/json',
          'Authorization': 'key=AAAAUfsD2mI:APA91bHe3pi2DgzRccx7kqpmAf8_8e59VxCSeZeUA_PyBakewcalPpMd0Gkzs7akpgClZm6qsOx0oKgHcOxDiQlAWMzCwwUUg1eiygCkz_mRxPfwsFM5ewD9SJTbFxDUlywwvZdYyv6C'
        },
        body: JSON.stringify(
          { "data": {
            "message": "Game Start - Lets Go"
          },
            "to" : deviceId
            // "to" : 'c_XZFxDio1U:APA91bEOXReotDyrfTImskiAA19-I_12rD8XSC6_o1gwXpQLNtn6TtZwhffsfrwPu4Kc7RZlBYXFFyjTymNpkx3BhQnk1J32fSm0NNllBTr2chfX8FlKQwrnftlJDMCEfYQQGJzc6lYs'
          }
        )
      }, function(error, response, body) {
        if (error) { 
          console.error(error, response, body); 
        }
        else if (response.statusCode >= 400) { 
          console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
        }
        else {
          console.log('Done!')
          console.error('Response: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
        }
      });

  }

  
//=====================================================================


//JOINGAME=======================================================
  JoinGame(){  
    var timestamp = new Date().getTime();
    // this.afAuth.authState.subscribe(user => {
      const userData = {
        phonenumber: this.currentUser.phoneNumber,
        displayName: this.currentUser.displayName,
        photoURL: this.currentUser.photoURL,
        userID: this.currentUser.uid,
        dummy: true,
        status: 'JOIN',
        time: timestamp
      }
      
      // this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(user.uid).valueChanges().subscribe(playerInfo => {
      //   if (playerInfo==null){
          this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(this.currentUser.uid).set(userData);
    //       console.log('profile created:', userData);
    //       // this.AssignRole()
    //       return
    //     }
    //  })
    // })
  }
//===============================================================


//READYGAME=======================================================
  ReadyGame(){
    // this.afAuth.authState.subscribe(user => {
      const userData = {
        status: 'READY',
      }
      // this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(user.uid).valueChanges().subscribe(playerInfo => {
      //   if (playerInfo.status=='JOIN'){
          this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(this.currentUser.uid).update(userData);
      //     return
      //   } 
      // })
    // })
  }
//===============================================================

//SHOWDATA=======================================================
  ShowGame(){
    // this.afAuth.authState.subscribe(user => {
      const userData = {
        status: 'SHOW',
      }
      // this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(user.uid).valueChanges().subscribe(playerInfo => {
      //   if (playerInfo.status=='READY'){
          this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(this.currentUser.uid).update(userData);
      //     return
      //   }
      // })
    // })
    
  }
//===============================================================



//SETDATA=======================================================
  AssignRole(){
    console.log(this.RoomData)
      this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').valueChanges().subscribe(playerInfo => {
      for (var key in playerInfo) {
          if (playerInfo.hasOwnProperty(key)) {
            var PlayerID = playerInfo[key].userID
            var MatchingKey = this.RoomData.RoleOrder[key]      
            var PlayerRole =  this.RoomData.RoleData[MatchingKey-1]    
            console.log(PlayerID, MatchingKey, PlayerRole);
            this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(PlayerID).update({PlayerRole: PlayerRole});
          }
      }
      })
  }
//==============================================================


//TRIGGER=======================================================
  Trigger(){
      this.afAuth.authState.subscribe(user => {
          var timestamp = new Date().getTime
          console.log (timestamp)
          this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(user.uid).update({LoginTime: timestamp});
      })
  }
//==============================================================

}

