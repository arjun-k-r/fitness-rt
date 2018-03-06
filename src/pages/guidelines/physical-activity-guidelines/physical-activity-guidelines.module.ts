import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhysicalActivityGuidelinesPage } from './physical-activity-guidelines';

@NgModule({
  declarations: [
    PhysicalActivityGuidelinesPage,
  ],
  imports: [
    IonicPageModule.forChild(PhysicalActivityGuidelinesPage),
  ],
})
export class PhysicalActivityGuidelinesPageModule {}
