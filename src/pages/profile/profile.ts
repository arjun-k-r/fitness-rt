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
import { FirebaseError, User, UserInfo } from 'firebase/app';

// Models
import {
  BodyFat,
  BodyMeasurements,
  Constitution,
  Fitness,
  FitnessTrend,
  HeartRate,
  ILineChartColors,
  ILineChartEntry,
  UserProfile
} from '../../models';

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
  private authId: string;
  private authSubscription: Subscription;
  private formInit: boolean;
  private profileFormSubscription: Subscription;
  private trends: FitnessTrend[];
  private trendSubscription: Subscription;
  public chartColors: ILineChartColors[] = [];
  public chartData: ILineChartEntry[] = [];
  public chartDataSelection: string = 'bodyFat';
  public chartLabels: string[] = [];
  public chartOpts: any = { responsive: true };
  public pageSegment: string = 'userInfo';
  public profileForm: FormGroup;
  public trendDays: number = 7;
  public unsavedChanges: boolean = false;
  public userInfo: UserInfo;
  public userProfile: UserProfile;
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private fitPvd: FitnessProvider,
    private navCtrl: NavController,
    private notifyPvd: NotificationProvider,
    private picPvd: PictureProvider,
    private toastCtrl: ToastController,
    private userPvd: UserProfileProvider
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
      gender: new FormControl(null, [Validators.required]),
      goal: new FormControl(1, [Validators.required]),
      heightMeasurement: new FormControl('', [Validators.required]),
      hipsMeasurement: new FormControl('', [Validators.required]),
      isLactating: new FormControl(''),
      isPregnant: new FormControl(''),
      iliacMeasurement: new FormControl('', [Validators.required]),
      restingHeartRateMeasurement: new FormControl('', [Validators.required]),
      waistMeasurement: new FormControl('', [Validators.required]),
      weightMeasurement: new FormControl('', [Validators.required])
    });
    this.userProfile = new UserProfile(
      0,
      new Constitution(),
      new Fitness(0, new BodyFat('', 0, 0, 0, 0), '', 1, new HeartRate(0, 0, 0), '', ''),
      '',
      false,
      false,
      new BodyMeasurements(0, 0, 0, 0, 0, 0, 0)
    );
  }

  private calculateFitness(): void {
    const { age, gender, measurements } = this.userProfile;
    const bodyFat: BodyFat = this.fitPvd.calculateBodyFat(+age, gender, +measurements.height, +measurements.hips, +measurements.iliac, +measurements.waist, +measurements.weight);
    const bmr: number = this.fitPvd.calculateBmr(+age, gender, +measurements.height, +measurements.weight);
    const bodyShape: string = this.fitPvd.calculateBodyShape(+measurements.chest, gender, +measurements.hips, +measurements.waist);
    const idealWaist: string = this.fitPvd.calculateIdealWaist(+age, gender, +measurements.height);
    const idealWeight: string = this.fitPvd.calculateIdealWeight(+age, gender, +measurements.height);
    const heartRate: HeartRate = this.fitPvd.calculateHeartRate(+age, +measurements.restingHeartRate);
    this.userProfile.fitness = new Fitness(bmr, bodyFat, bodyShape, this.userProfile.fitness.goal, heartRate, idealWaist, idealWeight);
  }

  private chooseImage(): void {
    this.picPvd.chooseImage().then((photoUri: string) => {
      this.userInfo.photoURL = photoUri;
      this.uploadImage();
    }).catch((err: Error) => {
      this.notifyPvd.showError(err.message);
    });
  }

  private getProfile(): void {
    this.notifyPvd.showLoading();
    this.userPvd.getUserProfile$(this.authId).subscribe((up: UserProfile) => {
      if (!!up && up['$value'] !== null) {
        this.userProfile = Object.assign({}, up);
        this.formInit = true;
        this.profileForm.controls['age'].patchValue(this.userProfile.age);
        this.profileForm.controls['chestMeasurement'].patchValue(this.userProfile.measurements.chest);
        this.profileForm.controls['gender'].patchValue(this.userProfile.gender);
        this.profileForm.controls['goal'].patchValue(this.userProfile.fitness.goal);
        this.profileForm.controls['heightMeasurement'].patchValue(this.userProfile.measurements.height);
        this.profileForm.controls['hipsMeasurement'].patchValue(this.userProfile.measurements.hips);
        this.profileForm.controls['isLactating'].patchValue(this.userProfile.isLactating);
        this.profileForm.controls['isPregnant'].patchValue(this.userProfile.isPregnant);
        this.profileForm.controls['iliacMeasurement'].patchValue(this.userProfile.measurements.iliac);
        this.profileForm.controls['restingHeartRateMeasurement'].patchValue(this.userProfile.measurements.restingHeartRate);
        this.profileForm.controls['waistMeasurement'].patchValue(this.userProfile.measurements.waist);
        this.profileForm.controls['weightMeasurement'].patchValue(this.userProfile.measurements.weight);
        this.formInit = false;
        this.notifyPvd.closeLoading();
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.showError(err.message);
      this.notifyPvd.closeLoading();
    });
  }

  private getTrends(): void {
    this.trendSubscription = this.userPvd.getTrends$(this.authId, +this.trendDays).subscribe(
      (trends: FitnessTrend[] = []) => {
        this.chartLabels = [...trends.map((t: FitnessTrend) => t.date)];
        this.trends = [...trends];
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.bodyFat)],
          label: 'Body fat percentage'
        }];
      },
      (err: FirebaseError) => {
        this.notifyPvd.showError(err.message);
      }
    );
  }

  private takePhoto(): void {
    this.picPvd.takePhoto().then((photoUri: string) => {
      this.userInfo.photoURL = photoUri;
      this.uploadImage();
    }).catch((err: Error) => {
      this.notifyPvd.showError(err.message);
    });
  }

  private watchFormChanges(): void {
    this.profileFormSubscription = this.profileForm.valueChanges.subscribe(
      (c: {
        age: number,
        chestMeasurement: number,
        gender: number,
        goal: number,
        heightMeasurement: number,
        hipsMeasurement: number,
        isLactating: number,
        isPregnant: number,
        iliacMeasurement: number,
        restingHeartRateMeasurement: number,
        waistMeasurement: number,
        weightMeasurement: number
      }) => {
        if (this.profileForm.valid && !this.formInit) {
          this.unsavedChanges = true;
          this.userProfile = Object.assign({}, this.userProfile, {
            age: c.age,
            gender: c.gender,
            isLactating: c.isLactating,
            isPregnant: c.isPregnant,
            measurements: new BodyMeasurements(c.chestMeasurement, c.heightMeasurement, c.hipsMeasurement, c.iliacMeasurement, c.restingHeartRateMeasurement, c.waistMeasurement, c.weightMeasurement)
          });
          this.calculateFitness();
        }
      },
      (err: Error) => console.error(`Error fetching form changes: ${err}`)
    )
  }

  public changeChartData(): void {
    switch (this.chartDataSelection) {
      case 'bodyFat':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.bodyFat)],
          label: 'Body fat percentage'
        }];
        break;

      case 'chestMEasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.chestMEasurement)],
          label: 'Chest'
        }];
        break;

      case 'heightMeasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.heightMeasurement)],
          label: 'Height'
        }];
        break;

      case 'heightMeasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.hipsMeasurement)],
          label: 'Hips'
        }];
        break;

      case 'iliacMeasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.iliacMeasurement)],
          label: 'Iliac'
        }];
        break;

      case 'restingHeartRateMeasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.restingHeartRateMeasurement)],
          label: 'Resting heart rate'
        }];
        break;

      case 'waistMeasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.waistMeasurement)],
          label: 'Waist'
        }];
        break;

      case 'weightMeasurement':
        this.chartData = [{
          data: [...this.trends.map((t: FitnessTrend) => t.weightMeasurement)],
          label: 'Weight'
        }];
        break;


      default:
        break;
    }
  }

  public changeImage(): void {
    if (Camera['installed']()) {
      this.actionSheetCtrl.create({
        title: 'Change image',
        buttons: [
          {
            text: 'Take photo',
            handler: () => {
              this.takePhoto();
            }
          }, {
            text: 'Choose image',
            handler: () => {
              this.chooseImage();
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

  public changeTrendDays(): void {
    this.userPvd.changeTrendDays(+this.trendDays || 1);
  }

  public onChange(): void {
    this.unsavedChanges = true;
  }

  public processWebImage(event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (readerEvent: Event) => {
      this.uploadImage(event.target.files[0]);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  public save(): void {
    this.notifyPvd.showLoading();
    this.calculateFitness();
    this.userPvd.saveUserProfile(this.authId, this.trends, this.userProfile)
      .then(() => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showInfo('Profile saved successfully!');
      }).catch((err: FirebaseError) => {
        this.notifyPvd.closeLoading();
        this.notifyPvd.showError(err.message);
      })
  }

  public takeConstitutionTest(): void {
    this.navCtrl.push('constitution-questionaire', { authId: this.authId, constitution: this.userProfile.constitution })
  }

  public uploadImage(file?: File): void {
    let canceledUpload: boolean = false,
      uploadComplete: boolean = false;
    const toast: Toast = this.toastCtrl.create({
      closeButtonText: 'Cancel',
      message: 'Uploading ... 0%',
      position: 'bottom',
      showCloseButton: true
    });

    toast.present();
    toast.onWillDismiss(() => {
      if (!uploadComplete) {
        canceledUpload = true;
        this.picPvd.cancelUpload();
      }
    });

    this.picPvd.uploadImage(this.authId, 'photos', file).subscribe((data: string | number) => {
      if (typeof data === 'number') {
        toast.setMessage(`Uploading ... ${data}%`);
      } else {
        this.userInfo.photoURL = data;
        this.afAuth.auth.currentUser.updateProfile({
          displayName: this.userInfo.displayName,
          photoURL: this.userInfo.photoURL
        }).catch((err: FirebaseError) => {
          this.notifyPvd.showError(err.message);
        });
      }
    }, (err: FirebaseError) => {
      toast.setMessage(err.message);
    },
      () => {
        if (canceledUpload === false) {
          uploadComplete = true;
          if (toast) {
            toast.dismiss();
          }
          this.notifyPvd.showInfo('Upload complete!');
          this.notifyPvd.showInfo('Upload complete!');
        } else {
          this.notifyPvd.showInfo('Upload canceled!');
        }
      });
  }

  public viewPageInfo(): void {
    this.navCtrl.push('profile-info');
  }

  ionViewCanEnter(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((auth: User) => {
        if (!auth) {
          reject();
          this.navCtrl.setRoot('registration', {
            history: 'profile'
          });
        }
        resolve();
      }, (err: FirebaseError) => {
        reject(err);
      })
    });
  }

  ionViewCanLEave(): boolean | Promise<{}> {
    if (!this.unsavedChanges && this.profileForm.valid) {
      return true;
    }
    return new Promise((resolve, reject) => {
      if (this.unsavedChanges) {
        this.alertCtrl.create({
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
        this.notifyPvd.showError('Please complete all the fields. They are required throughout the application');
      }
    });
  }

  ionViewWillEnter(): void {
    this.authSubscription = this.afAuth.authState.subscribe((auth: User) => {
      if (!!auth) {
        this.authId = auth.uid;
        const { displayName, email, phoneNumber, photoURL, providerId, uid } = this.afAuth.auth.currentUser;
        this.userInfo = {
          displayName,
          email,
          phoneNumber,
          photoURL,
          providerId,
          uid
        };

        this.getProfile();
        this.getTrends();
        this.watchFormChanges();
      }
    }, (err: FirebaseError) => {
      this.notifyPvd.showError(err.message);
    })
  }

  ionViewWillLeave(): void {
    this.authSubscription.unsubscribe();
    this.profileFormSubscription.unsubscribe();
    this.trendSubscription.unsubscribe();
  }
}
