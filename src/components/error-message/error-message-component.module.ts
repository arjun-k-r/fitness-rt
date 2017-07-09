import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ErrorMessageComponent } from './error-message.component';

@NgModule({
  declarations: [
    ErrorMessageComponent,
  ],
  imports: [
    IonicPageModule.forChild(ErrorMessageComponent),
  ],
  exports: [
    ErrorMessageComponent
  ]
})
export class ErrorMessageComponentModule {}
