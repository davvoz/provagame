import { Charter } from '../abstract/charter';
import { classe } from '../utils/costants.enum';

export class Guerriero extends Charter {
  override agilita = 20;
  override forza = 150;
  override intelligenza = 20;
  override mana = 1;
  override counterManaTreshold = 25;
  override resistenzaFisica = 100;
  override resistenzaMagica = 20;
  override maxMana = 50;
  override name = 'Guerriero default name';
  override classe: classe = 'GUERRIERO';
  override spriteSheetCharterPath = 'assets/images/biondotraspoAtck_1.png';//src\assets\images\biondotraspo.pngsrc\assets\images\spredtraso.png
  override spriteSheetAttackPath = 'assets/images/biondotraspoAtck_1.png';//src\assets\images\Sensitolos.pngsrc\assets\images\biondotraspoAtck_1.pngsrc\assets\images\edward.png
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.numeriFortunati = [0, 1, 2, 3, 4];
    this.counterForCritico = this.counterForCritico/2;
    this.aggiornaCaratteristiche();
  }

  override aggiornaCaratteristiche() {
    this.incrementaSalute( Math.floor(Math.random() * 50) * this.livello);
    this.forza += Math.floor(Math.random() * 60) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 20) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 20) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 20) * this.livello;
    this.agilita += Math.floor(Math.random() * 10) * this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
  }
  
  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'FIRE',
        quantita: 6 * this.livello,
        totTurni: 40 + this.livello,
        value: true
      }
    )
  }

}
