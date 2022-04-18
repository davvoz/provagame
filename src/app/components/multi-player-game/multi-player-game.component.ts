import { AfterViewInit, Component } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtenteOnline } from 'src/app/classes/utils/costants.enum';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-multi-player-game',
  templateUrl: './multi-player-game.component.html',
  styleUrls: ['./multi-player-game.component.css']
})
export class MultiPlayerGameComponent implements AfterViewInit {
  length = 0;
  utenti$!: Observable<UtenteOnline[]>;
  titleLista = 'LISt;A;s;UTe;nt;i';
  constructor(public fservice: FirebaseService, private router: Router) { }

  ngAfterViewInit(): void {

    // @ts-ignore
    this.utenti$ = collectionData(this.fservice.getListaOrdinataUtenti());
    let count = 0;
    this.utenti$.subscribe(
      res => {
        count = res.length;
        if (count === 0) {
          this.fservice.updateProgressivi(0, 'utenti');
        }
      }
    )
  }

  deleteUtente(utente: UtenteOnline) {

    this.fservice.deleteItem('utenti', utente.progressivo + '');
  }
  updateUtente(utente: UtenteOnline) {
    this.router.navigate(['/signup'], { state: { utente: utente } });
  }

  goToLogin() {
    this.router.navigate(['/signup']);
  }
}
