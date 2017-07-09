import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ErrorMessageComponentModule } from '../../components';
import { RegistrationPage } from './registration';

@NgModule({
  declarations: [
    RegistrationPage,
  ],
  entryComponents: [
  ],
  imports: [
    IonicPageModule.forChild(RegistrationPage),
    ErrorMessageComponentModule
  ],
  exports: [
    RegistrationPage
  ]
})
export class RegistrationPageModule {}
