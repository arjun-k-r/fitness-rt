import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MindBalanceInfoPage } from './mind-balance-info';

@NgModule({
  declarations: [
    MindBalanceInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MindBalanceInfoPage),
  ],
})
export class MindBalanceInfoPageModule {}
