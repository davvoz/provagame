import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuplaPossibile, UtenteOnline, UtenteParam } from 'src/app/classes/utils/costants.enum';
import { Utilities } from 'src/app/classes/utils/utilities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements UtenteParam {

  utente: UtenteOnline = {
    cognome: '',
    nome: '',
    progressivo: 0,
    registrered: new Date()
  };
  azione = '';

  constructor(public fservice: FirebaseService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      if (params['azione'] === 'modifica') {
        this.utente.nome = params['nome'];
        this.utente.cognome = params['cognome'];
        this.utente.registrered = params['registrered'];
        this.utente.progressivo = params['progressivo'];
        this.azione = params['azione'];
      } else {
        this.azione = 'inserisci';
      }
    });
  }


  submit() {
    if (this.azione === 'inserisci') {
      this.fservice.getProgressivo('utenti').then(
        (res) => {
          const tupla: TuplaPossibile = {
            dato: {
              nome: this.utente.nome,
              cognome: this.utente.cognome,
              registrered: new Date(),
              progressivo: res + 1,
            }, tabella:
              'utenti'
          }
          this.fservice.addItem(tupla, (res + 1) + '');
          this.fservice.updateProgressivi(res + 1, 'utenti');
          this.router.navigate(['/mgame']);
        }
      )
    } else {
      this.fservice.updateUtente(this.utente);
      this.router.navigate(['/mgame']);
    }

  }

  random() {
    this.utente.cognome = Utilities.conomeRandomico();
    this.utente.nome = Utilities.nomeRandomico()
  }
}
