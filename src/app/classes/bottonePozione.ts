import { Bottone } from "./bottone";

export class BottonePozione extends Bottone {
    spriteSheetCharterPath = 'assets/images/pozionevuota.png';//src\assets\images\treasure.pngsrc\assets\images\src\assets\images\pozioneverde.png.jpg
    image = new Image();
    isCasellaPiena = false;
    constructor(
        public override ctx: CanvasRenderingContext2D,
        color: string,
    ) {
        super(ctx, color);
        this.image.src = this.spriteSheetCharterPath;
        this.sideX = 30;
        this.sideY = 80;
    }
    override draw(): void {
        this.ctx.drawImage(this.image, this.sideX * this.getX(), this.sideY * this.getY(), 50, 80)
       // this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), 30, 80);

    }
    riempiCasella(){
        this.isCasellaPiena = true;
        this.image.src ='assets/images/pozioneverde.png'//src\assets\images\.png
    }
    svuotaCasella(){
        this.isCasellaPiena = false;
        this.image.src ='assets/images/pozionevuota.png'//src\assets\images\.png
    }
}