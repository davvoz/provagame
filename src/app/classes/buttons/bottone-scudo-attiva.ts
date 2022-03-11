import { Charter } from "../abstract/charter";
import { Bottone } from "../elements/bottone";
import { SquareConfig } from "../utils/costants.enum";

export class BottoneScudoAttiva extends Bottone {
    imageScudo = new Image();
    imageScudoBuco = new Image();

    index = 0;
    counterAnimation = 0;
    private isScudoPresente = false;
    constructor(configurazioneInziale: SquareConfig,isToggle:boolean) {
        super(configurazioneInziale, isToggle);
        this.imageScudo.src = 'assets/images/scudo.png';
        this.imageScudoBuco.src = 'assets/images/scudobuco.png';//src\assets\images\scudobuco.png
        this.config = configurazioneInziale;
        this.config.w = 50;
        this.config.h = 70;
    }

    override disegnaMe(): void {
        if (this.isScudoPresente) {//disegno bottone/scudo
            this.config.ctx.drawImage(this.imageScudo,
                0,//colonna ws
                0,//riga hs
                this.imageScudo.width, //ws
                this.imageScudo.height,//hs
                this.getX() * this.config.w,
                this.getY() * this.config.h,
                this.config.w,
                this.config.h);

        } else {//disegno il buco
            this.config.ctx.drawImage(this.imageScudoBuco,
                0,//colonna ws
                0,//riga hs
                this.imageScudoBuco.width, //ws
                this.imageScudoBuco.height,//hs
                this.getX() * this.config.w,
                this.getY() * this.config.h,
                this.config.w,
                this.config.h);
        }
       
       // this.config.ctx.strokeRect(this.config.w * this.getX(), this.config.h * this.getY(), this.config.w, this.config.h);
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
        charter.scudoCounter.attiva();
    }
}