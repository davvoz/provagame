import { Charter } from '../abstract/charter';
import { classe, SquareConfig } from '../utils/costants.enum';
import { Utilities } from '../utils/utilities';

export class Mago extends Charter {
  override name = 'Mago default name';
  override classe: classe = 'MAGO';
  override spriteSheetCharterPath = 'assets/images/discotraspoo.png';
  override spriteSheetAttackPath = 'assets/images/discotraspooAtck.png';
  override genereSprite: number = 0;
  override maxSalute = 10000 * this.parametriFantasy.livello;

  constructor(configurazioneInziale: SquareConfig) {
    super(configurazioneInziale);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.parametriFantasy.livello = 1;
    this.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4, 5, 6];
    this.parametriFantasy.agilita = 3;
    this.parametriFantasy.forza = 10;
    this.parametriFantasy.intelligenza = 25;
    this.parametriFantasy.mana = 1;
    this.parametriFantasy.resistenzaFisica = 15;
    this.parametriFantasy.resistenzaMagica = 25;
    this.parametriFantasy.maxMana = 10;
    this.counterForCriticoTreshold = 1;
    this.updateParametriFantasy();

  }

  override updateParametriFantasy() {
    this.parametriFantasy.forza +=Utilities.getSecureRandom(1) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaFisica += Utilities.getSecureRandom(2) * this.parametriFantasy.livello;
    this.parametriFantasy.intelligenza += Utilities.getSecureRandom(8) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaMagica += Utilities.getSecureRandom(4) * this.parametriFantasy.livello;
    this.parametriFantasy.agilita += Utilities.getSecureRandom(5) * this.parametriFantasy.livello;
    this.incrementaSalute(Utilities.getSecureRandom(5) * this.parametriFantasy.livello);

  }

  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateMalefici(
      {
        malus: 'VENO',
        quantita: 2 * this.parametriFantasy.livello,
        totTurni: 80 + this.parametriFantasy.livello,
        value: true
      }
    )
  }

}
