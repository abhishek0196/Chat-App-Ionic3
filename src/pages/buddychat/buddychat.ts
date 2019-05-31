import { UserProvider } from './../../providers/user/user';
import { messages } from './../../models/interfaces/messages';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';

/**
 * Generated class for the BuddychatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: messages = 
  {
    docid : "",
    receiverId : "",
    senderId : "",
    timestamp : "",
    displayName:"",
    photoURL : ""
  };
  newmessage;
  allmessages = [];
  photoURL;
  online;
  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public chatservice: ChatProvider,
              public events: Events, 
              public zone: NgZone,
              private userpro:UserProvider) {
    this.buddy = this.chatservice.buddy;
 
               
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    // 
    // this.allmessages = this.chatservice.buddymessages;
  
    
    this.events.subscribe("online",() => {
      console.log("online",this.online);
      this.online = this.userpro.online;
    })
  }
  ionViewWillEnter(){
      this.events.subscribe('newmessage', () => {
     
      this.zone.run(() => {
        
        this.chatservice.buddymessages.forEach(msg =>{
          this.allmessages.push({
            senderid :msg.senderid,
            message : msg.message,
          })

        })
        console.log("msg",this.allmessages);
        console.log("length ",this.allmessages.length);
        // if(this.chatservice.buddymessages.length === 1)
        // {
        // console.log("chat length",this.chatservice.buddymessages.senderid);
        
        // }
      })
    }) 
  }
 
  ionViewDidEnter(){
    this.chatservice.getbuddymessages();
 
    this.userpro.getOnline(this.buddy.receiverId);

  }
  // newLine()
  // {
   
  //   if(this.newmessage != undefined && this.newmessage.trim() != '')

  //     if(this.newmessage.length > 30)
  //     {
  //       console.log("beefore",this.newmessage);
  //       this.newmessage = this.newmessage + "\n";
  //       console.log("after",this.newmessage);
  //     }
  // }
  addmessage() {
    if(this.newmessage != undefined && this.newmessage.trim() != '')
{
    var msg = this.newmessage ;
    this.newmessage = '';

    this.chatservice.addnewmessage(msg).then(() => {
      this.content.scrollToBottom();
      
    })
  }
  }

  ionViewWillLeave(){
   this.events.unsubscribe('newmessage');
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}