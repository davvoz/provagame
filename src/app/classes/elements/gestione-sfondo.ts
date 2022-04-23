import { SquareParam, SquareConfig, tipoSfondo } from "../utils/costants.enum";
import { Utilities } from "../utils/utilities";
import { Square } from "./square";

export class GestioneSfondi extends Square {
    alberiPath = 'assets/images/alberi.png';
    skylinePath = 'assets/images/skyline.png';
    tipoSfondo: tipoSfondo = 'GIORNO';
    alberiImg = new Image();
    skylineImg = new Image();
    cloudImage = new Image();
    sunImg = new Image();
    grassImg = new Image();
    stelle: SquareParam[] = [];
    nuvole: SquareParam[] = [];
    override config!: SquareConfig;
    sunPosition = Utilities.getSecureRandom(this.config.ctx.canvas.width - 800) + 400;
    
    constructor(configurazioneInziale: SquareConfig) {
        super(configurazioneInziale);
        this.alberiImg.src = this.alberiPath;
        this.skylineImg.src = this.skylinePath;
        this.cloudImage.src = 'assets/images/cloud.png';
        this.sunImg.src = 'assets/images/sole.png';
        this.grassImg.src = 'assets/images/grassEr.png';
        this.config.h = this.config.w;
        this.config.ctx.fillStyle = 'yellow';

        [...Array(10).keys()].forEach(
            () => {
                const a = Utilities.getSecureRandom(3);
                this.stelle.push({
                    x: Utilities.getSecureRandom(this.config.ctx.canvas.width),
                    y: Utilities.getSecureRandom(60),
                    h: a,
                    w: a
                });
            }
        );

        [...Array(29).keys()].forEach(
            () => {
                const a = Utilities.getSecureRandom(100);
                const b = Utilities.getSecureRandom(30);
                this.nuvole.push({
                    x: Utilities.getSecureRandom(this.config.ctx.canvas.width),
                    y: Utilities.getSecureRandom(40),
                    h: a < b ? b : a,
                    w: a < b ? a : b
                });
            }
        );
    }

    override draw(): void {
        if (this.tipoSfondo !== 'GIORNO') {
            this.disegnaGiorno();
        } else {
            this.disegnaNotte();
        }
    }

    private disegnaNotte() {
        this.config.ctx.fillStyle = 'rgb(150, 130, 130)';
        this.config.ctx.fillRect(0, 90, this.config.ctx.canvas.width, 700);
        this.config.ctx.fillStyle = 'rgb(0, 0, 33)';
        this.config.ctx.fillRect(0, 0, this.config.ctx.canvas.width, 100);
        this.config.ctx.fillStyle = 'rgb(200,200,200)';
        this.config.ctx.fillRect(10, 300, 300, 50);
        this.config.ctx.fillRect(400, 300, 300, 50);
        this.config.ctx.fillRect(800, 300, 300, 50);
        this.config.ctx.fillStyle = 'white';
        this.stelle.forEach((stella) => {
            this.config.ctx.fillRect(stella.x, stella.y, stella.h, stella.w);
        });

        [...Array(10).keys()].forEach(
            (el) => {
                this.config.ctx.drawImage(this.skylineImg,
                    0, 0,
                    this.skylineImg.width, this.skylineImg.height,
                    this.config.x * this.config.w + 160 * el, this.config.y * this.config.h - 15,
                    200, 90
                );
            }
        );
    }

    private disegnaGiorno() {
        this.config.ctx.fillStyle = 'rgb(26, 233, 252)';
        this.config.ctx.fillRect(0, 0, this.config.ctx.canvas.width, 100);
        this.config.ctx.drawImage(this.sunImg,
            0, 0,
            this.sunImg.width, this.sunImg.height,
            this.sunPosition, 3,
            80, 70);

        this.nuvole.forEach((nuvola) => {
            this.config.ctx.drawImage(this.cloudImage,
                0, 0,
                this.cloudImage.width, this.cloudImage.height,
                nuvola.x, nuvola.y, nuvola.h, nuvola.w);
        });

        [...Array(20).keys()].forEach(
            (el) => {
                this.config.ctx.drawImage(this.alberiImg,
                    0, 0,
                    this.alberiImg.width, this.alberiImg.height,
                    this.config.x * this.config.w + 100 * el, this.config.y * this.config.h,
                    160, 50);
            }
        );

        this.config.ctx.fillStyle = 'rgb(164, 255, 149)';
        this.config.ctx.fillRect(0, 90, this.config.ctx.canvas.width, 700);

        [...Array(20).keys()].forEach(
            (el) => {
                this.config.ctx.drawImage(this.grassImg,
                    0, 0,
                    this.grassImg.width, this.grassImg.height,
                    this.config.x * this.config.w + 100 * el, 550,
                    this.grassImg.width / 2, this.grassImg.height / 2);
            }
        );
    }
}
