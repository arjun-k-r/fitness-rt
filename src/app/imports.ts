// App
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler } from '@angular/core';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';

// Cordova
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Firebase
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';

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

const FIREBASE_AUTH_CONFIG = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
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
    ActivitySelectPage,
    ConstitutionPage,
    ExercisePage,
    FoodDetailsPage,
    FoodListPage,
    ForgotPasswordPage,
    GettingStartedPage,
    HealingPage,
    HomePage,
    LifestylePage,
    LoginPage,
    MealSelectPage,
    NutrientPage,
    NutritionPage,
    PasswordResetPage,
    ProfilePage,
    RecipeDetailsPage,
    RecipesPage,
    RegistrationPage
} from '../pages';

// Pipes
import { CapitalizePipe } from '../pipes'

// Providers
import {
    AlertService,
    AuthValidator,
    ConstitutionService,
    FoodDataService,
    NutrientService,
    ProfileService
} from '../providers';

export const thgDeclarations = [
    MyApp,
    AccountPage,
    ActivitySelectPage,
    CapitalizePipe,
    ConstitutionPage,
    ErrorMessageComponent,
    ExercisePage,
    FoodDetailsPage,
    FoodListPage,
    ForgotPasswordPage,
    GettingStartedPage,
    HealingPage,
    HomePage,
    LifestylePage,
    LoginPage,
    MealSelectPage,
    NutrientPage,
    NutritionPage,
    PasswordResetPage,
    ProfilePage,
    RecipeDetailsPage,
    RecipesPage,
    RegistrationPage
];

export const thgEntries = [
    MyApp,
    AccountPage,
    ActivitySelectPage,
    ConstitutionPage,
    ExercisePage,
    FoodDetailsPage,
    FoodListPage,
    ForgotPasswordPage,
    GettingStartedPage,
    HealingPage,
    HomePage,
    LifestylePage,
    LoginPage,
    MealSelectPage,
    NutrientPage,
    NutritionPage,
    PasswordResetPage,
    ProfilePage,
    RecipeDetailsPage,
    RecipesPage,
    RegistrationPage
];

export const thgImports = [
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG, 'the-health-guide-1'),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(CLOUD_SETTINGS)
];

export const thgProviders = [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AlertService,
    AuthValidator,
    ConstitutionService,
    FoodDataService,
    NutrientService,
    ProfileService
];