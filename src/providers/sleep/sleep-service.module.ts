import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SleepService } from './sleep.service';

@NgModule({
  declarations: [
    SleepService,
  ],
  imports: [
    IonicPageModule.forChild(SleepService),
  ],
  exports: [
    SleepService
  ]
})
export class SleepServiceModule {}
