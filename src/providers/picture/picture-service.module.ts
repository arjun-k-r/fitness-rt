// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Providers
import { PictureService } from './picture.service';

@NgModule({
  imports: [
    IonicPageModule.forChild(PictureService),
  ],
  providers: [
    PictureService
  ]
})
export class PictureServiceModule {}
