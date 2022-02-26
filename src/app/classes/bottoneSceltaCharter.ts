import { Bottone } from "./bottone";
import { classe } from "./costants.enum";

export class BottoneSceltaCharter extends Bottone {
    typeOfCharter: classe= 'ABSTRACT';
    image = new Image();
    index = 0;
    counterAnimation = 0;
    
    constructor(public override ctx: CanvasRenderingContext2D, path: string) {
        super(ctx, path);
        this.image.src = path;
        this.sideX = 70;
        this.sideY = 90;
    }

    override disegnaMe(): void {
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.getX() * this.sideX,
            this.getY() * this.sideY + this.sideY / 2 -30,
            this.sideX,
            this.sideY);
        this.ctx.drawImage(this.image,
            this.image.width / 4 * this.counterAnimation,//colonna ws
            0,//riga hs
            this.image.width / 4, //ws
            this.image.height / 4,//hs
            this.getX() * this.sideX,
            this.getY() * this.sideY + this.sideY / 2 ,
            this.sideX,
            this.sideY);
    }

    override scriviAltriTesti() {
        // this.ctx.fillText(
        //     this.secondText,
        //     this.getX() * this.sideX,
        //     this.getY() * this.sideY + this.sideY / 2 ,
        //     this.sideX
        // );
        this.ctx.fillText(
            this.terzoText,
            this.getX() * this.sideX,
            this.getY() * this.sideY + this.sideY / 2 - 50,
            60
          );
    }

}