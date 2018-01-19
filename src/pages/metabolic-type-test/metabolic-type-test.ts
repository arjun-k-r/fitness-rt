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
      angerIrritability: new FormControl('', [Validators.required]),
      anxiety: new FormControl('', Validators.required),
      idealBreakfast: new FormControl('', [Validators.required]),
      mealPref: new FormControl('', Validators.required),
      climate: new FormControl('', [Validators.required]),
      chestPressure: new FormControl('', Validators.required),
      coffee: new FormControl('', [Validators.required]),
      breakfastAppetite: new FormControl('', Validators.required),
      lunchAppetite: new FormControl('', [Validators.required]),
      dinnerAppetite: new FormControl('', Validators.required),
      concentration: new FormControl('', [Validators.required]),
      coughing: new FormControl('', Validators.required),
      crackingSkin: new FormControl('', [Validators.required]),
      cravings: new FormControl('', Validators.required),
      dandruff: new FormControl('', [Validators.required]),
      depression: new FormControl('', Validators.required),
      desserts: new FormControl('', [Validators.required]),
      dessertPref: new FormControl('', Validators.required),
      idealDinner: new FormControl('', [Validators.required]),
      earColor: new FormControl('', Validators.required),
      eatingBeforeBed: new FormControl('', [Validators.required]),
      eatingHeavyBeforeBed: new FormControl('', Validators.required),
      eatingLightBeforeBed: new FormControl('', [Validators.required]),
      eatingSweetsBeforeBed: new FormControl('', Validators.required),
      eatingFrequency: new FormControl('', [Validators.required]),
      eatingHabits: new FormControl('', Validators.required),
      eyeMoisture: new FormControl('', Validators.required),
      skipMeals: new FormControl('', Validators.required),
      facialColor: new FormControl('', Validators.required),
      complexion: new FormControl('', Validators.required),
      fattyFood: new FormControl('', Validators.required),
      fingernailThickness: new FormControl('', Validators.required),
      fruitSaladLunch: new FormControl('', Validators.required),
      gainWeight: new FormControl('', Validators.required),
      gagReflex: new FormControl('', Validators.required),
      gooseBumps: new FormControl('', Validators.required),
      energyBoost: new FormControl('', Validators.required),
      heavyFatReaction: new FormControl('', Validators.required),
      hungerFeeling: new FormControl('', Validators.required),
      energyDrain: new FormControl('', Validators.required),
      insectBite: new FormControl('', Validators.required),
      insomnia: new FormControl('', Validators.required),
      itchingEyes: new FormControl('', Validators.required),
      itchingSkin: new FormControl('', Validators.required),
      mealPortions: new FormControl('', Validators.required),
      noiseMoisture: new FormControl('', Validators.required),
      fruitJuice: new FormControl('', Validators.required),
      personality: new FormControl('', Validators.required),
      potatoes: new FormControl('', Validators.required),
      redMeat: new FormControl('', Validators.required),
      pupilSize: new FormControl('', Validators.required),
      saladLunch: new FormControl('', Validators.required),
      salivation: new FormControl('', Validators.required),
      saltyFoods: new FormControl('', Validators.required),
      snacking: new FormControl('', Validators.required),
      snackPref: new FormControl('', Validators.required),
      sneezing: new FormControl('', Validators.required),
      sociability: new FormControl('', Validators.required),
      sourFoods: new FormControl('', Validators.required),
      stamina: new FormControl('', Validators.required),
      sweets: new FormControl('', Validators.required),
      meatBreakfast: new FormControl('', Validators.required),
      redMeatLunch: new FormControl('', Validators.required),
      redMeatDinner: new FormControl('', Validators.required),
      dinnerPref: new FormControl('', Validators.required),
    });
  }

  public checkMetabolicType(): void {
    if (this.metabolicTestForm.valid) {
      const { controls } = this.metabolicTestForm.controls;
      let proteinScore: number = 0, carbScore: number = 0, mixedScore: number = 0;
      let metabolicType: string;
      for (let key in controls) {
        const controlValue: string = controls[key].value;
        if (controlValue === 'a') {
          carbScore++;
        } else if (controlValue === 'b') {
          mixedScore++;
        } else if (controlValue === 'c') {
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
