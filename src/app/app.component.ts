import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/elements/bonus';
import { Mago } from './classes/charters/mago';
import { Utilities } from './classes/utils/utilities';
import { classeProiettile, direzione, FinalState, KEY_CODE } from './classes/utils/costants.enum';
import { Gui } from './classes/elements/gui';
import { Mondo } from './classes/elements/mondo';
import { Guerriero } from './classes/charters/guerriero';
import { Bullo } from './classes/charters/bullo';
import { Samurai } from './classes/charters/samurai';
import { Proiettile } from './classes/elements/proiettile';
import { Charter } from './classes/abstract/charter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'game2k22';
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.player && !this.player.isMorto) {
      this.keyHandlers(event);
    }
  }


  @HostListener('window:keyup', ['$event'])
  keyEventMu(event: KeyboardEvent) {
    if (this.player) {
      if (event.key == KEY_CODE.DOWN_ARROW || event.key == KEY_CODE.UP_ARROW || event.key == KEY_CODE.LEFT_ARROW || event.key == KEY_CODE.RIGHT_ARROW) {
        this.player.config.velocita = 0;
      }
    }
  }
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  mn = 0;//indice mondi mn = mondo numero
  dieCount = 0;
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
  counterEnemiesCollideSelf = 20;
  isEnemiesCollideSelf = false;

  constructor(private ngZone: NgZone) { }

  private animate(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isFaseScelta) {
      if (this.m.length > this.mn) {
        this.m[this.mn].aggiorna();
        this.collisionDetenction();
        this.update();
      }
    }
    this.gui.aggiornaGui(this.mn, this.player, this.counterAnimation, this.isFaseScelta);
    this.updateCounters();
    if (!this.isPause) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  private collisionDetenction() {
    this.dieCount = 0;
    //rilevo collisione player vs enemies[]
    this.collisionsPlayerVsEnemies();
    //rilevo collisione player vs camion
    this.collisionsPlayerVsCamion();
    //rilevo collisione player vs bonus[]
    this.collisionsPlayerVsBonus();
    //rilevo collisione player vs pozione
    this.collisionsPlayerVsPozione();
    //rilevo collisione player vs tesoro
    this.collisionsPlayerVsTesoro();
    //rilevo collisione player vs scudo
    this.collisionsPlayerVsScudo();
    //rilevo collisione player vs superProiettile
    this.collisionsPlayerVsSuperProiettile();
  }

  private update() {
    this.updatesProiettile();
    if (!this.isScudoRaccolto) {
      this.m[this.mn].scudoBonus.stand();
    }
    if (this.isScudoRaccolto && !this.gui.scudoButton.getIsScudoPresente()) {
      this.isScudoRaccolto = false;
      this.m[this.mn].scudoBonus.stand();
    }
    if ((this.mn % 3 == 0 && (this.mn % 3 == 0 || !this.isTesoroRaccolto)) && !this.isTesoroRaccolto) {
      this.m[this.mn].tesoro.stand()
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
    this.player.malefici.stunned.totTurni > 0 ? this.player.stand() : Utilities.directionToMoveSwitch(this.player);

    this.m[this.mn].camion.setCamion();
    if (this.player.isMorto) {
      this.reinit();
    }
    this.player.counterAnimation = this.counterAnimation;
  }

  private setPozioni(index: number) {
    this.player.pozioneCounter.attiva();
    this.player.pozioni.pop();
    this.gui.pozioniBottoni[index].svuotaCasella();
  }

  private keyHandlers(event: KeyboardEvent) {
    switch (event.key) {
      case KEY_CODE.DOWN_ARROW:
        this.player.config.velocita = 0.1;
        this.player.setDirection('BOTTOM');
        break;
      case KEY_CODE.UP_ARROW:
        this.player.config.velocita = 0.1;
        this.player.setDirection('TOP');
        break;
      case KEY_CODE.LEFT_ARROW:
        this.player.config.velocita = 0.1;
        this.player.setDirection('LEFT');
        break;
      case KEY_CODE.RIGHT_ARROW: this.player.config.velocita = 0.1;
        this.player.setDirection('RIGHT');
        break;
      case '1':
        this.setPozioni(0);
        break;
      case '2':
        this.setPozioni(1);
        break;
      case '3':
        this.setPozioni(2);
        break;
      case '4':
        if (this.gui.scudoButton.getIsScudoPresente()) {
          this.gui.scudoButton.attivaScudo(this.player);
        }
        break;
      case 'q':
        if (this.player.parametriFantasy.money > 0) {
          this.bonus = [];
          this.bonus = Utilities.createBonusArray(3, this.ctx);
          this.player.parametriFantasy.money -= 20;
        }
        break;
      case 'w':
        if (this.player.parametriFantasy.money > 0) {
          this.player.incrementaLivello();
          this.player.parametriFantasy.money -= 500 * this.player.parametriFantasy.livello;
        }
        break;
      case ' ':
        this.player.lanciaOggetto();
        this.newProiettile(this.gui.classeProiettileScelto);
        this.proiettile.setDirection(this.player.getDirection());
        break;
      case 'p':
        if (this.isPause) {
          this.isPause = false;
          this.animate()
        } else {
          this.isPause = true;
        }
        break;
    }
  }

  private collisionsPlayerVsSuperProiettile() {
    if (!this.m[this.mn].superProiettileCounter.isActive() && Utilities.rectsCollidingWrong(this.player.getSquareParam(), this.m[this.mn].superProiettile.getSquareParam())) {
      this.m[this.mn].superProiettileCounter.attiva();
      Utilities.setRandomXY(this.m[this.mn].superProiettile);
    }
  }

  private collisionsPlayerVsScudo() {
    if (!this.isScudoRaccolto && Utilities.rectsCollidingWrong(this.player.getSquareParam(), this.m[this.mn].scudoBonus.getSquareParam())) {
      this.gui.scudoButton.riempiScudo();
      this.isScudoRaccolto = true;
      Utilities.setRandomXY(this.m[this.mn].scudoBonus);
    }
  }

  private collisionsPlayerVsTesoro() {
    if ((!this.isTesoroRaccolto && Utilities.rectsCollidingWrong(this.player.getSquareParam(), this.m[this.mn].tesoro.getSquareParam())) && //
      (this.mn % 3 == 0 && (this.mn % 3 == 0 || !this.isTesoroRaccolto))) {
      this.player.parametriFantasy.money += this.m[this.mn].tesoro.money;
      Utilities.setRandomXY(this.m[this.mn].tesoro);
      this.isTesoroRaccolto = true;
    }
    if (this.mn % 3 != 0) {
      this.isTesoroRaccolto = false;
    }
  }

  private collisionsPlayerVsPozione() {
    if (Utilities.rectsCollidingWrong(this.player.getSquareParam(), this.m[this.mn].pozione.getSquareParam())) {
      this.player.pozioni.push(this.m[this.mn].pozione);
      for (const pozione of this.gui.pozioniBottoni) {
        if (!pozione.isCasellaPiena && !this.aggiungiPozioneAdArray) {
          pozione.riempiCasella();
          this.aggiungiPozioneAdArray = true;
          Utilities.setRandomXY(this.m[this.mn].pozione);
        }
      }
    } else {
      this.aggiungiPozioneAdArray = false;
    }
  }

  private collisionsPlayerVsBonus() {
    this.bonusCount = 0;
    for (const bonus of this.bonus) {
      bonus.stand();
      if (bonus.getPlafond() > 0) {
        if (Utilities.rectsCollidingWrong(bonus.getSquareParam(), this.player.getSquareParam())) {
          this.player.incrementaSalute(bonus.getQuantita() * this.player.parametriFantasy.livello);
          bonus.setPlafond(bonus.getPlafond() - bonus.getQuantita());
        }
      }
      this.bonusCount += bonus.getPlafond();

    }
  }

  private collisionsPlayerVsCamion() {
    if (Utilities.rectsCollidingWrong(this.player.getSquareParam(), this.m[this.mn].camion.getSquareParam())) {
      this.player.incrementaSalute(-(500 * this.mn));
      if (this.player.getSalute() <= 0) {
        this.player.isMorto = true;
      }
    }
  }

  private collisionsPlayerVsEnemies() {
    for (let i = 0; i < this.m[this.mn].enemies.length; i++) {
      this.m[this.mn].enemies[i].counterAnimation = this.counterAnimation;
      if (!this.player.isMorto
        && !this.m[this.mn].enemies[i].isMorto
        && Utilities.rectsCollidingWrong(this.m[this.mn].enemies[i].getSquareParam(), this.player.getSquareParam())) {
        this.combattimento(i);
      } else {
        this.player.isOnAttack = false;
        this.player.stato = 'camminando';
        this.m[this.mn].enemies[i].isOnAttack = false;
        this.m[this.mn].enemies[i].stato = 'camminando';
        //controllo se si scontra con il proiettile
        if (this.proiettile && Utilities.rectsCollidingWrong(this.m[this.mn].enemies[i].getSquareParam(), this.proiettile.getSquareParam())) {
          this.proiettileVs(i);
        }
        if (!this.m[this.mn].enemies[i].isMorto) {
          this.collisionsOperazioniAncoraVivo(i);
        }
      }
      if (this.m[this.mn].enemies[i].isMorto) {
        this.dieCount++;
      }
    }
  }

  private collisionsOperazioniAncoraVivo(i: number) {
    if (this.m[this.mn].enemies[i].malefici.stunned.totTurni > 0) {
      //se è stunnato lo stando
      this.m[this.mn].enemies[i].setDirection('STAND');
      Utilities.directionToMoveSwitch(this.m[this.mn].enemies[i]);
    } else {
      //se è attivo il counter direzionale prende la sua direzione
      if (this.m[this.mn].enemies[i].haPresoUnaDirezioneCounter.isActive()) {
        Utilities.directionToMoveSwitch(this.m[this.mn].enemies[i]);
      } else {
        //controllo se le nostre aure si scontrano
        this.collisionsAureeThenOperazioniFinali(i);
      }
    }
  }

  private collisionsAureeThenOperazioniFinali(i: number) {
    let cto = Utilities.rectsCollidingToDirection(this.m[this.mn].enemies[i].getAurea(), this.player.getAurea());
    if (cto.isColliding) {
      this.m[this.mn].enemies[i].setDirection(cto.getBetterDirection());
      Utilities.directionToMoveSwitch(this.m[this.mn].enemies[i]);
      this.m[this.mn].enemies[i].haPresoUnaDirezioneCounter.attiva();
    } else {
      //devo controllare se si scontrano tra loro e allonatanarli
      //per i se i non è morto e se non sta attaccando
      this.collisionOperazioniFinali(i);
    }
  }

  private collisionOperazioniFinali(i: number) {
    if (!this.m[this.mn].enemies[i].isMorto && this.m[this.mn].enemies[i].stato !== 'attaccando') {
      let iIsColliding = false;
      iIsColliding = this.siScontrantranoTraLoro(i);
      if (iIsColliding) {
        Utilities.directionToMoveSwitch(this.m[this.mn].enemies[i]);
      } else {
       Utilities.charterMovmentRandomRoutine(this.m[this.mn].enemies[i], this.counterRoutine, 20);
      }
    }
  }

  private siScontrantranoTraLoro(i: number) {
    let ic = false;
    for (let j = 0; j < this.m[this.mn].enemies.length; j++) {
      //se i non è se stesso(j) e se j non è morto
      if (i !== j && !this.m[this.mn].enemies[j].isMorto) {
        let cto2 = Utilities.rectsCollidingToDirection(this.m[this.mn].enemies[i].getAurea(), this.m[this.mn].enemies[j].getAurea());
        //se i e j si scontrano
        if (cto2.isColliding) {
          ic = true;
          //mando i dalla parte opposta
          switch (cto2.getBetterDirection()) {
            case 'BOTTOM': this.m[this.mn].enemies[i].setDirection('TOP'); break;
            case 'TOP': this.m[this.mn].enemies[i].setDirection('BOTTOM'); break;
            case 'LEFT': this.m[this.mn].enemies[i].setDirection('RIGHT'); break;
            case 'RIGHT': this.m[this.mn].enemies[i].setDirection('LEFT'); break;
          }
          break;//non mi serve restare
        }
      }
    }
    return ic;
  }

  private proiettileVs(i: number) {
    this.m[this.mn].enemies[i].incrementaSalute(-100 * this.player.parametriFantasy.livello);
    this.proiettile.lanciaAbilita(this.m[this.mn].enemies[i]);
    //se muore gli rubo i soldi
    if (this.m[this.mn].enemies[i].isMorto && this.m[this.mn].enemies[i].parametriFantasy.money > 0) {
      this.player.rubaSoldiA(this.m[this.mn].enemies[i]);
      this.player.exp = this.player.exp + this.player.parametriFantasy.livello * this.m[this.mn].enemies[i].parametriFantasy.livello * 100;
    }
  }

  private combattimento(i: number) {
    if (this.counterAnimation === 3) {
      if (this.player.parametriFantasy.agilita >= this.m[this.mn].enemies[i].parametriFantasy.agilita) {
        Utilities.algoAttack(this.player, this.m[this.mn].enemies[i]);
        Utilities.algoAttack(this.m[this.mn].enemies[i], this.player);
      } else {
        Utilities.algoAttack(this.m[this.mn].enemies[i], this.player);
        Utilities.algoAttack(this.player, this.m[this.mn].enemies[i]);
      }
    }
    this.player.isOnAttack = true;
    this.m[this.mn].enemies[i].isOnAttack = true;
    this.m[this.mn].enemies[i].stand();
  }

  private updatesProiettile() {
    if (this.player.isOggettoInvolo && !this.giaInvolo) {
      if (this.m[this.mn].superProiettileCounter.isActive()) {
        this.newProiettile(Utilities.arrayRandomico(['PALLADIFUOCO', 'RAGNO', 'COLTELLO', 'HAMMER']));
      } else {
        this.newProiettile(this.gui.classeProiettileScelto);
      }
      this.giaInvolo = true;
      this.proiettile.setDirection(this.player.getDirection());
      this.proiettile.config.velocita = 0.1;
    }

    if (this.giaInvolo) {
      this.proiettile.counterAnimation = this.counterAnimation;
      Utilities.directionToMoveSwitch(this.proiettile);
      if (this.proiettile.config.x > 20 || this.proiettile.config.x < -20 || this.proiettile.config.y > 20 || this.proiettile.config.y < -20) {
        this.giaInvolo = false;
        this.player.isOggettoInvolo = false;
      }
    }
  }

  private reinit() {
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

    this.setCanvasListener();
    if (this.isFaseScelta) {
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }

  private startGame() {
    this.isFaseScelta = false;
    this.gui.isRestartTouched = false;
    this.gui.counterAnimationDieText = 0;
    this.isScudoRaccolto = false;
    this.mn = 1;
    this.m[this.mn].inizialize(this.ctx);
    this.player.config.x = 10;
    this.player.config.y = 10;
    this.player.name = 'BEST PLAYER';
    this.player.posizioneInfoLabelX = 30;
    this.player.posizioneInfoLabelY = 700;
    this.player.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7];
    this.player.dannoCritico = 150;
    this.player.counterForCriticoTreshold = 4;
    this.player.isMorto = false;
    this.player.parametriFantasy.money = 2000;
    this.player.isPlayer = true;
    this.player.stand();
    this.m[this.mn].startSchema();
    this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.parametriFantasy.livello);
    this.isfinalStatesInc = false;
  }

  private updateCounters() {
    //this.ctx.strokeText(this.counterAnimation+'',30,30,500);
    //velocità animazione ogni n frame
    if (this.counterRoutine % 8 == 0) {
      //step animazione 
      if (this.counterAnimation === 3) {
        this.counterAnimation = 0
      } else {
        this.counterAnimation++;
      }

    }
    if (this.counterRoutine === 399) {
      this.counterRoutine = 0
    } else {
      this.counterRoutine++;
    }
  }

  private setCanvasListener() {
    this.ctx.canvas.addEventListener(
      'click',
      (evt) => {
        const startButtonTouched = this.startButton(evt);
        this.scegliPersonaggioButton(evt, startButtonTouched);
        this.scegliProiettileButton(evt, startButtonTouched);
        this.restartButton(evt);
        //se non sono nella prima fase non servono gli handler/mostrare ai bottoni di gioco e alla pausa
        if (!this.isFaseScelta) {
          this.incrementaLivelloButton(evt);
          this.compraBonusButton(evt);
          this.pozioniButtons(evt);
          this.compraScudoButton(evt);
          this.pauseButton(evt);
        }
      },
      false
    );
  }

  private scegliPersonaggioButton(evt: MouseEvent, startButtonTouched: boolean) {
    for (const charter of this.gui.sceltaCharter) {
      const scegliCharterButtonTouched = Utilities.changeButtonState(evt, charter, this.ctx);
      if (scegliCharterButtonTouched) {
        this.gui.classeCharterScelto = charter.typeOfCharter;
      }
      if (this.gui.classeCharterScelto && !this.isStarted) {

        if (startButtonTouched) {
          switch (this.gui.classeCharterScelto) {
            case 'BULLO': this.player = new Bullo(Utilities.getSquareConfig(this.ctx, 'azure')); this.startGame(); break;
            case 'MAGO': this.player = new Mago(Utilities.getSquareConfig(this.ctx, 'pink')); this.startGame(); break;
            case 'GUERRIERO': this.player = new Guerriero(Utilities.getSquareConfig(this.ctx, 'violet')); this.startGame(); break;
            case 'SAMURAI': this.player = new Samurai(Utilities.getSquareConfig(this.ctx, 'gold')); this.startGame(); break;
          }
          this.isStarted = true;
          this.gui.classeCharterScelto = 'ABSTRACT';
        }
      }
    }
  }

  private pauseButton(evt: MouseEvent) {
    const attivaPauseTouched = Utilities.changeButtonState(evt, this.gui.pauseButton, this.ctx);
    if (attivaPauseTouched) {
      if (this.isPause) { this.isPause = false; this.animate() } else { this.isPause = true; }
    }
  }

  private compraScudoButton(evt: MouseEvent) {
    const compraScudoTouched = Utilities.changeButtonState(evt, this.gui.scudoButton, this.ctx);
    if (compraScudoTouched) {
      this.gui.scudoButton.attivaScudo(this.player);
    }
  }

  private pozioniButtons(evt: MouseEvent) {
    for (const pozione of this.gui.pozioniBottoni) {
      const bottonPozioneButtonTouched = Utilities.changeButtonState(evt, pozione, this.ctx);
      if (bottonPozioneButtonTouched && this.player.pozioni.length > 0) {
        this.player.pozioneCounter.attiva();
        this.player.pozioni.pop();
        pozione.svuotaCasella();
      }
    }
  }

  private compraBonusButton(evt: MouseEvent) {
    const compraBonusTouched = Utilities.changeButtonState(evt, this.gui.compraBonus, this.ctx);
    if (compraBonusTouched && this.player.parametriFantasy.money > 0) {
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(3, this.ctx);
      this.player.parametriFantasy.money -= 20;
    }
  }

  private incrementaLivelloButton(evt: MouseEvent) {
    const incrementaLivelloButtonTouched = Utilities.changeButtonState(evt, this.gui.incrementaLivelloButton, this.ctx);
    if (incrementaLivelloButtonTouched && this.player.parametriFantasy.money > 0) {
      if (this.player.parametriFantasy.money > 100 * this.player.parametriFantasy.livello) {
        this.player.incrementaLivello();
        this.player.parametriFantasy.money -= 100 * this.player.parametriFantasy.livello;
      }
    }
  }

  private restartButton(evt: MouseEvent) {
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
          this.m[this.mn].enemies = [];
        }
      }
    }
  }

  private scegliProiettileButton(evt: MouseEvent, startButtonTouched: boolean) {
    for (const sp of this.gui.sceltaProiettile) {
      const scegliProiettileButtonTouched = Utilities.changeButtonState(evt, sp, this.ctx);
      if (scegliProiettileButtonTouched) {
        this.gui.classeProiettileScelto = sp.typeOfProiettile;
      }
      if (this.gui.classeProiettileScelto && !this.isStarted) {
        if (startButtonTouched) {
          this.newProiettile(this.gui.classeProiettileScelto);
          this.isStarted = true;
          this.gui.classeProiettileScelto = 'ABSTRACT';
        }
      }
    }
  }

  private startButton(evt: MouseEvent) {
    return Utilities.changeButtonState(evt, this.gui.startButton, this.ctx);
  }

  private newProiettile(cp: classeProiettile) {
    let path;
    switch (cp) {
      case 'COLTELLO': path = 'assets/images/coltello.png'; break;
      case 'PALLADIFUOCO': path = 'assets/images/fireball.png'; break;
      case 'RAGNO': path = 'assets/images/spidero.png'; break;
      case 'HAMMER': path = 'assets/images/hammero.png'; break;
      default: cp = 'HAMMER'; path = 'assets/images/hammero.png'; break;
    }
    this.proiettile = new Proiettile({
      color: 'white',
      ctx: this.ctx,
      velocita: 0.5,
      h: 70,
      w: 50,
      x: this.player.config.x,
      y: this.player.config.y
    }, path, cp);
  }

}
