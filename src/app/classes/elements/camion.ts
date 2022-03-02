import { Utilities } from '../utils/utilities';
import { Square } from './square';

export class Camion extends Square {

  image = new Image();
  isPlayerMorto = false;

  constructor(public override ctx: CanvasRenderingContext2D, color: string) {
    super(ctx, color);
    this.image.src = 'assets/images/camion.png';
  }
  override draw(): void {
    this.ctx.strokeStyle = this.getColor();
    this.ctx.strokeRect(
      this.getX() * this.sideX, this.getY() * this.sideY, this.image.width, this.image.height);
    this.ctx.drawImage(this.image,
      0, 0,
      this.image.width, this.image.height,
      this.getX() * this.sideX, this.getY() * this.sideY,
      this.image.width, this.image.height);
    if (this.isPlayerMorto) {
      this.aggiornaScritta();
    }
  }
  private aggiornaScritta() {
    this.ctx.font = 'normal bolder 15px Orbitron';
    this.ctx.fillStyle = 'rgb(200,150,10)';
    this.ctx.fillText('YOU ARE DEAD DUMBASS', this.getX() * this.sideX + 460, this.getY() * this.sideY + 100, 300);
  }

  override moveRight() {
    this.setDirection('RIGHT');
    this.setX(this.getX() + this.getVelocita());
    this.draw();
  }
  override  moveLeft() {
    this.setDirection('LEFT');
    this.setX(this.getX() - this.getVelocita());
    this.draw();
  }

  setCamion() {
    if (this.getX() * this.sideX + this.image.width > 0) {
      this.setDirection('LEFT');
      Utilities.directionToMoveSwitch(this);
    } else {
      this.setX(29);
      this.setY(Utilities.arrayRandomicoNumerico([1, 2, 3, 4]));
    }
  }

}
