import { Charter } from './charter';
import { classe } from './costants.enum';

export class Mago extends Charter {
  override salute = 185000;
  override agilita = 20;
  override forza = 25;
  override intelligenza = 7000;
  override mana = 10;
  override resistenzaFisica = 5;
  override resistenzaMagica = 8;
  override counterAnimation = 0;
  override classe: classe = 'MAGO';
  override name = 'Mago default name';
  override spriteSheetCharterPath = 'assets/images/discotraspoo.png';//src\assets\images\discotraspoo.png
  constructor(public override ctx: CanvasRenderingContext2D, color: string) {
    super(ctx, color);
    this.forza += Math.floor(Math.random() * 10)*this.livello;
    this.resistenzaFisica += Math.floor(Math.random() * 10)*this.livello;
    this.intelligenza += Math.floor(Math.random() * 50)*this.livello;
    this.resistenzaMagica += Math.floor(Math.random() * 10)*this.livello;
    this.spriteSheetImage.src = this.spriteSheetCharterPath;
  }
  

}
