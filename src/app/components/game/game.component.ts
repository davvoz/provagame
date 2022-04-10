import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Charter } from 'src/app/classes/abstract/charter';
import { Bonus } from 'src/app/classes/elements/bonus';
import { Gui } from 'src/app/classes/elements/gui';
import { Mondo } from 'src/app/classes/elements/mondo';
import { Proiettile } from 'src/app/classes/elements/proiettile';
import { Collisions } from 'src/app/classes/utils/collisions';
import { KEY_CODE, direzione, FinalState, CollisionsParams } from 'src/app/classes/utils/costants.enum';
import { SetCanvasListener } from 'src/app/classes/utils/set-canvas-listener';
import { Utilities } from 'src/app/classes/utils/utilities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  title = 'game2k22';
  errorMessage: any;
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
  giaInvolo = false;//oggetto gia in volo
  isfinalStatesInc = false;
  isFaseScelta = true;
  isPause = false;
  isFromStart = false;
  m: Mondo[] = [];
  proiettile!: Proiettile;
  direzioneProiettile: direzione = 'STAND';
  gui!: Gui;
  ctx!: CanvasRenderingContext2D;
  player!: Charter;
  nemico!: Charter;
  bonus: Bonus[] = [];
  finalStates: FinalState[] = [];//sintesi finale matches
  counterEnemiesCollideSelf = 20;
  isEnemiesCollideSelf = false;
  collisions!: Collisions;
  canvasListeners!: SetCanvasListener;
  isPlayerUno = false;

  constructor(private ngZone: NgZone, public fservice: FirebaseService) { }

  animate(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isFaseScelta) {
      if (this.m.length > this.mn) {
        this.getMondo().aggiorna();
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

  getMondo(): Mondo {
    return this.m[this.mn];
  }

  private collisionDetenction() {
    const cP: CollisionsParams = {
      bonus: this.bonus,
      counterAnimation: this.counterAnimation,
      mondo: this.m[this.mn],
      mondoNumero: this.mn,
      player: this.player,
      pozioniBottoni: this.gui.pozioniBottoni,
      proiettile: this.proiettile,
      scudoButton: this.gui.scudoButton
    }
    this.collisions = new Collisions(cP);
  }

  private update() {
    this.updateEnemies();
    this.updatesProiettile();
    if (!this.collisions.isScudoRaccolto) {
      this.getMondo().scudoBonus.stand();
    }

    if (this.collisions.isScudoRaccolto && !this.gui.scudoButton.getIsScudoPresente()) {
      this.collisions.isScudoRaccolto = false;
      this.getMondo().scudoBonus.stand();
    }
    if ((this.mn % 3 == 0 && (this.mn % 3 == 0 || !this.collisions.isTesoroRaccolto)) && !this.collisions.isTesoroRaccolto) {
      this.getMondo().tesoro.stand()
    }

    if (this.dieCount != 0 && this.dieCount == this.getMondo().enemies.length && !this.player.isMorto) {
      this.dieCount = 0;
      this.gui.incrementaLivelloButton.terzoText = '$' + (100 * this.player.parametriFantasy.livello);
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(this.ctx);
      this.mn++;
      this.getMondo().inizialize(this.ctx);
    }
    this.player.malefici.stunned.totTurni > 0 ? this.player.stand() : Utilities.directionToMoveSwitch(this.player);

    this.getMondo().camion.setCamion();
    if (this.player.isMorto) {
      this.reinit();
    }
    this.player.counterAnimation = this.counterAnimation;
  }

  private updateEnemies() {
    this.dieCount = 0;
    for (const en of this.getMondo().enemies) {
      if (!en.isMorto) {
        en.counterAnimation = this.counterAnimation;
        if (en.malefici.stunned.totTurni > 0) { //se è stunnato lo stando
          en.setDirection('STAND');
        }
        else if (en.haPresoUnaDirezioneCounter.isActive()) {//se è attivo il counter direzionale prende la sua direzione
          Utilities.directionToMoveSwitch(en);
        } else if (en.isColliding) {//se sta collidendo con qualcosa
          this.enemyIsCollidingUpdate(en);//scopro cosa e vado di conseguenza
        } else {
          Utilities.charterMovmentRandomRoutine(en, this.counterRoutine, 20);
        }
      } else {
        this.dieCount++;
      }
    }
  }

  private enemyIsCollidingUpdate(en: Charter) {
    if (en.stato !== 'attaccando') {
      //se non sta attaccando ne evinco che stanno collidendo tra loro enemies
      switch (en.directionColliding) {
        case 'BOTTOM': en.setDirection('TOP'); break;
        case 'TOP': en.setDirection('BOTTOM'); break;
        case 'LEFT': en.setDirection('RIGHT'); break;
        case 'RIGHT': en.setDirection('LEFT'); break;
      }
      en.isColliding = false;
    } else {
      //se attacca
      en.setDirection('STAND');
    }
    Utilities.directionToMoveSwitch(en);
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
          this.bonus = Utilities.createBonusArray(this.ctx);
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
        this.proiettile = Utilities.newProiettile(this.gui.classeProiettileScelto, this.player.config);
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

  private updatesProiettile() {
    if (this.player.isOggettoInvolo && !this.giaInvolo) {
      if (this.getMondo().superProiettileCounter.isActive()) {
        Utilities.newProiettile(Utilities.arrayRandomico(['PALLADIFUOCO', 'RAGNO', 'COLTELLO', 'HAMMER']), this.player.config);
      } else {
        Utilities.newProiettile(this.gui.classeProiettileScelto, this.player.config);
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
    this.collisions.isScudoRaccolto = false;
    if (!this.isfinalStatesInc && this.player.isMorto) {
      const fs: FinalState = {
        livelloPersonaggio: this.player.parametriFantasy.livello,
        livelloSchema: this.mn,
        money: this.player.parametriFantasy.money,
        classe: this.player.classe,
        numeroSchivate: this.player.sintesiDati.numeroSchivate,
        numeroAttacchi: this.player.sintesiDati.numeroAttacchi,
        ratio: this.player.sintesiDati.numeroAttacchi / this.player.sintesiDati.numeroSchivate
      };
      this.finalStates.push(fs);
      this.isfinalStatesInc = true;
      this.fservice.addItem({ dato: fs, tabella: 'raccolta' });

    }

    this.mn = 0;
  }

  ngAfterViewInit(): void {

    const res = this.canvasGui.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2d context.');
    }
    this.ctx = res;
    this.gui = new Gui(this.ctx);
    for (let i = 1; i < 5000; i++) {
      this.m.push(new Mondo({ livelloNemici: i, numeroNemici: i, velocitaCamion: 0.0, id: i }))
    }
    this.canvasListeners = new SetCanvasListener(this);
    if (this.isFaseScelta) {
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }

  startGame() {
    this.isFaseScelta = false;
    this.gui.isRestartTouched = false;
    this.gui.counterAnimationDieText = 0;
    if (this.collisions) {
      this.collisions.isScudoRaccolto = false;
    }
    this.mn = 0;
    this.getMondo().inizialize(this.ctx);
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
    this.getMondo().startSchema();
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

}
