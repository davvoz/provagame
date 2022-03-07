import { CharterParam, classe, Condition, Conditions, ParametriFanatsy, SintesiDati, stato } from '../utils/costants.enum';
import { Pozione } from '../elements/pozione';
import { Square } from '../elements/square';
import { GeneralSprite } from '../elements/general-sprite';
import { CounterToTrashold } from '../utils/counter-to-treshold';

export abstract class Charter extends Square implements CharterParam {
  classe: classe = 'ABSTRACT';
  name = 'Abstract cant instantiate';
  sintesiDati: SintesiDati = {
    danniMagiciRicevuti: 0,
    danniFisiciRicevuti: 0,
    dannoCritico: 0,
    danniCriticiInflitti: 0,
    danniCriticiRicevuti: 0,
    numeroSchivate: 0,
    numeroAttacchi: 0,
  };
  parametriFantasy: ParametriFanatsy = {
    agilita: 0,
    forza: 0,
    intelligenza: 0,
    mana: 0,
    numeriFortunati: [],
    resistenzaFisica: 0,
    salute: 10000,
    resistenzaMagica: 0,
    livello: 1,
    money: 0,
    maxMana: 0
  };
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
  posizioneInfoLabelX = 0;
  posizioneInfoLabelY = 0;
  isMorto = false;
  counterAnimation = 0;
  spriteSheetCharterPath = '';
  spriteSheetImage = new Image();
  spriteSheetImageAttack = new Image();
  isCritico = false;
  counterForCriticoTreshold = 100;
  spriteSheetAttackPath = '';
  isOnAttack: boolean = false;
  velocitaIniziale = 0;
  isVelenoApplicato = false;
  pozioni: Pozione[] = [];
  stato: stato = 'camminando';
  genereSprite = 0;//se = 0 then SX = 1 dx = 2 ; se = 1 SX = 2 DX = 1
  exp = 0;
  nextExp = 200;
  scudoCounter = new CounterToTrashold(500, false);
  pozioneCounter = new CounterToTrashold(500, false);
  visualizzaDannoCounter = new CounterToTrashold(32, false);
  scudoIcon = new Image();
  pozioneIcon = new Image();
  pozioneoggettoDaLanciareIcon = new Image();
  isOggettoInvolo = false;
  isOggettoAtterrato = false;
  oggettoDaLanciare !: GeneralSprite;
  dannoCritico: number = 50;
  counterForCritico: number = 0;
  fiammeImage = new Image();
  velenoImage = new Image();
  stunnoImage = new Image();
  isPlayer = false;
  private maxSalute = 1000 * this.parametriFantasy.livello;
  private ultimiDanni = 0;
  aggiornaCaratteristiche() { console.error('aggiornaCaratteristiche') }

  lanciaOggetto() {
    this.isOggettoInvolo = true;
  }

  getSalute(): number {
    return this.parametriFantasy.salute;
  }

  incrementaSalute(addendum: number) {
    this.parametriFantasy.salute + addendum > this.maxSalute ? this.parametriFantasy.salute = this.maxSalute : this.parametriFantasy.salute = this.parametriFantasy.salute + addendum;
  }

