import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MetabolicTypeTestPage } from './metabolic-type-test';
import { NotificationProviderModule } from '../../providers';

@NgModule({
  declarations: [
    MetabolicTypeTestPage,
  ],
  imports: [
    IonicPageModule.forChild(MetabolicTypeTestPage),
    NotificationProviderModule
  ],
})
export class MetabolicTypeTestPageModule {}
