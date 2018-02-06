// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import { IonicPage } from 'ionic-angular';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'stress-questionaire'
})
@Component({
  templateUrl: 'stress-questionaire.html',
})
export class StressQuestionairePage {
  public stressForm: FormGroup;
  constructor(private _notifyPvd: NotificationProvider) {
    this.stressForm = new FormGroup({
      mood: new FormControl('', [Validators.required]),
      overwhelm: new FormControl('', Validators.required),
      relaxation: new FormControl('', Validators.required),
      depression: new FormControl('', Validators.required),
      withdrawn: new FormControl('', Validators.required),
      energy: new FormControl('', Validators.required),
      headaches: new FormControl('', Validators.required),
      digestion: new FormControl('', Validators.required),
      pain: new FormControl('', Validators.required),
      chest: new FormControl('', Validators.required),
      insomnia: new FormControl('', Validators.required),
      colds: new FormControl('', Validators.required),
      libido: new FormControl('', Validators.required),
      nervousness: new FormControl('', Validators.required),
      mouth: new FormControl('', Validators.required),
      jaw: new FormControl('', Validators.required),
      worry: new FormControl('', Validators.required),
      thoughts: new FormControl('', Validators.required),
      disorganization: new FormControl('', Validators.required),
      focus: new FormControl('', Validators.required),
      judgment: new FormControl('', Validators.required),
      pessimism: new FormControl('', Validators.required),
      appetite: new FormControl('', Validators.required),
      procrastinating: new FormControl('', Validators.required),
      twitching: new FormControl('', Validators.required),
      addiction: new FormControl('', Validators.required)
    });
  }

  public checkStress(): void {
    let stressScore: number = 0;
    for (let key in this.stressForm.controls) {
      if (this.stressForm.controls[key].value === 'yes') {
        stressScore++;
      }
    }

    const stress: number = stressScore * 100 / 23;
    this._notifyPvd.showInfo(`You are ${(stress).toFixed(2)}% stressed. ${stress > 50 ? 'You should take time to relax, disconnect, and cool down' : 'You are not stressed, but you should pay attention to your lifestyle if something is bothering you!'}`)
  }
}
