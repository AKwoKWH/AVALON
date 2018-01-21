import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser = {displayName: 'LOADING....'};

  roomdata = {
    Oberon:false,
    Percival: false,
    Mordred: false,
    Morgana: false,
    Assassin: false,
    Name: 'DEFAULT ROOM',
    Number: 8 
  };

  RolesName;

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
      console.log(addrole);
      resolve (addrole)
    })

    })
  }
//===============================================================



//GetRolesName====================================================
  GetRolesName(){
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
      console.log(RoomDataAdj)
      // this.afDB.collection("games").doc('DEFAULT ROOM').collection("PLAYERS").valueChanges().subscribe(playerInfo => {
      //   for (var key in playerInfo) {
      //     if (playerInfo.hasOwnProperty(key)) {
      //       var PlayerID = playerInfo[key].userID
      //       console.log(PlayerID);
      //       this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(PlayerID).delete();
      //     }
      //   }  
      // return
      // })

      this.afDB.collection("games").doc('DEFAULT ROOM').collection("PLAYERS").ref.get().then(playerInfo => {

        playerInfo.forEach(player => {
            this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(player.id).delete()
        });

        // console.log(playerInfo.data())
        // for (var key in playerInfo) {
        //   if (playerInfo.hasOwnProperty(key)) {
        //     var PlayerID = playerInfo[key].userID
        //     console.log(PlayerID);
        //     this.afDB.collection('games').doc('DEFAULT ROOM').collection('PLAYERS').doc(PlayerID).delete();
        //   }
        // }  
        // return
      })


      this.afDB.collection('games').doc('DEFAULT ROOM').delete();
      this.afDB.collection("games").doc('DEFAULT ROOM').set(RoomDataAdj);
      this.presentAlert(RoomDataAdj)
      
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

