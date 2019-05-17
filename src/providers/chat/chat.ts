import { CollectionsProvider } from './../collections/collections';
import { messages } from './../../models/interfaces/messages';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatProvider {
  // firebuddychats = firebase.database().ref('/buddychats');
  db = firebase.firestore();
  buddy: messages = 
  {
    docid : "",
    receiverId : "",
    senderId : "",
    timestamp : "",
    displayName:"",
    photoURL : ""
  };
  buddymessages = [];
  constructor(public events: Events,
    private collectionName:CollectionsProvider) {
    
  }

  initializebuddy(docid:string,senderid:string,receiverid:string,displayName :string,photoURL:string) {
    this.buddy.docid = docid;
    this.buddy.receiverId  = receiverid;
    this.buddy.senderId = senderid;
    this.buddy.timestamp = " ";
    this.buddy.displayName = displayName;
    this.buddy.photoURL = photoURL;

  }

  addnewmessage(msg) {
    if (this.buddy) {

      var promise = new Promise((resolve, reject) => {

          this.db.collection(this.collectionName.friendsCollection).doc(this.buddy.docid).collection(this.collectionName.chatsCollection).add({
            senderid : this.buddy.senderId,
            receiverid: this.buddy.receiverId,
            message : msg,
            timestamp :  firebase.database.ServerValue.TIMESTAMP
          })
          .then(() => {
            resolve(true);
            }).catch((err) => {
              reject(err);
          })
        // this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
        //   sentby: firebase.auth().currentUser.uid,
        //   message: msg,
        //   timestamp: firebase.database.ServerValue.TIMESTAMP
        // }).then(() => {
        //   this.firebuddychats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push().set({
        //     sentby: firebase.auth().currentUser.uid,
        //     message: msg,
        //     timestamp: firebase.database.ServerValue.TIMESTAMP
        //   }).then(() => {
        //     resolve(true);
        //     }).catch((err) => {
        //       reject(err);
        //   })
        // })
      })
      return promise;
    }
  }

  getbuddymessages() {
    this.buddymessages = [];
    this.db.collection(this.collectionName.friendsCollection).doc(this.buddy.docid).collection(this.collectionName.chatsCollection).get().then(snapshot=> {
      if(snapshot.empty)
      {
        console.log("First Chat");
      }
      else{
        snapshot.forEach(msgDoc =>{
           this.buddymessages.push({
            senderid : msgDoc.data().senderid,
            message : msgDoc.data().message})
        })
        console.log("messages",this.buddymessages);
        this.events.publish('newmessage');
      }
    }).catch((err) => {
      alert(err);
     })
  //   let temp;
  //   this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
  //     this.buddymessages = [];
  //     temp = snapshot.val();
  //     for (var tempkey in temp) {
  //       this.buddymessages.push(temp[tempkey]);
  //     }
  //     this.events.publish('newmessage');
  //   })
   }

}