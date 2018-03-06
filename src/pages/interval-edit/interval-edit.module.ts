import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';

import { IntervalEditPage } from './interval-edit';

@NgModule({
  declarations: [
    IntervalEditPage,
  ],
  imports: [
    IonicPageModule.forChild(IntervalEditPage),
    MaterialIconsModule
  ],
})
export class IntervalEditPageModule {}
