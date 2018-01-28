import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { FilterPipe } from './filter';

@NgModule({
  declarations: [
    FilterPipe,
  ],
  imports: [
    IonicPageModule.forChild(FilterPipe),
  ],
  exports: [
    FilterPipe
  ]
})
export class FilterPipeModule {}
