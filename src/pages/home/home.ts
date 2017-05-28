// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  constructor(private _detectorRef: ChangeDetectorRef) { }

  ionViewWillLeave(): void {
    this._detectorRef.detach();
  }

}
