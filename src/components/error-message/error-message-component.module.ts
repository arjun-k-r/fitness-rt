// App
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Components
import { ErrorMessageComponent } from './error-message.component';

// Providers
import { AuthValidationServiceModule } from '../../providers';

@NgModule({
  declarations: [
    ErrorMessageComponent,
  ],
  imports: [
    IonicPageModule.forChild(ErrorMessageComponent),
    AuthValidationServiceModule
  ],
  exports: [
    ErrorMessageComponent
  ]
})
export class ErrorMessageComponentModule {}
