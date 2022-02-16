import { classe, Condition, Conditions } from './costants.enum';
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
  spriteSheetImageAttack = new Image();
  livello = 1;
  money = 0;
  isOnDefens = false;
  isCritico = false;
  counterForCriticoAnimation = 0;
  spriteSheetAttackPath = '';
  isOnAttack: boolean = false;
  counterMana = 0;
  counterManaTreshold = 10
  maxMana = 100;

  situazione: Conditions = {
    stunned:
    {
      conditionType: 'STUN',//aggiunge danni 
      value: false,
      quantita: 0,
      totTurni: 0,
    },
    poisoned: {
      conditionType: 'VENO',//non attacca
      value: false,
      quantita: 0,
      totTurni: 0
    },
    fiery: {
      conditionType: 'FIRE',//molto rallentato
      value: false,
      quantita: 0,
      totTurni: 0
    }

  }

  updateSituazioneConditions(condition: Condition) {
    console.log(this.name + ' riceve condition',condition);

    switch (condition.conditionType) {
      case 'STUN':
        this.situazione.stunned = condition;
        break;
      case 'VENO':
        this.situazione.poisoned = condition;
        break;
      case 'FIRE':
        this.situazione.fiery = condition;
        break;
    }
  }

  lanciaAbilita(charter: Charter): void { console.error('abilita abstrtact')}

  override draw() {
    this.salute <= 0 ? this.isMorto = true : this.isMorto = false;
    this.drawLabel();
    this.drawBarraEnergia();
    //this.drawDannoCritico();
    this.drawCritico();

    this.ctx.strokeStyle = this.getColor();
    this.ctx.strokeRect(this.getX() * this.sideX, this.getY() * this.sideY, this.sideX, this.sideY);

    if (!this.isMorto) {

      this.setSprite();
    }
    if (this.counterAnimation == 3) {
      if (this.counterMana <= this.counterManaTreshold) {
        if (this.mana < this.maxMana) {
          this.mana++;

        }
        this.counterMana++
      } else {
        this.counterMana = 0
      }
    }


  }

  setSprite() {
    let riga = 0;
    
    if (!this.isOnAttack) {
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

      let colonna = this.spriteSheetImage.width / 4 * this.counterAnimation;
      this.ctx.drawImage(this.spriteSheetImage, colonna, riga, this.spriteSheetImage.width / 4, this.spriteSheetImage.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 60, 80)
    } else {
      switch (this.getDirection()) {
        case 'TOP': riga = this.spriteSheetImageAttack.height / 4 * 3;//riga 4
          break;
        case 'BOTTOM': riga = 0;//riga 1
          break;
        case 'LEFT': riga = this.spriteSheetImageAttack.height / 4 * 2;//riga 2
          break;
        case 'RIGHT': riga = this.spriteSheetImageAttack.height / 4;//riga 3
          break;
      }
      let colonna = this.spriteSheetImageAttack.width / 4 * this.counterAnimation;
      this.ctx.drawImage(this.spriteSheetImageAttack, colonna, riga, this.spriteSheetImageAttack.width / 4, this.spriteSheetImageAttack.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 60, 80)
    }

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

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - 30,
      this.salute / 1000, 10
    )
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - 40,
      this.mana, 10
    )

    this.ctx.fillStyle = this.getColor();
    this.ctx.font = '18px Impact';
    this.ctx.fillText(
      this.classe + ' - ' + this.name + ' - Livello ' + this.livello + ' - $ ' + this.money,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 60, 500
    );
  }
  drawCritico() {
    if (this.isCritico && this.counterForCriticoAnimation < 8 && this.isOnDefens) {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(this.getX() * this.sideX, this.getY() * this.sideY, this.sideX + 10, this.sideY + 10);
    }
    this.counterForCriticoAnimation < 9 ? this.counterForCriticoAnimation++ : this.counterForCriticoAnimation = 0;
  }
  // drawDannoCritico() {
  //   this.ctx.strokeRect(this.getX() * this.sideX, this.getY() * this.sideY, this.sideX, this.sideY);


  // }
  attaccare(charter: Charter) {
    this.isOnAttack = true;
   
      if (this.counterAnimation == 3) {
        this.isOnDefens = false;
        console.log('** ATTACCA ' + this.classe + ' ' + this.name)
        if (!this.isMorto) {
          let critico = 0;
          let isCritico = false;
          if (this.counterForCritico === this.counterForCriticoTreshold) {
            critico = this.livello * 10;
            this.danniCriticiInflitti += critico;
            isCritico = true;
            this.isCritico = true;
          } else {
            this.isCritico = false;
          }
          charter.difendere((this.intelligenza + critico) * this.livello, (this.forza + critico) * this.livello, isCritico);
          this.counterForCritico === this.counterForCriticoTreshold ? this.counterForCritico = 0 : this.counterForCritico++;
          this.ctx.strokeStyle = 'red';
          if (charter.isMorto) {
            this.money += charter.money;
          }
        }
        console.log('** FINE ATTACCO ' + this.classe + ' ' + this.name)
      }
    


  }

  difendere(dannoMagico: number, dannoFisico: number, isCritico: boolean) {
    this.isOnDefens = true;
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

      this.ctx.font = '30px Impact';
      this.ctx.fillText((this.danniFisiciRicevuti + this.danniMagiciRicevuti) + '', this.getX() * this.sideX, this.getY() + this.sideY, 300);
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
    this.salute = this.salute + this.livello;
    this.forza += this.livello;
    this.intelligenza += this.livello;
    this.resistenzaFisica += this.livello;
    this.resistenzaMagica += this.livello;

  }

}
//quando attacca ogni charter fa danno magico e danno fisico in base alla sua forza  e alla sua intelligenza .
