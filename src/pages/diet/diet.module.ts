import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { DietPage } from './diet';
import { DietProviderModule } from '../../providers';

@NgModule({
  declarations: [
    DietPage
  ],
  imports: [
    IonicPageModule.forChild(DietPage),
    DietProviderModule,
    ChartsModule
  ],
})
export class DietPageModule {}
