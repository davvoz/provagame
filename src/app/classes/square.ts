import { direzione } from "./costants.enum";

export class Square {
  private color = 'red';
  private x = 0;
  private y = 0;
  private _sideX = 50;
  private _sideY = 70;
  public get sideX() {
    return this._sideX;
  }
  public set sideX(value) {
    this._sideX = value;
  }
  public get sideY() {
    return this._sideY;
  }
  public set sideY(value) {
    this.sideY = value;
  }

  private velocita = 1;
  private direction:direzione = 'STAND';

  constructor(public ctx: CanvasRenderingContext2D, color: string) {
    this.color = color;
  }

  getDirection() {
    return this.direction;
  }
  setDirection(direction: direzione) {
    this.direction = direction;
  }
  stand() {
    this.draw();
  }
  moveRight() {
    this.direction = 'RIGHT';
    if (this.x * this.sideX < this.ctx.canvas.width - this.sideX ) {//serve a non uscire dalla canvas senza collision detection
      this.x = this.x + this.velocita;
    }
    this.draw();
  }
  moveLeft() {
    this.direction = 'LEFT';
    if (this.x * this.sideX > 0 ) {
      this.x = this.x - this.velocita;
    }
    this.draw();
  }
  moveTop() {
    this.direction = 'TOP';
    if (this.y * this.sideX > 0 ) {
      this.y = this.y - this.velocita;
    }
    this.draw();
  }
  moveBottom() {
    this.direction = 'BOTTOM';
    if (this.y * this.sideY < this.ctx.canvas.height - this.sideY) {
      this.y = this.y + this.velocita ;
    }
    this.draw();
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(this.sideX * this.x, this.sideY * this.y, this.sideX, this.sideY);
    this.ctx.strokeRect(this.sideX * this.x, this.sideY * this.y, this.sideX, this.sideY);
  }

  getVelocita(): number {
    return this.velocita;
  }
  setVelocita(velocita: number) {
    this.velocita = velocita;
  }
  getX(): number {
    return this.x;
  }
  setX(x: number) {
    this.x = x;
  }
  getY(): number {
    return this.y;
  }
  setY(y: number) {
    this.y = y;
  }
  getColor(): string {
    return this.color;
  }
  setColor(color: string) {
    this.color = color;
  }
  
}
