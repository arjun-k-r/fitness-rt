// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import { IonicPage } from 'ionic-angular';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'overtraining-questionaire'
})
@Component({
  templateUrl: 'overtraining-questionaire.html',
})
export class OvertrainingQuestionairePage {
  public overtrainingForm: FormGroup;
  constructor(private _notifyPvd: NotificationProvider) {
    this.overtrainingForm = new FormGroup({
      heartRate: new FormControl('', [Validators.required]),
      infections: new FormControl('', Validators.required),
      colds: new FormControl('', Validators.required),
      injuries: new FormControl('', Validators.required),
      pain: new FormControl('', Validators.required),
      exhaustion: new FormControl('', Validators.required),
      lethargy: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      appetite: new FormControl('', Validators.required),
      thirst: new FormControl('', Validators.required),
      exerciseIntolerance: new FormControl('', Validators.required),
      performance: new FormControl('', Validators.required),
      recovery: new FormControl('', Validators.required),
      energy: new FormControl('', Validators.required),
      concentration: new FormControl('', Validators.required),
      apathy: new FormControl('', Validators.required),
      irritability: new FormControl('', Validators.required),
      anxiety: new FormControl('', Validators.required),
      depression: new FormControl('', Validators.required),
      headaches: new FormControl('', Validators.required),
      insomnia: new FormControl('', Validators.required),
      relaxation: new FormControl('', Validators.required),
      twitching: new FormControl('', Validators.required)
    });
  }

  public checkOvertraining(): void {
    let overtrainingScore: number = 0;
    for (let key in this.overtrainingForm.controls) {
      if (this.overtrainingForm.controls[key].value === 'yes') {
        overtrainingScore++;
      }
    }

    const overtraining: number = overtrainingScore * 100 / 23;
    this._notifyPvd.showInfo(`You are ${(overtraining).toFixed(2)}% overtraining. ${overtraining > 50 ? 'You should take a break and recover' : 'You are not overtraining, but always pay attention to your sleep, diet, and exercise!'}`)
  }
}
