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
  lastResult = "";
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
            created: new Date()
            // created: firebase.firestore.FieldValue.serverTimestamp()
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

  // getbuddymessages() {
  //   let skip = this;
  //   var query ;
  //   if(skip.lastResult === '')
  //   {
  //       query =  this.db.collection(this.collectionName.friendsCollection).doc(this.buddy.docid)
  //       .collection(this.collectionName.chatsCollection).orderBy('created').limit(5);
  //   }
  //   else{
  //     query =  this.db.collection(this.collectionName.friendsCollection).doc(this.buddy.docid)
  //     .collection(this.collectionName.chatsCollection).orderBy('created').startAfter(skip.lastResult).limit(5);
  //   }
    
  //    query.onSnapshot(snapshot=> {
  //      skip.buddymessages = [];
  //      if(snapshot.empty)
  //      { 
  //        console.log("First Chat");
  //      }
  //      else{
  //        if(snapshot.docs.length > 0){
  //       var last = snapshot.docs[snapshot.docs.length - 1];
  //        snapshot.forEach(msgDoc =>{
  //           skip.buddymessages.push({
  //            senderid : msgDoc.data().senderid,
  //            message : msgDoc.data().message})
  //        })
  //        skip.lastResult = last;
  //       }
  //      }
  //      console.log(skip.buddymessages);
  //      this.events.publish('newmessage');
       
  //    })
  //  }
  // getbuddymessages() {
  //  let skip = this;
  //   this.db.collection(this.collectionName.friendsCollection).doc(this.buddy.docid)
  //   .collection(this.collectionName.chatsCollection).orderBy('created')
  //   .onSnapshot(snapshot=> {
  //     skip.buddymessages = [];
  //     if(snapshot.empty)
  //     {
  //       console.log("First Chat");
  //     }
  //     else{
  //       snapshot.forEach(msgDoc =>{
  //          skip.buddymessages.push({
  //           senderid : msgDoc.data().senderid,
  //           message : msgDoc.data().message})
  //       })
  //     }
  //     console.log(skip.buddymessages);
  //     this.events.publish('newmessage');
  //   })
  // }
  getbuddymessages() {
    let skip = this;
    skip.buddymessages = [];
     this.db.collection(this.collectionName.friendsCollection).doc(this.buddy.docid)
     .collection(this.collectionName.chatsCollection).orderBy('created')
     .onSnapshot(snapshot=> {
     console.log("before",skip.buddymessages.length);
       if(snapshot.empty)
       {
         console.log("First Chat");
       }
       else{
        //  console.log("size",snapshot.size)
         snapshot.docChanges.forEach(msgDoc => {
           
           if (msgDoc.type === 'added') {
             console.log('New : ', msgDoc.doc.data());
             skip.buddymessages.push({
              senderid : msgDoc.doc.data().senderid,
              message : msgDoc.doc.data().message
            })
              
           }
          //  if (change.type === 'modified') {
          //    console.log('Modified : ', change.doc.data());
          //  }
          //  if (change.type === 'removed') {
          //    console.log('Removed : ', change.doc.data());
          //  }
         });
       }
       console.log("After",skip.buddymessages.length);
       //console.log(skip.buddymessages);
       this.events.publish('newmessage');
     })
   }
   

}