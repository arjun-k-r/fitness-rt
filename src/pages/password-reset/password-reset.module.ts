// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ErrorMessageComponentModule } from '../../components';

// Page
import { PasswordResetPage } from './password-reset';

// Providers
import { AuthValidationServiceModule } from '../../providers';

@NgModule({
  declarations: [
    PasswordResetPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordResetPage),
    AuthValidationServiceModule,
    ErrorMessageComponentModule
  ],
  exports: [
    PasswordResetPage
  ]
})
export class PasswordResetPageModule {}
