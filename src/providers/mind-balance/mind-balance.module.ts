import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { MindBalanceProvider } from './mind-balance';

@NgModule({
  imports: [
    IonicPageModule.forChild(MindBalanceProvider)
  ],
  providers: [
    MindBalanceProvider
  ]
})
export class MindBalanceProviderModule {}