import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ErrorMessageComponentModule } from '../../components';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    ErrorMessageComponentModule
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}
