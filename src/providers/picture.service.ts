import { Inject, Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// Third-party
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class PictureService {
  private _images: firebase.storage.Reference;
  private _pictureObserver: Observer<string>;
  private _uploadTask: firebase.storage.UploadTask;
  constructor(
    @Inject(FirebaseApp) _firebaseApp: any,
    private _user: User
  ) { this._images = _firebaseApp.storage().ref().child(`${_user.id}/images`); }

  public cancelUpload(): void {
    this._uploadTask.cancel();
    this._pictureObserver.complete();
  }

  public getImage(imgName: string, pathName: string): firebase.Promise<any> {
    return this._images.child(`${pathName}/${imgName}`).getDownloadURL();
  }

  public uploadImage(img: File, pathName: string): Observable<string | number> {
    let progress: number;
    return new Observable((observer: Observer<string | number>) => {
      this._uploadTask = this._images.child(`${pathName}/${img.name}`).put(img);
      this._pictureObserver = observer;

      this._uploadTask.catch((err: Error) => observer.error(err));

      this._uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
        switch (snapshot.state) {
          case 'canceled':
            observer.complete();
            break;

          default:
            break;
        }
        progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        observer.next(progress);
      }, (err: any) => {
        switch (err.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }

        //observer.error(err);
      },
        () => {
          observer.next(this._uploadTask.snapshot.downloadURL);
          observer.complete()
        });
    });
  }
}
