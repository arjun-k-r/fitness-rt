// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

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
  name: 'registration'
})
@Component({
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  private history: string;
  private tabBarElement: any;
  public registrationForm: FormGroup;
  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private params: NavParams
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.history = this.params.get('history');
    this.registrationForm = new FormGroup({
      email:  new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required, Validators.pattern(/[A-Za-z]+(\s[A-Za-z]+)?$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
    this.registrationForm.addControl('passwordConfirm', new FormControl('', [Validators.required, CustomValidators.equalTo(this.registrationForm.controls['password'])]));
  }

  public login(): void {
    this.navCtrl.setRoot('login', {
      history: this.history
    })
  }

  public register(): void {
    this.notifyPvd.showLoading();
    this.afAuth.auth.createUserWithEmailAndPassword(
      this.registrationForm.get('email').value.trim(),
      this.registrationForm.get('password').value.trim()
    )
      .then((user: User) => {
        user.updateProfile({
          displayName: this.registrationForm.get('name').value.trim(),
          photoURL: ''
        }).then(() => {
          this.notifyPvd.closeLoading();
          if (!!this.history) {
            this.navCtrl.setRoot(this.history);
          } else {
            this.navCtrl.setRoot('profile');
          }
        }).catch((err: FirebaseError) => {
          this.notifyPvd.closeLoading();
          this.notifyPvd.showError(err.message);
        });
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      });
  }
}
