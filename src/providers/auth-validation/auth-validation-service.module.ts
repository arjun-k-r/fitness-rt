// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { AuthValidationService } from './auth-validation.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(AuthValidationService),
  ],
  providers: [
    AuthValidationService
  ]
})
export class AuthValidationServiceModule {}
