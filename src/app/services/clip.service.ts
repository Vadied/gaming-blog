import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import IClip from '../models/clip.model';
import { map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCOllection: AngularFirestoreCollection<IClip>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCOllection = db.collection('clips');
  }

  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCOllection.add(data);
  }

  getUserClips() {
    return this.auth.user.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        const query = this.clipsCOllection.ref.where('uid', '==', user.uid);

        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCOllection.doc(id).update({ title });
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    await clipRef.delete();
  }
}
