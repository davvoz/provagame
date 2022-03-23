import { Bottone } from "../elements/bottone";
import { classe, SquareConfig } from "../utils/costants.enum";

export class BottoneSceltaCharter extends Bottone {
    typeOfCharter: classe = 'ABSTRACT';
    image = new Image();
    index = 0;
    counterAnimation = 0;

    constructor(configurazioneInziale: SquareConfig, path: string, isToggle: boolean) {
        super(configurazioneInziale, isToggle);
        this.image.src = path;
        this.config.w = 70;
        this.config.h = 90;
    }

    override disegnaMe(): void {
        this.config.ctx.save()
        this.config.ctx.strokeStyle = 'red';
        this.config.ctx.lineWidth = 3;
        this.config.ctx.strokeRect(
            this.config.x * this.config.w,
            this.config.y * this.config.h + this.config.h / 2 - 30,
            this.config.w,
            this.config.h);
        this.config.ctx.drawImage(this.image,
            this.image.width / 4 * this.counterAnimation,//colonna ws
            0,//riga hs
            this.image.width / 4, //ws
            this.image.height / 4,//hs
            this.config.x * this.config.w,
            this.config.y * this.config.h + this.config.h / 2,
            this.config.w,
            this.config.h);

        this.config.ctx.restore()
    }

    override scriviAltriTesti() {
        this.config.ctx.save();
        this.config.ctx.font = "13px Impact";
        this.config.ctx.fillText(
            this.terzoText,
            this.config.x * this.config.w,
            this.config.y * this.config.h + this.config.h / 2 - 50,
            60
        );
        this.config.ctx.restore();
    }

}