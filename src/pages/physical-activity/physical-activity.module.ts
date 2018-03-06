import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { MaterialIconsModule } from 'ionic2-material-icons';

import { ChartsModule } from 'ng2-charts';

import { PhysicalActivityPage } from './physical-activity';
import { PhysicalActivityProviderModule, UserProfileProviderModule } from '../../providers';

@NgModule({
  declarations: [
    PhysicalActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(PhysicalActivityPage),
    ChartsModule,
    PhysicalActivityProviderModule,
    MaterialIconsModule,
    UserProfileProviderModule
  ],
})
export class PhysicalActivityPageModule {}
