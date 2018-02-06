import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { MindBalancePage } from './mind-balance';
import { MindBalanceProviderModule } from '../../providers'

@NgModule({
  declarations: [
    MindBalancePage,
  ],
  imports: [
    IonicPageModule.forChild(MindBalancePage),
    ChartsModule,
    MindBalanceProviderModule
  ],
})
export class MindBalancePageModule {}
