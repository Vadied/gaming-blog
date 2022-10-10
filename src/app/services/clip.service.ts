import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection, DocumentReference
} from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCOllection: AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore) {
    this.clipsCOllection = db.collection('clips');
  }

  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCOllection.add(data)
  }
}
