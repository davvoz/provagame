import { classe, Condition, Conditions, stato } from './costants.enum';
import { Pozione } from './pozione';
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
  isCritico = false;
  counterForCriticoAnimation = 0;
  spriteSheetAttackPath = '';
  isOnAttack: boolean = false;
  counterMana = 0;
  counterManaTreshold = 10
  maxMana = 30;
  velocitaIniziale = 0;
  isVelenoApplicato = false;
  maxVelo = 0.1;
  pozioni: Pozione[] = [];
  pozioneAntiCambioStati = false;
  turniPozioneAntiCambiaStati = 1000;
  stato: stato = 'camminando';
  genereSprite = 0;//se = 0 then SX = 1 dx = 2 ; se = 1 SX = 2 DX = 1
  exp = 0;
  nextExp = 200;
  situazione: Conditions = {
    stunned:
    {
      conditionType: 'STUN',
      value: false,
      quantita: 0,
      totTurni: 0,
    },
    poisoned: {
      conditionType: 'VENO',
      value: false,
      quantita: 0,
      totTurni: 0
    },
    fiery: {
      conditionType: 'FIRE',
      value: false,
      quantita: 0,
      totTurni: 0
    }

  }

  updateSituazioneConditions(condition: Condition) {
    // console.error(this.name + ' riceve condition', condition);
    if (!this.pozioneAntiCambioStati) {
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

  }

  lanciaAbilita(charter: Charter): void { console.error('abilita abstrtact') }

  override draw() {
    if (this.salute <= 0) {
      this.isMorto = true
      this.stato = 'morendo';
    } else {
      this.isMorto = false
    }
    // this.drawLabel();
    this.drawBarraEnergia();
    this.drawPozioneAntivelenoState();
    if (!this.isMorto) {
      this.setSprite();
    }
    if (this.counterAnimation == 3) {
      if (this.counterMana <= this.maxMana) {
        if ((this.mana < this.maxMana)) {
          this.mana++;
        }
        this.counterMana++
      } else {
        this.counterMana = 0
      }
    }


  }
  drawPozioneAntivelenoState() {
    if (this.pozioneAntiCambioStati) {
      this.ctx.strokeStyle = 'rgb(0,200,0)';
      this.ctx.strokeRect(this.getX() * this.sideX - 10, this.getY() * this.sideY + 10, this.sideX + 10, this.sideY + 10);
      this.ctx.strokeStyle = 'rgb(0,180,0)';
      this.ctx.strokeRect(this.getX() * this.sideX - 9, this.getY() * this.sideY + 9, this.sideX + 9, this.sideY + 9);
      this.ctx.strokeStyle = 'rgb(0,160,0)';
      this.ctx.strokeRect(this.getX() * this.sideX - 8, this.getY() * this.sideY + 8, this.sideX + 8, this.sideY + 8);
      this.ctx.strokeStyle = 'rgb(0,140,0)';
      this.ctx.strokeRect(this.getX() * this.sideX - 7, this.getY() * this.sideY + 7, this.sideX + 7, this.sideY + 7);

      this.ctx.fillStyle = 'rgb(0,200,0)';
      this.ctx.fillRect(this.getX() * this.sideX,
        this.getY() * this.sideY - 20,
        this.turniPozioneAntiCambiaStati / 10, 10);
    }
  }

  setSprite() {
    let riga = 0;
    if (this.situazione.fiery.value && this.situazione.fiery.totTurni > 0) {
      console.log(this.name + ' riceve danni da ' + this.situazione.fiery.conditionType + ' : ' + this.situazione.fiery.quantita);
      this.situazione.fiery.totTurni--;
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(this.getX() * this.sideX - 20, this.getY() * this.sideY + 40, 30, 30);
      this.ctx.font = "20px Impact";
      this.ctx.fillText('ON FIRE !!!', this.getX() * this.sideX - 70, this.getY() * this.sideY, 300)
      if (this.counterAnimation == 3) {
        this.salute -= this.situazione.fiery.quantita;
      }
    }
    if (this.situazione.poisoned.value && this.situazione.poisoned.totTurni > 0) {
      console.log(this.name + ' riceve danni da ' + this.situazione.poisoned.conditionType + ' : ' + this.situazione.poisoned.quantita);
      this.situazione.poisoned.totTurni--;
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(this.getX() * this.sideX - 20, this.getY() * this.sideY + 60, 30, 30);
      this.ctx.font = "20px Impact";
      this.ctx.fillText('POISONED', this.getX() * this.sideX - 70, this.getY() * this.sideY + 60, 300)
      if (this.counterAnimation == 3) {
        this.salute -= this.situazione.poisoned.quantita;
      }
      if (!this.isVelenoApplicato) {
        this.isVelenoApplicato = true;
      }
    } else {
      this.isVelenoApplicato = false;
    }
    let colonna;
    switch (this.stato) {

      case 'camminando':
        switch (this.getDirection()) {
          case 'TOP': riga = this.spriteSheetImage.height / 4 * 3;//riga 4
            break;
          case 'BOTTOM': riga = 0;//riga 1
            break;
          case 'LEFT': ;//riga 2
            //se = 0 then SX = 1; se = 1 SX = 2 
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImage.height / 4 * 2

            } else {
              riga = this.spriteSheetImage.height / 4
            }
            break;
          case 'RIGHT': ;//riga 3
            //se = 0  dx = 2 ; se = 1 DX = 1
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImage.height / 4
            } else {
              riga = this.spriteSheetImage.height / 4 * 2
            }
            break;
        }
        colonna = this.spriteSheetImage.width / 4 * this.counterAnimation;
        this.ctx.drawImage(this.spriteSheetImage, colonna, riga, this.spriteSheetImage.width / 4, this.spriteSheetImage.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90)
        break;
      case 'attaccando':
        switch (this.getDirection()) {
          case 'TOP': riga = this.spriteSheetImageAttack.height / 4 * 3;//riga 4
            break;
          case 'BOTTOM': riga = 0;//riga 1
            break;
          case 'LEFT': ;//riga 2
            //se = 0 then SX = 1; se = 1 SX = 2 
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4 * 2

            } else {
              riga = this.spriteSheetImageAttack.height / 4
            }
            break;
          case 'RIGHT': ;//riga 3
            //se = 0  dx = 2 ; se = 1 DX = 1
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4
            } else {
              riga = this.spriteSheetImageAttack.height / 4 * 2
            }
            break;
        }
        colonna = this.spriteSheetImageAttack.width / 4 * this.counterAnimation;
        this.ctx.drawImage(this.spriteSheetImageAttack, colonna, riga, this.spriteSheetImageAttack.width / 4, this.spriteSheetImageAttack.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90)
        break;

      case 'difendendo':
        switch (this.getDirection()) {
          case 'TOP': riga = this.spriteSheetImageAttack.height / 4 * 3;//riga 4
            break;
          case 'BOTTOM': riga = 0;//riga 1
            break;
          case 'LEFT': ;//riga 2
            //se = 0 then SX = 1; se = 1 SX = 2 
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4 * 2

            } else {
              riga = this.spriteSheetImageAttack.height / 4
            }
            break;
          case 'RIGHT': ;//riga 3
            //se = 0  dx = 2 ; se = 1 DX = 1
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4
            } else {
              riga = this.spriteSheetImageAttack.height / 4 * 2
            }
            break;
        }
        colonna = this.spriteSheetImageAttack.width / 4 * this.counterAnimation;
        this.ctx.drawImage(this.spriteSheetImageAttack, colonna, riga, this.spriteSheetImageAttack.width / 4, this.spriteSheetImageAttack.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90)
        break;

      case 'morendo':
        this.ctx.fillText('morto', this.getX() * this.sideX, this.getY() * this.sideY, 300);
        break;
    }
  }

  drawLabel() {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.font = '15px Impact';
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
      this.salute / 100 * this.livello, 10
    )
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - 40,
      this.mana, 10
    )
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(
      this.getX() * this.sideX + this.maxMana,
      this.getY() * this.sideY - 40,
      5, 10
    )

    this.ctx.fillStyle = this.getColor();
    this.ctx.strokeStyle = 'black';

    this.ctx.font = '18px Impact';
    this.ctx.strokeText(
      this.classe + ' - ' + this.name + ' - Level ' + this.livello + ' - $ ' + this.money,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 45, 500
    );
    this.ctx.fillText(
      this.classe + ' - ' + this.name + ' - Level ' + this.livello + ' - $ ' + this.money,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 45, 500
    );
  }
  attaccare(charter: Charter) {
    if (!this.isVelenoApplicato) {
      if (this.exp >= this.nextExp) {
        this.exp = 0;
        this.nextExp = 100 * this.livello;
        this.incrementaLivello();
      }
      this.exp++;
      this.stato = 'attaccando';
      this.isOnAttack = true;
      if (this.counterAnimation == 3) {
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
  }

  difendere(dannoMagico: number, dannoFisico: number, isCritico: boolean) {
    console.log('****** DIFENDE ' + this.classe + ' ' + this.name)
    isCritico ? console.log('******** critico') : null;
    const schiva = Math.floor(Math.random() * 10);
    let schivata = false;
    this.stato = 'difendendo';
    if (!isCritico || this.isVelenoApplicato) {//il critico non si schiva ,se sei avvelenato non schivi
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

  incrementaLivello() {
    this.livello++;
    this.salute = this.salute + this.livello;
    this.forza += this.livello;
    this.intelligenza += this.livello;
    this.resistenzaFisica += this.livello;
    this.resistenzaMagica += this.livello;

  }

}