import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, orderBy, limit, doc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Chates, FinalState, IMyGeolocation, IMyUint8Array, playerFirebase, TabellaPresenze, tabelleFirebase } from '../classes/utils/costants.enum';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  chatRef = collection(this.firestore, "chates");
  constructor(private firestore: Firestore) { }

  addItem(dato: FinalState | TabellaPresenze | Chates | IMyGeolocation | IMyUint8Array, tabella: tabelleFirebase) {
    return addDoc(collection(this.firestore, tabella), dato);
  }

  getListaOrdinataChat(l: number) {
    return query(this.chatRef, orderBy("time", "desc"), limit(l));
  }

  getLista(tabella: tabelleFirebase) {
    return collection(this.firestore, tabella);
  }

  updateTabellaPresenze(presente: boolean, player: playerFirebase) {
    const ref = doc(this.firestore, 'tabella-presenze/' + player);
    return updateDoc(ref, { presente: presente });
  }

  getPresenzaByID(id: playerFirebase) {
    const bookRef = doc(this.firestore, 'tabella-presenze/' + id);
    return docData(bookRef, { idField: 'id' }) as Observable<TabellaPresenze>;
  }

}