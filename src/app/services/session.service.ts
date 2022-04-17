import { Injectable } from '@angular/core';
import { UtenteOnline } from '../classes/utils/costants.enum';
import { Utilities } from '../classes/utils/utilities';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  utente!: UtenteOnline;

  constructor() {
    this.utente = {
      nome: Utilities.nomeRandomico() ,
      cognome:Utilities.conomeRandomico(),
      registrered: new Date()
    }
  }
}
