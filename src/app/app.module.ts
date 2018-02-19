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
import { NotificationProvider } from '../providers';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import 'firebase/storage';

const CLOUD_SETTINGS: CloudSettings = {
  'core': {
    'app_id': '54226b67'
  }
};

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBbUXYb4bGV0BXfe8XE5B0e5A2G7oE2aDc',
  authDomain: 'fitness-rt.firebaseapp.com',
  databaseURL: 'https://fitness-rt.firebaseio.com',
  projectId: 'fitness-rt',
  storageBucket: 'fitness-rt.appspot.com',
  messagingSenderId: '745981839715'
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG, 'fitness-rt'),
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
    NotificationProvider,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
