import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, orderBy, limit, doc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { playerFirebase, TabellaPresenze, tabelleFirebase, TuplaPossibile } from '../classes/utils/costants.enum';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  chatRef = collection(this.firestore, "chates");
  constructor(private firestore: Firestore) { }

  addItem(tupla: TuplaPossibile) {
    return addDoc(collection(this.firestore, tupla.tabella), tupla.dato);
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