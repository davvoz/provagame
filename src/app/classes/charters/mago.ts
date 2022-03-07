import { Charter } from '../abstract/charter';
import { classe } from '../utils/costants.enum';

export class Mago extends Charter {
  //override counterManaTreshold = 15;
  override name = 'Mago default name';
  override classe: classe = 'MAGO';
  override spriteSheetCharterPath = 'assets/images/discotraspoo.png';//src\assets\images\discotraspooAtck.png
  override spriteSheetAttackPath = 'assets/images/discotraspooAtck.png';
  override genereSprite: number=0;
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.parametriFantasy.livello = level;
    this.parametriFantasy.numeriFortunati = [0, 1, 2, 3, 4];
    this.parametriFantasy.agilita = 2;
    this.parametriFantasy.forza = 10;
    this.parametriFantasy.intelligenza = 10;
    this.parametriFantasy.mana = 1;
    this.parametriFantasy.resistenzaFisica = 7;
    this.parametriFantasy.resistenzaMagica = 8;
    this.parametriFantasy.maxMana = 10;
    this.aggiornaCaratteristiche();

  }

  override aggiornaCaratteristiche() {
    this.parametriFantasy.forza += Math.floor(Math.random() * 1) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaFisica += Math.floor(Math.random() * 1) * this.parametriFantasy.livello;
    this.parametriFantasy.intelligenza += Math.floor(Math.random() * 5) * this.parametriFantasy.livello;
    this.parametriFantasy.resistenzaMagica += Math.floor(Math.random() * 2) * this.parametriFantasy.livello;
    this.incrementaSalute( Math.floor(Math.random() * 5) * this.parametriFantasy.livello);
    
  }
  
  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'STUN',
        quantita: 2 * this.parametriFantasy.livello,
        totTurni: 130 + this.parametriFantasy.livello,
        value: true
      }
    )
  }

}
