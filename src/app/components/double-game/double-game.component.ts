import { AfterViewInit, Component } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirePlayer, FireTris, tipoProgressivi } from 'src/app/classes/utils/costants.enum';
import { Utilities } from 'src/app/classes/utils/utilities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-double-game',
  templateUrl: './double-game.component.html',
  styleUrls: ['./double-game.component.css']
})
export class DoubleGameComponent implements AfterViewInit {
  players!: Observable<FirePlayer[]>;
  tris!: Observable<FireTris[]>;
  nome = 'Default_name';
  nomeDafireBase = '';
  numeroAiDadiPlayer = 0;
  numeroAiDadiAvversario = 0;
  haiScelto = false;
  haScelto = false;
  ciSonoTutti = false;
  tuttiHannoScelto = false;
  isNumeropGenerato = false;
  isStarted = false;
  isTuoTurno = false;
  matrice !: FireTris;
  playerScelto: FirePlayer = Utilities.getDefaultFirePlayer(1);
  nemicoScelto: FirePlayer = Utilities.getDefaultFirePlayer(1);
  listaPlayers: FirePlayer[] = [];

  hannoTiratoTutti = false;
  haVintoIlPlayer = false;
  haVintoIlNemico = false;
  fatto = false;
  isPartitaFinita = false;
  risultato='ancora nessun risultato';
  constructor(public fservice: FirebaseService) { }

  ngAfterViewInit(): void {
    this.matrice = {
      uno: [' ', ' ', ' '],
      due: [' ', ' ', ' '],
      tre: [' ', ' ', ' '],
      giocaIlNumero: 0
    }
    this.fservice.updateTris({
      uno: this.matrice.uno,
      due: this.matrice.due,
      tre: this.matrice.tre,
      giocaIlNumero: 0
    });
    // @ts-ignore
    this.tris = collectionData(this.fservice.getLista('matrici'));
    this.tris.subscribe(
      (res) => {
        this.matrice = res[0];
        if (this.checkVittoria(this.getFirebaseSymbol(this.nemicoScelto))) {
          this.isPartitaFinita = true;
          this.risultato = 'Hai perso';
        }
      }
    );

    // @ts-ignore
    this.players = collectionData(this.fservice.getLista('players'));
    this.players.subscribe(
      (arr) => {
        arr.forEach(
          (el) => {
            this.setCiSonoTutti(el);
            this.checkDadi();
          }
        );
        if (this.hannoTiratoTutti && !this.fatto) {
          this.fservice.updateTris({
            uno: this.matrice.uno,
            due: this.matrice.due,
            tre: this.matrice.tre,
            giocaIlNumero: this.haVintoIlPlayer ? this.playerScelto.progressivo : this.nemicoScelto.progressivo
          });
          this.fatto = true;
        }
      }
    );
  }

  private setCiSonoTutti(el: FirePlayer) {
    if (el.scelto && el.progressivo !== this.playerScelto.progressivo) {
      this.haScelto = true;
      if (this.haScelto && this.haiScelto) {
        this.ciSonoTutti = true;
        this.nemicoScelto = el;
      }
    }
  }

  private checkDadi() {
    if (this.playerScelto.numeroAiDadi > 0 && this.nemicoScelto.numeroAiDadi > 0) {
      this.hannoTiratoTutti = true;
      if (this.playerScelto.numeroAiDadi > this.nemicoScelto.numeroAiDadi) {
        this.haVintoIlPlayer = true;
      }
      if (this.playerScelto.numeroAiDadi < this.nemicoScelto.numeroAiDadi) {
        this.haVintoIlNemico = true;
      }
    }
  }

  registraPlayer(player: FirePlayer) {
    if (this.nome.startsWith('Default_name')) {
      this.nome = Utilities.nomeRandomico() + ' ' + Utilities.conomeRandomico();
    }
    player.nome = this.nome;
    player.scelto = true;
    player.pronto = false;
    this.fservice.updatePlayers(this.getFirebaseName(player), player);
    this.fservice.getPlayer(this.getFirebaseName(player)).then(
      (res) => {
        this.playerScelto = res;
        this.haiScelto = true;
      }
    )
  }

  resetPlayer(player: FirePlayer) {
    this.fservice.updatePlayers(this.getFirebaseName(player), Utilities.getDefaultFirePlayer(player.progressivo));
    this.haiScelto = false;
  }