  updateSituazioneConditions(condition: Condition) {
    if (!this.pozioneCounter.isActive()) {
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
    if (this.parametriFantasy.salute <= 0) {
      this.isMorto = true
      this.stato = 'morendo';
    } else {
      this.isMorto = false
    }

    if (this.exp >= this.nextExp) {
      this.exp = 0;
      this.nextExp = 100 * this.parametriFantasy.livello;
      this.incrementaLivello();
    }
    if (!this.isMorto) {

      this.setSprite();
      this.drawBarre();
      if (this.visualizzaDannoCounter.isActive()) {
        this.ctx.fillStyle = !this.isCritico ? this.getColor() : 'red';
        this.ctx.strokeStyle = 'black';
        this.ctx.font = (this.ultimiDanni / 100 + 52) + 'px Impact';
        this.ctx.strokeText(this.ultimiDanni + '', this.getX() * this.sideX - 30, this.getY() * this.sideY + this.sideY + 30, 300);
        this.ctx.fillText(this.ultimiDanni + '', this.getX() * this.sideX - 30, this.getY() * this.sideY + this.sideY + 30, 300);
      }
    }

    this.updateTimers();
  }

  private updateTimers() {
    this.scudoCounter.counting();
    this.pozioneCounter.counting();
    this.visualizzaDannoCounter.counting();
    if (this.counterAnimation == 3) {//rallento assunzione mana
      if (this.parametriFantasy.maxMana > this.parametriFantasy.mana) {
        this.parametriFantasy.mana++;
      }
    }
  }

  drawBarre() {
    let maxLength = 100;
    //salute
    this.setBarra('red', maxLength * this.parametriFantasy.salute / this.maxSalute, 30, 10);
    this.setFineCorsa(maxLength, 30);
    //mana
    this.setBarra('blue', this.parametriFantasy.mana, 40, 10);
    this.setFineCorsa(this.parametriFantasy.maxMana, 40);
    //scudo
    if (this.scudoCounter.isActive()) {
      this.setBarra('orangered', this.scudoCounter.counter / 3, 10, 10)
      this.scudoIcon.src = 'assets/images/scudo.png';
      this.ctx.drawImage(this.scudoIcon,
        0,//colonna ws
        0,//riga hs
        this.scudoIcon.width, //ws
        this.scudoIcon.height,//hs
        this.getX() * this.sideX - 10 + this.scudoCounter.counter / 3,
        this.getY() * this.sideY - 10,
        this.sideX / 3,
        this.sideY / 3);
    }
    //pozione
    if (this.pozioneCounter.isActive()) {
      this.setBarra('green', this.pozioneCounter.counter / 3, 20, 10)
      this.pozioneIcon.src = 'assets/images/pozioneverde.png';
      this.ctx.drawImage(this.pozioneIcon,
        0,//colonna ws
        0,//riga hs
        this.pozioneIcon.width, //ws
        this.pozioneIcon.height,//hs
        this.getX() * this.sideX - 10 + this.pozioneCounter.counter / 3,
        this.getY() * this.sideY - 30,
        this.sideX / 3,
        this.sideY / 3);
    }
    this.setTexts();
  }

  private setFineCorsa(max: number, heigt: number) {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(
      this.getX() * this.sideX + max,
      this.getY() * this.sideY - heigt,
      5, 10
    );
  }

  private setTexts() {
    this.ctx.fillStyle = this.getColor();
    this.ctx.strokeStyle = 'black';
    this.ctx.font = '18px Impact';
    this.ctx.strokeText(
      this.classe + ' - ' + this.name + ' - Level ' + this.parametriFantasy.livello + ' - $ ' + this.parametriFantasy.money + '     ' + this.parametriFantasy.salute + '     ' + this.maxSalute,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 55, 500
    );
    this.ctx.font = '18px Impact';
    this.ctx.fillText(
      'F' + this.parametriFantasy.forza + ' I ' + this.parametriFantasy.intelligenza + 'A' + this.parametriFantasy.agilita + ' RF ' + this.parametriFantasy.resistenzaFisica + ' RM ' + this.parametriFantasy.resistenzaMagica,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 75, 500
    );
    this.ctx.fillText(
      this.classe + ' - ' + this.name + ' - Level ' + this.parametriFantasy.livello + ' - $ ' + this.parametriFantasy.money,
      this.getX() * this.sideX,
      this.getY() * this.sideY - 55, 500
    );
  }

  private setBarra(color: string, counter: number, posHeight: number, heigt: number) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      this.getX() * this.sideX,
      this.getY() * this.sideY - posHeight,
      counter, heigt);
  }

  rubaSoldiA(charter: Charter) {
    this.parametriFantasy.money += charter.parametriFantasy.money;
    charter.parametriFantasy.money = 0;
  }

  attaccare(charter: Charter) {
    if (!this.isVelenoApplicato || this.counterAnimation * 3 == 9) {
      this.exp++;
      this.stato = 'attaccando';
      this.isOnAttack = true;
      if (this.counterAnimation == 3) {
        this.sintesiDati.numeroAttacchi++;
        console.log('** ATTACCA ' + this.classe + ' ' + this.name)
        if (!this.isMorto) {
          let critico = 0;
          let isCritico = false;
          if (this.counterForCritico === this.counterForCriticoTreshold) {
            critico = this.parametriFantasy.livello * 10;
            this.sintesiDati.danniCriticiInflitti += critico;
            isCritico = true;
            this.isCritico = true;
          } else {
            this.isCritico = false;
          }
          charter.difendere((this.parametriFantasy.intelligenza + critico) * this.parametriFantasy.livello, (this.parametriFantasy.forza + critico) * this.parametriFantasy.livello, isCritico);
          this.counterForCritico === this.counterForCriticoTreshold ? this.counterForCritico = 0 : this.counterForCritico++;
          this.ctx.strokeStyle = 'red';
          if (charter.isMorto && !charter.isPlayer) {
            this.rubaSoldiA(charter);
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
      for (let a of this.parametriFantasy.numeriFortunati) {
        if (schiva == a) {
          schivata = true;
          this.sintesiDati.numeroSchivate++;
          console.log('******** schiva');
          break;
        }
      }
    }
    if (!schivata || isCritico) {
      if (isCritico) {
        this.sintesiDati.danniCriticiRicevuti += dannoFisico;
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
      if (this.parametriFantasy.resistenzaMagica < dannoMagico) {
        dannoMagicoEffettivo = dannoMagico - this.parametriFantasy.resistenzaMagica * this.parametriFantasy.livello;
        dannoMagicoEffettivo < 0 ? dannoMagicoEffettivo = 0 : null;
      }
      if (this.parametriFantasy.resistenzaFisica < dannoFisico) {
        dannoFisicoEffettivo = dannoFisico - this.parametriFantasy.resistenzaFisica * this.parametriFantasy.livello;
        dannoFisicoEffettivo < 0 ? dannoFisicoEffettivo = 0 : null;
      }
      this.parametriFantasy.salute -= dannoFisicoEffettivo + dannoMagicoEffettivo;
      this.sintesiDati.danniFisiciRicevuti += dannoFisicoEffettivo;
      this.sintesiDati.danniMagiciRicevuti += dannoMagicoEffettivo;
      this.ultimiDanni = dannoFisicoEffettivo + dannoMagicoEffettivo;
      if (!this.visualizzaDannoCounter.isActive()) {
        this.visualizzaDannoCounter.attiva();
      }

      console.log('******** danni magici ricevuti ' + dannoMagicoEffettivo);
      console.log('******** danni fisici ricevuti ' + dannoFisicoEffettivo);
      console.log('******** danni totali ricevuti ' + (dannoFisicoEffettivo + dannoMagicoEffettivo));

    }
    console.log('**** FINE DIFESA ' + this.classe + ' ' + this.name)
    if (this.parametriFantasy.salute <= 0) {
      this.isMorto = true
      console.log(this.classe + ' - ' + this.name + ' è stato ucciso')
    } else {
      this.isMorto = false;
    }
  }

  incrementaLivello() {
    this.parametriFantasy.livello++;
    this.maxSalute = this.parametriFantasy.livello * 10000;
    this.parametriFantasy.salute = this.maxSalute;
    this.aggiornaCaratteristiche();
  }

  drawLabel() {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.font = '15px Impact';
    this.ctx.fillText(
      this.name + ' : ' + this.parametriFantasy.salute.toFixed(0),
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY,
      300
    );
    this.ctx.fillText(
      'Forza : ' + this.parametriFantasy.forza,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - 20,
      300
    );
    this.ctx.fillText(
      'Resistenza : ' + this.parametriFantasy.resistenzaFisica,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - 20 - 20,
      300
    );
    this.ctx.fillText(
      'intelligenza : ' + this.parametriFantasy.intelligenza,
      this.posizioneInfoLabelX,
      this.posizioneInfoLabelY - 20 - 20 - 20,
      300
    );
    this.ctx.closePath();
    this.ctx.fillText(
      'Resistenza m: ' + this.parametriFantasy.resistenzaMagica,
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
        'Danni magici ricevuti ' + this.sintesiDati.danniMagiciRicevuti,
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
        'Danni fisici ricevuti ' + this.sintesiDati.danniFisiciRicevuti,
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
        'Danni critici ricevuti ' + this.sintesiDati.danniCriticiRicevuti,
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
        'Danni critici inflitti ' + this.sintesiDati.danniCriticiInflitti,
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

  setSprite() {
    this.setCharterSprite();
    //situazione fire
    if (this.situazione.fiery.value && this.situazione.fiery.totTurni > 0) {
      this.situazione.fiery.totTurni--;
      this.ctx.fillStyle = 'red';
      this.ctx.font = "20px Impact";
      this.ctx.fillText('ON FIRE !!!', this.getX() * this.sideX - 50, this.getY() * this.sideY, 300)
      if (!this.fiammeImage.src) {
        this.fiammeImage.src = 'assets/images/FUOCO.png';
      }

      this.ctx.drawImage(this.fiammeImage, this.fiammeImage.width / 4 * this.counterAnimation, 0, this.fiammeImage.width / 4, this.fiammeImage.height / 2, this.getX() * this.sideX - 30, this.getY() * this.sideY, 70, 90)
      console.log(this.name + ' riceve danni da ' + this.situazione.fiery.conditionType + ' : ' + this.situazione.fiery.quantita);
      this.parametriFantasy.salute -= this.situazione.fiery.quantita;

    }
    //situazione poison
    if (this.situazione.poisoned.value && this.situazione.poisoned.totTurni > 0) {
      this.situazione.poisoned.totTurni--;
      this.ctx.fillStyle = 'green';
      this.ctx.font = "20px Impact";
      this.ctx.fillText('POISONED', this.getX() * this.sideX - 70, this.getY() * this.sideY + 60, 300)
      this.ctx.drawImage(this.velenoImage, this.velenoImage.width / 4 * this.counterAnimation, 0, this.velenoImage.width / 4, this.velenoImage.height / 2, this.getX() * this.sideX, this.getY() * this.sideY - 30, 70, 90)

      if (!this.velenoImage.src) {
        this.velenoImage.src = 'assets/images/avvelenamento.png';
      }
      console.log(this.name + ' riceve danni da ' + this.situazione.poisoned.conditionType + ' : ' + this.situazione.poisoned.quantita);
      this.parametriFantasy.salute -= this.situazione.poisoned.quantita;
      if (!this.isVelenoApplicato) {
        this.isVelenoApplicato = true;
      }
    } else {
      this.isVelenoApplicato = false;
    }
    //situazione stun
    if (this.situazione.stunned.value && this.situazione.stunned.totTurni > 0) {
      console.log(this.name + ' riceve danni da ' + this.situazione.stunned.conditionType + ' : ' + this.situazione.stunned.quantita);
      if (!this.stunnoImage.src) {
        this.stunnoImage.src = 'assets/images/star.png';
      }
      this.ctx.fillStyle = 'gold';
      this.ctx.font = "20px Impact";
      this.ctx.fillText('STUNNED', this.getX() * this.sideX - 30, this.getY() * this.sideY + 60, 300);
      this.ctx.drawImage(this.stunnoImage, this.stunnoImage.width / 4 * this.counterAnimation, 0, this.stunnoImage.width / 4, this.stunnoImage.height, this.getX() * this.sideX, this.getY() * this.sideY - 30, 70, 90)
      this.parametriFantasy.salute -= this.situazione.stunned.quantita;
      this.situazione.stunned.totTurni--;
    }
  }


  private setCharterSprite() {
    let colonna = 0;
    let riga = 0;
    switch (this.stato) {

      case 'camminando':
        switch (this.getDirection()) {
          case 'TOP': riga = this.spriteSheetImage.height / 4 * 3; //riga 4
            break;
          case 'BOTTOM': riga = 0; //riga 1
            break;
          case 'LEFT': ; //riga 2

            //se = 0 then SX = 1; se = 1 SX = 2 
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImage.height / 4 * 2;

            } else {
              riga = this.spriteSheetImage.height / 4;
            }
            break;
          case 'RIGHT': ; //riga 3

            //se = 0  dx = 2 ; se = 1 DX = 1
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImage.height / 4;
            } else {
              riga = this.spriteSheetImage.height / 4 * 2;
            }
            break;
        }
        colonna = this.spriteSheetImage.width / 4 * this.counterAnimation;
        this.ctx.drawImage(this.spriteSheetImage, colonna, riga, this.spriteSheetImage.width / 4, this.spriteSheetImage.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90);
        break;
      case 'attaccando':
        switch (this.getDirection()) {
          case 'TOP': riga = this.spriteSheetImageAttack.height / 4 * 3; //riga 4
            break;
          case 'BOTTOM': riga = 0; //riga 1
            break;
          case 'LEFT': ; //riga 2

            //se = 0 then SX = 1; se = 1 SX = 2 
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4 * 2;

            } else {
              riga = this.spriteSheetImageAttack.height / 4;
            }
            break;
          case 'RIGHT': ; //riga 3

            //se = 0  dx = 2 ; se = 1 DX = 1
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4;
            } else {
              riga = this.spriteSheetImageAttack.height / 4 * 2;
            }
            break;
        }
        colonna = this.spriteSheetImageAttack.width / 4 * this.counterAnimation;
        this.ctx.drawImage(this.spriteSheetImageAttack, colonna, riga, this.spriteSheetImageAttack.width / 4, this.spriteSheetImageAttack.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90);
        break;

      case 'difendendo':
        switch (this.getDirection()) {
          case 'TOP': riga = this.spriteSheetImageAttack.height / 4 * 3; //riga 4
            break;
          case 'BOTTOM': riga = 0; //riga 1
            break;
          case 'LEFT': ; //riga 2

            //se = 0 then SX = 1; se = 1 SX = 2 
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4 * 2;

            } else {
              riga = this.spriteSheetImageAttack.height / 4;
            }
            break;
          case 'RIGHT': ; //riga 3

            //se = 0  dx = 2 ; se = 1 DX = 1
            if (this.genereSprite === 0) {
              riga = this.spriteSheetImageAttack.height / 4;
            } else {
              riga = this.spriteSheetImageAttack.height / 4 * 2;
            }
            break;
        }
        colonna = this.spriteSheetImageAttack.width / 4 * this.counterAnimation;
        this.ctx.drawImage(this.spriteSheetImageAttack, colonna, riga, this.spriteSheetImageAttack.width / 4, this.spriteSheetImageAttack.height / 4, this.getX() * this.sideX, this.getY() * this.sideY, 70, 90);
        break;

      case 'morendo':
        this.ctx.fillText('morto', this.getX() * this.sideX, this.getY() * this.sideY, 300);
        break;
    }
  }
}
