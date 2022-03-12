import { Charter } from "../abstract/charter";
import { classe, classeProiettile, SquareConfig } from "../utils/costants.enum";
import { Square } from "./square";

export class Proiettile extends Square {

  spriteSheet = 'assets/images/edwardAtk.png';
  image = new Image();
  counterAnimation = 0;
  classe: classeProiettile = 'ABSTRACT';
  firebalTopBotPath = 'assets/images/fireballs2TB.png';
  constructor(configurazioneInziale: SquareConfig, srcPath: string, classe: classeProiettile) {
    super(configurazioneInziale);
    this.spriteSheet = srcPath;
    this.classe = classe
    this.image.src = this.spriteSheet;

  }

  lanciaAbilita(charter: Charter): void {
    switch (this.classe) {
      case 'PALLADIFUOCO': charter.updateMalefici(
        {
          malus: 'FIRE',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
      case 'EDWARD': charter.updateMalefici(
        {
          malus: 'STUN',
          quantita: 60,
          totTurni: 350,
          value: true
        }
      )
        break;
      case 'RAGNO': charter.updateMalefici(
        {
          malus: 'BLOCK',
          quantita: 10,
          totTurni: 750,
          value: true
        }
      )
        break;
      case 'HAMMER': charter.updateMalefici(
        {
          malus: 'STUN',
          quantita: 60,
          totTurni: 750,
          value: true
        }
      )
        break;
    }

  }

  override moveRight() {
    this.setDirection('RIGHT');
    this.config.x = this.config.x + this.config.velocita;
    this.draw();
  }
  override moveLeft() {
    this.setDirection('LEFT');
    this.config.x = this.config.x - this.config.velocita;
    this.draw();
  }
  override moveTop() {
    this.setDirection('TOP');
    this.config.y = this.config.y - this.config.velocita;
    this.draw();
  }
  override moveBottom() {
    this.setDirection('BOTTOM');
    this.config.y = this.config.y + this.config.velocita;
    this.draw();
  }
  override draw(): void {
    this.config.ctx.fillStyle = this.config.color;

    if (this.classe == 'HAMMER') {
      this.drawHammer();
    }

    if (this.classe == 'EDWARD') {
      this.drawEdward();
    }

    if (this.classe == 'RAGNO') {
      this.drawRagno();
    }

    if (this.classe == 'PALLADIFUOCO') {
      this.drawPallaDiFuoco();
    }
  }

  private drawPallaDiFuoco() {
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
        this.config.ctx.drawImage(this.image,
          this.image.width / 2,
          this.image.height / 2 * result,
          this.image.width / 2,
          this.image.height / 2,
          this.config.x * this.config.w,
          this.config.y * this.config.h,
          30, 90);
        break;
      case 'TOP':
        this.image.src = this.firebalTopBotPath;
        this.config.ctx.drawImage(this.image,
          0,
          this.image.height / 2 * result,
          this.image.width / 2,
          this.image.height / 2,
          this.config.x * this.config.w,
          this.config.y * this.config.h,
          30, 90);
        break;
      case 'LEFT':
        this.image.src = this.spriteSheet;
        this.config.ctx.drawImage(this.image,
          this.image.width / 2 * result,
          this.image.height / 2,
          this.image.width / 2,
          this.image.height / 2,
          this.config.x * this.config.w,
          this.config.y * this.config.h,
          90, 30);
        break;
      case 'RIGHT':
        this.image.src = this.spriteSheet;
        this.config.ctx.drawImage(this.image,
          this.image.width / 2 * result,
          0,
          this.image.width / 2,
          this.image.height / 2,
          this.config.x * this.config.w,
          this.config.y * this.config.h,
          90, 30);
        break;
    }
  }

  private drawRagno() {
    let riga = 0;
    switch (this.getDirection()) {
      case 'BOTTOM': riga = 0;
        break;
      case 'TOP': riga = this.image.height / 4 * 2;
        break;
      case 'LEFT': riga = this.image.height / 4;
        break;
      case 'RIGHT': riga = this.image.height / 4 * 3;
        break;
    }
    let colonna = this.image.width / 4 * this.counterAnimation;
    this.config.ctx.drawImage(this.image, colonna, riga, this.image.width / 4, this.image.height / 4, this.config.x * this.config.w, this.config.y * this.config.h, 70, 90);
  }

  private drawEdward() {
    let riga = 0;
    switch (this.getDirection()) {
      case 'BOTTOM': riga = 0;
        break;
      case 'TOP': riga = this.image.height / 4 * 3;
        break;
      case 'LEFT': riga = this.image.height / 4;
        break;
      case 'RIGHT': riga = this.image.height / 4 * 2;
        break;
    }
    let colonna = this.image.width / 4 * this.counterAnimation;
    this.config.ctx.drawImage(this.image, colonna, riga, this.image.width / 4, this.image.height / 4, this.config.x * this.config.w, this.config.y * this.config.h, 70, 90);
  }

  private drawHammer() {
    let colonna = this.image.width / 4 * this.counterAnimation;
    this.config.ctx.drawImage(this.image, colonna, 0, this.image.width / 4, this.image.height, this.config.x * this.config.w, this.config.y * this.config.h, 70, 90);
  }
}