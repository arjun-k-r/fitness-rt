// Angular
import { Injectable } from '@angular/core';

// Ionic
import {
  Loading,
  LoadingController,
  ToastController
} from 'ionic-angular';

@Injectable()
export class NotificationProvider {
  private _loader: Loading;
  constructor(private _loadCtrl: LoadingController, private _toastCtrl: ToastController) { }

  public closeLoading(): void {
    if (this._loader) {
      this._loader.dismiss();
      delete this._loader;
    }
  }

  public showError(message: string): void {
    this._toastCtrl.create({
      closeButtonText: 'GOT IT!',
      cssClass: 'alert-message',
      dismissOnPageChange: true,
      duration: 5000,
      message,
      showCloseButton: true
    }).present();
  }

  public showInfo(message: string): void {
    this._toastCtrl.create({
      closeButtonText: 'GREAT!',
      dismissOnPageChange: true,
      duration: 5000,
      message,
      showCloseButton: true
    }).present();
  }

  public showLoading(): void {
    this._loader = this._loadCtrl.create({
      content: 'Please wait...',
      duration: 5000,
      spinner: 'crescent'
    });
    this._loader.present();
  }

}
