// App
import { Component, ViewChild } from '@angular/core';
import { AlertController, AlertOptions, Nav, Platform, Toast, ToastController } from 'ionic-angular';
import { Deploy } from '@ionic/cloud-angular';

// Cordova
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export interface IPageLink {
    title: string,
    component: string,
    icon: string
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) private _nav: Nav;
    public pages: Array<IPageLink>;
    public rootPage: string = 'registration';
    constructor(
        private _alertCtrl: AlertController,
        private _deploy: Deploy,
        private _platform: Platform,
        private _statusBar: StatusBar,
        private _splashScreen: SplashScreen,
        private _toastCtrl: ToastController
    ) {
        this._initializeApp();
        this.pages = [
            { title: 'Home', component: 'home', icon: 'home' },
            { title: 'Fitness', component: 'fitness', icon: 'body' },
            { title: 'Sleep', component: 'sleep-plan', icon: 'moon' },
            { title: 'Exercise', component: 'activity-plan', icon: 'walk' },
            { title: 'Nutrition', component: 'meal-plan', icon: 'nutrition' },
            { title: 'Foods', component: 'food-list', icon: 'basket' },
            { title: 'Recipes', component: 'recipe-list', icon: 'restaurant' },
            { title: 'Account', component: 'account', icon: 'person' }
        ];

    }

    private _checkUpdate(): void {
        this._deploy.channel = 'dev';
        this._deploy.check().then((snapshotAvailable: boolean) => {
            if (snapshotAvailable) {
                let alertOpts: AlertOptions = {
                    title: 'There is an update available',
                    message: 'Do you want to update?',
                    buttons: [{
                        text: 'Cancel'
                    }, {
                        text: 'Update',
                        handler: () => {
                            let updateConfirmed: boolean = true,
                                toast: Toast = this._toastCtrl.create({
                                    message: 'Downloading ... 0%',
                                    position: 'bottom',
                                    showCloseButton: true,
                                    closeButtonText: 'Cancel'
                                });
                            toast.onDidDismiss(() => updateConfirmed = false);
                            toast.present();
                            this._deploy.download({
                                onProgress: progress => {
                                    toast.setMessage(`Downloading ... ${progress}%`);
                                }
                            }).then(() => {
                                if (updateConfirmed) {
                                    this._deploy.extract({
                                        onProgress: progress => {
                                            toast.setMessage(`Extracting ... ${progress}%`);
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
            this._statusBar.styleDefault();
            this._splashScreen.hide();
            if (this._platform.is('cordova')) {
                this._checkUpdate();
            }
        });
    }

    public openPage(page: IPageLink) {
        this._nav.setRoot(page.component);
    }
}
