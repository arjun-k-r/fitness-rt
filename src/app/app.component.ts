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
  @ViewChild(Nav) nav: Nav;
  private authSubscription: Subscription;
  public auth: User;
  public currentPage: IPageLink;
  public pages: Array<IPageLink>;
  public rootPage: string = 'registration';
  constructor(
    private afAuth: AngularFireAuth,
    private autostart: Autostart,
    private backgroundMode: BackgroundMode,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    this.initializeApp();
  }

  private initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.autostart.enable();
      this.pages = [
        { component: 'profile', icon: 'person', title: 'Profile' },
        { component: 'mind-balance', icon: 'compass', title: 'Mind balance' },
        { component: 'sleep', icon: 'moon', title: 'Sleep' },
        { component: 'diet', icon: 'nutrition', title: 'Diet' },
        { component: 'exercise', icon: 'walk', title: 'Exercise' },
        // { component: 'recipes', icon: 'restaurant', title: 'Recipes' },
        // { component: 'blood-cholesterol', icon: 'water', title: 'Blood cholesterol' },
        // { component: 'blood-pressure', icon: 'pulse', title: 'Blood pressure' },
        // { component: 'blood-sugar', icon: 'heart', title: 'Blood sugar' }
      ];
      this.authSubscription = this.afAuth.authState.subscribe((auth: User) => {
        if (!!auth) {
          this.auth = auth;
        }
      });
    });
  }

  public openPage(page: IPageLink): void {
    this.currentPage = page;
    this.nav.setRoot(page.component);
  }
  
}
