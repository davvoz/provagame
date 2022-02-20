import { Charter } from './charter';
import { classe } from './costants.enum';

export class Mago extends Charter {
  override salute = 3000;
  override agilita = 20;
  override forza = 20;
  override intelligenza = 100;
  override mana = 10;
  override resistenzaFisica = 5;
  override resistenzaMagica = 8;
  override counterAnimation = 0;
  override classe: classe = 'MAGO';
  override name = 'Mago default name';
  override spriteSheetCharterPath = 'assets/images/discotraspoo.png';//src\assets\images\discotraspooAtck.png
  override spriteSheetAttackPath = 'assets/images/discotraspooAtck.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.forza += Math.floor(Math.random() * 10) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 10) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 50) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 10) * this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
  }
  override lanciaAbilita(charter:Charter): void {
    console.log(this.name + ' lancia abilità a '+charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType:'VENO',
        quantita:200,
        totTurni:100*this.livello,
        value:true
      }
    )
  }

}
