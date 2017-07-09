import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PictureService } from './picture.service';

@NgModule({
  declarations: [
    PictureService,
  ],
  imports: [
    IonicPageModule.forChild(PictureService),
  ],
  exports: [
    PictureService
  ]
})
export class PictureServiceModule {}
