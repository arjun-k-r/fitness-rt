// Angular
import { Component, ViewChild } from '@angular/core';

// Ionic
import { Nav, Platform } from 'ionic-angular';

// Ionic Native
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
      this.pages = [
        { component: 'fitness', icon: 'body', title: 'Fitness' },
        { component: 'exercise', icon: 'walk', title: 'Exercise' },
        { component: 'nutrition', icon: 'nutrition', title: 'Nutrition' },
        { component: 'recipes', icon: 'restaurant', title: 'Recipes' },
        { component: 'sleep', icon: 'moon', title: 'Sleep' },
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
