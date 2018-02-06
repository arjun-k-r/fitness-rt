import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StressQuestionairePage } from './stress-questionaire';

@NgModule({
  declarations: [
    StressQuestionairePage,
  ],
  imports: [
    IonicPageModule.forChild(StressQuestionairePage),
  ],
})
export class StressQuestionairePageModule {}
