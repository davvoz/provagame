import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/bonus';
import { Charter } from './classes/charter';
import { Mago } from './classes/mago';
import { Pozione } from './classes/pozione';
import { Utilities } from './classes/utilities';
import { classe, FinalState } from './classes/costants.enum';
import { Treasure } from './classes/treasure';
import { Camion } from './classes/camion';
import { Gui } from './classes/gui';
import { Mondo } from './classes/mondo';
import { Guerriero } from './classes/guerriero';
import { Arcere } from './classes/arcere';
import { Samurai } from './classes/samurai';
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
  isMagoScelto: boolean = false;
  level = 1;
  numeroNemici: number = 0;
  livelloSchema: number = 0;
  aggiungiPozioneAdArray = false;
  dieCount: number = 0;
  gui!: Gui;
  typeOfPersonaggioSCelto !: classe;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
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
        this.player.pozioneAntiCambioStati = true;
        this.player.pozioni.pop();
        this.gui.pozioniBottoni[0].svuotaCasella();
      }
      if (event.keyCode == 50 && this.player.pozioni.length > 0) {//2 consuma pozione 2
        this.player.pozioneAntiCambioStati = true;
        this.player.pozioni.pop();
        this.gui.pozioniBottoni[1].svuotaCasella();
      }
      if (event.keyCode == 51 && this.player.pozioni.length > 0) {//2 consuma pozione 3
        this.player.pozioneAntiCambioStati = true;
        this.player.pozioni.pop();
        this.gui.pozioniBottoni[2].svuotaCasella();
      }
      if (event.keyCode == 13) {//invio aumenta livello
        if (this.player.money > 500 * this.player.livello) {
          this.player.incrementaLivello();
          this.player.money -= 500 * this.player.livello;
        }
      }
    }

  }
  @HostListener('window:keyup', ['$event'])
  keyEventMu(event: KeyboardEvent) {
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
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  player!: Mago;
  counterRoutine = 0;
  counterAnimation = 0;
  isCharterColliding = false;
  enemies: Charter[] = [];
  bonus: Bonus[] = [];
  bonusCount = 0;
  isStarted = false;
  pozione!: Pozione;
  isJustColliding = false;
  mondo!: Mondo;
  finalStates: FinalState[] = [];
  isfinalStatesInc = false;
  tesoro!: Treasure;
  isTesoroRaccolto = false;
  camion!: Camion;
  isFaseScelta = true;
  constructor(private ngZone: NgZone) { }


  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isFaseScelta) {
      this.mondo.aggiorna(this.livelloSchema);
      this.collisionDetenction();
      this.update();
    }
    if (this.camion && !this.gui.isRestartTouched) {
      this.setCamion();
    }
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
    this.gui.aggiornaGui(this.livelloSchema, this.player, this.counterAnimation, this.isFaseScelta);
  }

  private setCamion() {
    if (this.player.isMorto) {
      if (this.camion.getX() * this.camion.sideX + this.camion.image.width > 0) {
        this.camion.setDirection('LEFT');
        Utilities.directionToMoveSwitch(this.camion);
      } else {
        this.camion.setX(49);
        this.camion.setY(Utilities.arrayRandomicoNumerico([1, 4]));
      }
    }
  }

  collisionDetenction() {
    this.dieCount = 0;
    //rilevo collisione player vs enemies[]
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].counterAnimation = this.counterAnimation;
      if (!this.player.isMorto && !this.enemies[i].isMorto && Utilities.rectsColliding(this.enemies[i], this.player)) {
        this.enemies[i].attaccare(this.player);
        if (this.enemies[i].mana == this.enemies[i].maxMana) {
          this.enemies[i].mana = 0;
          this.enemies[i].lanciaAbilita(this.player);
        }
        this.player.attaccare(this.enemies[i]);
        if (this.player.mana == this.enemies[i].maxMana) {
          this.player.mana = 0;
          this.player.lanciaAbilita(this.enemies[i]);
        }
        this.player.isOnAttack = true;
        this.enemies[i].isOnAttack = true;
        this.enemies[i].stand();
      } else {
        this.player.isOnAttack = false;
        this.player.stato = 'camminando';
        this.enemies[i].isOnAttack = false;
        this.enemies[i].stato = 'camminando';
        if (!this.enemies[i].isMorto) {
          Utilities.charterMovmentRandomRoutine(this.enemies[i], this.counterRoutine, 20);
        }
      }
      //rilevo collisione this.enemies[i] vs camion
      // if (Utilities.rectsColliding(this.enemies[i], this.camion)) {
      //   this.enemies[i].salute -= 500 * this.livelloSchema;
      //   if (this.enemies[i].salute <= 0) {
      //     this.enemies[i].isMorto;
      //   }
      // }
      if (this.enemies[i].isMorto) {
        this.dieCount++;
      }
    }
    //rilevo collisione player vs camion
    if (Utilities.rectsColliding(this.player, this.camion)) {
      this.player.salute -= 100 * this.livelloSchema;
      if (this.player.salute <= 0) {
        this.player.isMorto
      }
    }
    this.bonusCount = 0;
    //rilevo collisione player vs bonus[]
    for (let j = 0; j < this.bonus.length; j++) {
      this.bonus[j].stand();
      if (this.bonus[j].getPlafond() > 0) {
        if (Utilities.rectsColliding(this.bonus[j], this.player)) {
          this.player[this.bonus[j].getTipoBonus()] += this.bonus[j].getQuantita() * this.player.livello;
          this.bonus[j].setPlafond(this.bonus[j].getPlafond() - this.bonus[j].getQuantita());
        }
      }
      this.bonusCount += this.bonus[j].getPlafond();
    }

    //rilevo collisione player vs pozione
    if (Utilities.rectsColliding(this.player, this.pozione)) {
      this.player.pozioni.push(this.pozione);
      for (let i = 0; i < this.gui.pozioniBottoni.length; i++) {
        if (!this.gui.pozioniBottoni[i].isCasellaPiena && !this.aggiungiPozioneAdArray) {
          this.gui.pozioniBottoni[i].riempiCasella();
          this.aggiungiPozioneAdArray = true;
          this.pozione.setX(Math.floor(Math.random() * 10) + 1);
          this.pozione.setY(Math.floor(Math.random() * 5) + 1);
          break;
        }
      }
    } else {
      this.aggiungiPozioneAdArray = false;
    }
    //rilevo collisione player vs tesoro
    if ((!this.isTesoroRaccolto && Utilities.rectsColliding(this.player, this.tesoro)) && //
      ((this.livelloSchema % 3 == 0 && (this.livelloSchema % 3 == 0 || this.isTesoroRaccolto == false)))) {
      this.player.money += this.tesoro.money;
      this.isTesoroRaccolto = true;
    }
    if (this.livelloSchema % 3 != 0) {
      this.isTesoroRaccolto = false;
    }
  }

  update() {
    this.pozione.stand();
    if (this.livelloSchema % 3 == 0 && (this.livelloSchema % 3 == 0 || this.isTesoroRaccolto == false)) {
      !this.isTesoroRaccolto ? this.tesoro.stand() : null;
    }
    Utilities.directionToMoveSwitch(this.player);
    this.setCamion();
    if (this.player.isMorto) {
      this.isFaseScelta = true;
    }
    if (!this.isfinalStatesInc && this.player.isMorto) {
      this.camion.isPlayerMorto = true;

      this.finalStates.push(
        {
          livelloPersonaggio: this.player.livello,
          livelloSchema: this.livelloSchema,
          money: this.player.money
        }
      );

      this.isfinalStatesInc = true;
    }

    //sono finiti i nemici , nuovo livello
    if (this.dieCount == this.enemies.length && !this.player.isMorto) {
      //this.player.incrementaLivello();
      this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.livello);
      this.enemies = [];
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(this.level, this.ctx);
      this.livelloSchema++;
      this.numeroNemici = this.livelloSchema;
      this.mondo.aggiornaLivello();
      this.enemies = Utilities.createEnemiesArray(this.numeroNemici, this.ctx, this.livelloSchema, this.player.salute);
    }
    if (this.player.pozioneAntiCambioStati) {
      if (this.player.turniPozioneAntiCambiaStati == 0) {
        this.player.turniPozioneAntiCambiaStati = 1000;
        this.player.pozioneAntiCambioStati = false;
      }
      this.player.turniPozioneAntiCambiaStati--;
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
    this.mondo = new Mondo(this.ctx);
    this.pozione = new Pozione(this.ctx, 'green');
    this.pozione.setX(2);
    this.pozione.setY(2);
    this.pozione.setVelocita(0);
    this.pozione.stand();

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
                case 'ARCERE': this.startGame(new Arcere(this.ctx, 'green', 1)); break;
                case 'MAGO': this.startGame(new Mago(this.ctx, 'blue', 1)); break;
                case 'GUERRIERO': this.startGame(new Guerriero(this.ctx, 'pink', 1)); break;
                case 'SAMURAI': this.startGame(new Samurai(this.ctx, 'yellow', 1)); break;
              }
              this.level = 0;
              this.isStarted = true;
              this.gui.classeCharterScelto = 'ABSTRACT';
            }
          }
        }
        if (this.player) {
          if (this.player.isMorto) {
            const restartButtonTouched = Utilities.changeButtonState(evt, this.gui.restartButton, this.ctx);
            if (restartButtonTouched) {
              this.isFaseScelta = true;
              this.gui.isRestartTouched = true;
              this.gui.classeCharterScelto = 'ABSTRACT';
              this.livelloSchema = 0;
              this.player.money = 0;
              this.isStarted = false;
            }
          }
        }
        if (!this.isFaseScelta) {//se non sono nella prima fase non servono gli handler ai bottoni di gioco

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
              this.player.pozioneAntiCambioStati = true;
              this.player.pozioni.pop();
              this.gui.pozioniBottoni[i].svuotaCasella();
            }
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


  startGame(playerHero: Charter) {
    this.isFaseScelta = false;
    this.gui.isRestartTouched = false;
    this.gui.counterAnimationDieText = 0;

    this.level = 0;
    this.livelloSchema = 0;
    this.player = playerHero;
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
    this.mondo.startSchema();
    this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.livello);

    this.enemies = Utilities.createEnemiesArray(0, this.ctx, 1, this.player.salute);

    this.tesoro = new Treasure(this.ctx, '');
    this.tesoro.setX(5);
    this.tesoro.setY(5);
    this.tesoro.setVelocita(0);
    this.tesoro.stand();

    this.camion = new Camion(this.ctx, 'red');
    this.camion.setX(19);
    this.camion.setY(3);
    this.camion.setVelocita(0.1);
    this.camion.stand();
    this.isfinalStatesInc = false;


  }






}
