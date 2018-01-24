import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ConstitutionQuestionairePage } from './constitution-questionaire';
import { UserProfileProviderModule } from '../../providers';

@NgModule({
  declarations: [
    ConstitutionQuestionairePage
  ],
  imports: [
    IonicPageModule.forChild(ConstitutionQuestionairePage),
    UserProfileProviderModule
  ],
})
export class ConstitutionQuestionairePageModule {}
