import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/elements/bonus';
import { Charter } from './classes/abstract/charter';
import { Mago } from './classes/charters/mago';
import { Utilities } from './classes/utils/utilities';
import { classe, FinalState } from './classes/utils/costants.enum';
import { Gui } from './classes/elements/gui';
import { Mondo } from './classes/elements/mondo';
import { Guerriero } from './classes/charters/guerriero';
import { Arcere } from './classes/charters/arcere';
import { Samurai } from './classes/charters/samurai';
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
      if (!this.player.isMorto && !this.isJustColliding) {
        if (event.keyCode == KEY_CODE.DOWN_ARROW || event.keyCode == 40) {
          this.player.setVelocita(this.player.maxVelo);
          this.player.setDirection('BOTTOM');
        }
        if (event.keyCode == KEY_CODE.UP_ARROW || event.keyCode == 38) {
          this.player.setVelocita(this.player.maxVelo);
          this.player.setDirection('TOP');
        }
        if (event.keyCode == KEY_CODE.LEFT_ARROW || event.keyCode == 37) {
          this.player.setVelocita(this.player.maxVelo);
          this.player.setDirection('LEFT');
        }
        if (event.keyCode == KEY_CODE.RIGHT_ARROW || event.keyCode == 39) {
          this.player.setVelocita(this.player.maxVelo);
          this.player.setDirection('RIGHT');
        }
        if (event.keyCode == 32) {//space compra bonus
          if (this.player.money > 0) {
            this.bonus = [];
            this.bonus = Utilities.createBonusArray(3, this.ctx);
            this.player.money -= 20;
          }
        }
        if (event.keyCode == 49 && this.player.pozioni.length > 0) {//1 consuma pozione 1
          this.player.isPozioneAntiCambioStatiAttivato = true;
          this.player.pozioni.pop();
          this.gui.pozioniBottoni[0].svuotaCasella();
        }
        if (event.keyCode == 50 && this.player.pozioni.length > 0) {//2 consuma pozione 2
          this.player.isPozioneAntiCambioStatiAttivato = true;
          this.player.pozioni.pop();
          this.gui.pozioniBottoni[1].svuotaCasella();
        }
        if (event.keyCode == 51 && this.player.pozioni.length > 0) {//2 consuma pozione 3
          this.player.isPozioneAntiCambioStatiAttivato = true;
          this.player.pozioni.pop();
          this.gui.pozioniBottoni[2].svuotaCasella();
        }
        if (event.keyCode == 51 && this.gui.scudoButton.getIsScudoPresente()) {//4 consuma scudo
          this.gui.scudoButton.attivaScudo(this.player);
        }
        if (event.keyCode == 13) {//invio aumenta livello
          if (this.player.money > 500 * this.player.livello) {
            this.player.incrementaLivello();
            this.player.money -= 500 * this.player.livello;
          }
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
  isMagoScelto: boolean = false;
  livelloSchema: number = 0;
  aggiungiPozioneAdArray = false;
  dieCount: number = 0;
  gui!: Gui;
  typeOfPersonaggioSCelto !: classe;
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  player!: Mago;
  counterRoutine = 0;
  counterAnimation = 0;
  isCharterColliding = false;
  bonus: Bonus[] = [];
  bonusCount = 0;
  isStarted = false;
  isJustColliding = false;
  finalStates: FinalState[] = [];
  isfinalStatesInc = false;
  //tesoro!: Treasure;
  isTesoroRaccolto = false;
  isScudoRaccolto = false;
  isFaseScelta = true;
  isPause = false;
  mondi: Mondo[] = [];
  isFromStart = false;
  constructor(private ngZone: NgZone) { }

  animate(): void {
    if (!this.isPause) {
      requestAnimationFrame(this.animate.bind(this));
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isFaseScelta) {
      if (this.mondi.length > this.livelloSchema) {
        this.mondi[this.livelloSchema].aggiorna(this.livelloSchema);
        this.collisionDetenction();
        this.update();
      }
    }
    this.gui.aggiornaGui(this.livelloSchema, this.player, this.counterAnimation, this.isFaseScelta);

    //velocità animazione ogni n frame
    if (this.counterRoutine % 8 == 0) {
      //step animazione 
      this.counterAnimation === 3
        ? (this.counterAnimation = 0)
        : this.counterAnimation++;
    }
    this.counterRoutine === 399
      ? (this.counterRoutine = 0)
      : this.counterRoutine++;
  }

  collisionDetenction() {
    this.dieCount = 0;
    //rilevo collisione player vs enemies[]
    for (let i = 0; i < this.mondi[this.livelloSchema].enemies.length; i++) {
      this.mondi[this.livelloSchema].enemies[i].counterAnimation = this.counterAnimation;
      if (!this.player.isMorto
        && !this.mondi[this.livelloSchema].enemies[i].isMorto
        && Utilities.rectsColliding(this.mondi[this.livelloSchema].enemies[i], this.player)) {
        if (this.player.agilita >= this.mondi[this.livelloSchema].enemies[i].agilita) {
          Utilities.algoAttack(this.player, this.mondi[this.livelloSchema].enemies[i]);
          Utilities.algoAttack(this.mondi[this.livelloSchema].enemies[i], this.player);
        } else {
          Utilities.algoAttack(this.mondi[this.livelloSchema].enemies[i], this.player);
          Utilities.algoAttack(this.player, this.mondi[this.livelloSchema].enemies[i]);
        }
        this.player.isOnAttack = true;
        this.mondi[this.livelloSchema].enemies[i].isOnAttack = true;
        this.mondi[this.livelloSchema].enemies[i].stand();
      } else {
        this.player.isOnAttack = false;
        this.player.stato = 'camminando';
        this.mondi[this.livelloSchema].enemies[i].isOnAttack = false;
        this.mondi[this.livelloSchema].enemies[i].stato = 'camminando';
        if (!this.mondi[this.livelloSchema].enemies[i].isMorto) {
          Utilities.charterMovmentRandomRoutine(this.mondi[this.livelloSchema].enemies[i], this.counterRoutine, 20);
        }
      }
      if (this.mondi[this.livelloSchema].enemies[i].isMorto) {
        this.dieCount++;
      }
    }

    //rilevo collisione player vs camion
    if (Utilities.rectsColliding(this.player, this.mondi[this.livelloSchema].camion)) {
      this.player.incrementaSalute(-(500 * this.livelloSchema));
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
          this.player.incrementaSalute(this.bonus[j].getQuantita() * this.player.livello);
          this.bonus[j].setPlafond(this.bonus[j].getPlafond() - this.bonus[j].getQuantita());
        }
      }
      this.bonusCount += this.bonus[j].getPlafond();
    }

    //rilevo collisione player vs pozione
    if (Utilities.rectsColliding(this.player, this.mondi[this.livelloSchema].pozione)) {
      this.player.pozioni.push(this.mondi[this.livelloSchema].pozione);
      for (let i = 0; i < this.gui.pozioniBottoni.length; i++) {
        if (!this.gui.pozioniBottoni[i].isCasellaPiena && !this.aggiungiPozioneAdArray) {
          this.gui.pozioniBottoni[i].riempiCasella();
          this.aggiungiPozioneAdArray = true;
          Utilities.setRandomXY(this.mondi[this.livelloSchema].pozione);
          break;
        }
      }
    } else {
      this.aggiungiPozioneAdArray = false;
    }
    //rilevo collisione player vs tesoro
    if ((!this.isTesoroRaccolto && Utilities.rectsColliding(this.player, this.mondi[this.livelloSchema].tesoro)) && //
      ((this.livelloSchema % 3 == 0 && (this.livelloSchema % 3 == 0 || this.isTesoroRaccolto == false)))) {
      this.player.money += this.mondi[this.livelloSchema].tesoro.money;
      Utilities.setRandomXY(this.mondi[this.livelloSchema].tesoro);
      this.isTesoroRaccolto = true;
    }
    if (this.livelloSchema % 3 != 0) {
      this.isTesoroRaccolto = false;
    }
    //rilevo collisione player vs scudo
    if (!this.isScudoRaccolto && Utilities.rectsColliding(this.player, this.mondi[this.livelloSchema].scudoBonus)) {
      this.gui.scudoButton.riempiScudo();
      this.isScudoRaccolto = true;
      Utilities.setRandomXY(this.mondi[this.livelloSchema].scudoBonus);
    }
  }

  update() {
    if (!this.isScudoRaccolto) {
      this.mondi[this.livelloSchema].scudoBonus.stand();
    }
    if (this.isScudoRaccolto && !this.gui.scudoButton.getIsScudoPresente()) {
      this.isScudoRaccolto = false;
      this.mondi[this.livelloSchema].scudoBonus.stand();
    }
    if (this.livelloSchema % 3 == 0 && (this.livelloSchema % 3 == 0 || this.isTesoroRaccolto == false)) {
      !this.isTesoroRaccolto ? this.mondi[this.livelloSchema].tesoro.stand() : null;
    }
    this.ctx.fillText(this.dieCount + '---' + this.mondi[this.livelloSchema].enemies.length + '-----' + this.player.isMorto + '-----' + !this.isFromStart, 20, 20, 500);
    //sono finiti i nemici , nuovo mondo...arrivo da start ?
    if (this.dieCount == this.mondi[this.livelloSchema].enemies.length && !this.player.isMorto && !this.isFromStart) {
      this.dieCount = 0;
      this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.livello);
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(this.livelloSchema, this.ctx);
      this.livelloSchema++;

      // if (this.mondi[this.livelloSchema]) {
      //   this.mondi[this.livelloSchema].startSchema();
      // }
    }
    Utilities.directionToMoveSwitch(this.player);

    this.mondi[this.livelloSchema].camion.setCamion();
    if (this.player.isMorto) {
      this.isFaseScelta = true;
      this.gui.isRestartTouched = false;
      this.gui.counterAnimationDieText = 0;
      this.isScudoRaccolto = false;
      if (!this.isfinalStatesInc && this.player.isMorto) {
        this.finalStates.push(
          {
            livelloPersonaggio: this.player.livello,
            livelloSchema: this.livelloSchema,
            money: this.player.money,
            classe: this.player.classe,
            numeroSchivate: this.player.numeroSchivate,
            numeroAttacchi: this.player.numeroAttacchi,
            ratio: this.player.numeroAttacchi / this.player.numeroSchivate
          }
        );

        this.isfinalStatesInc = true;
      }
      this.livelloSchema = 0;
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
      for (let j = 1; j < 5; j++) {
        this.mondi.push(new Mondo(this.ctx, i, j, 0.1))
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
                case 'ARCERE': this.player = new Arcere(this.ctx, 'green', 1); this.startGame(); break;
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
              this.livelloSchema = 1;
              this.player.money = 0;
              this.isStarted = false;
              this.mondi[this.livelloSchema].enemies
            }
          }
        }
        if (!this.isFaseScelta) {//se non sono nella prima fase non servono gli handler ai bottoni di gioco e alla pausa

          const incrementaLivelloButtonTouched = Utilities.changeButtonState(evt, this.gui.incrementaLivelloButton, this.ctx);
          if (incrementaLivelloButtonTouched && this.player.money > 0) {
            if (this.player.money > 100 * this.player.livello) {
              this.player.incrementaLivello();
              this.player.money -= 100 * this.player.livello;
            }
          }

          const compraBonusTouched = Utilities.changeButtonState(evt, this.gui.compraBonus, this.ctx);
          if (compraBonusTouched && this.player.money > 0) {
            this.bonus = [];
            this.bonus = Utilities.createBonusArray(3, this.ctx);
            this.player.money -= 20;
          }
          for (let i = 0; i < this.gui.pozioniBottoni.length; i++) {
            const bottonPozioneButtonTouched = Utilities.changeButtonState(evt, this.gui.pozioniBottoni[i], this.ctx);
            if (bottonPozioneButtonTouched && this.player.pozioni.length > 0) {
              this.player.isPozioneAntiCambioStatiAttivato = true;
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
    this.livelloSchema = 1;
    this.mondi[this.livelloSchema].inizialize(1, 1, this.ctx, 0.1)


    this.player.setX(2);
    this.player.setY(2);
    this.player.setVelocita(0.9);
    this.player.name = 'Tetramarco';
    this.player.posizioneInfoLabelX = 30;
    this.player.posizioneInfoLabelY = 700;
    this.player.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7];
    this.player.dannoCritico = 50;
    this.player.counterForCriticoTreshold = 10;
    this.player.isMorto = false;
    this.player.money = 2000;
    this.player.stand();
    this.mondi[this.livelloSchema].startSchema();
    this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.livello);


    this.isfinalStatesInc = false;

  }
}
