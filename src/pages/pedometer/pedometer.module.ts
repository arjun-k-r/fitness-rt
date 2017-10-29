import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { Pedometer } from '@ionic-native/pedometer';

import { PedometerPage } from './pedometer';

@NgModule({
  declarations: [
    PedometerPage,
  ],
  imports: [
    IonicPageModule.forChild(PedometerPage),
  ],
  providers: [
    Pedometer
  ]
})
export class PedometerPageModule {}
