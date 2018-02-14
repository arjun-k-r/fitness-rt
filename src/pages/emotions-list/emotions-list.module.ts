import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { EmotionsListPage } from './emotions-list';
import { MindBalanceProviderModule } from '../../providers'

@NgModule({
  declarations: [
    EmotionsListPage,
  ],
  imports: [
    IonicPageModule.forChild(EmotionsListPage),
    MindBalanceProviderModule
  ],
})
export class EmotionsListPageModule {}
