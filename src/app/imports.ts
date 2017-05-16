// App
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';

// Cordova
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

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
    apiKey: "AIzaSyAHAV3Jh_wkht6NQUcCjhnYFc8AVEZREc4",
    authDomain: "the-health-guide-1.firebaseapp.com",
    databaseURL: "https://the-health-guide-1.firebaseio.com",
    storageBucket: "the-health-guide-1.appspot.com",
    messagingSenderId: "493536537981"
};

// Components
import { ErrorMessageComponent } from '../components';

// Pages
import {
    AccountPage,
    ActivityPlanPage,
    ActivitySelectPage,
    FitnessPage,
    FoodDetailsPage,
    FoodListPage,
    FoodSelectPage,
    ForgotPasswordPage,
    HomePage,
    LoginPage,
    MealDetailsPage,
    MealPlanPage,
    PasswordResetPage,
    RecipeDetailsPage,
    RecipeListPage,
    RegistrationPage,
    SleepPlanPage
} from '../pages';

// Pipes
import { CapitalizePipe, SearchPipe } from '../pipes'

// Providers
import {
    ActivityService,
    AlertService,
    AuthValidator,
    DRIService,
    FitnessService,
    FoodService,
    MealService,
    NutritionService,
    PictureService,
    RecipeService,
    SleepService
} from '../providers';

export const thgDeclarations = [
    MyApp,
    AccountPage,
    ActivityPlanPage,
    ActivitySelectPage,
    CapitalizePipe,
    ErrorMessageComponent,
    FitnessPage,
    FoodDetailsPage,
    FoodListPage,
    FoodSelectPage,
    ForgotPasswordPage,
    HomePage,
    LoginPage,
    MealDetailsPage,
    MealPlanPage,
    PasswordResetPage,
    RecipeDetailsPage,
    RecipeListPage,
    RegistrationPage,
    SearchPipe,
    SleepPlanPage
];

export const thgEntries = [
    MyApp,
    AccountPage,
    ActivityPlanPage,
    ActivitySelectPage,
    FitnessPage,
    FoodDetailsPage,
    FoodListPage,
    FoodSelectPage,
    ForgotPasswordPage,
    HomePage,
    LoginPage,
    MealDetailsPage,
    MealPlanPage,
    PasswordResetPage,
    RecipeDetailsPage,
    RecipeListPage,
    RegistrationPage,
    SleepPlanPage
];

export const thgImports = [,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(CLOUD_SETTINGS),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG, 'the-health-guide-1'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
];

export const thgProviders = [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ActivityService,
    AlertService,
    AuthValidator,
    DRIService,
    FitnessService,
    FoodService,
    MealService,
    NutritionService,
    PictureService,
    RecipeService,
    SleepService
];