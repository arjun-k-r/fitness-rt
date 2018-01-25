// Angular
import { Component, ViewChild } from '@angular/core';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import { Nav, Platform } from 'ionic-angular';

// Ionic Native
import { Autostart } from '@ionic-native/autostart';
import { BackgroundMode } from '@ionic-native/background-mode';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase/app';

interface IPageLink {
  component: string,
  icon: string,
  title: string
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) _nav: Nav;
  private _authSubscription: Subscription;
  public auth: User;
  public currentPage: IPageLink;
  public pages: Array<IPageLink>;
  public rootPage: string = 'registration';
  constructor(
    private _afAuth: AngularFireAuth,
    private _autostart: Autostart,
    private _backgroundMode: BackgroundMode,
    private _platform: Platform,
    private _statusBar: StatusBar,
    private _splashScreen: SplashScreen
  ) {
    this._initializeApp();
  }

  private _initializeApp(): void {
    this._platform.ready().then(() => {
      this._statusBar.styleDefault();
      this._splashScreen.hide();
      this._backgroundMode.enable();
      this._autostart.enable();
      this.pages = [
        { component: 'profile', icon: 'person', title: 'Profile' },
        { component: 'sleep', icon: 'moon', title: 'Sleep' },
        { component: 'diet', icon: 'nutrition', title: 'Diet' },
        // { component: 'exercise', icon: 'walk', title: 'Exercise' },
        // { component: 'recipes', icon: 'restaurant', title: 'Recipes' },
        // { component: 'blood-cholesterol', icon: 'water', title: 'Blood cholesterol' },
        // { component: 'blood-pressure', icon: 'pulse', title: 'Blood pressure' },
        // { component: 'blood-sugar', icon: 'heart', title: 'Blood sugar' }
      ];
      this._authSubscription = this._afAuth.authState.subscribe((auth: User) => {
        if (!!auth) {
          this.auth = auth;
        }
      });
    });
  }

  public openPage(page: IPageLink): void {
    this.currentPage = page;
    this._nav.setRoot(page.component);
  }
  
}
