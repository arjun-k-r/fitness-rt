import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { DRIService } from './dri.service';

@NgModule({
  declarations: [
    DRIService,
  ],
  imports: [
    IonicPageModule.forChild(DRIService),
  ],
  exports: [
    DRIService
  ]
})
export class DRIServiceModule {}
