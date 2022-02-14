import { Square } from './square';

export class Bottone extends Square {
  private text = 'BOTTONE';
  state = 0;
  constructor(
    public override ctx: CanvasRenderingContext2D,
    color: string,
  ) {
    super(ctx, color);

  }
  override draw() {
    if (this.state == 0) {

      this.ctx.fillStyle = 'grey';
    } else {

      this.ctx.fillStyle ='red' ;
    }
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(
      this.sideX * this.getX(),
      this.sideY * this.getY(),
      this.sideX,
      this.sideY
    );
    this.ctx.strokeRect(
      this.sideX * this.getX(),
      this.sideY * this.getY(),
      this.sideX,
      this.sideY
    );
    this.ctx.font = '20px IMPACT';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(
      this.text,
      this.getX() * this.sideX,
      this.getY() * this.sideY + this.sideY,
      this.sideX
    );
  }
  getText(): string {
    return this.text;
  }
  setText(text: string) {
    this.text = text;
  }
}
