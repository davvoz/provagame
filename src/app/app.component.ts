import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/bonus';
import { Bottone } from './classes/bottone';
import { BottonePozione } from './classes/bottonePozione';
import { Charter } from './classes/charter';
import { Guerriero } from './classes/guerriero';
import { Mago } from './classes/mago';
import { Mura } from './classes/mura';
import { Muro } from './classes/muro';
import { Pozione } from './classes/pozione';
import { Square } from './classes/square';
import { Utilities } from './classes/utilities';
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
export class AppComponent {
  isMagoScelto: boolean = false;
  level = 1;
  numeroNemici: number = 0;
  livelloSchema: number = 0;
  aggiungiPozioneAdArray = false;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.player.isMorto) {
      if (event.keyCode == KEY_CODE.DOWN_ARROW) {
        this.player.setVelocita(this.player.maxVelo);
        this.player.setDirection('BOTTOM');
      }
      if (event.keyCode == KEY_CODE.UP_ARROW) {
        this.player.setVelocita(this.player.maxVelo);
        this.player.setDirection('TOP');
      }
      if (event.keyCode == KEY_CODE.LEFT_ARROW) {
        this.player.setVelocita(this.player.maxVelo);
        this.player.setDirection('LEFT');
      }
      if (event.keyCode == KEY_CODE.RIGHT_ARROW) {
        this.player.setVelocita(this.player.maxVelo);
        this.player.setDirection('RIGHT');
      }
      if (event.keyCode == 32) {
        if (this.player.money > 0) {
          this.bonus = [];
          this.bonus = Utilities.createBonusArray(3, this.ctx);
          this.player.money -= 20;
        }
      }
    }

  }
  @HostListener('window:keyup', ['$event'])
  keyEventMu(event: KeyboardEvent) {
    if (event.keyCode == KEY_CODE.DOWN_ARROW) {
      this.player.setVelocita(0);
    }
    if (event.keyCode == KEY_CODE.UP_ARROW) {
      this.player.setVelocita(0);
    }
    if (event.keyCode == KEY_CODE.LEFT_ARROW) {
      this.player.setVelocita(0);
    }
    if (event.keyCode == KEY_CODE.RIGHT_ARROW) {
      this.player.setVelocita(0);
    }
    if (event.keyCode == 32) {
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
  startButton!: Bottone;
  pauseButton!: Bottone;
  compraBonus!: Bottone;
  incrementaLivelloButton!: Bottone;
  isStarted = false;
  pozioniBottoni: BottonePozione[] = [];
  pozione!: Pozione;
  mura!: Mura;
  isJustColliding = false;
  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
  }


  charterMovmentRandomRoutine(charter: Square) {
    if (this.counterRoutine % 40 == 0) {
      Utilities.direzionaRandomicamenteCharter(charter);
    }
    Utilities.directionToMoveSwitch(charter);
  }


  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.fillStyle = 'rgb(200,200,200)';


    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.player.isMorto) {
      this.startButton.state == 1;
    }
    this.ctx.fillRect(0, 90, this.ctx.canvas.width, 700);
    this.collisionDetenction();
    this.update();

  }

  collisionDetenction() {
    let dieCount = 0;


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
          this.charterMovmentRandomRoutine(this.enemies[i]);
        }
      }
    
      if (this.enemies[i].isMorto) {
        dieCount++;
      }
    }


    this.bonusCount = 0;
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
    if (dieCount == this.enemies.length) {//sono finiti i nemici , nuovo livello
      this.player.incrementaLivello();
      this.enemies = [];
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(this.level, this.ctx);
      this.livelloSchema++;
      this.numeroNemici = this.livelloSchema;
      this.enemies = Utilities.createEnemiesArray(this.numeroNemici, this.ctx, this.livelloSchema, this.player.salute);
    }

    if (Utilities.rectsColliding(this.player, this.pozione)) {
      this.player.pozioni.push(this.pozione);
      for (let i = 0; i < this.pozioniBottoni.length; i++) {
        if (!this.pozioniBottoni[i].isCasellaPiena && !this.aggiungiPozioneAdArray) {
          this.pozioniBottoni[i].riempiCasella();
          this.aggiungiPozioneAdArray = true;
          this.pozione.setX(Math.floor(Math.random() * 19) + 1);
          this.pozione.setY(Math.floor(Math.random() * 10) + 1);
          break;
        }
      }
    } else {
      this.aggiungiPozioneAdArray = false;
    }


    Utilities.directionToMoveSwitch(this.player);
  }

  update() {
    if (this.player.pozioneAntiCambioStati) {
      if (this.player.turniPozioneAntiCambiaStati == 0) {
        this.player.turniPozioneAntiCambiaStati = 1000;
        this.player.pozioneAntiCambioStati = false;
      }
      this.player.turniPozioneAntiCambiaStati--;
    }

    this.pozione.stand();
    this.startButton.stand();
    this.incrementaLivelloButton.stand();
    this.compraBonus.stand();
    for (let i = 0; i < this.pozioniBottoni.length; i++) {
      this.pozioniBottoni[i].stand();
    }
    this.ctx.font = '40px Impact';
    this.ctx.fillStyle = 'rgb(130,150,10)';
    this.ctx.fillText('$' + this.player.money, 200, 40, 500);
    this.ctx.fillText('Livello ' + this.livelloSchema, 350, 40, 500);

    this.player.counterAnimation = this.counterAnimation;
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

  ngAfterViewInit(): void {
    const res = this.canvasGui.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2d context');
    }
    this.ctx = res;

    this.startButton = new Bottone(this.ctx, 'yellow');
    this.startButton.setX(0);
    this.startButton.setY(0);
    this.startButton.setText('START');
    this.startButton.stand();

    this.incrementaLivelloButton = new Bottone(this.ctx, 'yellow');
    this.incrementaLivelloButton.setX(1);
    this.incrementaLivelloButton.setY(0);
    this.incrementaLivelloButton.setText('LEVEL');
    this.incrementaLivelloButton.stand();

    this.compraBonus = new Bottone(this.ctx, 'yellow');
    this.compraBonus.setX(2);
    this.compraBonus.setY(0);
    this.compraBonus.setText('BONUS');
    this.compraBonus.stand();

    for (let i = 0; i < 3; i++) {
      let poszione = new BottonePozione(this.ctx, 'green');
      poszione.setX(i + 20);
      poszione.setY(0);
      poszione.stand();
      this.pozioniBottoni.push(poszione);
    }

    this.pozione = new Pozione(this.ctx, 'green');
    this.pozione.setX(2);
    this.pozione.setY(2);
    this.pozione.setVelocita(0);
    this.pozione.stand();

    this.mura = new Mura();
    const muri: Muro[] = [
      new Muro(this.ctx, '', 1, 2),
      new Muro(this.ctx, '', 2, 2),
      new Muro(this.ctx, '', 3, 2),
      new Muro(this.ctx, '', 4, 2),
      new Muro(this.ctx, '', 5, 2),
      new Muro(this.ctx, '', 6, 2),
      new Muro(this.ctx, '', 7, 2),
      new Muro(this.ctx, '', 8, 2),
      new Muro(this.ctx, '', 8, 3),
      new Muro(this.ctx, '', 8, 4),
      new Muro(this.ctx, '', 8, 5),
      new Muro(this.ctx, '', 8, 6),
      new Muro(this.ctx, '', 8, 7),
      new Muro(this.ctx, '', 8, 8)
    ];
    this.mura.setMuri(muri);

    this.ctx.canvas.addEventListener(
      'click',
      (evt) => {

        const startButtonTouched = this.changeButtonState(evt, this.startButton);
        if (startButtonTouched) {
          this.startGame();
          this.level = 0;
          this.isStarted = true;
        }

        const incrementaLivelloButtonTouched = this.changeButtonState(evt, this.incrementaLivelloButton);
        if (incrementaLivelloButtonTouched && this.player.money > 0) {
          this.player.incrementaLivello();
          this.player.money -= 200;
        }

        const compraBonusTouched = this.changeButtonState(evt, this.compraBonus);
        if (compraBonusTouched && this.player.money > 0) {
          this.bonus = [];
          this.bonus = Utilities.createBonusArray(3, this.ctx);
          this.player.money -= 20;
        }
        for (let i = 0; i < this.pozioniBottoni.length; i++) {
          const bottonPozioneButtonTouched = this.changeButtonState(evt, this.pozioniBottoni[i]);
          if (bottonPozioneButtonTouched && this.player.pozioni.length > 0) {
            this.player.pozioneAntiCambioStati = true;
            this.player.pozioni.pop();
            this.pozioniBottoni[i].svuotaCasella();
          }
        }

      },
      false
    );

  }


  private changeButtonState(evt: MouseEvent, button: Bottone): boolean {
    const mousePos = Utilities.getMousePos(this.ctx.canvas, evt);
    const rect = {
      x: button.getX() * button.sideX,
      y: button.getY() * button.sideY,
      width: button.sideX,
      height: button.sideY,
    };
    let out = false;
    if (Utilities.isInside(mousePos, rect)) {
      button.state == 0 ? button.state = 1 : button.state = 0;
      out = true;
    }
    return out;
  }

  startGame() {
    this.level = 0;
    this.livelloSchema = 0;
    this.player = new Guerriero(this.ctx, 'blue', 1);
    this.player.setX(10);
    this.player.setY(10);
    this.player.setVelocita(0.9);
    this.player.name = 'Tetramarco';
    this.player.posizioneInfoLabelX = 30;
    this.player.posizioneInfoLabelY = 700;
    this.player.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7];
    this.player.dannoCritico = 50;
    this.player.counterForCriticoTreshold = 10;
    this.player.isMorto = false;
    this.player.salute += 10000;
    this.player.money = 1000;
    this.player.stand();
    this.enemies = Utilities.createEnemiesArray(this.numeroNemici + 1, this.ctx, 1, this.player.salute);
    this.ctx.fillText('$' + this.player.money, 200, 40, 500);
    this.ctx.fillStyle = 'rgb(100,20,200)';
    this.ctx.fillRect(0, 300, 500, 300);
    if (!this.isStarted) {
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }






}
