import { Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/bonus';
import { Bottone } from './classes/bottone';
import { Charter } from './classes/charter';
import { Guerriero } from './classes/guerriero';
import { Mago } from './classes/mago';
import { Square } from './classes/square';
import { Utilities } from './classes/utilities';
export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isMagoScelto: boolean = false;
  level = 0;
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
  qtaInizialeNemici = 1;
  bonusCount = 0;
  startButton!: Bottone;
  pauseButton!: Bottone;
  compraBonus!: Bottone;
  incrementaLivelloButton!: Bottone;
  isStarted = false;
  initLevel = 0;
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
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if(this.player.isMorto){
      this.startButton.state == 1;
      
    }
    this.update();

    this.collisionDetenction();
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
        //this.enemies[i].setDirection('STAND');
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
      this.bonus[j].counterAnimation = this.counterAnimation;
      if (this.bonus[j].getPlafond() > 0) {
        if (Utilities.rectsColliding(this.bonus[j], this.player)) {
          this.player[this.bonus[j].getTipoBonus()] += this.bonus[j].getQuantita() * this.player.livello * 50;
          this.bonus[j].setPlafond(this.bonus[j].getPlafond() - this.bonus[j].getQuantita());
        }
      }
      this.bonusCount += this.bonus[j].getPlafond();
    }
    if (dieCount == this.enemies.length || this.enemies.length <= 0) {
      this.player.incrementaLivello();
      this.qtaInizialeNemici++;
      this.enemies = [];
      this.enemies = Utilities.createEnemiesArray(this.qtaInizialeNemici, this.ctx, this.initLevel, this.player.salute);
      this.bonus = [];
      this.bonus = Utilities.createBonusArray(this.qtaInizialeNemici, this.ctx);
      this.initLevel++;
      this.level++;
    }
    Utilities.directionToMoveSwitch(this.player);
  }

  update() {
    this.startButton.stand();
    this.incrementaLivelloButton.stand();
    this.compraBonus.stand();
    this.ctx.fillText('$' + this.player.money, 200, 40, 500);
    this.ctx.fillText('Livello ' + this.level, 350, 40, 500);
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

    
    this.ctx.canvas.addEventListener(
      'click',
      (evt) => {

        const startButtonTouched = this.changeButtonState(evt, this.startButton);
          if (startButtonTouched) {
            this.startGame();
            this.level = 0;
            this.initLevel = 1;
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
    this.player = new Mago(this.ctx, 'blue', 1);
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
    this.bonus = Utilities.createBonusArray(this.initLevel, this.ctx);
    this.enemies = Utilities.createEnemiesArray(this.qtaInizialeNemici, this.ctx, this.initLevel, this.player.salute);
    this.ctx.fillText('$' + this.player.money, 200, 40, 500);

    if (!this.isStarted) {
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }






}
