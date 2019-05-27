import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController, Loading} from 'ionic-angular';

import { usercreds } from '../../models/interfaces/usercreds';

import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = {} as usercreds;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthProvider,public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    console.log("hello");
  }

  signin() {
   
    this.presentLoading();
    this.authservice.login(this.credentials).then((res: any) => {
      console.log("resss",res);
      if (!res.code)
        this.navCtrl.setRoot('TabsPage');
      else
        alert(res);
    })
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  passwordreset() {
    this.navCtrl.push('PasswordresetPage');
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
     
      duration: 2000
    });
    loading.present();
  }
}