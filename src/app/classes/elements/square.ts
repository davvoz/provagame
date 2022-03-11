import { direzione, SquareConfig } from "../utils/costants.enum";

export class Square {

  private velocita = 1;
  private direction: direzione = 'STAND';
  config!: SquareConfig;
  constructor( configurazioneIniziale: SquareConfig) {
    this.config = configurazioneIniziale
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
    if (this.config.x * this.config.w < this.config.ctx.canvas.width - this.config.w) {
      this.config.x = this.config.x + this.velocita;
    }
    this.draw();
  }
  moveLeft() {
    this.direction = 'LEFT';
    if (this.config.x * this.config.w > 0) {
      this.config.x = this.config.x - this.velocita;
    }
    this.draw();
  }
  moveTop() {
    this.direction = 'TOP';
    if (this.config.y * this.config.w > 50) {
      this.config.y = this.config.y - this.velocita;
    }
    this.draw();
  }
  moveBottom() {
    this.direction = 'BOTTOM';
    if (this.config.y * this.config.h < 550) {
      this.config.y = this.config.y + this.velocita;
    }
    this.draw();
  }
  draw() {
    this.config.ctx.fillStyle = this.config.color;
    this.config.ctx.lineWidth = 1;
    this.config.ctx.strokeStyle = 'black';
    this.config.ctx.fillRect(this.config.w * this.config.x, this.config.h * this.config.y, this.config.w, this.config.h);
    this.config.ctx.strokeRect(this.config.w * this.config.x, this.config.h * this.config.y, this.config.w, this.config.h);
  }

  getVelocita(): number {
    return this.velocita;
  }
  setVelocita(velocita: number) {
    this.velocita = velocita;
  }
  getX(): number {
    return this.config.x;
  }
  setX(x: number) {
    this.config.x = x;
  }
  getY(): number {
    return this.config.y;
  }
  setY(y: number) {
    this.config.y = y;
  }
  getColor(): string {
    return this.config.color;
  }
  setColor(color: string) {
    this.config.color = color;
  }


}
