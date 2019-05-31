import * as functions from 'firebase-functions';


import * as admin from 'firebase-admin';
admin.initializeApp();
exports.createTeamMember = functions.firestore
  .document('/friends/{newfriend}/chat/{newchat}')
  .onCreate((snap:any) => {
      if(snap.exists)
      {
        const newValue = snap.data();
        console.log("messages"+newValue.message)
        return null;
      }
    
    //
    
});