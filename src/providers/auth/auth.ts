import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { usercreds } from '../../models/interfaces/usercreds';
import { ToastController } from 'ionic-angular';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
  
  constructor(public afireauth: AngularFireAuth,private Toast:ToastController) {

  }

/*
    For logging in a particular user. Called from the login.ts file.
  
*/  
async presentToast() {
  const toast = await this.Toast.create({
    message: 'Put Valid Email And Password.',
    duration: 2000
  });
  toast.present();
}
  login(credentials: usercreds) {
    var promise = new Promise((resolve) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        resolve(true);
      }).catch((err) => {
          this.presentToast();
        
       })
    })

    return promise;
    
  }

}