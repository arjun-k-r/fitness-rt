// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { DRIService } from './dri.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(DRIService),
  ],
  providers: [
    DRIService
  ]
})
export class DRIServiceModule {}
