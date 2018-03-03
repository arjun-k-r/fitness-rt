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
  private loader: Loading;
  constructor(private loadCtrl: LoadingController, private toastCtrl: ToastController) { }

  public closeLoading(): void {
    if (this.loader) {
      this.loader.dismiss();
      delete this.loader;
    }
  }

  public showError(message: string): void {
    this.toastCtrl.create({
      closeButtonText: 'GOT IT!',
      cssClass: 'alert-message',
      dismissOnPageChange: true,
      duration: 5000,
      message,
      showCloseButton: true
    }).present();
  }

  public showInfo(message: string, duration?: number): void {
    this.toastCtrl.create({
      closeButtonText: 'GREAT!',
      dismissOnPageChange: true,
      duration: duration || 5000,
      message,
      showCloseButton: true
    }).present();
  }

  public showLoading(): void {
    this.loader = this.loadCtrl.create({
      content: 'Please wait...',
      duration: 5000,
      spinner: 'crescent'
    });
    this.loader.present();
  }

}
