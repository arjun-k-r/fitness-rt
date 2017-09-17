// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController } from 'ionic-angular';

// Third-party
import * as moment from 'moment';

const CURRENT_DATE: string = moment().format('YYYY-MM-DD');

interface IPageLink {
  component: string,
  icon: string,
  title: string
}

@IonicPage({
  name: 'tabs',
  segment: 'app'
})
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  private _tabBarElement: any;
  public pages: Array<IPageLink>;
  constructor(private _navCtrl: NavController) {
    this._tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.pages = [
      { component: 'fitness', icon: 'body', title: 'Fitness' },
      { component: 'exercise', icon: 'walk', title: 'Exercise' },
      { component: 'nutrition', icon: 'nutrition', title: 'Nutrition' },
      { component: 'recipes', icon: 'restaurant', title: 'Recipes' },
      { component: 'sleep', icon: 'moon', title: 'Sleep' }
    ];
  }

  ionViewWillEnter(): void {
    if (this._tabBarElement) {
      this._tabBarElement.style.display = 'flex';
    }
  }
}
