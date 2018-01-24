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
  private _history: string;
  private _tabBarElement: any;
  public registrationForm: FormGroup;
  constructor(
    private _afAuth: AngularFireAuth,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams
  ) {
    this._tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this._history = this._params.get('history');
    this.registrationForm = new FormGroup({
      email:  new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required, Validators.pattern(/[A-Za-z]+(\s[A-Za-z]+)?$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
    this.registrationForm.addControl('passwordConfirm', new FormControl('', [Validators.required, CustomValidators.equalTo(this.registrationForm.controls['password'])]));
  }

  public login(): void {
    this._navCtrl.setRoot('login', {
      history: this._history
    })
  }

  public register(): void {
    this._notifyPvd.showLoading();
    this._afAuth.auth.createUserWithEmailAndPassword(
      this.registrationForm.get('email').value.trim(),
      this.registrationForm.get('password').value.trim()
    )
      .then((user: User) => {
        user.updateProfile({
          displayName: this.registrationForm.get('name').value.trim(),
          photoURL: ''
        }).then(() => {
          this._notifyPvd.closeLoading();
          if (!!this._history) {
            this._navCtrl.setRoot(this._history);
          } else {
            this._navCtrl.setRoot('profile');
          }
        }).catch((err: FirebaseError) => {
          this._notifyPvd.closeLoading();
          this._notifyPvd.showError(err.message);
        });
      }).catch((err: FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      });
  }
}
