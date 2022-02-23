import { Charter } from './charter';
import { classe } from './costants.enum';

export class Arcere extends Charter {
  override salute = 3000;
  override agilita = 20;
  override forza = 20;
  override intelligenza = 100;
  override mana = 1;
  override counterManaTreshold = 20;
  override resistenzaFisica = 50;
  override resistenzaMagica = 80;
  override counterAnimation = 0;
  override classe: classe = 'ARCERE';
  override name = 'Arcere default name';
  override spriteSheetCharterPath = 'assets/images/edwardAtk.png';//src\assets\images\spredtraso.png
  override spriteSheetAttackPath = 'assets/images/edwardAtk.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.forza += Math.floor(Math.random() * 8) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 8) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 20) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 10) * this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.genereSprite = 1;
  }
  override lanciaAbilita(charter: Charter): void {
    //console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'VENO',
        quantita: 1 * this.livello,
        totTurni: 200 + this.livello * 2,
        value: true
      }
    )
  }

}
