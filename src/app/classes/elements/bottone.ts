import { SquareConfig, statoBottone } from '../utils/costants.enum';
import { Square } from './square';

export class Bottone extends Square {
  private text = 'BOTTONE';
  secondText = '';
  state: statoBottone = 'OFF';
  terzoText = '';
  isToggle = false;
  isShowState = false;
  constructor(configurazioneInziale: SquareConfig, isToggle: boolean) {
    super(configurazioneInziale);
    this.isToggle = isToggle;
  }
  override draw() {
   
    this.disegnaMe();
   // this.scriviAltriTesti();
  }

  disegnaMe() {
    this.config.ctx.fillStyle = this.getColor();
    //this.config.ctx.fillRect(this.config.w * this.config.x, this.config.h * this.config.y, this.config.w, this.config.h);
    this.config.ctx.strokeRect(this.config.w * this.config.x, this.config.h * this.config.y, this.config.w, this.config.h);
    this.config.ctx.font = 'normal bolder 15px Orbitron';
    this.config.ctx.fillStyle = 'black';
    this.config.ctx.fillText(
      this.text,
      this.config.w * this.config.x, 
      this.config.h * this.config.y+ this.config.h /2,
      300
    );
  }

  scriviAltriTesti() {
    this.config.ctx.font = 'normal bolder 15px Orbitron';
    this.config.ctx.fillStyle = 'black';
    this.config.ctx.fillText(
      this.secondText,
      this.getX() * this.config.w,
      this.getY() * this.config.y + this.config.y + 29,
      this.config.w
    );
    this.config.ctx.fillText(
      this.terzoText,
      this.getX() * this.config.w,
      this.getY() * this.config.y + this.config.y - 10,
      this.config.w
    );
    if (this.isToggle && this.isShowState) {
      this.config.ctx.fillText(
        this.state,
        this.getX() * this.config.w,
        this.getY() * this.config.y + 60,
        this.config.w
      );
    }
  }
  getText(): string {
    return this.text;
  }
  setText(text: string) {
    this.text = text;
  }
}
