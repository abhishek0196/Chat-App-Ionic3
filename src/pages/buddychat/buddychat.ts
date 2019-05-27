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
  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
              public events: Events, public zone: NgZone) {
    this.buddy = this.chatservice.buddy;
 

    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    // 
    // this.allmessages = this.chatservice.buddymessages;
  
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
      
      })
    })
  }
 
  ionViewDidEnter(){
    this.chatservice.getbuddymessages();
  }

  addmessage() {
    var msg = this.newmessage ;
    this.newmessage = '';

    this.chatservice.addnewmessage(msg).then(() => {
      this.content.scrollToBottom();
      
    })
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