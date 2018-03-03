// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import { IonicPage } from 'ionic-angular';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'vikruti-questionaire'
})
@Component({
  templateUrl: 'vikruti-questionaire.html',
})
export class VikrutiQuestionairePage {
  public vikrutiForm: FormGroup;
  constructor(private notifyPvd: NotificationProvider) {
    this.vikrutiForm = new FormGroup({
      appearance: new FormControl('', [Validators.required]),
      weight: new FormControl('', Validators.required),
      joints: new FormControl('', Validators.required),
      spine: new FormControl('', Validators.required),
      muscles: new FormControl('', Validators.required),
      skin: new FormControl('', Validators.required),
      lymphNodes: new FormControl('', Validators.required),
      veins: new FormControl('', Validators.required),
      eyes: new FormControl('', Validators.required),
      ears: new FormControl('', Validators.required),
      nose: new FormControl('', Validators.required),
      lips: new FormControl('', Validators.required),
      mouth: new FormControl('', Validators.required),
      teeth: new FormControl('', Validators.required),
      tongue: new FormControl('', Validators.required),
      hair: new FormControl('', Validators.required),
      nails: new FormControl('', Validators.required),
      appetite: new FormControl('', Validators.required),
      digestion: new FormControl('', Validators.required),
      metabolism: new FormControl('', Validators.required),
      thirst: new FormControl('', Validators.required),
      elimination: new FormControl('', Validators.required),
      energy: new FormControl('', Validators.required),
      sex: new FormControl('', Validators.required),
      liverSpleen: new FormControl('', Validators.required),
      voice: new FormControl('', Validators.required),
      speech: new FormControl('', Validators.required),
      breathing: new FormControl('', Validators.required),
      allergies: new FormControl('', Validators.required),
      sleep: new FormControl('', Validators.required),
      dreams: new FormControl('', Validators.required),
      emotions: new FormControl('', Validators.required),
      intellect: new FormControl('', Validators.required),
      memory: new FormControl('', Validators.required)
    });
  }

  public checkVikruti(): void {
    let vataScore: number = 0, pittaScore: number = 0, kaphaScore: number = 0;
    for (let key in this.vikrutiForm.controls) {
      if (this.vikrutiForm.controls[key].value === 'vata') {
        vataScore++;
      } else if (this.vikrutiForm.controls[key].value === 'pitta') {
        pittaScore++
      } else if (this.vikrutiForm.controls[key].value === 'kapha') {
        kaphaScore++;
      }
    }

    const vataVikruti: number = vataScore * 100 / 34;
    const pittaVikruti: number = pittaScore * 100 / 34;
    const kaphaVikruti: number = kaphaScore * 100 / 34;

    const vikrutiScore: number = Math.max(vataVikruti, pittaVikruti, kaphaVikruti);
    let vikruti: string;
    if (vikrutiScore === vataVikruti) {
      vikruti = 'Vata';
    } else if (vikrutiScore === pittaVikruti) {
      vikruti = 'Pitta';
    } else {
      vikruti = 'Kapha';
    }

    this.notifyPvd.showInfo(`Your vikruti is: ${vataVikruti.toFixed(2)}% vata, ${pittaVikruti.toFixed(2)}% pitta, ${kaphaVikruti.toFixed(2)}% kapha. ${vikruti}} is your current dominant dosha`)
  }
}
