import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Bonus } from './classes/bonus';
import { direzione } from './classes/costants.enum';
import { Guerriero } from './classes/guerriero';
import { Mago } from './classes/mago';
import { Square } from './classes/square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  guerrieroUno!: Guerriero;
  magoUno!: Mago;
  counterRoutine = 0;
  counterAnimation = 0;
  isCharterColliding = false;
  bonus: Bonus[] = [];
  isQualcunoMorto = false;
  constructor(private ngZone: NgZone) { }
  ngOnInit(): void { }

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

    if (!this.isCharterColliding) {
      if (!this.guerrieroUno.isMorto) {

        this.guerrieroUno.setDirection(this.getDirectionFromEnemy(this.guerrieroUno, this.magoUno));
        this.directionToMoveSwitch(this.guerrieroUno);
      } else {
        this.directionToMoveSwitch(this.guerrieroUno);
      }
      if (!this.magoUno.isMorto) {
        this.magoUno.setDirection(this.getDirectionFromEnemy(this.magoUno, this.guerrieroUno));
        this.directionToMoveSwitch(this.magoUno);

      } else {
        this.charterMovmentRandomRoutine(this.guerrieroUno);
      }
      if (
        !this.magoUno.isMorto &&
        !this.guerrieroUno.isMorto &&
        this.rectsColliding(this.guerrieroUno, this.magoUno)
      ) {
        this.isCharterColliding = true;
      }

    } else {
      //voglio VERAMENTE attacare ad ogni frame?
      //sarebbe bello invece da lanciare un animazione ad hoc
      this.guerrieroUno.attaccare(this.magoUno);
      this.magoUno.attaccare(this.guerrieroUno);
      this.guerrieroUno.stand();
      this.magoUno.stand();
      if (this.guerrieroUno.salute <= 0) {
        this.guerrieroUno.isMorto = true;
        this.magoUno.isWinner = true;
        this.isCharterColliding = false;
        this.isQualcunoMorto = true;
      }
      if (this.magoUno.salute <= 0) {
        this.magoUno.isMorto = true;
        this.guerrieroUno.isWinner = true;
        this.isCharterColliding = false;
        this.isQualcunoMorto = true;
      }
    }
    if (!this.isQualcunoMorto) {
      for (let i = 0; i < this.bonus.length; i++) {
        if (this.rectsColliding(this.magoUno, this.bonus[i])) {
          this.magoUno[this.bonus[i].getTipoBonus()] += this.bonus[i].quantita;
          this.bonus.pop();
        }
        if (this.bonus.length > 0) {
          if (this.rectsColliding(this.guerrieroUno, this.bonus[i])) {
            this.guerrieroUno[this.bonus[i].getTipoBonus()] += this.bonus[i].quantita;
            this.bonus.pop();
  
          }
        }
      }
    }
    

    if (!(this.magoUno.salute <= 0 || this.guerrieroUno.salute <= 0)) {
      for (let i = 0; i < this.bonus.length; i++) {
        this.charterMovmentRandomRoutine(this.bonus[i]);
      }
    } else {
      for (let i = 0; i < this.bonus.length; i++) {
        this.bonus[i].setX(9999);
        this.bonus[i].setY(9999);
      }
    }
    this.guerrieroUno.counterAnimation = this.counterAnimation;
    this.magoUno.counterAnimation = this.counterAnimation;

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


  getDirectionFromEnemy(cercatore: Square, cercato: Square): direzione {
    let out: direzione = 'STAND';

    if (cercato.getX() > cercatore.getX()) {//cercato a sinisistra del Cercatore
      out = 'RIGHT';
    } else if (cercato.getX() < cercatore.getX()) {//cercato a destra del cercatore
      out = 'LEFT';
    }
    if (cercato.getX() - cercatore.getX() < 1) {//cercato e cercatore in linea
      if (cercato.getY() > cercatore.getY()) { //cercato sotto il cercatore
        out = 'BOTTOM';
      } else if (cercato.getY() < cercatore.getY()) {//cercato sopra il cercatore
        out = 'TOP';
      } else if (cercato.getY() === cercatore.getY()) {//evidendemente stanno collidendo
        out = 'STAND';
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
    this.guerrieroUno = new Guerriero(this.ctx, 'green');
    this.guerrieroUno.setX(Math.floor(Math.random() * 40));
    this.guerrieroUno.setY(Math.floor(Math.random() * 40));
    this.guerrieroUno.setZ(20);
    this.guerrieroUno.setVelocita(0.4);
    this.guerrieroUno.setSpazioInPiu(60);
    this.guerrieroUno.name = 'Manduca';
    this.guerrieroUno.posizioneInfoLabelX = 270;
    this.guerrieroUno.posizioneInfoLabelY = 480;
    this.guerrieroUno.numeriFortunati = [8, 9, 2, 3, 4, 5, 6, 7];
    this.guerrieroUno.dannoCritico = 100;
    this.guerrieroUno.counterForCriticoTreshold = 10;
    this.guerrieroUno.stand();

    this.magoUno = new Mago(this.ctx, 'blue');
    this.magoUno.setX(Math.floor(Math.random() * 40));
    this.magoUno.setY(Math.floor(Math.random() * 40));
    this.magoUno.setZ(20);
    this.magoUno.setVelocita(0.4);
    this.magoUno.setSpazioInPiu(60);
    this.magoUno.name = 'Tetramarco';
    this.magoUno.posizioneInfoLabelX = 30;
    this.magoUno.posizioneInfoLabelY = 480;
    this.magoUno.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7];
    this.magoUno.dannoCritico = 5;
    this.magoUno.counterForCriticoTreshold = 100;
    this.magoUno.stand();

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
