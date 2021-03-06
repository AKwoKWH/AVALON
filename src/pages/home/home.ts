import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
// import { NavParams } from 'ionic-angular';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import * as admin from "firebase-admin";
 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser = {displayName: 'LOADING....'};
  timestamp = Date.now()
  timesnap = this.timestamp - Math.floor(this.timestamp/10000)*10000
  roomdata = {
    Oberon:false,
    Percival: false,
    Merlin: true,
    Mordred: false,
    Morgana: false,
    Assassin: false,
    Lancelot: false,
    Name: this.RandomName(),
    Number: 8 ,
    Selection: ''
  };

  RolesName;
  Selection;

  constructor(
    public navCtrl: NavController, 
    // public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public alertCtrl:AlertController,
    public afDB: AngularFirestore
  ) {
      afAuth.authState.subscribe(user => {
        this.currentUser = user
        if (!user) {this.currentUser = null}
        else {this.currentUser = user}
        console.log(this.currentUser)
      })
       this.GetRolesName()
    }


  // GetPlayerList(){
  //   console.log("GetPlayerListCalled")
  //   this.afDB.collection('players', ref => {
  //     return ref
  //   }).valueChanges().subscribe(result => {
  //     this.playerList = result
  //     console.log(result)
  //   })
  // }
RandomName(){
  var projectNameGenerator = require("project-name-generator")
  return projectNameGenerator().dashed.toUpperCase(); 
}

presentAlert(Infomation) {
  let alert = this.alertCtrl.create({
    title: 'ROOM CREATED',
    subTitle: Infomation.Name + ': ' + Infomation.Number + ' players',
    buttons: ['Dismiss']
  });
  alert.present();
}

//CombineArray==================================================
  combineArray(Array1,Array2){
    var ArrayCombine = Object.assign({}, Array1, Array2);
    return ArrayCombine
  }

//==============================================================

//GetRoles=======================================================
  GetRoles(n){  
    return new Promise((resolve) => {

    this.afDB.collection("roles").doc(n+'').valueChanges().subscribe(result => {
      
      var ServantNumber = result.Servant;
      var EvilNumber = result.Evil;
      var Selection = result.Selection
      var addrole = []


      if (ServantNumber > 1) {
        ServantNumber = ServantNumber - 1
        // addrole = this.combineArray(addrole,{role: 'Oberon', side: 'RED'})
        addrole.push({role: 'Merlin', side: 'BLUE'})
      }
      if (this.roomdata.Oberon == true && EvilNumber > 0) {
        EvilNumber = EvilNumber - 1
        // addrole = this.combineArray(addrole,{role: 'Oberon', side: 'RED'})
        addrole.push({role: 'Oberon', side: 'RED'})
      }
      if (this.roomdata.Assassin == true && EvilNumber > 0) {
        EvilNumber = EvilNumber - 1
        // addrole = this.combineArray(addrole,{role: 'Oberon', side: 'RED'})
        addrole.push({role: 'Assassin', side: 'RED'})
      }
      if (this.roomdata.Percival == true && ServantNumber > 0) {
        ServantNumber = ServantNumber - 1
        // addrole = this.combineArray(addrole,{role: 'Percival', side: 'BLUE'})
        addrole.push({role: 'Percival', side: 'BLUE'})
      }
      if (this.roomdata.Mordred == true && EvilNumber > 0) {
        EvilNumber = EvilNumber - 1
        // addrole = this.combineArray(addrole,{role: 'Mordred', side: 'RED'})
        addrole.push({role: 'Mordred', side: 'RED'})
      }
      if (this.roomdata.Morgana == true && EvilNumber > 0) {
        EvilNumber = EvilNumber - 1
        // addrole = this.combineArray(addrole,{role: 'Morgana', side: 'RED'})
        addrole.push({role: 'Morgana', side: 'RED'})
      }
      if (this.roomdata.Lancelot == true && EvilNumber > 0 && ServantNumber > 0) {
        console.log("Lancelot")
        EvilNumber = EvilNumber - 1
        ServantNumber = ServantNumber - 1
        addrole.push({role: 'Lancelot', side: 'RED'})
        addrole.push({role: 'Lancelot', side: 'BLUE'})
      }

      var RED = 0
      var BLUE = 0
      while(RED < EvilNumber){
        addrole.push({role: 'Minion', side: 'RED'}) 
        RED = RED + 1
      }

      while(BLUE < ServantNumber){
        addrole.push({role: 'Servant', side: 'BLUE'})      
        BLUE = BLUE + 1
      }
      this.RolesName = addrole
      this.Selection = Selection
      console.log(addrole);
      resolve (addrole)
    })

    })
  }
