import { Component } from '@angular/core';

import { IonicPage, NavController } from 'ionic-angular';

interface IPageLink {
  title: string,
  component: string,
  icon: string
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
      { title: 'Fitness', component: 'fitness', icon: 'body' },
      { title: 'Exercise', component: 'exercise', icon: 'walk' },
      { title: 'Nutrition', component: 'nutrition', icon: 'nutrition' },
      { title: 'Recipes', component: 'recipe-list', icon: 'restaurant' }
    ];
  }

  public openPage(page: IPageLink): void {
    this._navCtrl.setRoot(page.component);
  }

  ionViewWillEnter(): void {
    if (this._tabBarElement) {
      this._tabBarElement.style.display = 'flex';
    }
  }
}
