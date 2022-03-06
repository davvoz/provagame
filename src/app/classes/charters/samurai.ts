import { Charter } from '../abstract/charter';
import { classe } from '../utils/costants.enum';

export class Samurai extends Charter {
  override maxMana = 40;
  //override counterManaTreshold = 25;
  override name = 'SAMURAI default name';
  override classe: classe = 'SAMURAI';
  override genereSprite = 1;
  override spriteSheetCharterPath = 'assets/images/samuraiAtk2.png';
  override spriteSheetAttackPath = 'assets/images/samuraiAtk2.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;  
    this.parametriFantasy.livello = level;
    this.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4, 5, 6];
    this.parametriFantasy.agilita = 2;
    this.parametriFantasy.forza = 10;
    this.parametriFantasy.intelligenza = 10;
    this.parametriFantasy.mana = 1;
    this.parametriFantasy.resistenzaFisica = 7;
    this.parametriFantasy.resistenzaMagica = 8;
    this.genereSprite = 1;
    this.aggiornaCaratteristiche();
    this.manaCounter.attiva();
  }

  override aggiornaCaratteristiche() {
    this.parametriFantasy.forza += Math.floor(Math.random() * 5) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaFisica += Math.floor(Math.random() * 3) * this.parametriFantasy.livello;
    this.parametriFantasy.intelligenza += Math.floor(Math.random() * 4) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaMagica += Math.floor(Math.random() * 4) * this.parametriFantasy.livello;
    this.parametriFantasy.agilita += Math.floor(Math.random() * 5) * this.parametriFantasy.livello;  
    this.incrementaSalute(Math.floor(Math.random() * 50) * this.parametriFantasy.livello);
  }

  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'FIRE',
        quantita: 69 * this.parametriFantasy.livello,
        totTurni: 190 + this.parametriFantasy.livello,
        value: true
      }
    )
  }

}
