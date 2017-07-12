// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { SleepService } from './sleep.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(SleepService),
  ],
  providers: [
    SleepService
  ]
})
export class SleepServiceModule {}
