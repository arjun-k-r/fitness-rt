// Angular
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';

// Ionic
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

// Ionic Native
import { Autostart } from '@ionic-native/autostart';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// App
import { MyApp } from './app.component';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import 'firebase/storage';

const CLOUD_SETTINGS: CloudSettings = {
  'core': {
    'app_id': '6f751f99'
  }
};

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCFuo3aDzAyF6LFgS9cyKQGvXBL7CE41zM',
  authDomain: 'ifit-6f60e.firebaseapp.com',
  databaseURL: 'https://ifit-6f60e.firebaseio.com',
  projectId: 'ifit-6f60e',
  storageBucket: 'ifit-6f60e.appspot.com',
  messagingSenderId: '597263959509'
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG, 'iFit'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    CloudModule.forRoot(CLOUD_SETTINGS),
    CommonModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Autostart,
    BackgroundMode,
    Camera,
    ImagePicker,
    LocalNotifications,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
