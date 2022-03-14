import { CharterParam, classe, MaliciusEffect, Malefici, ParametriFanatsy, SintesiDati, stato, SquareConfig, SquareParam } from '../utils/costants.enum';
import { Pozione } from '../elements/pozione';
import { Square } from '../elements/square';
import { CounterToTrashold } from '../utils/counter-to-treshold';
import { DrawCharter } from '../elements/draw-charter';

export class Charter extends Square implements CharterParam {
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
  malefici: Malefici = {
    stunned: {
      malus: 'STUN',
      value: false,
      quantita: 0,
      totTurni: 0,
    },
    poisoned: {
      malus: 'VENO',
      value: false,
      quantita: 0,
      totTurni: 0
    },
    fiery: {
      malus: 'FIRE',
      value: false,
      quantita: 0,
      totTurni: 0
    },
    slowed: {
      malus: 'BLOCK',
      value: false,
      quantita: 0,
      totTurni: 0,
    },
    blooding: {
      malus: 'BLOOD',
      value: false,
      quantita: 0,
      totTurni: 0,
    }
  }
  override config !: SquareConfig;
  maxSalute = 10000 * this.parametriFantasy.livello;
  genereSprite = 0;//se = 0 then SX = 1 dx = 2 ; se = 1 SX = 2 DX = 1
  exp = 0;
  nextExp = 200;
  velocitaIniziale = 0.1;
  posizioneInfoLabelX = 0;
  posizioneInfoLabelY = 0;
  counterAnimation = 0;
  counterForCriticoTreshold = 100;
  dannoCritico = 50;
  counterForCritico = 0;
  ultimiDanni = 0;
  spriteSheetCharterPath = '';
  spriteSheetAttackPath = '';

  spriteSheetImage = new Image();
  spriteSheetImageAttack = new Image();

  isOnAttack = false;
  isVelenoApplicato = false;
  isPlayer = false;
  isCritico = false;
  isMorto = false;
  isOggettoInvolo = false;
  isOggettoAtterrato = false;
  isLogActive = false;

  pozioni: Pozione[] = [];
  stato: stato = 'camminando';

  scudoCounter = new CounterToTrashold(500, false);
  pozioneCounter = new CounterToTrashold(500, false);
  visualizzaDannoCounter = new CounterToTrashold(32, false);
  haPresoUnaDirezioneCounter = new CounterToTrashold(25, false);
  disegno!: DrawCharter;


  override draw() {
    if (!this.disegno) {
      this.disegno = new DrawCharter(this);
    }
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
      this.disegno.drawAll(false);
    }
    this.updateTimers();
  }

  updateParametriFantasy() {
    throw new Error('Not implemented');
  }

  lanciaAbilita(charter: Charter): void {
    throw new Error('Not implemented');
  }

  lanciaOggetto() {
    this.isOggettoInvolo = true;
  }

  getSalute(): number {
    return this.parametriFantasy.salute;
  }

  incrementaSalute(addendum: number) {
    this.parametriFantasy.salute + addendum > this.maxSalute ? this.parametriFantasy.salute = this.maxSalute : this.parametriFantasy.salute = this.parametriFantasy.salute + addendum;
  }

  updateMalefici(effettoMalevolo: MaliciusEffect) {
    if (!this.pozioneCounter.isActive()) {
      switch (effettoMalevolo.malus) {
        case 'STUN':
          this.malefici.stunned = effettoMalevolo;
          break;
        case 'VENO':
          this.malefici.poisoned = effettoMalevolo;
          break;
        case 'FIRE':
          this.malefici.fiery = effettoMalevolo;
          break;
        case 'BLOCK':
          this.malefici.slowed = effettoMalevolo;
          break;
        case 'BLOOD':
          this.malefici.blooding = effettoMalevolo;
          break;
      }
    }
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
        //Utilities.log(this.isLogActive, [this.classe + ' ' + this.name +'** ATTACCA ' + charter.classe + ' ' + charter.name ]);
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
          if (charter.isMorto && !charter.isPlayer) {
            this.rubaSoldiA(charter);
          }
        }
        //console.log('** FINE ATTACCO ' + this.classe + ' ' + this.name)
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
        this.config.ctx.fillStyle = this.config.color;
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
    this.updateParametriFantasy();
  }

  getAurea(): SquareParam {
    return {
      x: this.config.x * this.config.w - this.config.w,
      y: this.config.y * this.config.h - this.config.h,
      h: this.config.w * 3,
      w: this.config.h * 3
    }
  }

  private updateTimers() {
    this.haPresoUnaDirezioneCounter.counting();
    this.scudoCounter.counting();
    this.pozioneCounter.counting();
    this.visualizzaDannoCounter.counting();
    if (this.counterAnimation == 3) {//rallento assunzione mana
      if (this.parametriFantasy.maxMana > this.parametriFantasy.mana) {
        this.parametriFantasy.mana++;
      }
    }
  }

}
