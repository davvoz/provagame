import { DrawSquareParam, SquareConfig, tipoSfondo } from "../utils/costants.enum";
import { Square } from "./square";

export class GestioneSfondi extends Square {
    spriteSheetPath = 'assets/images/alberi.png';
    spriteSheetPath5 = 'assets/images/skyline.png';
    tipoSfondo:tipoSfondo ='GIORNO';
    image = new Image();
    image5 = new Image();
    imageCloud1 = new Image();
    imageSun = new Image();
    imageGrass = new Image();
    stelle: DrawSquareParam[] = [];

    override config!:SquareConfig;
    constructor(configurazioneInziale:SquareConfig) {
    super(configurazioneInziale);
        this.image.src = this.spriteSheetPath;
        this.image5.src = this.spriteSheetPath5;
        this.imageCloud1.src = 'assets/images/cloud.png';
        this.imageSun.src = 'assets/images/sole.png';
        this.imageGrass.src = 'assets/images/grassEr.png';
        this.config.h = this.config.w;
        this.config.ctx.fillStyle = 'yellow';
        for (let i = 0; i < 250; i++) {
            const a = Math.random() * 3;
            this.stelle.push(
                {
                    x: Math.floor(Math.random() * 1100),
                    y: Math.floor(Math.random() * 60),
                    sideX: a,
                    sideY: a
                }
            );
        }
    }

    override draw(): void {
        if (this.tipoSfondo  === 'GIORNO') {
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
            //this.config.ctx.fillStyle = 'rgb('+(Math.floor(Math.random()*250))+','+(Math.floor(Math.random()*250))+','+(Math.floor(Math.random()*250))+')';
            this.config.ctx.fillRect(stella.x, stella.y, stella.sideY, stella.sideX);
        });
        for (let i = 0; i < 7; i++) {
            this.config.ctx.drawImage(this.image5,
                0, 0,
                this.image5.width, this.image5.height,
                this.config.x * this.config.w + 160 * i, this.config.y * this.config.h - 15,
                200, 90);
        }
    }

    private disegnaGiorno() {
        this.config.ctx.fillStyle = 'rgb(164, 255, 149)';
        this.config.ctx.fillRect(0, 90, this.config.ctx.canvas.width, 700);
        this.config.ctx.fillStyle = 'rgb(26, 233, 252)';
        this.config.ctx.fillRect(0, 0, this.config.ctx.canvas.width, 100);
        this.config.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            0, 690,
            this.image.width / 2, this.image.height / 2);
        this.config.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            200, 690,
            this.image.width / 2, this.image.height / 2);

        this.config.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            500, 690,
            this.image.width / 2, this.image.height / 2);
        this.config.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            630, 690,
            this.image.width / 2, this.image.height / 2);


        this.config.ctx.drawImage(this.imageSun,
            0, 0,
            this.image.width, this.image.height,
            230, 3,
            400, 80);
        this.config.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            220, 20,
            200, 50);
        this.config.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            420, -10,
            200, 50);

        this.config.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            460, 14,
            200, 50);
        this.config.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            630, -20,
            200, 50);
        this.config.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            880, 10,
            200, 50);

        for (let i = 0; i < 11; i++) {
            this.config.ctx.drawImage(this.image,
                0, 0,
                this.image.width, this.image.height,
                this.config.x * this.config.w + 100 * i, this.config.y * this.config.h,
                160, 50);
        }
    }
}