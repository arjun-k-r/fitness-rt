// Angular
import { Injectable } from '@angular/core';

// Ionic Native
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

// Firebase
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase/app';

// Moment
import * as moment from 'moment';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class PictureProvider {
  private cameraOpts: CameraOptions;
  private captureDataUrl: string;
  private imagePickerOpts: ImagePickerOptions;
  private pictureObserver: Observer<string>;
  private uploadTask: firebase.storage.UploadTask;
  constructor(
    private camera: Camera,
    private fb: FirebaseApp,
    private imagePicker: ImagePicker
  ) {
    this.cameraOpts = {
      allowEdit: true,
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.imagePickerOpts = {
      maximumImagesCount: 1
    };
  }

  public cancelUpload(): void {
    this.uploadTask.cancel();
    this.pictureObserver.complete();
  }

  public chooseImage(): Promise<string> {
    return new Promise((resolve, reject) => this.imagePicker.getPictures(this.imagePickerOpts).then((results: Array<string>) => resolve(results[0]), (err: Error) => reject(err)));
  }

  public takePhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.cameraOpts).then((imageData: ImageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.captureDataUrl = `data:image/jpeg;base64,${imageData}`;
        resolve(this.captureDataUrl);
      }, (err: Error) => reject(err));
    });
  }

  public uploadImage(authId: string, pathName: string, img?: File): Observable<string | number> {
    /**
     * FIXME: Firebase sends an uncaught error on cancel and don't know how to catch it
     */
    let progress: number;
    return new Observable((observer: Observer<string | number>) => {
      const imageStorage: firebase.storage.Reference = this.fb.storage().ref().child(`${authId}/images`);
      this.uploadTask = img ? imageStorage.child(`${pathName}/${img.name}`).put(img) : imageStorage.child(`${pathName}/${moment().format('DDMMYYHHmmss')}.jpg`).putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL);
      this.pictureObserver = observer;
      this.uploadTask.catch((err: Error) => observer.error(err));
      this.uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
        progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        observer.next(progress);
      }, (err: Error) => observer.error(err),
        () => {
          observer.next(this.uploadTask.snapshot.downloadURL);
          observer.complete()
        });
    });
  }
}
