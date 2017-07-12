import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SortByPipe } from './sortBy.pipe';

@NgModule({
  declarations: [
    SortByPipe,
  ],
  imports: [
    IonicPageModule.forChild(SortByPipe),
  ],
  exports: [
    SortByPipe
  ]
})
export class SortByPipeModule {}
