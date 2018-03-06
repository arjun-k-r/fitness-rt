import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhysicalActivityInfoPage } from './physical-activity-info';

@NgModule({
  declarations: [
    PhysicalActivityInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PhysicalActivityInfoPage),
  ],
})
export class PhysicalActivityInfoPageModule {}
