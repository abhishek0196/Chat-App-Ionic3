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
    var data = [];
    var id:string = firebase.auth().currentUser.uid;
    var senderQuery = this.db.collection(this.collectionName.usersCollection);
    //Getting the friends / user ids of the firends with the currently logged in user.
    //checking if user1 has the same id as the currently logged in user.
    this.db.collection(this.collectionName.friendsCollection).where("user1" ,"==",id)
    .onSnapshot(user1Snapshot =>
    {
      data = [];
      //if the snapshot results empty then we are checkng if  user1 has the same id as the currently logged in user.
      if(user1Snapshot.empty)
      {
        this.db.collection(this.collectionName.friendsCollection).where("user2" ,"==",id)
        .onSnapshot(user2Snapshot =>
        {
          data = [];
          //Even after checking, if the snapshot is empty that means , that the currently logged in user has no friends.
          if(user2Snapshot.empty)
          {

          }
          //now we are fetching the details of the other user who is friend with the currently logged in user.
          else
          {
           user2Snapshot.forEach(user2doc =>
            {
              
              let filterSenderQuery = senderQuery.where("uid","==",user2doc.data().user1)
              filterSenderQuery.onSnapshot(senderSnapshot =>
              {
                
                if(senderSnapshot.empty)
                {
                  console.log("why? user2")
                }
                else
                {
                 
                  senderSnapshot.docChanges.forEach(senderDoc=>
                  {
                    console.log(senderDoc);
                    if (senderDoc.type === 'added') {
                      data.push({
                        docid :user2doc.id,
                        displayName :senderDoc.doc.data().displayName,
                        photoURL : senderDoc.doc.data().photoURL,
                        senderid : user2doc.data().user2,
                        receiverid : user2doc.data().user1 
                      })
                    }
                  })

                 
                }
              })

              self.myfriends = data;
              this.events.publish('friends'); 
            })
          } 
        })
      }
      else
      {
        //now we are fetching the details of the other user who is friend with the currently logged in user.
        user1Snapshot.forEach(user1doc =>
        {
          
          let filterSenderQuery = senderQuery.where("uid","==",user1doc.data().user2)
          filterSenderQuery
          .onSnapshot(senderSnapshot =>
          {
            if(senderSnapshot.empty)
            {
              console.log("why? user1")
            }
            else
            {
              
              senderSnapshot.docChanges.forEach(senderDoc=>
              {
                if(senderDoc.type == 'added')
                {
                  console.log(senderDoc);
                  data.push(
                  {
                    docid :user1doc.id,
                    displayName :senderDoc.doc.data().displayName,
                    photoURL : senderDoc.doc.data().photoURL,
                    senderid : user1doc.data().user1,
                    receiverid : user1doc.data().user2 
                  })
                }
              })
              console.log("user1",this.myfriends);
            }
          })
          
          self.myfriends = data;
          this.events.publish('friends'); 
        })
      }
    })
  }  
   
  getmyrequests() 
  {
    var self = this;
    var data = [];
    var id:string = firebase.auth().currentUser.uid;
    var senderQuery = this.db.collection(this.collectionName.usersCollection);
    data = [];
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

