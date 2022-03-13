import { classeProiettile } from "../utils/costants.enum";
import { BottoneSceltaCharter } from "./bottone-scelta-charter";

export class BottoneSceltaProiettile extends BottoneSceltaCharter {
    typeOfProiettile!: classeProiettile;
    descrizioneProiettile: string = '';
    override disegnaMe(): void {
        this.config.ctx.save()
        this.config.ctx.strokeStyle = 'red';
        this.config.ctx.lineWidth = 3;
        this.config.ctx.strokeRect(
            this.config.x * this.config.w,
            this.config.y * this.config.h + this.config.h / 2 - 30,
            this.config.w,
            this.config.h);
        switch (this.typeOfProiettile) {
            case 'RAGNO':
                this.image.src = 'assets/images/spidero.png';
                this.descrizioneProiettile = 'blocca';
                this.config.ctx.drawImage(this.image,
                    this.image.width / 4 * this.counterAnimation,//colonna ws
                    0,//riga hs
                    this.image.width / 4, //ws
                    this.image.height / 4,//hs
                    this.config.x * this.config.w,
                    this.config.y * this.config.h,
                    this.config.w,
                    this.config.h);
                break;
            case 'COLTELLO':
                this.image.src = 'assets/images/coltello.png';
                this.descrizioneProiettile = 'stunna';
                this.config.ctx.drawImage(this.image,
                    this.image.width / 4 * this.counterAnimation,//colonna ws
                    0,//riga hs
                    this.image.width / 4, //ws
                    this.image.height,//hs
                    this.config.x * this.config.w,
                    this.config.y * this.config.h,
                    this.config.w,
                    this.config.h);
                break;
            case 'PALLADIFUOCO':
                this.image.src = 'assets/images/fireball.png';
                this.descrizioneProiettile = 'incendia';
                this.config.ctx.drawImage(this.image,
                    this.image.width / 4 * this.counterAnimation,//colonna ws
                    0,//riga hs
                    this.image.width / 4, //ws
                    this.image.height / 4,//hs
                    this.config.x * this.config.w,
                    this.config.y * this.config.h,
                    this.config.w,
                    this.config.h);
                break;
            case 'HAMMER':
                this.image.src = 'assets/images/hammero.png';
                this.descrizioneProiettile = 'stunna';
                this.config.ctx.drawImage(this.image,
                    this.image.width / 4 * this.counterAnimation,//colonna ws
                    0,//riga hs
                    this.image.width / 4, //ws
                    this.image.height,//hs
                    this.config.x * this.config.w,
                    this.config.y * this.config.h,
                    this.config.w,
                    this.config.h);
                break;
        }
        this.config.ctx.restore()
    }
}
