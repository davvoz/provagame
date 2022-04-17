import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, orderBy, limit, doc, updateDoc, docData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {  playerFirebase, TabellaPresenze, tabelleFirebase, TuplaPossibile } from '../classes/utils/costants.enum';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) { }

  addItem(tupla: TuplaPossibile) {
    return addDoc(collection(this.firestore, tupla.tabella), tupla.dato);
  }

  getListaOrdinataChat(l: number) {
    return query(collection(this.firestore, "chates"), orderBy("time", "desc"), limit(l));
  }

  getLista(tabella: tabelleFirebase) {
    return collection(this.firestore, tabella);
  }

  updateTabellaPresenze(presente: boolean, player: playerFirebase) {
    return updateDoc(doc(this.firestore, 'tabella-presenze/' + player), { presente: presente });
  }

  getPresenzaByID(id: playerFirebase) {
    return docData(doc(this.firestore, 'tabella-presenze/' + id), { idField: 'id' }) as Observable<TabellaPresenze>;
  }
  
  getMessageByID(id: string ) {
    return docData(doc(this.firestore, 'chates/' + id), { idField: 'id' }) as Observable<Object>;
  }

}