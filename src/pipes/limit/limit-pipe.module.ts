import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { LimitPipe } from './limit.pipe';

@NgModule({
  declarations: [
    LimitPipe,
  ],
  imports: [
    IonicPageModule.forChild(LimitPipe),
  ],
  exports: [
    LimitPipe
  ]
})
export class LimitPipeModule {}
