import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, limit, doc, docData, deleteDoc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tabelleFirebase, tipoProgressivi, TuplaPossibile, UtenteOnline } from '../classes/utils/costants.enum';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) { }

  async getProgressivo(id: string): Promise<number> {
    const docRef = doc(this.firestore, "progressivi", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()['progressivo'];
    } else {
      throw new Error();
    }
  }

  addItem(tupla: TuplaPossibile, id: string) {
    return setDoc(doc(this.firestore, tupla.tabella, id), tupla.dato);
  }

  updateProgressivi(nuovoProgressivo: number, tp: tipoProgressivi) {
    const ref = doc(this.firestore, "progressivi", tp);
    updateDoc(ref, {
      progressivo: nuovoProgressivo
    });
  }
  updateUtente(utente: UtenteOnline) {
    const ref = doc(this.firestore, "utenti", utente.progressivo + '');
    updateDoc(ref, {
      nome: utente.nome,
      cognome: utente.cognome
    });
  }
  getListaOrdinataChat(l: number) {
    return query(collection(this.firestore, 'chates'), orderBy('time', 'desc'), limit(l));
  }

  getListaOrdinataUtenti() {
    return query(collection(this.firestore, 'utenti'), orderBy('progressivo', 'desc'));
  }

  getLista(tabella: tabelleFirebase) {
    return collection(this.firestore, tabella);
  }

  getMessageByID(id: string) {
    return docData(doc(this.firestore, 'chates/' + id), { idField: 'id' }) as Observable<Object>;
  }

  deleteItem(tabella: tabelleFirebase, id: string) {
    deleteDoc(doc(this.firestore, tabella + '/' + id));
  }
}