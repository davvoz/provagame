import { Charter } from '../abstract/charter';
import { classe, SquareConfig } from '../utils/costants.enum';

export class Mago extends Charter {
  override name = 'Mago default name';
  override classe: classe = 'MAGO';
  override spriteSheetCharterPath = 'assets/images/discotraspoo.png';
  override spriteSheetAttackPath = 'assets/images/discotraspooAtck.png';
  override genereSprite: number = 0;
  override maxSalute =  10000 * this.parametriFantasy.livello;

  constructor(configurazioneInziale:SquareConfig) {
    super(configurazioneInziale);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.parametriFantasy.livello = 1;
    this.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4];
    this.parametriFantasy.agilita = 3;
    this.parametriFantasy.forza = 10;
    this.parametriFantasy.intelligenza = 25;
    this.parametriFantasy.mana = 1;
    this.parametriFantasy.resistenzaFisica = 10;
    this.parametriFantasy.resistenzaMagica = 15;
    this.parametriFantasy.maxMana = 10;
    this.counterForCriticoTreshold = 2 ;
    this.updateParametriFantasy();

  }

  override updateParametriFantasy() {
    this.parametriFantasy.forza += Math.floor(Math.random() * 1) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaFisica += Math.floor(Math.random() * 2) * this.parametriFantasy.livello;
    this.parametriFantasy.intelligenza += Math.floor(Math.random() * 8) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaMagica += Math.floor(Math.random() * 4) * this.parametriFantasy.livello;
    this.incrementaSalute(Math.floor(Math.random() * 5) * this.parametriFantasy.livello);

  }

  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateMalefici(
      {
        malus: 'VENO',
        quantita: 10 * this.parametriFantasy.livello,
        totTurni: 80 + this.parametriFantasy.livello,
        value: true
      }
    )
  }

}
