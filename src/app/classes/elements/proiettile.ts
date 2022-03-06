import { Square } from "./square";

export class Proiettile extends Square {

  counterAnimationDieText = 0;
  counterAnimationDieTextThO = 200;
  spriteSheet = 'assets/images/edwardAtk.png';
  image = new Image();
  counterAnimation = 0;
  constructor(public override ctx: CanvasRenderingContext2D, color: string, originX: number, originY: number) {
    super(ctx, color);
    this.setX(originX);
    this.setY(originY);
    this.image.src = this.spriteSheet;
    //this.setVelocita(0.9);
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

    // rotate the rect
    switch (this.counterAnimation) {
      case 0: break;
      case 1: break;
      case 2: break;
      case 3: break;
    }

    this.ctx.drawImage(this.image,  this.image.width / 4 * this.counterAnimation, 0, this.image.width / 4, this.image.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90)

    this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX, this.sideY);
    if (this.counterAnimationDieText < this.counterAnimationDieTextThO) {
      this.counterAnimationDieText++;
    } else {
      this.counterAnimationDieText = this.counterAnimationDieTextThO + 1;
    }
  }
}