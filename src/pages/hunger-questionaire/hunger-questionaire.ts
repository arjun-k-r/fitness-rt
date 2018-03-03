// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import { IonicPage } from 'ionic-angular';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'hunger-questionaire'
})
@Component({
  templateUrl: 'hunger-questionaire.html',
})
export class HungerQuestionairePage {
  public hungerForm: FormGroup;
  constructor(private notifyPvd: NotificationProvider) {
    this.hungerForm = new FormGroup({
      mealTime: new FormControl('', [Validators.required]),
      mealPlace: new FormControl('', Validators.required),
      foodSight: new FormControl('', Validators.required),
      foodSmell: new FormControl('', Validators.required),
      fatigue: new FormControl('', Validators.required),
      stress: new FormControl('', Validators.required),
      sadness: new FormControl('', Validators.required),
      boredom: new FormControl('', Validators.required),
      excitement: new FormControl('', Validators.required),
      occasion: new FormControl('', Validators.required),
      earlyEat: new FormControl('', Validators.required),
      specificFood: new FormControl('', Validators.required),
      mealWaiting: new FormControl('', Validators.required),
      hungerRating: new FormControl('', Validators.required)
    });
  }

  public checkHunger(): void {
    let hungerScore: number = 0;
    for (let key in this.hungerForm.controls) {
      if (this.hungerForm.controls[key].value === 'no') {
        hungerScore++;
      }
    }

    if (this.hungerForm.controls.hungerRating.value > 5) {
      hungerScore++;
    }

    const hungry: number = hungerScore * 100 / 14;
    this.notifyPvd.showInfo(`You are ${(hungry).toFixed(2)}% hungry. ${hungry > 75 ? 'You are definetly hungry and should eat something' : "You are not actually hungry and shouldn't eat right now"}`)
  }

}
