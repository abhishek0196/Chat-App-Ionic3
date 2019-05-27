import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
 
/**
 * Generated class for the ChatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myrequests = [];
  myfriends = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
              public events: Events, public alertCtrl: AlertController, public chatservice: ChatProvider,private userservice:UserProvider) {
  }

  ionViewDidLoad() {
    
    firebase.auth().onAuthStateChanged((user) =>
    {
      
      if(!user)
      {
        console.log("hell00");
        this.navCtrl.setRoot("LoginPage");
      }
      else{
        var id:string = firebase.auth().currentUser.uid;
        this.requestservice.getmyrequests(id);
        this.requestservice.getmyfriends(id);
        this.myfriends = [];
        this.myrequests = [];
        this.events.subscribe('requests', () => {
          
          this.myrequests = [];
          this.myrequests = this.requestservice.userdetails;
         
        })
        this.events.subscribe('friends', () => {
          this.myfriends = [];
          this.myfriends = this.requestservice.myfriends; 
        })
      }
    })
      
 
  }
  // ionViewWillEnter() {
    
  //   firebase.auth().onAuthStateChanged((user) =>
  //   {
      
  //     if(!user)
  //     {
  //       console.log("hell00");
  //       this.navCtrl.setRoot("LoginPage");
  //     }
  //     else{
  //       var id:string = firebase.auth().currentUser.uid;
  //       this.requestservice.getmyrequests(id);
  //       this.requestservice.getmyfriends(id);
  //       this.myfriends = [];
  //       this.myrequests = [];
  //       this.events.subscribe('requests', () => {
          
  //         this.myrequests = [];
  //         this.myrequests = this.requestservice.userdetails;
         
  //       })
  //       this.events.subscribe('friends', () => {
  //         this.myfriends = [];
  //         this.myfriends = this.requestservice.myfriends; 
  //       })
  //     }
  //   })
      
 
  // }

  ionViewDidLeave() {
    this.events.unsubscribe('requests');
    this.events.unsubscribe('friends');
  }
 

  
  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }
  accept(docid:string,senderid:string,receiverid:string) {
    
    this.requestservice.acceptrequest(docid,senderid,receiverid).then(() => {
      
      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }
  ignore(docid:string) {
    this.requestservice.declinerequest(docid).then(() => {
      let newalert = this.alertCtrl.create({
        title: 'Invitation Rejected',
        subTitle: 'You Can Search For More Friends',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  buddychat(docid:string,senderid:string,receiverid:string,displayName :string,photoURL:string) {
   this.chatservice.initializebuddy(docid,senderid,receiverid,displayName,photoURL);
    this.navCtrl.parent.parent.push('BuddychatPage');
  }
}