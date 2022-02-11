import { classe } from './costants.enum';
import { Square } from './square';

export abstract class Charter extends Square {
  salute = 0; //salute totale
  mana = 0; //mana totale
  forza = 0; // quanta hp togli in un attacco
  agilita = 0; //quanti attacchi al secondo TODO
  intelligenza = 0; //quanta hp togli  in un attacco
  resistenzaMagica = 0;
  resistenzaFisica = 0;
  posizioneInfoLabelX = 0;
  posizioneInfoLabelY = 0;
  numeriFortunati: number[] = []; //se il generatore random fa uno di questi numeri schivi
  isMorto = false;
  isWinner = false;
  classe: classe = 'ABSTRACT';
  name = 'Abstract cant instantiate';
  danniMagiciRicevuti = 0;
  danniFisiciRicevuti = 0;
  dannoCritico = 0;
  counterForCritico = 10;//il decimo attacco è danno critico (danno normale * 10)
  counterForCriticoTreshold = 100;
  danniCriticiInflitti = 0;
  danniCriticiRicevuti = 0;
  counterAnimation = 0;
  spriteSheetCharterPath = '';
  spriteSheetImage = new Image();
   livello = 1;
  lanciaAbilita() { }

  override draw() {
    this.drawLabel();
    if (!this.isMorto) {
      this.setSprite();
      if (!this.isWinner) {
        this.drawBarraEnergia();
      }
    }
    
  }

 setSprite() {
    let riga = 0;
    switch (this.getDirection()) {
      case 'TOP': riga = this.spriteSheetImage.height / 4 * 3;//riga 4
        break;
      case 'BOTTOM': riga = 0;//riga 1
        break;
      case 'LEFT': riga = this.spriteSheetImage.height / 4* 2;//riga 2
        break;
      case 'RIGHT': riga = this.spriteSheetImage.height / 4 ;//riga 3
        break;
      default: riga = 0;
    }
    const sw = this.spriteSheetImage.width / 4;
    const sh = this.spriteSheetImage.height / 4;
    let colonna = this.spriteSheetImage.width / 4 * (this.counterAnimation + 1);
    this.ctx.drawImage(this.spriteSheetImage, colonna, riga, sw, sh, this.getX() * this.getZ(), this.getY() * this.getZ(), 60, 80)
  }

  drawLabel() {
    this.ctx.beginPath();
    this.ctx.fillStyle ='black';
    this.ctx.font = 'Arial 18px';
    this.ctx.fillText(
      this.name + ' : ' + this.salute.toFixed(0),
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY,
      300
    );
    this.ctx.fillText(
      'Forza : ' + this.forza,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - this.getZ(),
      300
    );
    this.ctx.fillText(
      'Resistenza : ' + this.resistenzaFisica,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - this.getZ() - this.getZ(),
      300
    );
    this.ctx.fillText(
      'intelligenza : ' + this.intelligenza,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - this.getZ() - this.getZ() - this.getZ(),
      300
    );
    this.ctx.closePath();
    this.ctx.fillText(
      'Resistenza magica : ' + this.resistenzaMagica,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ(),
      300
    );
    this.ctx.fillText(
      'Ruolo: ' + this.classe,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ(),
      300
    );
    if (this.isMorto || this.isWinner) {
      this.ctx.fillText(
        this.isWinner ? 'WINNER :)' : 'LOOSER :(',
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ(),
        300
      );
      this.ctx.fillText(
        'Danni magici ricevuti ' + this.danniMagiciRicevuti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ(),
        300
      );
      this.ctx.fillText(
        'Danni fisici ricevuti ' + this.danniFisiciRicevuti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ(),
        300
      );
      this.ctx.fillText(
        'Danni critici ricevuti ' + this.danniCriticiRicevuti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ(),
        300
      );
      this.ctx.fillText(
        'Danni critici inflitti ' + this.danniCriticiInflitti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ() -
        this.getZ(),
        300
      );
    }
  }
  
  drawBarraEnergia() {
    this.ctx.fillStyle =this.getColor();
    this.ctx.fillRect(
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ() -
      this.getZ(),
      this.salute / 1000, this.getZ()
    )
  }
  attaccare(charter: Charter) {
    let critico = 0;
    let isCritico = false;
    if (this.counterForCritico === this.counterForCriticoTreshold) {
      critico = this.forza * 10;
      this.danniCriticiInflitti += critico;
      isCritico = true;
    }
    charter.difendere(this.intelligenza, this.forza + critico, isCritico);
    this.counterForCritico === this.counterForCriticoTreshold ? this.counterForCritico = 0 : this.counterForCritico++;
  }

  difendere(dannoMagico: number, dannoFisico: number, isCritico: boolean) {
    const schiva = Math.floor(Math.random() * 10);
    let schivata = false;
    for (let a of this.numeriFortunati) {
      if (schiva == a) {
        schivata = true;
        break;
      }
    }//il critico non si schiva
    if (!schivata || isCritico) {
      isCritico ? this.danniCriticiRicevuti += dannoFisico : null;
      let dannoFisicoEffettivo = 0;
      let dannoMagicoEffettivo = 0;
      if (this.resistenzaMagica < dannoMagico) {
        dannoMagicoEffettivo = dannoMagico - this.resistenzaMagica;
      }
      if (this.resistenzaFisica < dannoFisico) {
        dannoFisicoEffettivo = dannoFisico - this.resistenzaFisica;
      }
      this.salute -= dannoFisicoEffettivo + dannoMagicoEffettivo;
      this.danniFisiciRicevuti += dannoFisicoEffettivo;
      this.danniMagiciRicevuti += dannoMagicoEffettivo;
    }
  }
}
//quando attacca ogni charter fa danno magico e danno fisico in base alla sua forza  e alla sua intelligenza .
