import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { take } from 'rxjs/operators';
import { AngularFirestoreDocument } from 'angularfire2/firestore';

import { QRCodeModule } from 'angular2-qrcode';

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
  RoomData = {Name: '' , RoleData: '', Selection: ''};
  joingame = false;
  PlayerStatus = null;
  RoomPlayer;
  MyRole;
  TotalPlayer;
  DisplayRole = true;
  admincounter = 0;
  lastPlayer = false
  adminUser = false
  RoomID = 'DEFAULT ROOM'
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDB: AngularFirestore,
    // public http: Http
  ) {
    // this.DisplayRoles
      afAuth.authState.subscribe(user => {
        if (!user) {this.currentUser = null}
        else {
          this.currentUser = user
          this.afDB.collection("users").doc(user.uid).valueChanges().subscribe(result => {
            if(result!=null){
              if (result.NewName!=null){
                this.currentUser = this.combineArray(this.currentUser,{displayName:result.NewName})
              }
              if (result.photoURLCustom64!=null){
                this.currentUser = this.combineArray(this.currentUser,{photoURL:result.photoURLCustom64})
              }
            }
          })
        }
        // console.log(this.currentUser)
      })
      // this.RoomID = this.navParams.get('RoomID')
      // console.log(this.navParams.get('RoomID'))
      //   if (this.navParams.get('RoomID')!=null){
      //     console.log(this.navParams.get('RoomID'))
      //   }else{
      //     123
      //   }

      if (navParams.get("Room")!=undefined){
        this.RoomID = navParams.get("Room")
        this.GetRoomData()
        this.checkStatus()
        this.AssignRole()      
      } else{
        this.afDB.collection("games").valueChanges().subscribe(RoomInfo => {
          for (var key in RoomInfo) {
            if (RoomInfo.hasOwnProperty(key)) {
              var ID = RoomInfo[key].CreateTime
              // console.log(ID)
              if (ID!='DEFAULT'){ 
                this.RoomID = ID
              } 
            }
          }
          // console.log(this.RoomID)
          this.GetRoomData()
          this.checkStatus()
          this.AssignRole()            
        })      
      }
        
        // this.GetRoomData()
        // this.checkStatus()
        // this.AssignRole()      

      //this.setdata()
      // this.Trigger()

    }




  GetRoomData(){
    console.log("GetPlayerListCalled")
    this.afDB.collection("games").doc(this.RoomID).valueChanges().subscribe(result => {
      console.log(result)
      this.RoomData = result      
    })

    this.afDB.collection("games").doc(this.RoomID).collection('PLAYERS').valueChanges().subscribe(result => {
      // console.log(result)
      this.afAuth.authState.subscribe(user => {
      
        var count = 0 
        for (var key in result) {
          console.log(result[key])
          if (result[key].status == "READY" || result[key].status == "SHOW"){
            count = count + 1
          }
          if (result[key].userID == user.uid){
            var mystatus = result[key].status
          }
        }
        console.log('TOTAL: ',count)
        this.TotalPlayer = count
        this.RoomPlayer = result 

        if (count == this.RoomData.Number - 1 && mystatus == 'JOIN'){ 
          console.log("I AM THE LAST ONE")
          this.lastPlayer = true
          // this.FCMGetToken('I AM THE LAST ONE')
        } else {this.lastPlayer = false}

        // if (count == this.RoomData.Number){ 
        //   console.log("START")
        //   this.FCMGetToken('Game Start')
        // } else {
        //   // this.FCMGetToken(count + ' Player Joined')      
        // }   
      })
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
      this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(user.uid).valueChanges().subscribe(playerInfo => {
          console.log(playerInfo)
          if (playerInfo==null || !playerInfo){
            this.PlayerStatus = null;
            console.log('profile not in room', this.PlayerStatus)
          }
          else {
            this.PlayerStatus = playerInfo.status
            this.MyRole = playerInfo.PlayerRole
            console.log('profile in room', playerInfo.status)
          }
      })
    })
  }
//===============================================================

NotificationTesting() {
  if ("Notification" in window) {
    var permission = Notification.permission;
    console.log(permission)
    var notificationtest = new Notification("Hello, world!");
  }
}

