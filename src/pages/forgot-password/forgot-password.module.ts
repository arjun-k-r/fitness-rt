// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ErrorMessageComponentModule } from '../../components';

// Pages
import { ForgotPasswordPage } from './forgot-password';

// Providers
import { AuthValidationServiceModule } from '../../providers';

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordPage),
    AuthValidationServiceModule,
    ErrorMessageComponentModule
  ],
  exports: [
    ForgotPasswordPage
  ]
})
export class ForgotPasswordPageModule {}
