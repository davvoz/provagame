import { Charter } from '../abstract/charter';
import { classe, SquareConfig } from '../utils/costants.enum';
import { Utilities } from '../utils/utilities';

export class Samurai extends Charter {
  override name = 'SAMURAI default name';
  override classe: classe = 'SAMURAI';
  override genereSprite = 1;
  override spriteSheetCharterPath = 'assets/images/samuraiAtk2.png';
  override spriteSheetAttackPath = 'assets/images/samuraiAtk2.png';
  override maxSalute = 12000 * this.parametriFantasy.livello;

  constructor(configurazioneInziale: SquareConfig) {
    super(configurazioneInziale);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.parametriFantasy.livello = 1;
    this.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4, 5, 6];
    this.parametriFantasy.agilita = 2;
    this.parametriFantasy.forza = 10;
    this.parametriFantasy.intelligenza = 10;
    this.parametriFantasy.mana = 1;
    this.parametriFantasy.resistenzaFisica = 7;
    this.parametriFantasy.resistenzaMagica = 8;
    this.genereSprite = 1;
    this.parametriFantasy.maxMana = 50;

    this.updateParametriFantasy();
  }

  override updateParametriFantasy() {
    this.parametriFantasy.forza += Utilities.getSecureRandom(5) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaFisica += Utilities.getSecureRandom(3) * this.parametriFantasy.livello;
    this.parametriFantasy.intelligenza += Utilities.getSecureRandom(4) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaMagica += Utilities.getSecureRandom(4) * this.parametriFantasy.livello;
    this.parametriFantasy.agilita += Utilities.getSecureRandom(5) * this.parametriFantasy.livello;
    this.incrementaSalute(Utilities.getSecureRandom(5) * this.parametriFantasy.livello);
  }

  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateMalefici(
      {
        malus: 'FIRE',
        quantita: 5 * this.parametriFantasy.livello,
        totTurni: 90 + this.parametriFantasy.livello,
        value: true
      }
    )
  }

}