//FCM====================================================================


  SendSelfFCM(msg){
    firebase.messaging().getToken()
      .then(currentToken => {
        if (currentToken) {
            console.log(currentToken);
            this.SENDFCM(currentToken,msg)
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

  SENDFCM(deviceId, msg){

      request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
          'Content-Type' :' application/json',
          'Authorization': 'key=AAAAUfsD2mI:APA91bHe3pi2DgzRccx7kqpmAf8_8e59VxCSeZeUA_PyBakewcalPpMd0Gkzs7akpgClZm6qsOx0oKgHcOxDiQlAWMzCwwUUg1eiygCkz_mRxPfwsFM5ewD9SJTbFxDUlywwvZdYyv6C'
        },
        body: JSON.stringify(
          { "data": {
            "message": msg
          },
            "to" : deviceId
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



//SEND EVERYONE==================================================

  gameStartFCM(){
    this.afDB.collection("games").doc(this.RoomID).collection("PLAYERS").valueChanges().pipe(take(1)).subscribe(player => {
        for (var key in player) {
          this.afDB.collection("users").doc(player[key].userID).valueChanges().pipe(take(1)).subscribe(result => {      
            console.log('Send ' + result.displayName + ', Token: ' + result.token)
            this.SENDFCM(result.token,"Game is now START!!!!")
          })
        } 
      })
  }

//===============================================================

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
          this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(this.currentUser.uid).set(userData);
    //       console.log('profile created:', userData);
    //       // this.AssignRole()
    //       return
    //     }
    //  })
    // })
  }
//===============================================================


//SETDATA============================================================

  setdata(){
    this.afDB.collection('roles').doc('10').set({Evil: 4, Servant: 6, Selection: '3➟4➟4➟5*➟5'}).catch(err => console.log(err));
    this.afDB.collection('roles').doc('9').set({Evil: 3, Servant: 6, Selection: '3➟4➟4➟5*➟5'});
    this.afDB.collection('roles').doc('8').set({Evil: 3, Servant: 5, Selection: '3➟4➟4➟5*➟5'});
    this.afDB.collection('roles').doc('7').set({Evil: 3, Servant: 4, Selection: '2➟3➟3➟4*➟4'});
    this.afDB.collection('roles').doc('6').set({Evil: 2, Servant: 4, Selection: '2➟3➟4➟3➟4'});
    this.afDB.collection('roles').doc('5').set({Evil: 2, Servant: 3, Selection: '2➟3➟2➟3➟3'});


  }
    

//===================================================================


//ADMIN MODE======================================================

  AdminMode(){
    this.admincounter = this.admincounter +1
    if (this.admincounter>10){
      this.adminUser = true
      this.setdata()
    }
  }

//================================================================


//poke===========================================================
  pokeUser(player){
    console.log(player)
    //this check if node exist
    // this.afDB.collection("users").doc(player.userID).ref.get().then(userInfo => {
    //   console.log(userInfo.exists, userInfo)        
    // })
    // this.afDB.collection("users").doc('12345').ref.get().then(userInfo => {
    //   console.log(userInfo.exists, userInfo)        
    // })

    this.afDB.collection("users", ref => {
      return ref.where('userID', '==', player.userID)
    }).valueChanges().pipe(take(1)).subscribe(result => {
      console.log(result[0].token)
      // this.SENDFCM(result[0].token,'Hello ' + player.displayName)
      this.SENDFCM(result[0].token,'SOMEONE POKE YOU!!!!')
    })

  }
//================================================================

//KICK===========================================================
  kickUser(player){
    this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(player.userID).delete();
    this.afDB.collection("games").doc(this.RoomID).collection("PLAYERS").valueChanges().pipe(take(1)).subscribe(player => {      
      for (var key in player) {
        // console.log(player[key])
          if (player[key].status == 'SHOW') {
            const userData = {status: 'READY'}
            this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(player[key].userID).update(userData);
          }
      }
    })
  }
//================================================================




//READYGAME=======================================================
  ReadyGame(){
    // this.afAuth.authState.subscribe(user => {
      const userData = {
        status: 'READY',
      }
      // this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(user.uid).valueChanges().subscribe(playerInfo => {
      //   if (playerInfo.status=='JOIN'){
          this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(this.currentUser.uid).update(userData);
      //     return
      //   } 
      // })
    // })
      if (this.lastPlayer == true) {
        console.log('SEND ALL A START GAME MSG')
        this.gameStartFCM()
      }
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
          this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(this.currentUser.uid).update(userData);
      //     return
      //   }
      // })
    // })
    
  }
//===============================================================

//DISPLAYROLE====================================================
  DisplayRoles(){
    if (this.DisplayRole==true){
      this.DisplayRole=false
      console.log(this.DisplayRole)
    } else {
      this.DisplayRole=true
      console.log(this.DisplayRole)
    }
  }
//===============================================================


//SETDATA=======================================================
  AssignRole(){
    console.log(this.RoomData)
      this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').valueChanges().subscribe(playerInfo => {
      for (var key in playerInfo) {
          if (playerInfo.hasOwnProperty(key)) {
            var PlayerID = playerInfo[key].userID
            var MatchingKey = this.RoomData.RoleOrder[key]      
            var PlayerRole =  this.RoomData.RoleData[MatchingKey-1]    
            console.log(PlayerID, MatchingKey, PlayerRole);
            this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(PlayerID).update({PlayerRole: PlayerRole});
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
          this.afDB.collection('games').doc(this.RoomID).collection('PLAYERS').doc(user.uid).update({LoginTime: timestamp});
      })
  }
//==============================================================

}

