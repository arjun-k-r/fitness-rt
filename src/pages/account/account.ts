// App
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, AlertOptions, IonicPage, LoadingController, NavController, Toast, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Providers
import { PictureService } from '../../providers';

@IonicPage({
  name: 'account'
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  @ViewChild('fileInput') fileInput;
  public avatar: string;
  public uploadReady: boolean = false;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _loadCtrl: LoadingController,
    private _navCtrl: NavController,
    private _picService: PictureService,
    private _toastCtrl: ToastController
  ) {  }

  public changeImage(): void {
    if (Camera['installed']()) {
      this._actionSheetCtrl.create({
        title: 'Change image',
        buttons: [
          {
            text: 'Take photo',
            handler: () => {
              this._picService.takePhoto().then((photoUri: string) => {
                this.avatar = photoUri;
                this.uploadImage();
              }).catch((err: Error) => this._alertCtrl.create({
                title: 'Uhh ohh...',
                subTitle: 'Something went wrong',
                message: err.toString(),
                buttons: ['OK']
              }).present());
            }
          }, {
            text: 'Choose image',
            handler: () => {
              this._picService.chooseImage().then((photoUri: string) => {
                this.avatar = photoUri;
                this.uploadImage();
              }).catch((err: Error) => this._alertCtrl.create({
                title: 'Uhh ohh...',
                subTitle: 'Something went wrong',
                message: err.toString(),
                buttons: ['OK']
              }).present());
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

  public processWebImage(event) {
    let reader: FileReader = new FileReader();
    reader.onload = (readerEvent: Event) => {
      this.uploadImage(event.target.files[0]);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  public signout(): void {
    this._navCtrl.setRoot('registration');
    this._afAuth.auth.signOut();
  }

  public uploadImage(file?: File): void {
    let canceledUpload: boolean = false,
      toast: Toast = this._toastCtrl.create({
        message: 'Uploading ... 0%',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Cancel'
      });
    toast.present();
    toast.onWillDismiss(() => {
      canceledUpload = true;
      this._picService.cancelUpload();
    });

    this._picService.uploadImage('recipes', file).subscribe((data: string | number) => {
      if (typeof data === 'number') {
        toast.setMessage(`Uploading ... ${data}%`);
      } else {
        this.avatar = data;
        this._afAuth.auth.currentUser.updateProfile({
          displayName: this._afAuth.auth.currentUser.displayName,
          photoURL: this.avatar
        });
      }
    }, (err: Error) => {
      toast.setMessage('Uhh ohh, something went wrong!');
    },
      () => {
        if (canceledUpload === true) {
          this._toastCtrl.create({
            message: 'Upload canceled',
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            duration: 10000
          }).present();
        } else {
          toast.dismiss();
          this._toastCtrl.create({
            message: 'Upload complete!',
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            duration: 10000
          }).present();
        }
      });
  }

  ionViewCanEnter(): void {
    this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!auth) {
        this._navCtrl.setRoot('registration', {
          history: 'account'
        });
      } else {
        this.avatar = auth.photoURL;
      }
    })
  }

  ionViewDidEnter(): void {
    if (!!this.avatar) {
      this._toastCtrl.create({
        message: 'Hint: Click the avatar to change it',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'OK',
        duration: 10000
      }).present();
    }
  }
}
