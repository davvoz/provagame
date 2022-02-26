import { Square } from './square';

export class Bottone extends Square {
  private text = 'BOTTONE';
  secondText = '';
  state = 0;
  terzoText = '';
  constructor(
    public override ctx: CanvasRenderingContext2D,
    color: string,
  ) {
    super(ctx, color);
    this.sideX = 70;
    this.sideY = this.sideX;
  }
  override draw() {
    this.disegnaMe();
    this.scriviAltriTesti();
  }
  disegnaMe() {
    this.ctx.fillStyle= this.getColor();
    this.ctx.fillRect(
      this.sideX * this.getX(),
      this.sideY * this.getY() + 10,
      this.sideX,
      this.sideY
    );
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(
      this.sideX * this.getX(),
      this.sideY * this.getY() + 10,
      this.sideX,
      this.sideY
    );
    this.ctx.font = 'normal bolder 15px Orbitron';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(
      this.text,
      this.getX() * this.sideX,
      this.getY() * this.sideY + this.sideY / 2 + 10,
      this.sideX
    );
  }

  scriviAltriTesti() {
    this.ctx.fillText(
      this.secondText,
      this.getX() * this.sideX,
      this.getY() * this.sideY + this.sideY / 2 + 29,
      this.sideX
    );
    this.ctx.fillText(
      this.terzoText,
      this.getX() * this.sideX,
      this.getY() * this.sideY + this.sideY / 2 - 10,
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
