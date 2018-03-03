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
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private params: NavParams,
    private userPvd: UserProfileProvider
  ) {
    this.constitution = <Constitution>this.params.get('constitution') || new Constitution();
    if (!this.constitution.dominantDosha) {
      this.navCtrl.setRoot('profile');
    }
  }

  public calculateResults(): void {
    this.notifyPvd.showLoading();
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
    const totalPoints: number = totalVataPoints + totalPittaPoints + totalKaphaPoints;

    this.constitution.vata.totalInfluence = Math.round(totalVataPoints * 100 / totalPoints);
    this.constitution.pitta.totalInfluence = Math.round(totalPittaPoints * 100 / totalPoints);
    this.constitution.kapha.totalInfluence = Math.round(totalKaphaPoints * 100 / totalPoints);

    const maxPoints: number = Math.max(this.constitution.vata.totalInfluence, this.constitution.pitta.totalInfluence, this.constitution.kapha.totalInfluence);
    if (maxPoints === this.constitution.vata.totalInfluence) {
      if (this.constitution.vata.totalInfluence - this.constitution.pitta.totalInfluence <= 5 && this.constitution.vata.totalInfluence - this.constitution.kapha.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Pitta-Kapha';
        this.constitution.bodyType = 'Ectomorph'
      } else if (this.constitution.vata.totalInfluence - this.constitution.pitta.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Pitta';
      } else if (this.constitution.vata.totalInfluence - this.constitution.kapha.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Kapha';
      }
    } else if (maxPoints === this.constitution.pitta.totalInfluence) {
      if (this.constitution.pitta.totalInfluence - this.constitution.vata.totalInfluence <= 5 && this.constitution.pitta.totalInfluence - this.constitution.kapha.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Pitta-Kapha';
      } else if (this.constitution.pitta.totalInfluence - this.constitution.vata.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Pitta';
      } else if (this.constitution.pitta.totalInfluence - this.constitution.kapha.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Pitta-Kapha';
      }
    } else if (maxPoints === this.constitution.kapha.totalInfluence) {
      if (this.constitution.kapha.totalInfluence - this.constitution.vata.totalInfluence <= 5 && this.constitution.kapha.totalInfluence - this.constitution.pitta.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Pitta-Kapha';
      } else if (this.constitution.kapha.totalInfluence - this.constitution.vata.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Vata-Kapha';
      } else if (this.constitution.kapha.totalInfluence - this.constitution.pitta.totalInfluence <= 5) {
        this.constitution.dominantDosha = 'Pitta-Kapha';
      }
    }

    this.userPvd.saveConstitution(this.params.get('authId'), this.constitution)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.navCtrl.pop();
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      })
  }
}