//===============================================================






//GetRolesName====================================================
  GetRolesName(){
    // this.roomdata.Merlin.checked
    // console.log(this.roomdata.Merlin)
    this.GetRoles(this.roomdata.Number)
  }

//===============================================================


//DELETEROOM=====================================================
  DeleteRoom(){
    this.afDB.collection("games").doc('DEFAULT ROOM').delete
  }
//===============================================================

//CREATEROOM=====================================================
  CreateRoom(){  
    console.log(this.roomdata)
    this.GetRoles(this.roomdata.Number).then(RoleData => {
      var RoleOrder = this.GenerateRandomOrder(this.roomdata.Number)
      var RoomDataAdj = this.combineArray(this.roomdata, {RoleOrder: RoleOrder})
      var RoomDataAdj = this.combineArray(RoomDataAdj, {RoleData: RoleData})
      var RoomDataAdj = this.combineArray(RoomDataAdj, {Selection: this.Selection})
      var RoomDataAdj = this.combineArray(RoomDataAdj, {CreateTime: ''+Math.floor(Date.now())})
      console.log(RoomDataAdj)


      //Search For Room with Same Name:
      

      //Remove Room
      // this.afDB.collection('games').doc('DEFAULT ROOM').delete().catch(err => console.log(err));
      this.afDB.collection("games").doc('DEFAULT ROOM').collection("PLAYERS").valueChanges().pipe(take(1)).subscribe(playerInfo => {
        for (var key in playerInfo) {
          if (playerInfo.hasOwnProperty(key)) {
            var PlayerID = playerInfo[key].userID
            console.log(PlayerID);
            this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(PlayerID).delete();
          }
        }  
      return
      })

      //Create New Room
      // this.afDB.collection("games").doc('DEFAULT ROOM').set(RoomDataAdj);
      this.afDB.collection("games").doc(RoomDataAdj.CreateTime).set(RoomDataAdj);
      this.presentAlert(RoomDataAdj)
      this.roomdata.Name= this.RandomName()

      // this.afDB.collection("games").doc('DEFAULT ROOM').collection("PLAYERS").ref.get().then(playerInfo => {

      //   playerInfo.forEach(player => {
      //       this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(player.id).delete()
      //   });

        // console.log(playerInfo.data())
        // for (var key in playerInfo) {
        //   if (playerInfo.hasOwnProperty(key)) {
        //     var PlayerID = playerInfo[key].userID
        //     console.log(PlayerID);
        //     this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(PlayerID).delete();
        //   }
        // }  
        // return
      // })
      
      // console.log(this.roomdata)
    })
  }
//===============================================================


//===============================================================
  GenerateRandomOrder(n){
    var arr = []
    var i = 0
    for (i = 0; i < n; i++) {
      var randomNumber = Math.floor(Math.random() * n) + 1;
      if (arr.indexOf(randomNumber) < 0) {
        arr.push(randomNumber);
      } else i--;
    }
    return arr
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
      .then(function(currentToken) {
        if (currentToken) {
            console.log(currentToken);
            this.SENDFCM(currentToken)
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

  SENDFCM(userFcmToken){
      const payload = {
        notification: {
          title: "Game Start",
          body: "Game Start - Lets Go",
          icon: "https://placeimg.com/250/250/people"
        }
      };

    // const admin = require('firebase-admin');
    // admin.sendToDevice(userFcmToken, payload)

  }

//=====================================================================



// //CREATECURRENTUSER===================================================
//   JoinGame(){  
//     this.afAuth.authState.subscribe(user => {
//       const userData = {
//         phonenumber: user.phoneNumber,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//         userID: user.uid,
//         dummy: true
//       }
//       this.afDB.collection('players').doc(user.uid).valueChanges().subscribe(userInfo => {
//         if (userInfo==null){
//           this.afDB.collection("players").doc(user.uid).set(userData);
//           console.log('profile created:', userData);
//         }
//         else {
//           console.log('profile already exist')
//         }
//         this.joingame = true;
//         this.GetPlayerList()
//       })
//     })
//   }
// //===============================================================

}

