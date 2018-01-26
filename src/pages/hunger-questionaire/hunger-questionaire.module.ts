import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HungerQuestionairePage } from './hunger-questionaire';

@NgModule({
  declarations: [
    HungerQuestionairePage,
  ],
  imports: [
    IonicPageModule.forChild(HungerQuestionairePage),
  ],
})
export class HungerQuestionairePageModule {}
