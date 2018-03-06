import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { PhysicalActivityProvider } from './physical-activity';

@NgModule({
  imports: [
    IonicPageModule.forChild(PhysicalActivityProvider)
  ],
  providers: [
    PhysicalActivityProvider
  ]
})
export class PhysicalActivityProviderModule {}