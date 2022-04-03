import { CharterParam, classe, MaliciusEffect, Malefici, ParametriFanatsy, SintesiDati, stato, SquareConfig, SquareParam, IOtherAnimations, direzione } from '../utils/costants.enum';
import { Pozione } from '../elements/pozione';
import { Square } from '../elements/square';
import { CounterToTrashold } from '../utils/counter-to-treshold';
import { DrawCharter } from '../elements/draw-charter';

export class Charter extends Square implements CharterParam, IOtherAnimations {
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
  maxSalute(): number {
    return 10000 * this.parametriFantasy.livello;
  }
  genereSprite = 0;//se = 0 then SX = 1 dx = 2 ; se = 1 SX = 2 DX = 1
  exp = 0;
  nextExp = 200;
  velocitaIniziale = 0.1;
  posizioneInfoLabelX = 0;
  posizioneInfoLabelY = 0;
  counterAnimation = 0;

  dannoCritico = 50;
  ultimiDanni = 0;
  ultimiDanniDaMaleficio = 0;
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
  isColliding = false;

  pozioni: Pozione[] = [];
  stato: stato = 'camminando';
  directionColliding: direzione = 'STAND';

  scudoCounter = new CounterToTrashold(500, false);
  pozioneCounter = new CounterToTrashold(500, false);
  visualizzaDannoCounter = new CounterToTrashold(30, false);
  haPresoUnaDirezioneCounter = new CounterToTrashold(25, false);

  counterForCriticoTreshold = 100;
  counterForCritico = 0;
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

  lanciaAbilita(aCharter: Charter): void {
    throw new Error('Not implemented');
  }

  lanciaOggetto() {
    this.isOggettoInvolo = true;
  }

  getSalute(): number {
    return this.parametriFantasy.salute;
  }

  incrementaSalute(addendum: number) {
    if (this.parametriFantasy.salute + addendum > this.maxSalute()) {
      this.parametriFantasy.salute = this.maxSalute();
    } else {
      this.parametriFantasy.salute = this.parametriFantasy.salute + addendum;
    }
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
      console.log(this.name, this.classe, this.parametriFantasy.livello, 'ATTACCA', charter.name, charter.classe, charter.parametriFantasy.livello);
      this.exp++;
      this.stato = 'attaccando';
      this.isOnAttack = true;
      if (this.counterAnimation == 3) {
        this.sintesiDati.numeroAttacchi++;
        this.isNotMortoProcedure(charter);
      }
    }
  }

  private isNotMortoProcedure(charter: Charter) {
    if (!this.isMorto) {
      let critico = 0;
      let isCritico = false;
      ({ critico, isCritico } = this.setCritico(critico, isCritico));
      console.log('Danni intelligenza =' + ((this.parametriFantasy.intelligenza + critico) * this.parametriFantasy.livello));
      console.log('Danni forza =' + ((this.parametriFantasy.forza + critico) * this.parametriFantasy.livello));
      console.log('Critico =' + critico);
      charter.difendere((this.parametriFantasy.intelligenza + critico) * this.parametriFantasy.livello, (this.parametriFantasy.forza + critico) * this.parametriFantasy.livello, isCritico);
      if (this.counterForCritico === this.counterForCriticoTreshold) {
        this.counterForCritico = 0;
      } else {
        this.counterForCritico++;
      }
      if (charter.isMorto && !charter.isPlayer) {
        this.rubaSoldiA(charter);
      }
    }
  }

  private setCritico(critico: number, isCritico: boolean) {
    if (this.counterForCritico === this.counterForCriticoTreshold) {
      critico = this.parametriFantasy.livello * 10;
      this.sintesiDati.danniCriticiInflitti += critico;
      isCritico = true;
      this.isCritico = true;
    } else {
      this.isCritico = false;
    }
    return { critico, isCritico };
  }

  difendere(dannoMagico: number, dannoFisico: number, isCritico: boolean) {
    const schiva = this.getSecureRandom(10);
    let schivata = false;
    this.stato = 'difendendo';
    schivata = this.getSchivata(isCritico, schiva, schivata);
    this.notSchivaOrCriticoProcedure(schivata, isCritico, dannoFisico, dannoMagico);
    if (this.parametriFantasy.salute <= 0) {
      this.isMorto = true
      console.log(this.classe + ' - ' + this.name + ' è stato ucciso')
    } else {
      this.isMorto = false;
    }


  }

  getSecureRandom(max: number) {
    let min = 0;
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xffffffff + 1);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  }

  private notSchivaOrCriticoProcedure(schivata: boolean, isCritico: boolean, dannoFisico: number, dannoMagico: number) {
    if (!schivata || isCritico) {
      if (isCritico) {
        this.sintesiDati.danniCriticiRicevuti += dannoFisico;
        this.config.ctx.fillStyle = this.config.color;
      }
      let dannoFisicoEffettivo = 0;
      let dannoMagicoEffettivo = 0;
      ({ dannoMagicoEffettivo, dannoFisicoEffettivo } = this.getDanni(dannoMagico, dannoMagicoEffettivo, dannoFisico, dannoFisicoEffettivo));
      this.parametriFantasy.salute -= dannoFisicoEffettivo + dannoMagicoEffettivo;
      this.sintesiDati.danniFisiciRicevuti += dannoFisicoEffettivo;
      this.sintesiDati.danniMagiciRicevuti += dannoMagicoEffettivo;
      this.ultimiDanni = dannoFisicoEffettivo + dannoMagicoEffettivo;
      if (!this.visualizzaDannoCounter.isActive()) {
        this.visualizzaDannoCounter.attiva();
      }

      console.log(this.name, this.classe, this.parametriFantasy.livello, 'Difende');
      console.log('Riceve Danni forza =' + dannoFisicoEffettivo);
      console.log('Riceve Danni intelligenza =' + dannoMagicoEffettivo);

    }
  }

  private getDanni(dannoMagico: number, dannoMagicoEffettivo: number, dannoFisico: number, dannoFisicoEffettivo: number) {
    if (this.parametriFantasy.resistenzaMagica < dannoMagico) {
      dannoMagicoEffettivo = dannoMagico - this.parametriFantasy.resistenzaMagica * this.parametriFantasy.livello;
      if (dannoMagicoEffettivo < 0) {
        dannoMagicoEffettivo = 0;
      }
    }
    if (this.parametriFantasy.resistenzaFisica < dannoFisico) {
      dannoFisicoEffettivo = dannoFisico - this.parametriFantasy.resistenzaFisica * this.parametriFantasy.livello;
      if (dannoFisicoEffettivo < 0) {
        dannoFisicoEffettivo = 0;
      }
    }
    return { dannoMagicoEffettivo, dannoFisicoEffettivo };
  }

  private getSchivata(isCritico: boolean, schiva: number, schivata: boolean) {
    if (!isCritico || this.isVelenoApplicato) { //il critico non si schiva ,se sei avvelenato non schivi
      for (let a of this.parametriFantasy.numeriFortunati) {
        if (schiva == a) {
          schivata = true;
          this.sintesiDati.numeroSchivate++;
        }
      }
    }
    return schivata;
  }

  incrementaLivello() {
    this.parametriFantasy.livello++;
    this.parametriFantasy.salute = this.maxSalute();
    this.updateParametriFantasy();
  }

  getAurea(): SquareParam {
    return {
      x: this.config.x * this.config.w,
      y: this.config.y * this.config.h,
      h: this.config.w,
      w: this.config.h
    }
  }

  getVisionAurea(): SquareParam {
    return {
      x: this.config.x * this.config.w - this.config.w ,
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
