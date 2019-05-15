import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { connreq } from '../../models/interfaces/request';
import { UserProvider } from '../user/user';
import firebase from 'firebase';


/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RequestsProvider {
  // firereq = firebase.database().ref('/requests');
  // firefriends = firebase.database().ref('/friends');
  db = firebase.firestore();
  collectionName = "requests";
  
  userdetails;
  myfriends;
  constructor(public userservice: UserProvider, public events: Events) {
    
  }

  sendrequest(req: connreq) {
    var promise = new Promise((resolve, reject) => {
      this.db.collection(this.collectionName).add({
          receiver_id:req.recipient,
          sender_id:req.sender,
          status:"Pending"
      })

    //   this.firereq.child(req.recipient).push().set({
    //   sender: req.sender,
    //   status : "PENDING"
    //   })
    .then(() => {
        resolve({ success: true });
        }).catch((err) => {
          resolve(err);
    })
    })
    return promise;  
  }

   getmyrequests() {
  //   let allmyrequests;
  //   var myrequests = [];

  //   this.firereq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
  //     allmyrequests = snapshot.val();
  //     myrequests = [];
  //     for (var i in allmyrequests) {
  //       myrequests.push(allmyrequests[i].sender);
  //     }
  //     // this.userservice.getallusers().then((res) => {
  //     //   var allusers = res;
  //     //   this.userdetails = [];
  //     //   for (var j in myrequests)
  //     //     for (var key in allusers) {
  //     //       if (myrequests[j] === allusers[key].uid) {
  //     //         this.userdetails.push(allusers[key]);
  //     //       }
  //     //     }
  //     //   this.events.publish('gotrequests');
  //     // })

  // })
  }  

   acceptrequest(buddy) {
  //   var promise = new Promise((resolve, reject) => {
  //     this.myfriends = [];
  //     this.firefriends.child(firebase.auth().currentUser.uid).push().set({
  //       uid: buddy.uid
  //     }).then(() => {
  //       this.firefriends.child(buddy.uid).push().set({
  //         uid: firebase.auth().currentUser.uid
  //       }).then(() => {
  //         this.updaterequest(buddy).then(() => {
  //         resolve(true);
  //       })
        
  //       }).catch((err) => {
  //         reject(err);
  //        })
  //       }).catch((err) => {
  //         reject(err);
  //     })
  //   })
  //   return promise;
   }

   updaterequest(buddy) {
  //   var promise = new Promise((resolve, reject) => {
  //    this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
  //         let somekey;
  //         for (var key in snapshot.val())
  //           somekey = key;
  //         this.firereq.child(firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
  //           resolve(true);
  //         })
  //        })
  //         .then(() => {
          
  //       }).catch((err) => {
  //         reject(err);
  //       })
  //   })
  //   return promise; 
   }

   getmyfriends() {
  //   let friendsuid = [];
  //   this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
  //     let allfriends = snapshot.val();
  //     this.myfriends = [];
  //     for (var i in allfriends)
  //       friendsuid.push(allfriends[i].uid);
        
  //     // this.userservice.getallusers().then((users) => {
  //     //   this.myfriends = [];
  //     //   for (var j in friendsuid)
  //     //     for (var key in users) {
  //     //       if (friendsuid[j] === users[key].uid) {
  //     //         this.myfriends.push(users[key]);
  //     //       }
  //     //     }
  //     //   this.events.publish('friends');
  //     // }).catch((err) => {
  //     //   alert(err);
  //     // })
    
  //  })
   }  
      getReceiver(){
  
  //   console.log((firebase.auth().currentUser.uid));
  //   this.firereq.orderByChild(firebase.auth().currentUser.uid).on('value',(snapshot) =>
  //   {
  //     console.log(snapshot.val());
  //   })
   }
}