// Angular
import { Component, ViewChild } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  Toast,
  ToastController
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { BodyFat, BodyMeasurements, Fitness, UserProfile } from '../../models';

// Providers
import { FitnessProvider, PictureProvider, UserProfileProvider } from '../../providers';

/**
 * TODO: Reactive forms
 */

@IonicPage({
  name: 'profile'
})
@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('fileInput') fileInput;
  private _authId: string;
  private _authSubscription: Subscription;
  public profilePageSegment: string = 'userInfo';
  public unsavedChanges: boolean = false;
  public userInfo: firebase.UserInfo;
  public userProfile: UserProfile;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _fitPvd: FitnessProvider,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _picPvd: PictureProvider,
    private _toastCtrl: ToastController,
    private _userPvd: UserProfileProvider
  ) {
    this.userProfile = new UserProfile(
      0,
      new Fitness(0, new BodyFat('', 0, 0, 0), ''),
      '',
      false,
      false,
      new BodyMeasurements(0, 0, 0, 0, 0, 0)
    );
  }

  public changeImage(): void {
    if (Camera['installed']()) {
      this._actionSheetCtrl.create({
        title: 'Change image',
        buttons: [
          {
            text: 'Take photo',
            handler: () => {
              this._picPvd.takePhoto().then((photoUri: string) => {
                this.userInfo.photoURL = photoUri;
                this.uploadImage();
              }).catch((err: Error) => {
                this._toastCtrl.create({
                  closeButtonText: 'GOT IT!',
                  cssClass: 'alert-message',
                  dismissOnPageChange: true,
                  duration: 5000,
                  message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
                  showCloseButton: true
                }).present();
              });
            }
          }, {
            text: 'Choose image',
            handler: () => {
              this._picPvd.chooseImage().then((photoUri: string) => {
                this.userInfo.photoURL = photoUri;
                this.uploadImage();
              }).catch((err: Error) => {
                this._toastCtrl.create({
                  closeButtonText: 'GOT IT!',
                  cssClass: 'alert-message',
                  dismissOnPageChange: true,
                  duration: 5000,
                  message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
                  showCloseButton: true
                }).present();
              });
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).present();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  public changeMade(): void {
    this.unsavedChanges = true;
  }

  public processWebImage(event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (readerEvent: Event) => {
      this.uploadImage(event.target.files[0]);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  public saveChanges(): void {
    const loader: Loading = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 5000,
      spinner: 'crescent'
    });
    loader.present();
    const { age, gender, measurements } = this.userProfile;
    const bodyFat: BodyFat = this._fitPvd.calculateBodyFat(age, gender, measurements.height, measurements.hips, measurements.neck, measurements.waist, measurements.weight);
    const bmr: number = this._fitPvd.calculateBmr(age, gender, measurements.height, measurements.weight);
    const bodyShape: string = this._fitPvd.calculateBodyShape(measurements.chest, gender, measurements.hips, measurements.waist);
    this.userProfile.fitness = new Fitness(bmr, bodyFat, bodyShape);
    console.log(this.userProfile.fitness);
    this._userPvd.saveUserProfile(this._authId, this.userProfile)
      .then(() => {
        loader.dismiss();
        this._toastCtrl.create({
          closeButtonText: 'GREAT!',
          dismissOnPageChange: true,
          duration: 5000,
          message: 'Profile saved successfully!',
          showCloseButton: true
        }).present();
      }).catch((err: firebase.FirebaseError) => {
        loader.dismiss();
        this._toastCtrl.create({
          closeButtonText: 'GOT IT!',
          cssClass: 'alert-message',
          dismissOnPageChange: true,
          duration: 5000,
          message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
          showCloseButton: true
        }).present();
      })
  }

  public uploadImage(file?: File): void {
    let canceledUpload: boolean = false,
      uploadComplete: boolean = false;
    const toast: Toast = this._toastCtrl.create({
      closeButtonText: 'Cancel',
      message: 'Uploading ... 0%',
      position: 'bottom',
      showCloseButton: true
    });

    toast.present();
    toast.onWillDismiss(() => {
      if (!uploadComplete) {
        canceledUpload = true;
        this._picPvd.cancelUpload();
      }
    });

    this._picPvd.uploadImage(this._authId, 'photos', file).subscribe((data: string | number) => {
      if (typeof data === 'number') {
        toast.setMessage(`Uploading ... ${data}%`);
      } else {
        this.userInfo.photoURL = data;
        this._afAuth.auth.currentUser.updateProfile({
          displayName: this.userInfo.displayName,
          photoURL: this.userInfo.photoURL
        }).catch((err: firebase.FirebaseError) => {
          this._toastCtrl.create({
            closeButtonText: 'GOT IT!',
            cssClass: 'alert-message',
            dismissOnPageChange: true,
            duration: 5000,
            message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
            showCloseButton: true
          }).present();
        });
      }
    }, (err: firebase.FirebaseError) => {
      toast.setMessage(err.message);
    },
      () => {
        if (canceledUpload === false) {
          uploadComplete = true;
          if (toast) {
            toast.dismiss();
          }
          this._toastCtrl.create({
            closeButtonText: 'GREAT!',
            duration: 5000,
            message: 'Upload complete!',
            showCloseButton: true
          }).present();
        } else {
          this._toastCtrl.create({
            closeButtonText: 'OK',
            duration: 5000,
            message: 'Upload canceled',
            showCloseButton: true
          }).present();
        }
      });
  }

  public viewPageInfo(): void {
    this._navCtrl.push('profile-info');
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'profile'
        });
      }
    })
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        const { displayName, email, phoneNumber, photoURL, providerId, uid } = this._afAuth.auth.currentUser;
        this.userInfo = {
          displayName,
          email,
          phoneNumber,
          photoURL,
          providerId,
          uid
        };
        this._userPvd.getUserProfile$(this._authId).subscribe((up: UserProfile) => {
          if (!!up && !up.hasOwnProperty('$value')) {
            this.userProfile = Object.assign({}, up);
          }
        }, (err: firebase.FirebaseError) => {
          this._toastCtrl.create({
            closeButtonText: 'GOT IT!',
            cssClass: 'alert-message',
            dismissOnPageChange: true,
            duration: 5000,
            message: `<ion-icon color="warn" name="warning"></ion-icon>${err.message} `,
            showCloseButton: true
          }).present();
        })
      }
    })
  }

}
