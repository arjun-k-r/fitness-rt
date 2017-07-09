import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CapitalizePipe } from './capitalize.pipe';

@NgModule({
  declarations: [
    CapitalizePipe,
  ],
  imports: [
    IonicPageModule.forChild(CapitalizePipe),
  ],
  exports: [
    CapitalizePipe
  ]
})
export class CapitalizePipeModule {}
