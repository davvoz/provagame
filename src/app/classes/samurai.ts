import { Charter } from './charter';
import { classe } from './costants.enum';

export class Samurai extends Charter {
  override salute = 4000;
  override agilita = 20;
  override forza = 90;
  override intelligenza = 40;
  override mana = 10;
  override maxMana = 40;
  override counterManaTreshold = 25;
  override resistenzaFisica = 120;
  override resistenzaMagica = 30;
  override name = 'SAMURAI default name';
  override classe: classe = 'SAMURAI';
  override genereSprite = 1;
  override spriteSheetCharterPath = 'assets/images/samuraiAtk2.png';//src\assets\images\biondotraspo.pngsrc\assets\images\src\assets\images\samuraiAtk.png.png
  override spriteSheetAttackPath = 'assets/images/samuraiAtk2.png';//src\assets\images\Sensitolos.pngsrc\assets\images\biondotraspoAtck_1.pngsrc\assets\images\edward.png
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.salute += Math.floor(Math.random() * 50) * this.livello;
    this.forza += Math.floor(Math.random() * 50) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 20) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 10) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 10) * this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
  }
  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'FIRE',
        quantita: 6 * this.livello,
        totTurni: 90 + this.livello,
        value: true
      }
    )
  }

}
