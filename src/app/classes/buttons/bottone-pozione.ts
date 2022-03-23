import { Bottone } from "../elements/bottone";
import { SquareConfig } from "../utils/costants.enum";

export class BottonePozione extends Bottone {
    spriteSheetCharterPath = 'assets/images/pozionevuota.png';
    image = new Image();
    isCasellaPiena = false;
    constructor(configurazioneInziale: SquareConfig, isToggle: boolean) {
        super(configurazioneInziale, isToggle);
        this.config.w = 30;
        this.config.h = 80;
        this.image.src = this.spriteSheetCharterPath;
    }
    override disegnaMe(): void {
        this.config.ctx.drawImage(this.image,
            0, 0,
            this.image.width, this.image.height,
            this.config.w * this.config.x, this.config.h * this.config.y,
            50, 75);
    }

    riempiCasella() {
        this.isCasellaPiena = true;
        this.image.src = 'assets/images/pozioneverde.png'
    }

    svuotaCasella() {
        this.isCasellaPiena = false;
        this.image.src = 'assets/images/pozionevuota.png'
    }
}