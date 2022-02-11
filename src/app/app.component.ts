import { Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/bonus';
import { direzione } from './classes/costants.enum';
import { Guerriero } from './classes/guerriero';
import { Mago } from './classes/mago';
import { Square } from './classes/square';
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
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == KEY_CODE.DOWN_ARROW) {
      this.player.setDirection('BOTTOM');
    }
    if (event.keyCode == KEY_CODE.UP_ARROW) {
      this.player.setDirection('TOP');
    }
    if (event.keyCode == KEY_CODE.LEFT_ARROW) {
      this.player.setDirection('LEFT');
    }
    if (event.keyCode == KEY_CODE.RIGHT_ARROW) {
      this.player.setDirection('RIGHT');
    }
    if (event.keyCode == 32) {
      this.player.setDirection('STAND');
    }
  }
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  nemico!: Guerriero;
  player!: Mago;
  counterRoutine = 0;
  counterAnimation = 0;
  isCharterColliding = false;
  bonus: Bonus[] = [];
  isQualcunoMorto = false;
  constructor(private ngZone: NgZone) { }
  ngOnInit(): void {

   }

  reset() { }

  charterMovmentRandomRoutine(charter: Square) {
    if (this.counterRoutine % 10 == 0) {
      this.direzionaRandomicamenteCharter(charter);
    }
    this.directionToMoveSwitch(charter);
  }
  private directionToMoveSwitch(charter: Square) {
    switch (charter.getDirection()) {
      case 'TOP':
        charter.moveTop();
        break;
      case 'BOTTOM':
        charter.moveBottom();
        break;
      case 'LEFT':
        charter.moveLeft();
        break;
      case 'RIGHT':
        charter.moveRight();
        break;
      default:
        charter.stand();
    }
  }

  animate(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (!this.isQualcunoMorto) {
      for (let i = 0; i < this.bonus.length; i++) {
        let isJustRimosso = false;
        if (this.rectsColliding(this.player, this.bonus[i])) {
          this.player[this.bonus[i].getTipoBonus()] += this.bonus[i].quantita;
          this.bonus.pop();
          isJustRimosso = true;
        }
        if (this.bonus.length > 0 && !isJustRimosso) {
          if (this.rectsColliding(this.nemico, this.bonus[i])) {
            this.nemico[this.bonus[i].getTipoBonus()] += this.bonus[i].quantita;
            this.bonus.pop();

          }
        }
      }
    }

    if (!this.isCharterColliding) {

      if (!this.nemico.isMorto) {
        this.nemico.setDirection(this.getDirectionFromEnemy({ cercatore: this.nemico, cercato: this.player }));
        this.directionToMoveSwitch(this.nemico);
      } else {
        this.directionToMoveSwitch(this.nemico);
      }
      if (!this.player.isMorto) {
        //this.player.setDirection(this.getDirectionFromEnemy({ cercatore: this.player, cercato: this.nemico }));
        this.directionToMoveSwitch(this.player);

      } else {
        this.charterMovmentRandomRoutine(this.nemico);
      }
      if (
        !this.player.isMorto &&
        !this.nemico.isMorto &&
        this.rectsColliding(this.nemico, this.player)
      ) {
        this.isCharterColliding = true;
      }

    } else {
      this.nemico.attaccare(this.player);
      this.player.attaccare(this.nemico);
      this.nemico.stand();
      this.player.stand();
      if (this.nemico.salute <= 0) {
        this.nemico.isMorto = true;
        this.player.isWinner = true;
        this.isCharterColliding = false;
        this.isQualcunoMorto = true;
      }
      if (this.player.salute <= 0) {
        this.player.isMorto = true;
        this.nemico.isWinner = true;
        this.isCharterColliding = false;
        this.isQualcunoMorto = true;
      }
    }



    if (!(this.player.salute <= 0 || this.nemico.salute <= 0)) {
      for (let i = 0; i < this.bonus.length; i++) {
        this.charterMovmentRandomRoutine(this.bonus[i]);
      }
    } else {
      for (let i = 0; i < this.bonus.length; i++) {
        this.bonus[i].setX(9999);
        this.bonus[i].setY(9999);
      }
    }
    this.nemico.counterAnimation = this.counterAnimation;
    this.player.counterAnimation = this.counterAnimation;

    //velocità animazione ogni 
    if (this.counterRoutine % 4 == 0) {
      //step animazione 
      this.counterAnimation === 2
        ? (this.counterAnimation = 0)
        : this.counterAnimation++;
    }
    this.counterRoutine === 399
      ? (this.counterRoutine = 0)
      : this.counterRoutine++;

    requestAnimationFrame(this.animate.bind(this));

  }


  getDirectionFromEnemy({ cercatore, cercato }: { cercatore: Square; cercato: Square; }): direzione {
    let out: direzione = 'STAND';

    if (cercato.getX() > cercatore.getX()) {//cercato a sinisistra del Cercatore
      out = 'RIGHT';
    } else if (cercato.getX() < cercatore.getX()) {//cercato a destra del cercatore
      out = 'LEFT';
    }

     if (cercato.getX() - cercatore.getX() < 1 ) {//cercato e cercatore in linea
      if (cercato.getY() > cercatore.getY()) { //cercato sotto il cercatore
        out = 'BOTTOM';
      } else if (cercato.getY() < cercatore.getY()) {//cercato sopra il cercatore
        out = 'TOP';
      } 
    }
    return out;
  }

  direzionaRandomicamenteCharter(charter: Square) {
    const direzione: direzione[] = ["TOP", "BOTTOM", "LEFT", "RIGHT", "STAND"];
    const random = Math.floor(Math.random() * direzione.length);
    charter.setDirection(direzione[random]);
  }

  rectsColliding(r1: Square, r2: Square) {
    return !(
      r1.getX() > r2.getX() + 1 ||
      r1.getX() + 1 < r2.getX() ||
      r1.getY() > r2.getY() + 1 ||
      r1.getY() + 1 < r2.getY()
    );
  }

  ngAfterViewInit(): void {

    const res = this.canvasGui.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2d context');
    }
    this.ctx = res;
    this.nemico = new Guerriero(this.ctx, 'green');
    this.nemico.setX(0);
    this.nemico.setY(0);
    this.nemico.setZ(20);
    this.nemico.setVelocita(0.4);
    this.nemico.spazioInPiuX=60;
    this.nemico.spazioInPiuY=20;
    this.nemico.name = 'Manduca';
    this.nemico.posizioneInfoLabelX = 270;
    this.nemico.posizioneInfoLabelY = 480;
    this.nemico.numeriFortunati = [8, 9, 2, 3, 4, 5, 6, 7];
    this.nemico.dannoCritico = 100;
    this.nemico.counterForCriticoTreshold = 10;
    this.nemico.stand();

    this.player = new Mago(this.ctx, 'blue');
    this.player.setX(20);
    this.player.setY(20);
    this.player.setZ(20);
    this.player.setVelocita(0.4);
    this.player.spazioInPiuX=20;
    this.player.spazioInPiuY=60;
    this.player.name = 'Tetramarco';
    this.player.posizioneInfoLabelX = 30;
    this.player.posizioneInfoLabelY = 480;
    this.player.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7];
    this.player.dannoCritico = 5;
    this.player.counterForCriticoTreshold = 100;
    this.player.stand();

    for (let i = 0; i < 9; i++) {
      let bonus: Bonus;
      bonus = new Bonus(this.ctx, 'red', 'forza', 10)
      const a = i + 1;
      switch (a % 3) {
        case 0: bonus = new Bonus(this.ctx, 'red', 'forza', 50);
          break;
        case 1: bonus = new Bonus(this.ctx, 'green', 'intelligenza', 50);
          break;
        case 2: bonus = new Bonus(this.ctx, 'blue', 'salute', 1000);
          break;
      }

      bonus.setX(Math.floor(Math.random() * 50));
      bonus.setY(Math.floor(Math.random() * 20));
      bonus.setZ(20);
      bonus.setVelocita(0.3);
      this.bonus.push(bonus);
    }
    this.ngZone.runOutsideAngular(() => this.animate());
  }


}
