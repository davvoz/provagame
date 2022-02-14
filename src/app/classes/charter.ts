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
  money = 0;
  lanciaAbilita() { }

  override draw() {
    this.salute <= 0 ? this.isMorto = true : this.isMorto = false;
    this.drawLabel();
    this.drawBarraEnergia();
    if (!this.isMorto) {

      this.setSprite();
    }

  }

  setSprite() {
    let riga = 0;
    switch (this.getDirection()) {
      case 'TOP': riga = this.spriteSheetImage.height / 4 * 3;//riga 4
        break;
      case 'BOTTOM': riga = 0;//riga 1
        break;
      case 'LEFT': riga = this.spriteSheetImage.height / 4 * 2;//riga 2
        break;
      case 'RIGHT': riga = this.spriteSheetImage.height / 4;//riga 3
        break;
    }

    let colonna = this.spriteSheetImage.width / 4 * (this.counterAnimation + 1);
    this.ctx.drawImage(this.spriteSheetImage, colonna, riga, this.spriteSheetImage.width / 4, this.spriteSheetImage.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 60, 80)
  }

  drawLabel() {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.font = '15px Impact';
    // this.ctx.fillText(
    //   this.classe,
    //   this.getX() * this.sideX,
    //   this.getY() * this.sideY,
    //   300
    // );
    // this.ctx.fillText(
    //   this.name,
    //   this.getX() * this.sideX,
    //   this.getY() * this.sideY - 8,
    //   300
    // );
    this.ctx.fillText(
      this.name + ' : ' + this.salute.toFixed(0),
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY,
      300
    );
    this.ctx.fillText(
      'Forza : ' + this.forza,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - 20,
      300
    );
    this.ctx.fillText(
      'Resistenza : ' + this.resistenzaFisica,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - 20 - 20,
      300
    );
    this.ctx.fillText(
      'intelligenza : ' + this.intelligenza,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - 20 - 20 - 20,
      300
    );
    this.ctx.closePath();
    this.ctx.fillText(
      'Resistenza m: ' + this.resistenzaMagica,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY -
      20 -
      20 -
      20 -
      20,
      300
    );
    this.ctx.fillText(
      'RUolo : ' + this.classe,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY -
      20 -
      20 -
      20 -
      20 -
      20,
      300
    );
    if (this.isMorto) {
      this.ctx.fillText(
        !this.isMorto ? 'WINNER :)' : 'LOOSER :(',
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        20 -
        20 -
        20 -
        20 -
        20 -
        20,
        300
      );
      this.ctx.fillText(
        'Danni magici ricevuti ' + this.danniMagiciRicevuti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20,
        300
      );
      this.ctx.fillText(
        'Danni fisici ricevuti ' + this.danniFisiciRicevuti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20,
        300
      );
      this.ctx.fillText(
        'Danni critici ricevuti ' + this.danniCriticiRicevuti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20,
        300
      );
      this.ctx.fillText(
        'Danni critici inflitti ' + this.danniCriticiInflitti,
        this.posizioneInfoLabelX,
        this.posizioneInfoLabelY -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20 -
        20,
        300
      );
    }

  }

  drawBarraEnergia() {

    this.ctx.fillStyle = this.getColor();
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - 30,
      this.salute / 500, 10
    )
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - 40,
      this.intelligenza / 5, 10
    )
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - 50,
      this.forza / 5, 10
    )
    this.ctx.fillStyle = this.getColor();
    this.ctx.font = '18px Impact';
    this.ctx.fillText(
      this.classe + ' - ' + this.name + ' - Livello ' + this.livello+ ' - $ ' + this.money,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 60, 500
    );
  }

  attaccare(charter: Charter) {

    console.log('** ATTACCA ' + this.classe + ' ' + this.name)
    if (!this.isMorto) {
      let critico = 0;
      let isCritico = false;
      if (this.counterForCritico === this.counterForCriticoTreshold) {
        critico = this.livello * 10;
        this.danniCriticiInflitti += critico;
        isCritico = true;
      }
      charter.difendere((this.intelligenza + critico) * this.livello, (this.forza + critico) * this.livello, isCritico);
      this.counterForCritico === this.counterForCriticoTreshold ? this.counterForCritico = 0 : this.counterForCritico++;
      this.ctx.strokeStyle = 'red';
      this.ctx.strokeRect(this.getX() * this.sideX, this.getY() * this.sideY, this.sideX, this.sideY);
      if (charter.isMorto) {
        this.money += charter.money;
      }
    }
    console.log('** FINE ATTACCO ' + this.classe + ' ' + this.name)
  }

  difendere(dannoMagico: number, dannoFisico: number, isCritico: boolean) {
    console.log('****** DIFENDE ' + this.classe + ' ' + this.name)
    isCritico ? console.error('******** critico') : null;
    const schiva = Math.floor(Math.random() * 10);
    let schivata = false;
    if (!isCritico) {//il critico non si schiva
      for (let a of this.numeriFortunati) {
        if (schiva == a) {
          schivata = true;
          console.log('******** schiva');
          break;
        }
      }
    }
    if (!schivata || isCritico) {
      if (isCritico) {
        this.danniCriticiRicevuti += dannoFisico;
        this.ctx.fillRect(this.getX() * this.sideX, this.getY() * this.sideY, this.sideX + 10, this.sideY + 10);
        this.ctx.fillStyle = this.getColor();
        this.ctx.font = '18px Impact';
        this.ctx.fillText(
          'CRITICO',
          this.getX() * this.sideX,
          this.getY() * this.sideY - 60, 500
        );
      }
      let dannoFisicoEffettivo = 0;
      let dannoMagicoEffettivo = 0;
      if (this.resistenzaMagica < dannoMagico) {
        dannoMagicoEffettivo = dannoMagico - this.resistenzaMagica * this.livello;
        dannoMagicoEffettivo < 0 ? dannoMagicoEffettivo = 0 : null;
      }
      if (this.resistenzaFisica < dannoFisico) {
        dannoFisicoEffettivo = dannoFisico - this.resistenzaFisica * this.livello;
        dannoFisicoEffettivo < 0 ? dannoFisicoEffettivo = 0 : null;
      }
      this.salute -= dannoFisicoEffettivo + dannoMagicoEffettivo;
      this.danniFisiciRicevuti += dannoFisicoEffettivo;
      this.danniMagiciRicevuti += dannoMagicoEffettivo;
      console.log('******** danni magici ricevuti ' + dannoMagicoEffettivo);
      console.log('******** danni fisici ricevuti ' + dannoFisicoEffettivo);
    }

    console.log('**** FINE DIFESA ' + this.classe + ' ' + this.name)
    if (this.salute <= 0) {
      this.isMorto = true
      console.log(this.classe + ' - ' + this.name + ' è stato ucciso')
    } else {
      this.isMorto = false;
    }
  }
  muori() { }

  incrementaLivello() {
    this.livello++;
    this.salute = this.salute + this.livello*10;
    this.forza = this.forza + this.livello*10;
    this.intelligenza = this.intelligenza + this.livello*10;
    this.resistenzaFisica = this.resistenzaFisica + this.livello*2;
    this.resistenzaMagica = this.resistenzaMagica + this.livello*2;

  }
}
//quando attacca ogni charter fa danno magico e danno fisico in base alla sua forza  e alla sua intelligenza .
