import { Charter } from './charter';
import { classe } from './costants.enum';

export class Guerriero extends Charter {
  override salute = 200000;
  override agilita = 20;
  override forza = 50;
  override intelligenza = 30;
  override mana = 10;
  override resistenzaFisica = 10;
  override resistenzaMagica = 2;
  override name = 'Guerriero';
  override classe:classe = 'GUERRIERO';
  override spriteSheetCharterPath = 'assets/images/biondotraspo.png';//src\assets\images\biondotraspo.png

  constructor(public override ctx: CanvasRenderingContext2D, color: string) {
    super(ctx, color);
    this.forza += Math.floor(Math.random() * 10);
    this.resistenzaFisica += Math.floor(Math.random() * 10);
    this.intelligenza += Math.floor(Math.random() * 10);
    this.resistenzaMagica += Math.floor(Math.random() * 10);
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
  }

 
}
