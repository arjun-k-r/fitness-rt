// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { PictureServiceModule } from '../../providers';

// Pages
import { AccountPage } from './account';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    PictureServiceModule
  ],
  exports: [
    AccountPage
  ]
})
export class AccountPageModule {}
