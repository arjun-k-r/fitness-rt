// Angular
import { Component } from '@angular/core';

// Ionic
import { IonicPage } from 'ionic-angular';

// Models
import { Constitution } from '../../models';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'constitution-questionaire'
})
@Component({
  templateUrl: 'constitution-questionaire.html',
})
export class ConstitutionQuestionairePage {
  public vataConstitution: Constitution = new Constitution();
  public pittaConstitution: Constitution = new Constitution();
  public kaphaConstitution: Constitution = new Constitution();
  constructor(
    private _notifyPvd: NotificationProvider,
  ) { }

  public checkConstitution(): void {
    const bodyConstitution: any = {
      vata: 0,
      pitta: 0,
      kapha: 0
    };

    const mentalConstitution: any = {
      vata: 0,
      pitta: 0,
      kapha: 0
    };

    for (let key in this.vataConstitution.body) {
      if (this.vataConstitution.body[key]) {
        bodyConstitution.vata++;
      }

      if (this.pittaConstitution.body[key]) {
        bodyConstitution.pitta++;
      }

      if (this.kaphaConstitution.body[key]) {
        bodyConstitution.kapha++;
      }
    }

    for (let key in this.vataConstitution.mind) {
      if (this.vataConstitution.mind[key]) {
        mentalConstitution.vata++;
      }

      if (this.pittaConstitution.mind[key]) {
        mentalConstitution.pitta++;
      }

      if (this.kaphaConstitution.mind[key]) {
        mentalConstitution.kapha++;
      }
    }

    const bodyPoints: number = bodyConstitution.vata + bodyConstitution.pitta + bodyConstitution.kapha;
    const mentalPoints: number = mentalConstitution.vata + mentalConstitution.pitta + mentalConstitution.kapha;

    const maxBodyPoints: number = Math.max(bodyConstitution.vata, bodyConstitution.pitta, bodyConstitution.kapha);
    const maxMentalPoints: number = Math.max(mentalConstitution.vata, mentalConstitution.pitta, mentalConstitution.kapha);

    const bodyDosha: string = maxBodyPoints === bodyConstitution.vata ? 'Vata' : maxBodyPoints === bodyConstitution.pitta ? 'Pitta' : 'Kapha';
    const mentalDosha: string = maxMentalPoints === mentalConstitution.vata ? 'Vata' : maxMentalPoints === mentalConstitution.pitta ? 'Pitta' : 'Kapha';

    const totalVataPoints: number = bodyConstitution.vata + mentalConstitution.vata;
    const totalPittaPoints: number = bodyConstitution.pitta + mentalConstitution.pitta;
    const totalKaphaPoints: number = bodyConstitution.kapha + mentalConstitution.kapha;

    const maxPoints: number = Math.max(totalVataPoints, totalPittaPoints, totalKaphaPoints);
    const dominantDosha: string = maxPoints === totalVataPoints ? 'Vata' : maxPoints === totalPittaPoints ? 'Pitta' : 'Kapha';

    this._notifyPvd.showInfo(`
      Physical constitution: ${(bodyConstitution.vata * 100 / bodyPoints).toFixed(2)}% Vata, ${(bodyConstitution.pitta * 100 / bodyPoints).toFixed(2)}% Pitta, ${(bodyConstitution.kapha * 100 / bodyPoints).toFixed(2)}% Kapha\n
      Mental constitution: ${(mentalConstitution.vata * 100 / mentalPoints).toFixed(2)}% Vata, ${(mentalConstitution.pitta * 100 / mentalPoints).toFixed(2)}% Pitta, ${(mentalConstitution.kapha * 100 / mentalPoints).toFixed(2)}% Kapha\n
      Your dominant dosha is: ${dominantDosha}
    `, 60000);
  }
}
