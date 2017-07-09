import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [
    SearchPipe,
  ],
  imports: [
    IonicPageModule.forChild(SearchPipe),
  ],
  exports: [
    SearchPipe
  ]
})
export class SearchPipeModule {}
