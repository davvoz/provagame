import { Bottone } from "../elements/bottone";
import { classe, SquareConfig } from "../utils/costants.enum";

export class BottoneSceltaCharter extends Bottone {
    typeOfCharter: classe = 'ABSTRACT';
    image = new Image();
    index = 0;
    counterAnimation = 0;
    abilitato = true;

    constructor(configurazioneInziale: SquareConfig, path: string, isToggle: boolean) {
        super(configurazioneInziale, isToggle);
        this.image.src = path;
        this.config.w = 70;
        this.config.h = 90;
    }

    override disegnaMe(): void {
        this.config.ctx.save()
        this.config.ctx.strokeStyle = 'red';


        [...Array(15).keys()].forEach(
            (el) => {
                this.config.ctx.strokeRect(
                    this.config.x * this.config.w + el * 10,
                    this.config.y * this.config.h - 60 + el * 10,
                    this.config.w - el * 20,
                    this.config.h - el * 20)
            });
        this.config.ctx.drawImage(this.image,
            this.image.width / 4 * this.counterAnimation,//colonna ws
            0,//riga hs
            this.image.width / 4, //ws
            this.image.height / 4,//hs
            this.config.x * this.config.w,
            this.config.y * this.config.h,
            this.config.w,
            this.config.h);

        this.config.ctx.restore();
        this.scriviAltriTesti();
    }

    override scriviAltriTesti() {
        this.config.ctx.save();

        this.config.ctx.font = "23px Orbitron";
        this.config.ctx.fillStyle='black';    
            if (this.isToggle && this.isShowState) {
            this.config.ctx.fillText(
                this.state,
                this.config.x * this.config.w,
                this.config.y * this.config.y + 60,
                3000
            );
        }
        this.config.ctx.fillText(
            this.terzoText,
            this.config.x * this.config.w,
            this.config.y * this.config.h + this.config.h / 2 +50,
            3000
        );
        this.config.ctx.restore();
    }

}