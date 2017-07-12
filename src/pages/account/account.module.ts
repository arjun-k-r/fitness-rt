// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Pages
import { AccountPage } from './account';

// Providers
import { PictureServiceModule } from '../../providers';

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
