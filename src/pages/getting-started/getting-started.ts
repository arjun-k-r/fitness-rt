// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

// Pages
import { ConstitutionPage } from '../constitution/constitution';

@Component({
  selector: 'page-getting-started',
  templateUrl: 'getting-started.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GettingStartedPage {
  @ViewChild(Slides) private _slider: Slides;
  public slides: Array<{ title: string, description: string, image: string }>
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _params: NavParams
  ) {
    this.slides = [
      {
        title: 'Welcome to the Health Guide!',
        description: 'Before we begin, I want to remind you that this is the Health Guide App. <br/><b class="slide__description--bold">This is NOT</b> the "I want to lose weight" Guide app<br/><b class="slide__description--bold">This is NOT</b> the "I want to look good for my girl/boy" Guide app<br/><b class="slide__description--bold">This is NOT</b> the "I want to have six pack" Guide app<br/><b class="slide__description--bold">This is NOT</b> the "I want to have huge muscles" Guide app',
        image: 'assets/img/ica-slidebox-img-1.png',
      },
      {
        title: 'What is the Health Guide App?',
        description: '<b class="slide__description--bold">The Health Guide App</b> is an application focused on lifestyle changes, based on the uniqueness of each individual\'s physical and mental constituition.<br/>The app was designed to make you learn how to:<br/><b class="slide__description--bold">Develop long-term healthy habits</b><br/><b class="slide__description--bold">Listen to your body\'s needs</b><br/><b class="slide__description--bold">Become your own nutritionist and doctor</b><br/>The app evolves as you evolve.',
        image: 'assets/img/ica-slidebox-img-2.png',
      },
      {
        title: 'Why? Is it worth it?',
        description: '<b class="slide__description--bold">Every day</b>, you must remind yourself why you are doing this. <b class="slide__description--bold">Every day</b>, you must remind yourself that life and health are the most important gifts we have. <b class="slide__description--bold">Every day</b> you must ask yourself:<br/>"Do I truly love my body?"<br/>"If I am sick, did I ever do something about it? Have I ever wanted to be healthy?"<br/>"If I am old and sick, is it because I am old or because I have never given damn about my health?"</b><br/>Health is a lifetime commitment <b class="slide__description--bold">(like marriage)<b/>.',
        image: 'assets/img/ica-slidebox-img-3.png',
      }
    ];

    this._detectorRef.markForCheck();
  }

  public takeQuiz(): void {
    this._navCtrl.setRoot(ConstitutionPage);
  }

  public nextSlide(): void {
    this._slider.slideNext();
  }

  ionViewWillUnload(): void {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
