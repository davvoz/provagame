import { Charter } from "../abstract/charter";
import { classe } from "../utils/costants.enum";
import { Square } from "./square";

export class Proiettile extends Square {

  counterAnimationDieText = 0;
  counterAnimationDieTextThO = 200;
  spriteSheet = 'assets/images/edwardAtk.png';
  image = new Image();
  counterAnimation = 0;
  classe: classe = 'ABSTRACT';
  firebalTopBotPath = 'assets/images/fireballs2TB.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, originX: number, originY: number, classe: classe) {
    super(ctx, color);
    this.setX(originX);
    this.setY(originY);
    this.classe = classe;
    switch (this.classe) {
      case 'BULLO': this.spriteSheet = 'assets/images/fireballs2.png';
        break;
      case 'MAGO': this.spriteSheet = 'assets/images/fireballs2.png';
        break;
      case 'GUERRIERO': this.spriteSheet = 'assets/images/edwardAtk.png';
        break;
      case 'SAMURAI': this.spriteSheet = 'assets/images/edwardAtk.png';
        break;
      case 'ARCERE': this.spriteSheet = 'assets/images/edwardAtk.png';
        break;
    }
    this.image.src = this.spriteSheet;

  }

  lanciaAbilita(charter: Charter): void {
    switch (this.classe) {
      case 'BULLO': charter.updateSituazioneConditions(
        {
          conditionType: 'FIRE',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
      case 'MAGO': charter.updateSituazioneConditions(
        {
          conditionType: 'FIRE',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
      case 'GUERRIERO': charter.updateSituazioneConditions(
        {
          conditionType: 'VENO',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
      case 'SAMURAI': charter.updateSituazioneConditions(
        {
          conditionType: 'VENO',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
      case 'ARCERE': charter.updateSituazioneConditions(
        {
          conditionType: 'VENO',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
    }

  }

  override moveRight() {
    this.setDirection('RIGHT');
    this.setX(this.getX() + this.getVelocita());
    this.draw();
  }
  override moveLeft() {
    this.setDirection('LEFT');
    this.setX(this.getX() - this.getVelocita());
    this.draw();
  }
  override moveTop() {
    this.setDirection('TOP');
    this.setY(this.getY() - this.getVelocita());
    this.draw();
  }
  override moveBottom() {
    this.setDirection('BOTTOM');
    this.setY(this.getY() + this.getVelocita());
    this.draw();
  }
  override draw(): void {
    this.ctx.fillStyle = this.getColor();

    if (this.classe !== 'MAGO' && this.classe !== 'BULLO') {
      this.ctx.drawImage(this.image, this.image.width / 4 * this.counterAnimation, 0, this.image.width / 4, this.image.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90)

    }
    if (this.classe === 'MAGO' || this.classe === 'BULLO') {
      let result = 0;
      if (this.counterAnimation == 2) {
        result = 0;
      }
      if (this.counterAnimation == 3) {
        result = 1;
      } else {
        result = this.counterAnimation;
      }
      switch (this.getDirection()) {
        case 'BOTTOM':
          this.image.src = this.firebalTopBotPath;
          this.ctx.drawImage(this.image,
            this.image.width / 2,
            this.image.height / 2 * result,
            this.image.width / 2,
            this.image.height / 2,
            this.getX() * this.sideX,
            this.getY() * this.sideY,
            30, 90)
          break;
        case 'TOP':
          this.image.src = this.firebalTopBotPath;
          this.ctx.drawImage(this.image,
            0,
            this.image.height / 2 * result,
            this.image.width / 2,
            this.image.height / 2,
            this.getX() * this.sideX,
            this.getY() * this.sideY,
            30, 90)
          break;
        case 'LEFT':
          this.image.src = this.spriteSheet;
          this.ctx.drawImage(this.image,
            this.image.width / 2 * result,
            this.image.height / 2,
            this.image.width / 2,
            this.image.height / 2,
            this.getX() * this.sideX,
            this.getY() * this.sideY,
            90, 30)
          break;
        case 'RIGHT':
          this.image.src = this.spriteSheet;
          this.ctx.drawImage(this.image,
            this.image.width / 2 * result,
            0,
            this.image.width / 2,
            this.image.height / 2,
            this.getX() * this.sideX,
            this.getY() * this.sideY,
            90, 30)
          break;
      }

    }

    //this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX, this.sideY);
    if (this.counterAnimationDieText < this.counterAnimationDieTextThO) {
      this.counterAnimationDieText++;
    } else {
      this.counterAnimationDieText = this.counterAnimationDieTextThO + 1;
    }
  }
}