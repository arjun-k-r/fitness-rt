// App
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { MyApp } from './app.component';

// Cordova
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import 'firebase/storage';

const CLOUD_SETTINGS: CloudSettings = {
  'core': {
    'app_id': 'af911689'
  },
  'auth': {
    'facebook': {
      'scope': ['email', 'public_profile', 'user_friends']
    },
    'google': {
      'webClientId': '493536537981-gfrb9dtsnltvsslcv0os8foq8is80j67.apps.googleusercontent.com',
      'scope': ['']
    }
  }
};

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCCiFuPGxiQ-uQnFH4IPybfQ2P_CvgLgKU",
  authDomain: "live-fit-4u.firebaseapp.com",
  databaseURL: "https://live-fit-4u.firebaseio.com",
  projectId: "live-fit-4u",
  storageBucket: "live-fit-4u.appspot.com",
  messagingSenderId: "296711725329"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(CLOUD_SETTINGS),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Camera,
    ImagePicker,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
