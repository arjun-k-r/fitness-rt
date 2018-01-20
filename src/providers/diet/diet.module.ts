import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { DietProvider } from './diet';

@NgModule({
  imports: [
    IonicPageModule.forChild(DietProvider)
  ],
  providers: [
    DietProvider
  ]
})
export class DietProviderModule {}