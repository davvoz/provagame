import { Charter } from './charter';
import { classe } from './costants.enum';

export class Arcere extends Charter {
  override salute = 30000;
  override agilita = 20;
  override forza = 20;
  override intelligenza = 100;
  override mana = 10;
  override resistenzaFisica = 5;
  override resistenzaMagica = 8;
  override counterAnimation = 0;
  override classe: classe = 'ARCERE';
  override name = 'Arcere default name';
  override spriteSheetCharterPath = 'assets/images/spredtraso.png';//src\assets\images\spredtraso.png
  override spriteSheetAttackPath = 'assets/images/spredtraso.png';
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
        quantita:100,
        totTurni:100*this.livello,
        value:true
      }
    )
  }

}
