import { direzione } from "./costants.enum";

export class Square {
  private color = 'red';
  private x = 0;
  private y = 0;
  private z = 50;
  private velocita = 1;
  private direction:direzione = 'STAND';
   spazioInPiuX = 0;
   spazioInPiuY = 0;
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
    if (this.x * this.z < this.ctx.canvas.width - this.z - this.spazioInPiuX) {
      this.x = this.x + this.velocita;
    }
    this.draw();
  }
  moveLeft() {
    this.direction = 'LEFT';
    if (this.x * this.z > 0 + this.spazioInPiuX) {
      this.x = this.x - this.velocita;
    }
    this.draw();
  }
  moveTop() {
    this.direction = 'TOP';
    if (this.y * this.z > 0 - this.spazioInPiuY) {
      this.y = this.y - this.velocita;
    }
    this.draw();
  }
  moveBottom() {
    this.direction = 'BOTTOM';
    if (this.y * this.z < this.ctx.canvas.height - this.z - this.spazioInPiuY) {
      this.y = this.y + this.velocita ;
    }
    this.draw();
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
    this.ctx.strokeRect(this.z * this.x, this.z * this.y, this.z, this.z);
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
  getZ(): number {
    return this.z;
  }
  setZ(z: number) {
    this.z = z;
  }
}
