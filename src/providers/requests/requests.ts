import { CollectionsProvider } from './../collections/collections';
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

  db = firebase.firestore();

  
  userdetails = [];
  myfriends = [];
  constructor(public userservice: UserProvider, public events: Events,private collectionName:CollectionsProvider) {
    
  }

  sendrequest(req: connreq) {
    var promise = new Promise((resolve, reject) => {
      this.db.collection(this.collectionName.requestCollection).add({
          receiver_id:req.recipient,
          sender_id:req.sender,
          status:"Pending"
      })

    
    .then(() => {
        resolve({ success: true });
        }).catch((err) => {
          resolve(err);
    })
    })
    return promise;  
  }
  acceptrequest(docid:string,senderid:string,receiverid:string) {
   
    var promise = new Promise((resolve, reject) => {
      this.myfriends = [];
      
      this.db.collection(this.collectionName.requestCollection).doc(docid).update({
        status:"Accepted"
      }).then(()=>
      {
          this.db.collection(this.collectionName.friendsCollection).add({
            user1:senderid,
            user2:receiverid
          }).then(()=>{
            resolve(true);
          }).catch((err) => {
                  reject(err);
                 })

          }).catch((err) => {
            alert(err);
           })
      });
      
    return promise;
  
    
   }

   declinerequest(docid:string) {
      var promise = new Promise((resolve, reject) => {
    this.myfriends = [];
    
    this.db.collection(this.collectionName.requestCollection).doc(docid).update({
      status:"Rejected"
    })
          .then(() => {
          
        }).catch((err) => {
          reject(err);
        })
    })
    return promise; 
   }


   /*
   Friends Collection Schema--- >  user1:id , user2:id
   Users Collection Schema ---> uid:id,and other details.
   so in this funtion we are matching the currently logged in user with eithier user1/user2
   and then if user1 is the currently logged in user then fecthing the details of user2 
   from the users collection and then displaying itin user1's friends section.
   */
  
  getmyfriends()
  {
    var self = this;
    var id:string = firebase.auth().currentUser.uid;
    var data = [];
    var userQuery = self.db.collection(self.collectionName.usersCollection);
    self.db.collection(self.collectionName.friendsCollection)
    .onSnapshot(friendsSnapshot =>
      {
          friendsSnapshot.docChanges.forEach(friendsDoc =>{
            var source = friendsDoc.doc.metadata.hasPendingWrites ? "Local" : "Server";
          
            console.log(source);
           
              if(id === friendsDoc.doc.data().user1 && friendsDoc.type === 'added')
              {
                userQuery.where("uid","==",friendsDoc.doc.data().user2).get()
                .then(userSnapshot => {
                  userSnapshot.forEach(userDoc =>{
                   // console.log(" user1 display name",userDoc.data().displayName);
                    data.push({
                      docid :friendsDoc.doc.id,
                      displayName :userDoc.data().displayName,
                      photoURL : userDoc.data().photoURL,
                      senderid : friendsDoc.doc.data().user2,
                      receiverid : friendsDoc.doc.data().user1 
                    })
                  })
                })
                
              }
              if(id === friendsDoc.doc.data().user2 && friendsDoc.type === 'added')
              {
                userQuery.where("uid","==",friendsDoc.doc.data().user1).get()
                .then(userSnapshot => {
                  userSnapshot.forEach(userDoc =>{
                    // console.log(" user2 display name",userDoc.data().displayName);
                    data.push({
                      docid :friendsDoc.doc.id,
                      displayName :userDoc.data().displayName,
                      photoURL : userDoc.data().photoURL,
                      senderid : friendsDoc.doc.data().user1,
                      receiverid : friendsDoc.doc.data().user2 
                    })
                  })
                })
              }
              
          })
          self.myfriends = data;
              this.events.publish('friends');
      })
  }
  getmyrequests() 
  {
    var self = this;
    var data = [];
    var id:string = firebase.auth().currentUser.uid;
    var senderQuery = this.db.collection(this.collectionName.usersCollection);
    this.db.collection(this.collectionName.requestCollection)
    .where("receiver_id", "==",id).where("status", "==", "Pending")
    .onSnapshot(requestSnapshot =>
    {
      data = [];
      if(requestSnapshot.empty)
      {
        
      }
      else
      {
        requestSnapshot.forEach(requestDoc=>
        {
          let filterSenderQuery = senderQuery.where("uid","==",requestDoc.data().sender_id)
          filterSenderQuery.onSnapshot(senderSnapshot =>
          {
            
            if(senderSnapshot.empty)
            {
              console.log("why?")
            }
            else
            {
              senderSnapshot.forEach(senderDoc=>
                {
                  data.push(
                  {
                    docid :requestDoc.id,
                    displayName :senderDoc.data().displayName,
                    photoURL : senderDoc.data().photoURL,
                    senderid: requestDoc.data().sender_id,
                    receiverid : requestDoc.data().receiver_id
                  })
                    
                }) 
               
              }
            })
            
          })           
      }
      self.userdetails = data;
      //console.log("kaiswe",this.userdetails);  
      self.events.publish("requests");
    })
  }

}

