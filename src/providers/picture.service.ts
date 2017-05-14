import { Inject, Injectable } from '@angular/core';
import { User } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// Third-party
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class PictureService {
  private _images: firebase.storage.Reference;
  constructor(
    @Inject(FirebaseApp) firebaseApp: any,
    private _user: User
  ) { this._images = firebaseApp.storage().ref().child(`${_user.id}/images`); }

  public getImage(imgName: string, pathName: string): firebase.Promise<any> {
    return this._images.child(`${pathName}/${imgName}`).getDownloadURL();
  }

  public uploadImage(img: File, pathName: string): Observable<string | number> {
    let progress: number;
    return new Observable((observer: Observer<string | number>) => {
      let uploadTask: firebase.storage.UploadTask = this._images.child(`${pathName}/${img.name}`).put(img);

      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
        progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        observer.next(progress);
      }, (err: Error) =>  observer.error(err),
        () => {
          observer.next(uploadTask.snapshot.downloadURL);
          observer.complete()
        });
    });
  }
}
