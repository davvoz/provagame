import { Charter } from './charter';
import { classe } from './costants.enum';

export class Guerriero extends Charter {
  override salute = 5000;
  override agilita = 20;
  override forza = 100;
  override intelligenza = 20;
  override mana = 10;
  override resistenzaFisica = 10;
  override resistenzaMagica = 2;
  override name = 'Guerriero default name';
  override classe: classe = 'GUERRIERO';
  override spriteSheetCharterPath = 'assets/images/biondotraspo.png';//src\assets\images\biondotraspo.pngsrc\assets\images\spredtraso.png
  override spriteSheetAttackPath = 'assets/images/biondotraspoAtck_1.png';//src\assets\images\Sensitolos.pngsrc\assets\images\biondotraspoAtck_1.png
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.salute += Math.floor(Math.random() * 50) * this.livello;
    this.forza += Math.floor(Math.random() * 50) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 10) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 10) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 10) * this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
  }
  override lanciaAbilita(charter:Charter): void {
    console.log(this.name + ' lancia abilità a '+charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType:'FIRE',
        quantita:100,
        totTurni:100*this.livello,
        value:true
      }
    )
  }

}
