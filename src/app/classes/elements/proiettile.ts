import { Charter } from "../abstract/charter";
import { classeProiettile, SquareConfig } from "../utils/costants.enum";
import { Square } from "./square";

export class Proiettile extends Square {

  spriteSheet = 'assets/images/edwardAtk.png';
  image = new Image();
  counterAnimation = 0;
  classe: classeProiettile = 'ABSTRACT';
  constructor(configurazioneInziale: SquareConfig, srcPath: string, cp: classeProiettile) {
    super(configurazioneInziale);
    this.spriteSheet = srcPath;
    this.classe = cp;
    this.image.src = this.spriteSheet;

  }

  lanciaAbilita(charter: Charter): void {
    switch (this.classe) {
      case 'PALLADIFUOCO': charter.updateMalefici(
        {
          malus: 'FIRE',
          quantita: 9,
          totTurni: 150,
          value: true
        }
      )
        break;
      case 'COLTELLO': charter.updateMalefici(
        {
          malus: 'BLOOD',
          quantita: 12,
          totTurni: 75,
          value: true
        }
      )
        break;
      case 'RAGNO': charter.updateMalefici(
        {
          malus: 'BLOCK',
          quantita: 9,
          totTurni: 150,
          value: true
        }
      )
        break;
      case 'HAMMER': charter.updateMalefici(
        {
          malus: 'STUN',
          quantita: 5,
          totTurni: 190,
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

    if (this.classe == 'COLTELLO') {
      this.drawColtello();
    }

    if (this.classe == 'RAGNO') {
      this.drawRagno();
    }

    if (this.classe == 'PALLADIFUOCO') {
      this.drawPallaDiFuoco();
    }
  }

  private drawPallaDiFuoco() {
    this.drawRagno();
  }

  private drawRagno() {
    let riga = 0;
    switch (this.getDirection()) {
      case 'BOTTOM':
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

  private drawColtello() {
    let colonna = this.image.width / 4 * this.counterAnimation;
    this.config.ctx.drawImage(this.image, colonna, 0, this.image.width / 4, this.image.height, this.config.x * this.config.w, this.config.y * this.config.h, 70, 90);
  }

  private drawHammer() {
    let colonna = this.image.width / 4 * this.counterAnimation;
    this.config.ctx.drawImage(this.image, colonna, 0, this.image.width / 4, this.image.height, this.config.x * this.config.w, this.config.y * this.config.h, 70, 90);
  }
}