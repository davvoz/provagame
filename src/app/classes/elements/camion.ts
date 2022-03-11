import { SquareConfig } from '../utils/costants.enum';
import { Utilities } from '../utils/utilities';
import { Square } from './square';

export class Camion extends Square {

  image = new Image();
  isPlayerMorto = false;

  constructor(configurazioneInziale:SquareConfig) {
  super(configurazioneInziale);
    this.image.src = 'assets/images/camion.png';
  }
  
  override draw(): void {
    this.config.ctx.strokeStyle = this.getColor();
    this.config.ctx.strokeRect(
      this.getX() * this.config.w, this.getY() * this.config.h, this.image.width, this.image.height);
    this.config.ctx.drawImage(this.image,
      0, 0,
      this.image.width, this.image.height,
      this.getX() * this.config.w, this.getY() * this.config.h,
      this.image.width, this.image.height);
    if (this.isPlayerMorto) {
      this.aggiornaScritta();
    }
  }

  private aggiornaScritta() {
    this.config.ctx.font = 'normal bolder 15px Orbitron';
    this.config.ctx.fillStyle = 'rgb(200,150,10)';
    this.config.ctx.fillText('YOU ARE DEAD DUMBASS', this.getX() * this.config.w + 460, this.getY() * this.config.h + 100, 300);
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
    if (this.getX() * this.config.w + this.image.width > 0) {
      this.setDirection('LEFT');
      Utilities.directionToMoveSwitch(this);
    } else {
      this.setX(29);
      this.setY(Utilities.arrayRandomicoNumerico([1, 2, 3, 4]));
    }
  }

}
