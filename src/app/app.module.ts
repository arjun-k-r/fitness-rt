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
    'app_id': '7d599801'
  }
};

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBSRCjaqNBzwylAbxrwPpHde6eGTeyC5nQ",
  authDomain: "fit-4-life.firebaseapp.com",
  databaseURL: "https://fit-4-life.firebaseio.com",
  projectId: "fit-4-life",
  storageBucket: "fit-4-life.appspot.com",
  messagingSenderId: "234322620896"
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
    AngularFireModule.initializeApp(FIREBASE_CONFIG, 'fit-4-life'),
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
