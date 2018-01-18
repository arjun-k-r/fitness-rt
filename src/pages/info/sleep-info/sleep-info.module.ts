import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SleepInfoPage } from './sleep-info';

@NgModule({
  declarations: [
    SleepInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SleepInfoPage),
  ],
})
export class SleepInfoPageModule {}
