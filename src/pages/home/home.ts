// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  constructor(private _detectorRef: ChangeDetectorRef) { }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
