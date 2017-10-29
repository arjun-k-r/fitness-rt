// Angular
import { Component, ViewChild } from '@angular/core';

// Ionic
import { Nav, Platform } from 'ionic-angular';

// Ionic Native
import { Autostart } from '@ionic-native/autostart';
import { BackgroundMode } from '@ionic-native/background-mode';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
  public pages: Array<IPageLink>;
  public rootPage: string = 'registration';
  constructor(
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
        { component: 'fitness', icon: 'body', title: 'Fitness' },
        { component: 'sleep', icon: 'moon', title: 'Sleep' },
        { component: 'exercise', icon: 'walk', title: 'Exercise' },
        { component: 'nutrition', icon: 'nutrition', title: 'Nutrition' },
        { component: 'recipes', icon: 'restaurant', title: 'Recipes' },
        { component: 'blood-cholesterol', icon: 'water', title: 'Blood cholesterol' },
        { component: 'blood-pressure', icon: 'pulse', title: 'Blood pressure' },
        { component: 'blood-sugar', icon: 'heart', title: 'Blood sugar' }
      ];
    });
  }

  public openPage(page: IPageLink): void {
    this._nav.setRoot(page.component);
  }
}
