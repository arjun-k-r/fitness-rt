import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from 'ionic-angular';

@Injectable()
export class AlertService {

  constructor(private _alertCtrl: AlertController) {}

  public showAlert(message: string, subTitle: string = "This doesn't seem to be right", title: string = 'Uhh ohh...'): void {
    let alertOpts: AlertOptions = {
      title: title,
      subTitle: subTitle,
      message: message,
      buttons: ['OK']
    };

    this._alertCtrl.create(alertOpts).present();
  }

}
