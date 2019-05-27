import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { connreq } from '../../models/interfaces/request';
import { RequestsProvider } from '../../providers/requests/requests';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  newrequest = {} as connreq;
  temparr = [];
  filteredusers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userservice: UserProvider,private alertCtrl :AlertController,
              private requestservice:RequestsProvider) {
               // console.log(this.userservice.getallusers());
    this.userservice.getallusers().then((res: any) => {
      
      this.filteredusers = res;
      this.temparr = res;
   
   })
  }

  ionViewDidLoad() {

  }

  searchuser(searchbar) {
   
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }

    this.filteredusers = this.filteredusers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }
  reset()
  {
    this.filteredusers = this.temparr;
    return;
  }
  sendreq(recipient) {
    this.newrequest.sender = firebase.auth().currentUser.uid;
    this.newrequest.recipient = recipient.uid;
   
      let successalert = this.alertCtrl.create({
        title: 'Request sent',
        subTitle: 'Your request was sent to ' + recipient.name,
        buttons: ['ok']
      });
    
      this.requestservice.sendrequest(this.newrequest).then((res: any) => {
        if (res.success) {
          successalert.present();
          let sentuser = this.filteredusers.indexOf(recipient);
          this.filteredusers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
    
  }
}