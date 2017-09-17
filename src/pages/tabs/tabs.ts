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
  id: string,
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
      { component: 'fitness', icon: 'body', id: 'info', title: 'Fitness' },
      { component: 'exercise', icon: 'walk', id: CURRENT_DATE, title: 'Exercise' },
      { component: 'nutrition', icon: 'nutrition', id: CURRENT_DATE, title: 'Nutrition' },
      { component: 'recipes', icon: 'restaurant',  id: 'list', title: 'Recipes' },
      { component: 'sleep', icon: 'moon',  id: CURRENT_DATE, title: 'Sleep' }
    ];
  }

  ionViewWillEnter(): void {
    if (this._tabBarElement) {
      this._tabBarElement.style.display = 'flex';
    }
  }
}
