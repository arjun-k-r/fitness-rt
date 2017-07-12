// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ErrorMessageComponentModule } from '../../components';

// Pages
import { RegistrationPage } from './registration';

// Providers
import { AuthValidationServiceModule } from '../../providers';

@NgModule({
  declarations: [
    RegistrationPage,
  ],
  entryComponents: [
  ],
  imports: [
    IonicPageModule.forChild(RegistrationPage),
    AuthValidationServiceModule,
    ErrorMessageComponentModule
  ],
  exports: [
    RegistrationPage
  ]
})
export class RegistrationPageModule {}
