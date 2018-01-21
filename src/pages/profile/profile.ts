// Angular
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

// Ionic
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  NavController,
  Toast,
  ToastController
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Models
import { BodyFat, BodyMeasurements, Fitness, FitnessTrend, ILineChartColors, ILineChartEntry, UserProfile } from '../../models';

// Providers
import { FitnessProvider, NotificationProvider, PictureProvider, UserProfileProvider } from '../../providers';

@IonicPage({
  name: 'profile'
})
@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('fileInput') fileInput;
  private _authId: string;
  private _authSubscription: Subscription;
  private _formInit: boolean;
  private _profileFormSubscription: Subscription;
  private _trends: FitnessTrend[];
  private _trendSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'bodyFat';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public profileForm: FormGroup;
  public profilePageSegment: string = 'userInfo';
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  public userInfo: firebase.UserInfo;
  public userProfile: UserProfile;
  constructor(
    private _actionSheetCtrl: ActionSheetController,
    private _afAuth: AngularFireAuth,
    private _alertCtrl: AlertController,
    private _fitPvd: FitnessProvider,
    private _navCtrl: NavController,
    private _notifyPvd: NotificationProvider,
    private _picPvd: PictureProvider,
    private _toastCtrl: ToastController,
    private _userPvd: UserProfileProvider
  ) {
    this.chartColors.push({
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: '#4dd87b',
      pointBackgroundColor: '#4dd87b',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4dd87b'
    });
    this.profileForm = new FormGroup({
      age: new FormControl('', [Validators.required]),
      chestMeasurement: new FormControl('', [Validators.required]),
      // constitution: new FormControl('', [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      heightMeasurement: new FormControl('', [Validators.required]),
      hipsMeasurement: new FormControl('', [Validators.required]),
      isLactating: new FormControl(''),
      isPregnant: new FormControl(''),
      metabolicType: new FormControl(''),
      neckMeasurement: new FormControl('', [Validators.required]),
      waistMeasurement: new FormControl('', [Validators.required]),
      weightMeasurement: new FormControl('', [Validators.required])
    });
    this.userProfile = new UserProfile(
      0,
      // '',
      new Fitness(0, new BodyFat('', 0, 0, 0, 0), '', '', ''),
      '',
      false,
      false,
      new BodyMeasurements(0, 0, 0, 0, 0, 0),
      ''
    );
  }

  private _calculateFitness(): void {
    const { age, gender, measurements } = this.userProfile;
    const bodyFat: BodyFat = this._fitPvd.calculateBodyFat(age, gender, measurements.height, measurements.hips, measurements.neck, measurements.waist, measurements.weight);
    const bmr: number = this._fitPvd.calculateBmr(age, gender, measurements.height, measurements.weight);
    const bodyShape: string = this._fitPvd.calculateBodyShape(measurements.chest, gender, measurements.hips, measurements.waist);
    const idealWaist: string = this._fitPvd.calculateIdealWaist(age, gender, measurements.height);
    const idealWeight: string = this._fitPvd.calculateIdealWeight(age, gender, measurements.height);
    this.userProfile.fitness = new Fitness(bmr, bodyFat, bodyShape, idealWaist, idealWeight);
  }

  private _chooseImage(): void {
    this._picPvd.chooseImage().then((photoUri: string) => {
      this.userInfo.photoURL = photoUri;
      this.uploadImage();
    }).catch((err: Error) => {
      this._notifyPvd.showError(err.message);
    });
  }

  private _getProfile(): void {
    this._userPvd.getUserProfile$(this._authId).subscribe((up: UserProfile) => {
      if (!!up && up['$value'] !== null) {
        this.userProfile = Object.assign({}, up);
        this._formInit = true;
        this.profileForm.controls['age'].patchValue(this.userProfile.age);
        this.profileForm.controls['chestMeasurement'].patchValue(this.userProfile.measurements.chest);
        // this.profileForm.controls['constitution'].patchValue(this.userProfile.constitution);
        this.profileForm.controls['gender'].patchValue(this.userProfile.gender);
        this.profileForm.controls['heightMeasurement'].patchValue(this.userProfile.measurements.height);
        this.profileForm.controls['hipsMeasurement'].patchValue(this.userProfile.measurements.hips);
        this.profileForm.controls['isLactating'].patchValue(this.userProfile.isLactating);
        this.profileForm.controls['isPregnant'].patchValue(this.userProfile.isPregnant);
        this.profileForm.controls['metabolicType'].patchValue(this.userProfile.metabolicType);
        this.profileForm.controls['neckMeasurement'].patchValue(this.userProfile.measurements.neck);
        this.profileForm.controls['waistMeasurement'].patchValue(this.userProfile.measurements.waist);
        this.profileForm.controls['weightMeasurement'].patchValue(this.userProfile.measurements.weight);
        this._formInit = false;
      }
    }, (err: firebase.FirebaseError) => {
      this._notifyPvd.showError(err.message);
    });
  }

  private _takePhoto(): void {
    this._picPvd.takePhoto().then((photoUri: string) => {
      this.userInfo.photoURL = photoUri;
      this.uploadImage();
    }).catch((err: Error) => {
      this._notifyPvd.showError(err.message);
    });
  }

  private _watchFormChanges(): void {
    this._profileFormSubscription = this.profileForm.valueChanges.subscribe(
      (c: {
        age: number,
        chestMeasurement: number,
        // constitution: string,
        gender: number,
        heightMeasurement: number,
        hipsMeasurement: number,
        isLactating: number,
        isPregnant: number,
        metabolicType: string,
        neckMeasurement: number,
        waistMeasurement: number,
        weightMeasurement: number
      }) => {
        if (this.profileForm.valid && !this._formInit) {
          this.unsavedChanges = true;
          this.userProfile = Object.assign({}, this.userProfile, {
            age: c.age,
            // constitution: c.constitution,
            gender: c.gender,
            isLactating: c.isLactating,
            isPregnant: c.isPregnant,
            measurements: new BodyMeasurements(c.chestMeasurement, c.heightMeasurement, c.hipsMeasurement, c.neckMeasurement, c.waistMeasurement, c.weightMeasurement),
            metabolicType: c.metabolicType
          });
          this._calculateFitness();
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    )
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'bodyFat':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.bodyFat)],
          label: 'Body fat percentage'
        }];
        break;

      case 'chestMEasurement':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.chestMEasurement)],
          label: 'Chest'
        }];
        break;

      case 'heightMeasurement':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.heightMeasurement)],
          label: 'Height'
        }];
        break;

      case 'heightMeasurement':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.hipsMeasurement)],
          label: 'Hips'
        }];
        break;

      case 'neckMeasurement':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.neckMeasurement)],
          label: 'Neck'
        }];
        break;

      case 'waistMeasurement':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.waistMeasurement)],
          label: 'Waist'
        }];
        break;

      case 'weightMeasurement':
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.weightMeasurement)],
          label: 'Weight'
        }];
        break;


      default:
        break;
    }
  }

  public changeImage(): void {
    if (Camera['installed']()) {
      this._actionSheetCtrl.create({
        title: 'Change image',
        buttons: [
          {
            text: 'Take photo',
            handler: () => {
              this._takePhoto();
            }
          }, {
            text: 'Choose image',
            handler: () => {
              this._chooseImage();
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).present();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  public getTrends(): void {
    if (this._trendSubscription) {
      this._trendSubscription.unsubscribe();
    }
    this._trendSubscription = this._userPvd.getTrends$(this._authId, +this.trendDays).subscribe(
      (trends: FitnessTrend[] = []) => {
        this.chartLabels = [...trends.map((t: FitnessTrend) => t.date)];
        this._trends = [...trends];
        this.chartData = [{
          data: [...this._trends.map((t: FitnessTrend) => t.bodyFat)],
          label: 'Body fat percentage'
        }];
      },
      (err: firebase.FirebaseError) => {
        this._notifyPvd.showError(err.message);
      }
    );
  }

  public processWebImage(event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (readerEvent: Event) => {
      this.uploadImage(event.target.files[0]);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  public save(): void {
    this._notifyPvd.showLoading();
    this._calculateFitness();
    this._userPvd.saveUserProfile(this._authId, this._trends, this.userProfile)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Profile saved successfully!');
      }).catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      })
  }

  public takeConstitutionTest(): void {
    this._navCtrl.push('constitution-test')
  }
  public takeMetabolicTypeTest(): void {
    this._navCtrl.push('metabolic-type-test')
  }

  public uploadImage(file?: File): void {
    let canceledUpload: boolean = false,
      uploadComplete: boolean = false;
    const toast: Toast = this._toastCtrl.create({
      closeButtonText: 'Cancel',
      message: 'Uploading ... 0%',
      position: 'bottom',
      showCloseButton: true
    });

    toast.present();
    toast.onWillDismiss(() => {
      if (!uploadComplete) {
        canceledUpload = true;
        this._picPvd.cancelUpload();
      }
    });

    this._picPvd.uploadImage(this._authId, 'photos', file).subscribe((data: string | number) => {
      if (typeof data === 'number') {
        toast.setMessage(`Uploading ... ${data}%`);
      } else {
        this.userInfo.photoURL = data;
        this._afAuth.auth.currentUser.updateProfile({
          displayName: this.userInfo.displayName,
          photoURL: this.userInfo.photoURL
        }).catch((err: firebase.FirebaseError) => {
          this._notifyPvd.showError(err.message);
        });
      }
    }, (err: firebase.FirebaseError) => {
      toast.setMessage(err.message);
    },
      () => {
        if (canceledUpload === false) {
          uploadComplete = true;
          if (toast) {
            toast.dismiss();
          }
          this._notifyPvd.showInfo('Upload complete!');
          this._notifyPvd.showInfo('Upload complete!');
        } else {
          this._notifyPvd.showInfo('Upload canceled!');
        }
      });
  }

  public viewPageInfo(): void {
    this._navCtrl.push('profile-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this._afAuth.authState.subscribe((auth: firebase.User) => {
        if (!auth) {
          reject();
          this._navCtrl.setRoot('registration', {
            history: 'profile'
          });
        }
        resolve();
      })
    });
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges && this.profileForm.valid) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this._alertCtrl.create({
          title: 'Unsaved changes',
          message: 'All your changes will be lost. Are you sure you want to leave?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Yes',
              handler: () => {
                resolve();
              }
            }
          ]
        });
      } else if (this.profileForm.invalid) {
        this._notifyPvd.showError('Please complete all the fields. They are required throughout the application');
      }
    });
  }

  ionViewWillEnter(): void {
    this._authSubscription = this._afAuth.authState.subscribe((auth: firebase.User) => {
      if (!!auth) {
        this._authId = auth.uid;
        const { displayName, email, phoneNumber, photoURL, providerId, uid } = this._afAuth.auth.currentUser;
        this.userInfo = {
          displayName,
          email,
          phoneNumber,
          photoURL,
          providerId,
          uid
        };

        this._getProfile();
        this.getTrends();
        this._watchFormChanges();
      }
    })
  }

  ionViewWillLeave(): void {
    this._authSubscription.unsubscribe();
    this._profileFormSubscription.unsubscribe();
    this._trendSubscription.unsubscribe();
  }
}
