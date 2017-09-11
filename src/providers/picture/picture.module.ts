import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { PictureProvider } from './picture';

@NgModule({
  imports: [
    IonicPageModule.forChild(PictureProvider),
  ],
  providers: [
    PictureProvider
  ]
})
export class PictureProviderModule {}
