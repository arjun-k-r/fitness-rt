// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseError, User } from 'firebase/app';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'login'
})
@Component({
  templateUrl: 'login.html'
})
export class LoginPage {
  private history: string;
  public loginForm: FormGroup;
  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private params: NavParams
  ) {
    this.history = this.params.get('history');
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  public forgotPassword(): void {
    this.navCtrl.setRoot('forgot-password', {
      history: this.history
    })
  }

  public login(): void {
    this.notifyPvd.showLoading();
    this.afAuth.auth.signInWithEmailAndPassword(
      this.loginForm.get('email').value.trim(),
      this.loginForm.get('password').value.trim()
    )
      .then((user: User) => {
        this.notifyPvd.closeLoading();
        if (this.history) {
          this.navCtrl.setRoot(this.history);
        } else {
          this.navCtrl.setRoot('profile');
        }
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }

  public register(): void {
    this.navCtrl.setRoot('registration', {
      history: this.history
    })
  }
}