  private getFirebaseName(player: FirePlayer): tipoProgressivi {
    return player.progressivo === 1 ? 'player-one' : 'player-two';
  }

 getFirebaseSymbol(player: FirePlayer) {
    return player.progressivo === 1 ? 'X' : 'O';

  }

  resetPlayers() {
    this.fservice.updatePlayers('player-one', Utilities.getDefaultFirePlayer(1));
    this.fservice.updatePlayers('player-two', Utilities.getDefaultFirePlayer(1));
    this.haiScelto = false;
  }

  sonoPronto() {
    this.playerScelto.pronto = true;
    this.fservice.updatePlayers(this.getFirebaseName(this.playerScelto), this.playerScelto).then(
      (res) => {
        this.playerScelto = res;
      }
    );
  }

  updateNumeroAiDadi() {
    this.isNumeropGenerato = true;
    this.playerScelto.numeroAiDadi = Utilities.getSecureRandom(1000) + 1;
    this.fservice.updatePlayers(this.getFirebaseName(this.playerScelto), this.playerScelto).then(
      (res) => {
        this.playerScelto = res;

      }
    );
  }

  readyGo() {
    this.isStarted = true;
  }

  sceltoQuestoQuadrato(i: number, j: number) {
    if (!this.isPartitaFinita) {
      const simbolo = this.getFirebaseSymbol(this.playerScelto);
      switch (i) {
        case 0:
          if (this.matrice.uno[j] !== simbolo) {
            this.matrice.uno[j] = simbolo;
          }
          break;
        case 1: if (this.matrice.due[j] !== simbolo) {
          this.matrice.due[j] = simbolo;
        }
          break;
        case 2: if (this.matrice.tre[j] !== simbolo) {
          this.matrice.tre[j] = simbolo;
        }
          break;
      }
      this.fservice.updateTris({
        uno: this.matrice.uno,
        due: this.matrice.due,
        tre: this.matrice.tre,
        giocaIlNumero: this.nemicoScelto.progressivo
      }).then(
        (res) => {
          this.matrice = res;
          if (this.checkVittoria(simbolo)) {
            this.isPartitaFinita = true;
            this.risultato = 'Hai vinto';
          }
        }
      );
    }
  }

  private checkVittoria(simbolo: string): boolean {
    const condizioneOrizzontale = this.checkTrisOrizzontale(simbolo, this.matrice.uno) ||
      this.checkTrisOrizzontale(simbolo, this.matrice.due) ||
      this.checkTrisOrizzontale(simbolo, this.matrice.tre);
    return this.checkTrisObliquo(simbolo) || this.checkTrisVerticale(simbolo) || condizioneOrizzontale;
  }

  private checkTrisObliquo(simbolo: string): boolean {
    return (this.matrice.uno[2] === simbolo && this.matrice.due[1] === simbolo && this.matrice.tre[0] === simbolo) ||
      (this.matrice.uno[0] === simbolo && this.matrice.due[1] === simbolo && this.matrice.tre[2] === simbolo);
  }

  private checkTrisVerticale(simbolo: string): boolean {
    return (this.matrice.uno[0] === simbolo && this.matrice.due[0] === simbolo && this.matrice.tre[0] === simbolo) ||
      (this.matrice.uno[1] === simbolo && this.matrice.due[1] === simbolo && this.matrice.tre[1] === simbolo) ||
      (this.matrice.uno[2] === simbolo && this.matrice.due[2] === simbolo && this.matrice.tre[2] === simbolo)
  }

  private checkTrisOrizzontale(simbolo: string, array: any[]): boolean {
    if (array[0] === simbolo && array[1] === simbolo && array[2] === simbolo) {
      return true
    }
    return false;
  }

  resetGame() {
    this.isPartitaFinita = false;
    this.matrice = {
      uno: [' ', ' ', ' '],
      due: [' ', ' ', ' '],
      tre: [' ', ' ', ' '],
      giocaIlNumero: 0
    }
    this.fservice.updateTris({
      uno: this.matrice.uno,
      due: this.matrice.due,
      tre: this.matrice.tre,
      giocaIlNumero: this.nemicoScelto.progressivo
    });
  }
}
