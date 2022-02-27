import { Charter } from '../abstract/charter';
import { classe } from '../utils/costants.enum';

export class Mago extends Charter {
  override agilita = 20;
  override forza = 70;
  override intelligenza = 280;
  override mana = 1;
  override maxMana = 10;
  override counterManaTreshold = 15;
  override resistenzaFisica = 50;
  override resistenzaMagica = 80;
  override counterAnimation = 0;
  override classe: classe = 'MAGO';
  override name = 'Mago default name';
  override spriteSheetCharterPath = 'assets/images/discotraspoo.png';//src\assets\images\discotraspooAtck.png
  override spriteSheetAttackPath = 'assets/images/discotraspooAtck.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.aggiornaCaratteristiche()
    this.numeriFortunati = [0, 1, 2, 3, 4];

  }

  override aggiornaCaratteristiche() {
    this.forza += Math.floor(Math.random() * 10) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 10) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 50) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 10) * this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.incrementaSalute( Math.floor(Math.random() * 50) * this.livello);
  }
  
  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'VENO',
        quantita: 3 * this.livello,
        totTurni: 100 + this.livello,
        value: true
      }
    )
  }

}
