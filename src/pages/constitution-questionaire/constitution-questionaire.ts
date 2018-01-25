// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Models
import { Constitution } from '../../models';

// Providers
import { NotificationProvider, UserProfileProvider } from '../../providers';
import { FirebaseError } from 'firebase/app';

@IonicPage({
  name: 'constitution-questionaire'
})
@Component({
  templateUrl: 'constitution-questionaire.html'
})
export class ConstitutionQuestionairePage {
  public constitution: Constitution;
  constructor(
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _params: NavParams,
    private _userPvd: UserProfileProvider
  ) { }

  public calculateResults(): void {
    this._notifyPvd.showLoading();
    this.constitution.vata.body.total = 0;
    this.constitution.pitta.body.total = 0;
    this.constitution.kapha.body.total = 0;
    this.constitution.vata.mind.total = 0;
    this.constitution.pitta.mind.total = 0;
    this.constitution.kapha.mind.total = 0;

    for (let key in this.constitution.vata.body) {
      if (this.constitution.vata.body[key] === true) {
        this.constitution.vata.body.total++;
      }

      if (this.constitution.pitta.body[key] === true) {
        this.constitution.pitta.body.total++;
      }

      if (this.constitution.kapha.body[key] === true) {
        this.constitution.kapha.body.total++;
      }
    }

    for (let key in this.constitution.vata.mind) {
      if (this.constitution.vata.mind[key] === true) {
        this.constitution.vata.mind.total++;
      }

      if (this.constitution.pitta.mind[key] === true) {
        this.constitution.pitta.mind.total++;
      }

      if (this.constitution.kapha.mind[key] === true) {
        this.constitution.kapha.mind.total++;
      }
    }

    const bodyPoints: number = this.constitution.vata.body.total + this.constitution.pitta.body.total + this.constitution.kapha.body.total;
    const mentalPoints: number = this.constitution.vata.mind.total + this.constitution.pitta.mind.total + this.constitution.kapha.mind.total;

    this.constitution.vata.total = this.constitution.vata.body.total + this.constitution.vata.mind.total;
    this.constitution.pitta.total = this.constitution.pitta.body.total + this.constitution.pitta.mind.total;
    this.constitution.kapha.total = this.constitution.kapha.body.total + this.constitution.kapha.mind.total;

    this.constitution.vata.bodyInfluence = Math.round(this.constitution.vata.body.total * 100 / bodyPoints);
    this.constitution.pitta.bodyInfluence = Math.round(this.constitution.pitta.body.total * 100 / bodyPoints);
    this.constitution.kapha.bodyInfluence = Math.round(this.constitution.kapha.body.total * 100 / bodyPoints);

    this.constitution.vata.mindInfluence = Math.round(this.constitution.vata.mind.total * 100 / mentalPoints);
    this.constitution.pitta.mindInfluence = Math.round(this.constitution.pitta.mind.total * 100 / mentalPoints);
    this.constitution.kapha.mindInfluence = Math.round(this.constitution.kapha.mind.total * 100 / mentalPoints);

    const totalVataPoints: number = this.constitution.vata.body.total + this.constitution.vata.mind.total;
    const totalPittaPoints: number = this.constitution.pitta.body.total + this.constitution.pitta.mind.total;
    const totalKaphaPoints: number = this.constitution.kapha.body.total + this.constitution.kapha.mind.total;

    const maxPoints: number = Math.max(totalVataPoints, totalPittaPoints, totalKaphaPoints);
    this.constitution.dominantDosha = maxPoints === totalVataPoints ? 'Vata' : maxPoints === totalPittaPoints ? 'Pitta' : 'Kapha';
    this.constitution.bodyType = this.constitution.dominantDosha === 'Vata' ? 'Ectomorph' : this.constitution.dominantDosha === 'Pitta' ? 'Mezomorph' : 'Endomorph';

    this._userPvd.saveConstitution(this._params.get('authId'), this.constitution)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._navCtrl.pop();
      }).catch((err: FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      })
  }

  ionViewWillEnter(): void {
    this.constitution = <Constitution>this._params.get('constitution') || new Constitution();
  }
}
