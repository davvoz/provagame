import { Charter } from '../abstract/charter';
import { classe } from '../utils/costants.enum';

export class Arcere extends Charter {
  override agilita = 20;
  override forza = 100;
  override intelligenza = 100;
  override mana = 1;
  override counterManaTreshold = 20;
  override resistenzaFisica = 70;
  override resistenzaMagica = 80;
  override counterAnimation = 0;
  override classe: classe = 'ARCERE';
  override name = 'Arcere default name';
  override spriteSheetCharterPath = 'assets/images/edwardAtk.png';//src\assets\images\spredtraso.png
  override spriteSheetAttackPath = 'assets/images/edwardAtk.png';
  constructor(public override ctx: CanvasRenderingContext2D, color: string, level: number) {
    super(ctx, color);
    this.livello = level;
    this.aggiornaCaratteristiche();
    this.genereSprite = 1;
    this.numeriFortunati = [0, 1, 2, 3, 4, 5, 6, 7,8];

  }
  
  override aggiornaCaratteristiche() {
    this.forza += Math.floor(Math.random() * 20) * this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 50) * this.livello;
    this.intelligenza += Math.floor(Math.random() * 55) * this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 20) * this.livello;
    this.agilita += Math.floor(Math.random() * 50) * this.livello;

    this.spriteSheetImage.src = this.spriteSheetCharterPath;
    this.spriteSheetImageAttack.src = this.spriteSheetAttackPath;
    this.incrementaSalute(Math.floor(Math.random() * 50) * this.livello);
  }

  override lanciaAbilita(charter: Charter): void {
    console.log(this.name + ' lancia abilità a ' + charter.name);
    charter.updateSituazioneConditions(
      {
        conditionType: 'VENO',
        quantita: 5 * this.livello,
        totTurni: 200 + this.livello * 2,
        value: true
      }
    )
  }

}
