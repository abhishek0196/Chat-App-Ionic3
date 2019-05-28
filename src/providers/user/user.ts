import { Events } from 'ionic-angular';
import { CollectionsProvider } from './../collections/collections';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import 'firebase/firestore'
import { AngularFirestore} from 'angularfire2/firestore';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserProvider {
  db = firebase.firestore();
  online:boolean;
  // firedata = firebase.database().ref('/users');
  // firereq = firebase.database().ref('/requests');

  constructor(public afireauth: AngularFireAuth,
    public firestore: AngularFirestore,
    private collectionName:CollectionsProvider,
    private events:Events) {
  
  }

  adduser(newuser) {
    
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
          displayName: newuser.displayName,
          photoURL: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652__340.png',         
        }).then(() => {
          this.db.collection(this.collectionName.usersCollection).doc(this.afireauth.auth.currentUser.uid).set({
            uid: this.afireauth.auth.currentUser.uid,
            displayName: newuser.displayName,
            photoURL: "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652__340.png",
            online : false,
            //lastseen : " "
          
          // this.firedata.child(this.afireauth.auth.currentUser.uid).set({
          //   uid: this.afireauth.auth.currentUser.uid,
          //   displayName: newuser.displayName,
          //   photoURL: "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652__340.png"
          }).then(() => {
            resolve({ success: true });
            }).catch((err) => {
              reject(err);
          })
          }).catch((err) => {
            reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
      this.db.collection(this.collectionName.usersCollection)
      .doc(firebase.auth().currentUser.uid).get().then(docSnapshot => {
        if (!docSnapshot.exists) {
          console.log('No matching documents.');
          return;
        }  
        else{
          resolve(docSnapshot.data());
        }        
      })
      .catch(err => {
        console.log('Error getting documents', err);
        reject(err);
      });

    })
    return promise;
  }
  updateimage(imageurl) {

    var promise = new Promise((resolve, reject) => {
        this.afireauth.auth.currentUser.updateProfile({
            displayName: this.afireauth.auth.currentUser.displayName,
            photoURL: imageurl      
        }).then(() => {
         
          this.db.collection(this.collectionName.usersCollection)
          .doc(firebase.auth().currentUser.uid).update({
            photoURL: this.afireauth.auth.currentUser.photoURL,
           })   
        .then(() => {
                resolve({ success: true });
                }).catch((err) => {
                    reject(err);
                })
        }).catch((err) => {
              reject(err);
           })  
    })
    return promise;
  }

  // updateimage(imageurl) {
  //   this.docId ='';
  //   var promise = new Promise((resolve, reject) => {
  //       this.afireauth.auth.currentUser.updateProfile({
  //           displayName: this.afireauth.auth.currentUser.displayName,
  //           photoURL: imageurl      
  //       }).then(() => {
  //         this.db.collection(this.collectionName.usersCollection)
  //         .where('uid', '==', firebase.auth().currentUser.uid).get().then(snapshot => {
  //           if (snapshot.empty) {
  //             console.log('No matching documents.');
  //             return;
  //           }  
        
  //           snapshot.forEach(doc => {
  //             this.docId = doc.id;

  //           });

  //         })
  //         .catch(err => {
  //           console.log('Error getting documents', err);
  //         });
  //         this.db.collection(this.collectionName.usersCollection).doc(this.docId).update({
  //           displayName: this.afireauth.auth.currentUser.displayName,
  //           photoURL: this.afireauth.auth.currentUser.photoURL,
  //           uid: firebase.auth().currentUser.uid
  //         })
  //       //     firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
  //       //     displayName: this.afireauth.auth.currentUser.displayName,
  //       //     photoURL: imageurl,
  //       //     uid: firebase.auth().currentUser.uid
  //       //     })
  //       .then(() => {
  //               resolve({ success: true });
  //               }).catch((err) => {
  //                   reject(err);
  //               })
  //       }).catch((err) => {
  //             reject(err);
  //          })  
  //   })
  //   return promise;
  // }
  // updatedisplayname(newname) {
  //   this.docId ='';
 
   
  //   var promise = new Promise((resolve, reject) => {
  //     this.afireauth.auth.currentUser.updateProfile({
  //     displayName: newname,
  //     photoURL: this.afireauth.auth.currentUser.photoURL
  //   }).then(() => {
  //     this.db.collection(this.collectionName.usersCollection).where('uid', '==', firebase.auth().currentUser.uid).get().then(snapshot => {
  //       if (snapshot.empty) {
  //         console.log('No matching documents.');
  //         return;
  //       }  
    
  //       snapshot.forEach(doc => {
  //         this.docId = doc.id;
         
  //         this.db.collection(this.collectionName.usersCollection).doc(this.docId).update({
  //           displayName:  newname,
  //           photoURL:  this.afireauth.auth.currentUser.photoURL,
  //           uid: firebase.auth().currentUser.uid
  //         })
        
  //         .then(() => {
  //           resolve({ success: true });
  //         }).catch((err) => {
  //           reject(err);
  //         })
  //         })
  //       });

  //     })
  //     .catch(err => {
  //       console.log('Error getting documents', err);
  //     });
      
      
  //     // this.firedata.child(firebase.auth().currentUser.uid).update({
  //     //   displayName: newname,
  //     //   photoURL: this.afireauth.auth.currentUser.photoURL,
  //     //   uid: this.afireauth.auth.currentUser.uid
  //     // })
  //   })
  //   return promise;
  // }
  updatedisplayname(newname) {
    
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
      displayName: newname,
      photoURL: this.afireauth.auth.currentUser.photoURL
    }).then(() => {
         this.db.collection(this.collectionName.usersCollection)
         .doc(firebase.auth().currentUser.uid).update({
            displayName:  newname,
          })
        
          .then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          })
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    
    })
    return promise;
  }

  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.db.collection(this.collectionName.usersCollection).get().then(userSnapshot => { 
        this.db.collection(this.collectionName.requestCollection).get().then(requestSnapshot =>{
                let arr = [];
                if(requestSnapshot.empty)
                {
                  userSnapshot.forEach(userDoc =>
                    {
                      
                      if(firebase.auth().currentUser.uid != userDoc.data().uid )
                        arr.push({
                          docid:userDoc.id,
                          name:userDoc.data().displayName,
                          photoURL:userDoc.data().photoURL,
                          uid:userDoc.data().uid
                        });
                    })
                }
                else
                {
               
                  userSnapshot.forEach(userDoc =>
                  {
                    let  flag1 = true ,flag2 = true;
                    requestSnapshot.forEach(requestDo=>
                    {
                     
                      if(firebase.auth().currentUser.uid != userDoc.data().uid 
                       &&( requestDo.data().receiver_id != userDoc.data().uid || requestDo.data().sender_id != firebase.auth().currentUser.uid)
                       && (requestDo.data().receiver_id != firebase.auth().currentUser.uid || requestDo.data().sender_id != userDoc.data().uid))
                       {
                            flag1 = true;
                          }
                          else{
                            flag2 = false;
                          }
                       })
                       if(flag1 && flag2)
                       {
                        arr.push({
                          docid:userDoc.id,
                          name:userDoc.data().displayName,
                          photoURL:userDoc.data().photoURL,
                          uid:userDoc.data().uid
                        });
                      }
                    
                  })
                }
                resolve(arr);
          })
       })
      .catch((err) => {
        reject(err);
      })
    })
    return promise;
}
 updateOnline(flag:boolean)
 {
  var uid:string = firebase.auth().currentUser.uid;
   if(flag === true)
   {
     this.db.collection(this.collectionName.usersCollection).doc(uid).update({
          online:true
        })
   }
   else if(flag === false)
   {
      this.db.collection(this.collectionName.usersCollection).doc(uid).update({
      online:false
    })
     
   }
 }
 getOnline(uid:string)
 {
    this.db.collection(this.collectionName.usersCollection).doc(uid).onSnapshot(doc=>{
      this.online = doc.data().online;
      this.events.publish("online");
   })
 }
}