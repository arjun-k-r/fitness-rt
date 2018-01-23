import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstitutionQuestionairePage } from './constitution-questionaire';

@NgModule({
  declarations: [
    ConstitutionQuestionairePage,
  ],
  imports: [
    IonicPageModule.forChild(ConstitutionQuestionairePage),
  ],
})
export class ConstitutionQuestionairePageModule {}
