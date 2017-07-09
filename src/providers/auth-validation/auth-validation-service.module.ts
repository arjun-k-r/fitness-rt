import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AuthValidationService } from './auth-validation.service';

@NgModule({
  declarations: [
    AuthValidationService,
  ],
  imports: [
    IonicPageModule.forChild(AuthValidationService),
  ],
  exports: [
    AuthValidationService
  ]
})
export class AuthValidationServiceModule {}
