// App
import { Component, ViewChild } from '@angular/core';
import { AlertController, AlertOptions, Nav, Platform, ToastController } from 'ionic-angular';
import { Deploy } from '@ionic/cloud-angular';

// Cordova
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {
    HomePage,
    FoodListPage,
    RegistrationPage
} from '../pages';

export interface IPageLink {
    title: string,
    component: any,
    icon: string
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) private _nav: Nav;
    public pages: Array<IPageLink>;
    public rootPage: any = RegistrationPage;

    constructor(
        private _alertCtrl,
        private _deploy: Deploy,
        private _platform: Platform,
        private _statusBar: StatusBar,
        private _splashScreen: SplashScreen,
        private _toastCtrl: ToastController
    ) {
        this._initializeApp();
        this._checkUpdate();

        this.pages = [
            { title: 'Home', component: HomePage, icon: 'home' },
            { title: 'Foods', component: FoodListPage, icon: 'nutrition' }
        ];

    }

    private _checkUpdate(): void {
        this._deploy.check().then((snapshotAvailable: boolean) => {
            if (snapshotAvailable) {
                /**
                 * If a new snapshot is available,
                 * download it, apply it, and reload the app
                 */
                this._deploy.download().then(() => this._deploy.extract()).then(() => this._deploy.load());
            }
        });
        this._deploy.check().then((snapshotAvailable: boolean) => {
            if (snapshotAvailable) {
                /**
                 * If a new snapshot is available,
                 * download it, apply it, and reload the app
                 */
                let alertOpts: AlertOptions = {
                    title: 'There is an update available',
                    message: 'Do you want to update?',
                    buttons: [{
                        text: 'Cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }, {
                        text: 'Update',
                        handler: () => {

                            let updateConfirmed = true,
                                toast = this._toastCtrl.create({
                                    message: 'Downloading ... 0%',
                                    position: 'bottom',
                                    showCloseButton: true,
                                    closeButtonText: 'Cancel'
                                });

                            toast.onDidDismiss(() => updateConfirmed = false);
                            toast.present();
                            this._deploy.channel = 'dev';
                            this._deploy.download({
                                onProgress: progress => {
                                    toast.setMessage(`Downloading ... ${progress}%`);
                                    console.log(`Download progress: ${progress}%`);
                                }
                            }).then(() => {
                                if (updateConfirmed) {
                                    this._deploy.extract({
                                        onProgress: progress => {
                                            toast.setMessage(`Extracting ... ${progress}%`);
                                            console.log(`Extract progress: ${progress}%`);
                                        }
                                    }).then(() => {
                                        if (updateConfirmed) {
                                            return this._deploy.load();
                                        }
                                    }).catch(() => toast.setMessage('Uhh ohh, something went wrong!'))
                                }

                            }).catch(() => toast.setMessage('Uhh ohh, something went wrong!'))
                        }
                    }]
                };

                this._alertCtrl.create(alertOpts).present();
            }
        });
    }

    private _initializeApp() {
        this._platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this._statusBar.styleDefault();
            this._splashScreen.hide();
        });
    }

    public openPage(page: IPageLink) {
        this._nav.setRoot(page.component);
    }
}
