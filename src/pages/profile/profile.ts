// Angular
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
import { BodyFat, BodyMeasurements, Fitness, UserProfile } from '../../models';

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
  private _profileFormSubscription: Subscription;
  public ageControl: FormControl = new FormControl('', [Validators.required]);
  public chestMeasurementControl: FormControl = new FormControl('', [Validators.required]);
  public genderControl: FormControl = new FormControl('', [Validators.required]);
  public heightMeasurementControl: FormControl = new FormControl('', [Validators.required]);
  public hipsMeasurementControl: FormControl = new FormControl('', [Validators.required]);
  public isLactatingControl: FormControl = new FormControl('', [Validators.required]);
  public isPregnantControl: FormControl = new FormControl('', [Validators.required]);
  public neckMeasurementControl: FormControl = new FormControl('', [Validators.required]);
  public profileForm: FormGroup;
  public profilePageSegment: string = 'userInfo';
  public unsavedChanges: boolean = false;
  public userInfo: firebase.UserInfo;
  public userProfile: UserProfile;
  public waistMeasurementControl: FormControl = new FormControl('', [Validators.required]);
  public weightMeasurementControl: FormControl = new FormControl('', [Validators.required]);
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
    this.profileForm = new FormGroup({
      age: this.ageControl,
      chestMeasurement: this.chestMeasurementControl,
      gender: this.genderControl,
      heightMeasurement: this.heightMeasurementControl,
      hipsMeasurementControl: this.hipsMeasurementControl,
      isLactating: this.isLactatingControl,
      isPregnant: this.isPregnantControl,
      neckMeasurement: this.neckMeasurementControl,
      waistMeasurement: this.waistMeasurementControl,
      weightMeasurement: this.weightMeasurementControl
    });
    this.userProfile = new UserProfile(
      0,
      new Fitness(0, new BodyFat('', 0, 0, 0), ''),
      '',
      false,
      false,
      new BodyMeasurements(0, 0, 0, 0, 0, 0)
    );
  }

  private _calculateFitness(): void {
    const { age, gender, measurements } = this.userProfile;
    const bodyFat: BodyFat = this._fitPvd.calculateBodyFat(age, gender, measurements.height, measurements.hips, measurements.neck, measurements.waist, measurements.weight);
    const bmr: number = this._fitPvd.calculateBmr(age, gender, measurements.height, measurements.weight);
    const bodyShape: string = this._fitPvd.calculateBodyShape(measurements.chest, gender, measurements.hips, measurements.waist);
    this.userProfile.fitness = new Fitness(bmr, bodyFat, bodyShape);
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
      if (!!up && !up.hasOwnProperty('$value')) {
        this.userProfile = Object.assign({}, up);
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
        gender: number,
        heightMeasurement: number,
        hipsMeasurementControl: number,
        isLactating: number,
        isPregnant: number,
        neckMeasurement: number,
        waistMeasurement: number,
        weightMeasurement: number
      }) => {
        if (this.profileForm.valid) {
          this.unsavedChanges = true;
          this.userProfile = Object.assign({}, this.userProfile, {
            age: c.age,
            gender: c.gender,
            isLactating: c.isLactating,
            isPregnant: c.isPregnant,
            measurements: new BodyMeasurements(c.chestMeasurement, c.heightMeasurement, c.hipsMeasurementControl, c.neckMeasurement, c.waistMeasurement, c.weightMeasurement)
          });
        }
      }
    )
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

  public changeMade(): void {
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
    this._notifyPvd.showLoading();
    this._calculateFitness();
    this._userPvd.saveUserProfile(this._authId, this.userProfile)
      .then(() => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showInfo('Profile saved successfully!');
      }).catch((err: firebase.FirebaseError) => {
        this._notifyPvd.closeLoading();
        this._notifyPvd.showError(err.message);
      })
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

  ionViewCanEnter(): Promise<void> {
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

  ionViewCanLEave(): boolean | Promise<void> {
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
      } else if (!this.profileForm.valid) {
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
        this._watchFormChanges();
      }
    })
  }

  ionViewWillLeave(): void {
    this._authSubscription.unsubscribe();
    this._profileFormSubscription.unsubscribe();
  }
}
