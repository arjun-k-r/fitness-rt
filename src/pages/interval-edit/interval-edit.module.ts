import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntervalEditPage } from './interval-edit';

@NgModule({
  declarations: [
    IntervalEditPage,
  ],
  imports: [
    IonicPageModule.forChild(IntervalEditPage),
  ],
})
export class IntervalEditPageModule {}
