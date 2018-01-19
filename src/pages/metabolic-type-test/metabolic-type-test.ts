// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Ionic
import {
  IonicPage,
  NavController
} from 'ionic-angular';

// Providers
import { NotificationProvider } from '../../providers';

@IonicPage({
  name: 'metabolic-type-test'
})
@Component({
  selector: 'page-metabolic-type-test',
  templateUrl: 'metabolic-type-test.html',
})
export class MetabolicTypeTestPage {
  public metabolicTestForm: FormGroup;
  constructor(
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
  ) {
    this.metabolicTestForm = new FormGroup({
      angerIrritability: new FormControl(null, [Validators.required]),
      anxiety: new FormControl(null, Validators.required),
      idealBreakfast: new FormControl(null, [Validators.required]),
      mealPref: new FormControl(null, Validators.required),
      climate: new FormControl(null, [Validators.required]),
      chestPressure: new FormControl(null, Validators.required),
      coffee: new FormControl(null, [Validators.required]),
      breakfastAppetite: new FormControl(null, Validators.required),
      lunchAppetite: new FormControl(null, [Validators.required]),
      dinnerAppetite: new FormControl(null, Validators.required),
      concentration: new FormControl(null, [Validators.required]),
      coughing: new FormControl(null, Validators.required),
      crackingSkin: new FormControl(null, [Validators.required]),
      cravings: new FormControl(null, Validators.required),
      dandruff: new FormControl(null, [Validators.required]),
      depression: new FormControl(null, Validators.required),
      desserts: new FormControl(null, [Validators.required]),
      dessertPref: new FormControl(null, Validators.required),
      idealDinner: new FormControl(null, [Validators.required]),
      earColor: new FormControl(null, Validators.required),
      eatingBeforeBed: new FormControl(null, [Validators.required]),
      eatingHeavyBeforeBed: new FormControl(null, Validators.required),
      eatingLightBeforeBed: new FormControl(null, [Validators.required]),
      eatingSweetsBeforeBed: new FormControl(null, Validators.required),
      eatingFrequency: new FormControl(null, [Validators.required]),
      eatingHabits: new FormControl(null, Validators.required),
      eyeMoisture: new FormControl(null, Validators.required),
      skipMeals: new FormControl(null, Validators.required),
      facialColor: new FormControl(null, Validators.required),
      complexion: new FormControl(null, Validators.required),
      fattyFood: new FormControl(null, Validators.required),
      fingernailThickness: new FormControl(null, Validators.required),
      fruitSaladLunch: new FormControl(null, Validators.required),
      gainWeight: new FormControl(null, Validators.required),
      gagReflex: new FormControl(null, Validators.required),
      gooseBumps: new FormControl(null, Validators.required),
      energyBoost: new FormControl(null, Validators.required),
      heavyFatReaction: new FormControl(null, Validators.required),
      hungerFeeling: new FormControl(null, Validators.required),
      energyDrain: new FormControl(null, Validators.required),
      insectBite: new FormControl(null, Validators.required),
      insomnia: new FormControl(null, Validators.required),
      itchingEyes: new FormControl(null, Validators.required),
      itchingSkin: new FormControl(null, Validators.required),
      mealPortions: new FormControl(null, Validators.required),
      noiseMoisture: new FormControl(null, Validators.required),
      fruitJuice: new FormControl(null, Validators.required),
      personality: new FormControl(null, Validators.required),
      potatoes: new FormControl(null, Validators.required),
      redMeat: new FormControl(null, Validators.required),
      pupilSize: new FormControl(null, Validators.required),
      saladLunch: new FormControl(null, Validators.required),
      salivation: new FormControl(null, Validators.required),
      saltyFoods: new FormControl(null, Validators.required),
      snacking: new FormControl(null, Validators.required),
      snackPref: new FormControl(null, Validators.required),
      sneezing: new FormControl(null, Validators.required),
      sociability: new FormControl(null, Validators.required),
      sourFoods: new FormControl(null, Validators.required),
      stamina: new FormControl(null, Validators.required),
      sweets: new FormControl(null, Validators.required),
      meatBreakfast: new FormControl(null, Validators.required),
      redMeatLunch: new FormControl(null, Validators.required),
      redMeatDinner: new FormControl(null, Validators.required),
      dinnerPref: new FormControl(null, Validators.required),
    });
  }

  public checkMetabolicType(): void {
    if (this.metabolicTestForm.valid) {
      let proteinScore: number = 0, carbScore: number = 0, mixedScore: number = 0;
      let metabolicType: string;
      for (let key in this.metabolicTestForm.value) {
        const selection: string = this.metabolicTestForm.value[key];
        if (selection === 'a') {
          carbScore++;
        } else if (selection === 'b') {
          mixedScore++;
        } else if (selection === 'c') {
          proteinScore++;
        }
      }

      if (carbScore >= proteinScore + 5 && carbScore >= mixedScore + 5) {
        metabolicType = 'Carbo Type';
      } else if (proteinScore >= carbScore + 5 && proteinScore >= mixedScore + 5) {
        metabolicType = 'Protein Type';
      } else {
        metabolicType = 'Mixed Type';
      }

      this._notifyPvd.showInfo(`You are a ${metabolicType}`);
    } else {
      this._notifyPvd.showError('Please answer the complete questionaire');
    }
  }
}
