import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/elements/bonus';
import { Mago } from './classes/charters/mago';
import { Utilities } from './classes/utils/utilities';
import { classe, direzione, FinalState } from './classes/utils/costants.enum';
import { Gui } from './classes/elements/gui';
import { Mondo } from './classes/elements/mondo';
import { Guerriero } from './classes/charters/guerriero';
import { Bullo } from './classes/charters/bullo';
import { Samurai } from './classes/charters/samurai';
import { Proiettile } from './classes/elements/proiettile';
import { Charter } from './classes/abstract/charter';
export enum KEY_CODE {
  UP_ARROW = 87,
  DOWN_ARROW = 83,
  RIGHT_ARROW = 68,
  LEFT_ARROW = 65,
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.player) {
      if (!this.player.isMorto ) {
        if (event.keyCode == KEY_CODE.DOWN_ARROW || event.keyCode == 40) {
          this.player.setVelocita(0.1);
          this.player.setDirection('BOTTOM');
        }
        if (event.keyCode == KEY_CODE.UP_ARROW || event.keyCode == 38) {
          this.player.setVelocita(0.1);
          this.player.setDirection('TOP');
        }
        if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == 37) {
          this.player.setVelocita(0.1);
          this.player.setDirection('LEFT');
        }
        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == 39) {
          this.player.setVelocita(0.1);
          this.player.setDirection('RIGHT');
        }
        if (event.keyCode == 49 && this.player.pozioni.length > 0) {//1 consuma pozione 1
          this.player.pozioneCounter.attiva();
          this.player.pozioni.pop();
          this.gui.pozioniBottoni[0].svuotaCasella();
        }
        if (event.keyCode == 50 && this.player.pozioni.length > 0) {//2 consuma pozione 2
          this.player.pozioneCounter.attiva();
          this.player.pozioni.pop();
          this.gui.pozioniBottoni[1].svuotaCasella();
        }
        if (event.keyCode == 51 && this.player.pozioni.length > 0) {//3 consuma pozione 3
          this.player.pozioneCounter.attiva();
          this.player.pozioni.pop();
          this.gui.pozioniBottoni[2].svuotaCasella();
        }
        if (event.keyCode == 52 && this.gui.scudoButton.getIsScudoPresente()) {//4 consuma scudo
          this.gui.scudoButton.attivaScudo(this.player);
        }
        if (event.keyCode == 53) {//5 compra bonus
          if (this.player.parametriFantasy.money > 0) {
            this.bonus = [];
            this.bonus = Utilities.createBonusArray(3, this.ctx);
            this.player.parametriFantasy.money -= 20;
          }
        }
        if (event.keyCode == 54) {//6 aumenta livello
          if (this.player.parametriFantasy.money > 500 * this.player.parametriFantasy.livello) {
            this.player.incrementaLivello();
            this.player.parametriFantasy.money -= 500 * this.player.parametriFantasy.livello;
          }
        }
        if (event.keyCode == 80) {//P = pause
          this.isPause ? (this.isPause = false, this.animate()) : this.isPause = true;
        }
        if (event.keyCode == 32) {//space lancia qualcosa
          this.player.lanciaOggetto();
          this.proiettile = new Proiettile(this.ctx, 'white', this.player.getX(), this.player.getY(), this.player.classe);
          this.proiettile.setDirection(this.player.getDirection());
          this.proiettile.setVelocita(0.9);
        }
      }
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyEventMu(event: KeyboardEvent) {
    if (this.player) {
      if (event.keyCode == KEY_CODE.DOWN_ARROW || event.keyCode == 40) {
        this.player.setVelocita(0);
      }
      if (event.keyCode == KEY_CODE.UP_ARROW || event.keyCode == 38) {
        this.player.setVelocita(0);
      }
      if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == 37) {
        this.player.setVelocita(0);
      }
      if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == 39) {
        this.player.setVelocita(0);
      }
    }
  }
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  counterAnimationProiettile= 0;
  mn= 0;//indice mondi mn = mondo numero
  dieCount= 0;
  counterRoutine = 0;
  counterAnimation = 0;
  isStarted = false;
  aggiungiPozioneAdArray = false;
  giaInvolo = false;//oggetto gia in volo
  isfinalStatesInc = false;
  isTesoroRaccolto = false;
  isScudoRaccolto = false;
  isFaseScelta = true;
  isPause = false;
  isFromStart = false;
  m: Mondo[] = [];
  proiettile!: Proiettile;
  direzioneProiettile: direzione = 'STAND';
  gui!: Gui;
  ctx!: CanvasRenderingContext2D;
  player!: Charter;
  bonus: Bonus[] = [];
  bonusCount = 0;
  finalStates: FinalState[] = [];//sintesi finale matches
  constructor(private ngZone: NgZone) { }

  animate(): void {
    if (!this.isPause) {
      requestAnimationFrame(this.animate.bind(this));
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isFaseScelta) {
      if (this.m.length > this.mn) {
        this.m[this.mn].aggiorna();
        this.collisionDetenction();
        this.update();
      }
    }
    this.gui.aggiornaGui(this.mn, this.player, this.counterAnimation, this.isFaseScelta);
    //velocità animazione ogni n frame
    if (this.counterRoutine % 8 == 0) {
      //step animazione 
      this.counterAnimation === 3
        ? (this.counterAnimation = 0)
        : this.counterAnimation++;
    }
    if (this.counterRoutine % 2 == 0) {
      //step animazione 
      this.counterAnimationProiettile === 3
        ? (this.counterAnimationProiettile = 0)
        : this.counterAnimationProiettile++;
    }
    this.counterRoutine === 399
      ? (this.counterRoutine = 0)
      : this.counterRoutine++;
  }

  collisionDetenction() {
    this.dieCount = 0;
    //rilevo collisione player vs enemies[]
    for (let i = 0; i < this.m[this.mn].enemies.length; i++) {
      this.m[this.mn].enemies[i].counterAnimation = this.counterAnimation;
      if (!this.player.isMorto
        && !this.m[this.mn].enemies[i].isMorto
        && Utilities.rectsColliding(this.m[this.mn].enemies[i], this.player)) {
        //il + agile attacca per primo
        if (this.player.parametriFantasy.agilita >= this.m[this.mn].enemies[i].parametriFantasy.agilita) {
          Utilities.algoAttack(this.player, this.m[this.mn].enemies[i]);
          Utilities.algoAttack(this.m[this.mn].enemies[i], this.player);
        } else {
          Utilities.algoAttack(this.m[this.mn].enemies[i], this.player);
          Utilities.algoAttack(this.player, this.m[this.mn].enemies[i]);
        }
        this.player.isOnAttack = true;
        this.m[this.mn].enemies[i].isOnAttack = true;
        this.m[this.mn].enemies[i].stand();
      } else {
        this.player.isOnAttack = false;
        this.player.stato = 'camminando';
        this.m[this.mn].enemies[i].isOnAttack = false;
        this.m[this.mn].enemies[i].stato = 'camminando';

        //se è rimasto vivo controllo se si contra con il proiettile
        if (this.proiettile && Utilities.rectsColliding(this.m[this.mn].enemies[i], this.proiettile)) {
          this.m[this.mn].enemies[i].incrementaSalute(-100 * this.player.parametriFantasy.livello);
          this.ctx.strokeStyle = 'red';
          this.ctx.strokeRect(this.m[this.mn].enemies[i].getX() + 10, this.m[this.mn].enemies[i].getY() + 10, 30, 30);
          this.proiettile.lanciaAbilita(this.m[this.mn].enemies[i]);
          //se muore mgli rubo i soldi
          if (this.m[this.mn].enemies[i].isMorto && this.m[this.mn].enemies[i].parametriFantasy.money > 0) {
            this.player.rubaSoldiA(this.m[this.mn].enemies[i]);
            this.player.exp = this.player.exp + this.player.parametriFantasy.livello * this.m[this.mn].enemies[i].parametriFantasy.livello * 100;
          }
        }
        if (!this.m[this.mn].enemies[i].isMorto) {
          if(this.m[this.mn].enemies[i].malefici.stunned.totTurni > 0){
            //se è stunnato lo stando
            this.m[this.mn].enemies[i].setDirection('STAND');
            Utilities.directionToMoveSwitch(this.m[this.mn].enemies[i]);
          }else{
            Utilities.charterMovmentRandomRoutine(this.m[this.mn].enemies[i], this.counterRoutine, 20);

          }
        }
      }

      if (this.m[this.mn].enemies[i].isMorto) {
        this.dieCount++;
      }
    }

    //rilevo collisione player vs camion
    if (Utilities.rectsColliding(this.player, this.m[this.mn].camion)) {
      this.player.incrementaSalute(-(500 * this.mn));
      if (this.player.getSalute() <= 0) {
        this.player.isMorto = true;
      }
    }

    this.bonusCount = 0;
    //rilevo collisione player vs bonus[]
    for (let j = 0; j < this.bonus.length; j++) {
      this.bonus[j].stand();
      if (this.bonus[j].getPlafond() > 0) {
        if (Utilities.rectsColliding(this.bonus[j], this.player)) {
          this.player.incrementaSalute(this.bonus[j].getQuantita() * this.player.parametriFantasy.livello);
          this.bonus[j].setPlafond(this.bonus[j].getPlafond() - this.bonus[j].getQuantita());
        }
      }
      this.bonusCount += this.bonus[j].getPlafond();
    }

    //rilevo collisione player vs pozione
    if (Utilities.rectsColliding(this.player, this.m[this.mn].pozione)) {
      this.player.pozioni.push(this.m[this.mn].pozione);
      for (let i = 0; i < this.gui.pozioniBottoni.length; i++) {
        if (!this.gui.pozioniBottoni[i].isCasellaPiena && !this.aggiungiPozioneAdArray) {
          this.gui.pozioniBottoni[i].riempiCasella();
          this.aggiungiPozioneAdArray = true;
          Utilities.setRandomXY(this.m[this.mn].pozione);
          break;
        }
      }
    } else {
      this.aggiungiPozioneAdArray = false;
    }
    //rilevo collisione player vs tesoro
    if ((!this.isTesoroRaccolto && Utilities.rectsColliding(this.player, this.m[this.mn].tesoro)) && //
      ((this.mn % 3 == 0 && (this.mn % 3 == 0 || this.isTesoroRaccolto == false)))) {
      this.player.parametriFantasy.money += this.m[this.mn].tesoro.money;
      Utilities.setRandomXY(this.m[this.mn].tesoro);
      this.isTesoroRaccolto = true;
    }
    if (this.mn % 3 != 0) {
      this.isTesoroRaccolto = false;
    }
    //rilevo collisione player vs scudo
    if (!this.isScudoRaccolto && Utilities.rectsColliding(this.player, this.m[this.mn].scudoBonus)) {
      this.gui.scudoButton.riempiScudo();
      this.isScudoRaccolto = true;
      Utilities.setRandomXY(this.m[this.mn].scudoBonus);
    }
  }

  update() {
    if (this.player.isOggettoInvolo && !this.giaInvolo) {
      this.giaInvolo = true;
      this.proiettile = new Proiettile(this.ctx, 'white', this.player.getX(), this.player.getY(), this.player.classe);
      this.proiettile.setDirection(this.player.getDirection());
      this.proiettile.setVelocita(0.1);
    }
    if (this.giaInvolo) {

      this.proiettile.counterAnimation = this.counterAnimationProiettile;

      Utilities.directionToMoveSwitch(this.proiettile);
      if (this.proiettile.getX() > 20 || this.proiettile.getX() < -20 || this.proiettile.getY() > 20 || this.proiettile.getY() < -20) {
        this.giaInvolo = false;
        this.player.isOggettoInvolo = false;
      }
    }

    if (!this.isScudoRaccolto) {
      this.m[this.mn].scudoBonus.stand();
    }
    if (this.isScudoRaccolto && !this.gui.scudoButton.getIsScudoPresente()) {
      this.isScudoRaccolto = false;
      this.m[this.mn].scudoBonus.stand();
    }
    if (this.mn % 3 == 0 && (this.mn % 3 == 0 || this.isTesoroRaccolto == false)) {
      !this.isTesoroRaccolto ? this.m[this.mn].tesoro.stand() : null;
    }
    this.ctx.fillStyle = 'black';
    if (this.dieCount != 0 && this.dieCount == this.m[this.mn].enemies.length && !this.player.isMorto) {
      this.dieCount = 0;
      this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.parametriFantasy.livello);
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(this.mn, this.ctx);
      this.mn++;
      this.m[this.mn].inizialize(this.ctx);
    }
    this.player.malefici.stunned.totTurni > 0 ? this.player.stand() : Utilities.directionToMoveSwitch(this.player);;
    
    this.m[this.mn].camion.setCamion();
    if (this.player.isMorto) {
      this.isFaseScelta = true;
      this.gui.isRestartTouched = false;
      this.gui.counterAnimationDieText = 0;
      this.isScudoRaccolto = false;
      if (!this.isfinalStatesInc && this.player.isMorto) {
        this.finalStates.push(
          {
            livelloPersonaggio: this.player.parametriFantasy.livello,
            livelloSchema: this.mn,
            money: this.player.parametriFantasy.money,
            classe: this.player.classe,
            numeroSchivate: this.player.sintesiDati.numeroSchivate,
            numeroAttacchi: this.player.sintesiDati.numeroAttacchi,
            ratio: this.player.sintesiDati.numeroAttacchi / this.player.sintesiDati.numeroSchivate
          }
        );
        this.isfinalStatesInc = true;
      }
      this.mn = 0;
    }
    this.player.counterAnimation = this.counterAnimation;
  }

  ngAfterViewInit(): void {
    const res = this.canvasGui.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2d context');
    }
    this.ctx = res;
    this.gui = new Gui(this.ctx);
    for (let i = 1; i < 50; i++) {
      for (let j = 1; j < 6; j++) {
        this.m.push(new Mondo({ livelloNemici: i * j, numeroNemici: j, velocitaCamion: 0.1, id: i }))
      }
    }
    //#region Eventi click canvas
    this.ctx.canvas.addEventListener(
      'click',
      (evt) => {
        for (let i = 0; i < this.gui.sceltaCharter.length; i++) {
          const scegliCharterButtonTouched = Utilities.changeButtonState(evt, this.gui.sceltaCharter[i], this.ctx);
          if (scegliCharterButtonTouched) {
            this.gui.classeCharterScelto = this.gui.sceltaCharter[i].typeOfCharter;
          }
          if (this.gui.classeCharterScelto && !this.isStarted) {
            const startButtonTouched = Utilities.changeButtonState(evt, this.gui.startButton, this.ctx);
            if (startButtonTouched) {
              switch (this.gui.classeCharterScelto) {
                case 'BULLO': this.player = new Bullo(this.ctx, 'green', 1); this.startGame(); break;
                case 'MAGO': this.player = new Mago(this.ctx, 'blue', 1); this.startGame(); break;
                case 'GUERRIERO': this.player = new Guerriero(this.ctx, 'pink', 1); this.startGame(); break;
                case 'SAMURAI': this.player = new Samurai(this.ctx, 'yellow', 1); this.startGame(); break;
              }
              this.isStarted = true;
              this.gui.classeCharterScelto = 'ABSTRACT';
            }
          }
        }
        if (this.player) {
          if (this.player.isMorto) {
            const restartButtonTouched = Utilities.changeButtonState(evt, this.gui.restartButton, this.ctx);
            if (restartButtonTouched) {
              this.isFromStart = true;
              this.isFaseScelta = true;
              this.gui.isRestartTouched = true;
              this.gui.classeCharterScelto = 'ABSTRACT';
              this.mn = 1;
              this.player.parametriFantasy.money = 0;
              this.isStarted = false;
              this.m[this.mn].enemies
            }
          }
        }
        if (!this.isFaseScelta) {//se non sono nella prima fase non servono gli handler ai bottoni di gioco e alla pausa

          const incrementaLivelloButtonTouched = Utilities.changeButtonState(evt, this.gui.incrementaLivelloButton, this.ctx);
          if (incrementaLivelloButtonTouched && this.player.parametriFantasy.money > 0) {
            if (this.player.parametriFantasy.money > 100 * this.player.parametriFantasy.livello) {
              this.player.incrementaLivello();
              this.player.parametriFantasy.money -= 100 * this.player.parametriFantasy.livello;
            }
          }

          const compraBonusTouched = Utilities.changeButtonState(evt, this.gui.compraBonus, this.ctx);
          if (compraBonusTouched && this.player.parametriFantasy.money > 0) {
            this.bonus = [];
            this.bonus = Utilities.createBonusArray(3, this.ctx);
            this.player.parametriFantasy.money -= 20;
          }

          for (let i = 0; i < this.gui.pozioniBottoni.length; i++) {
            const bottonPozioneButtonTouched = Utilities.changeButtonState(evt, this.gui.pozioniBottoni[i], this.ctx);
            if (bottonPozioneButtonTouched && this.player.pozioni.length > 0) {
              this.player.pozioneCounter.attiva();
              this.player.pozioni.pop();
              this.gui.pozioniBottoni[i].svuotaCasella();
            }
          }

          const compraScudoTouched = Utilities.changeButtonState(evt, this.gui.scudoButton, this.ctx);
          if (compraScudoTouched) {
            this.gui.scudoButton.attivaScudo(this.player);
          }

          const attivaPauseTouched = Utilities.changeButtonState(evt, this.gui.pauseButton, this.ctx);
          if (attivaPauseTouched) {
            this.isPause ? (this.isPause = false, this.animate()) : this.isPause = true;
          }

        }
      },
      false
    );
    //#endregion
    if (this.isFaseScelta) {
      this.ngZone.runOutsideAngular(() => this.animate());
    }

  }

  startGame() {
    this.isFaseScelta = false;
    this.gui.isRestartTouched = false;
    this.gui.counterAnimationDieText = 0;
    this.isScudoRaccolto = false;
    this.mn = 1;
    this.m[this.mn].inizialize(this.ctx);
    this.player.setX(2);
    this.player.setY(2);
    this.player.setVelocita(0.9);
    this.player.name = Utilities.nomeRandomico();
    this.player.posizioneInfoLabelX = 30;
    this.player.posizioneInfoLabelY = 700;
    this.player.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7];
    this.player.dannoCritico = 150;
    this.player.counterForCriticoTreshold = 6;
    this.player.isMorto = false;
    this.player.parametriFantasy.money = 2000;
    this.player.isPlayer = true;
    this.player.stand();
    this.m[this.mn].startSchema();
    this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.parametriFantasy.livello);
    this.isfinalStatesInc = false;

  }
}
