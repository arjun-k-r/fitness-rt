// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage } from 'ionic-angular';

// Firebase
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

// Models
import { IEmotion } from '../../models';

// Providers
import { MindBalanceProvider } from '../../providers';

// https://simple.wikipedia.org/wiki/Emotion
@IonicPage({
  name: 'emotions-list'
})
@Component({
  templateUrl: 'emotions-list.html',
})
export class EmotionsListPage {
  public emotions$: FirebaseListObservable<IEmotion[]>;
  constructor(private mindBalancePvd: MindBalanceProvider) {}

  ionViewWillEnter(): void {
    this.emotions$ = this.mindBalancePvd.getEmotions$();
  }

}
