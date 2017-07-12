// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

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
    AuthValidationServiceModule
  ],
  exports: [
    ForgotPasswordPage
  ]
})
export class ForgotPasswordPageModule {}
