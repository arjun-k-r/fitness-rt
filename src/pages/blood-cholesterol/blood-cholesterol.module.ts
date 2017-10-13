import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { ChartsModule } from 'ng2-charts';

import { BloodCholesterolPage } from './blood-cholesterol';
import { BloodCholesterolProviderModule } from '../../providers';

@NgModule({
  declarations: [
    BloodCholesterolPage,
  ],
  imports: [
    IonicPageModule.forChild(BloodCholesterolPage),
    BloodCholesterolProviderModule,
    ChartsModule
  ],
})
export class BloodCholesterolPageModule {}
