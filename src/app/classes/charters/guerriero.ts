import { Charter } from '../abstract/charter';
import { classe } from '../utils/costants.enum';

export class Guerriero extends Charter {
  override name = 'Guerriero default name';
  override classe: classe = 'GUERRIERO';
  override spriteSheetCharterPath = 'assets/images/biondotraspoAtck_1.png';
  override spriteSheetAttackPath = 'assets/images/biondotraspoAtck_1.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.parametriFantasy.livello = level;
    this.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.parametriFantasy.agilita = 2;
    this.parametriFantasy.forza = 10;
    this.parametriFantasy.intelligenza = 10;
    this.parametriFantasy.mana = 1;
    this.parametriFantasy.resistenzaFisica = 7;
    this.parametriFantasy.resistenzaMagica = 8;
    this.parametriFantasy.maxMana = 50;
    this.genereSprite = 0;
    this.updateParametriFantasy();
  }

  override updateParametriFantasy() {
    this.parametriFantasy.forza += Math.floor(Math.random() * 6) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaFisica += Math.floor(Math.random() * 2) * this.parametriFantasy.livello;
    this.parametriFantasy.intelligenza += Math.floor(Math.random() * 2) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaMagica += Math.floor(Math.random() * 2) * this.parametriFantasy.livello;
    this.parametriFantasy.agilita += Math.floor(Math.random() * 1) * this.parametriFantasy.livello;
    this.incrementaSalute( Math.floor(Math.random() * 5) * this.parametriFantasy.livello); 
  }
  
  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateMalefici(
      {
        malus: 'STUN',
        quantita: 6 * this.parametriFantasy.livello,
        totTurni: 450 + this.parametriFantasy.livello,
        value: true
      }
    )
  }

}
