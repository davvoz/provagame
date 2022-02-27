import { Charter } from "../abstract/charter";
import { Bottone } from "../elements/bottone";

export class BottoneScudoAttiva extends Bottone {
    imageScudo = new Image();
    imageScudoBuco = new Image();

    index = 0;
    counterAnimation = 0;
    private isScudoPresente = false;
    constructor(public override ctx: CanvasRenderingContext2D, path: string,isToggle:boolean) {
        super(ctx, path,isToggle);
        this.imageScudo.src = 'assets/images/scudo.png';
        this.imageScudoBuco.src = 'assets/images/scudobuco.png';//src\assets\images\scudobuco.png
        this.sideX = 50;
        this.sideY = 70;
    }

    override disegnaMe(): void {
        if (this.isScudoPresente) {//disegno bottone/scudo
            this.ctx.drawImage(this.imageScudo,
                0,//colonna ws
                0,//riga hs
                this.imageScudo.width, //ws
                this.imageScudo.height,//hs
                this.getX() * this.sideX,
                this.getY() * this.sideY,
                this.sideX,
                this.sideY);

        } else {//disegno il buco
            this.ctx.drawImage(this.imageScudoBuco,
                0,//colonna ws
                0,//riga hs
                this.imageScudoBuco.width, //ws
                this.imageScudoBuco.height,//hs
                this.getX() * this.sideX,
                this.getY() * this.sideY,
                this.sideX,
                this.sideY);
        }
       
       // this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX, this.sideY);
    }

    getIsScudoPresente() {
        return this.isScudoPresente;
    }

    riempiScudo() {
        this.isScudoPresente = true;
    }

    attivaScudo(charter:Charter) {
        if (this.isScudoPresente) {
            this.isScudoPresente = false;
        }
        charter.isScudoAttivato = true;
    }
}