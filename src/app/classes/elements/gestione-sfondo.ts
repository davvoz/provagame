import { DrawSquareParam } from "../utils/costants.enum";
import { Square } from "./square";

export class GestioneSfondi extends Square {
    spriteSheetPath = 'assets/images/alberi.png';//src\assets\images\biondotraspo.pngsrc\assets\images\spredtraso.png
    spriteSheetPath5 = 'assets/images/skyline.png';//src\assets\images\biondotraspo.pngsrc\assets\images\src\assets\images\src\assets\images\grass2.png.png.png
    livello = 0;
    image = new Image();
    image5 = new Image();
    imageCloud1 = new Image();
    imageSun = new Image();
    imageGrass = new Image();
    //imageTubo = new Image();

    stelle: DrawSquareParam[] = [];
    constructor(public override ctx: CanvasRenderingContext2D, color: string,) {
        super(ctx, color);
        this.image.src = this.spriteSheetPath;
        this.image5.src = this.spriteSheetPath5;
        this.imageCloud1.src = 'assets/images/cloud.png';
        this.imageSun.src = 'assets/images/sole.png';
        this.imageGrass.src = 'assets/images/grassEr.png';
        //this.imageTubo.src = 'assets/images/grass.png';

        this.sideY = this.sideX;
        this.ctx.fillStyle = 'yellow';
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
        if (this.livello % 2 == 0) {
            this.disegnaGiorno();
        } else {
            this.disegnaNotte();

        }
    }

    private disegnaNotte() {
        this.ctx.fillStyle = 'rgb(150, 130, 130)';
        this.ctx.fillRect(0, 90, this.ctx.canvas.width, 700);
        this.ctx.fillStyle = 'rgb(0, 0, 33)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, 100);
        this.ctx.fillStyle = 'rgb(200,200,200)';
        this.ctx.fillRect(10, 300, 300, 50);
        this.ctx.fillRect(400, 300, 300, 50);
        this.ctx.fillRect(800, 300, 300, 50);
        this.ctx.fillStyle = 'white';
        this.stelle.forEach((stella) => {
            //this.ctx.fillStyle = 'rgb('+(Math.floor(Math.random()*250))+','+(Math.floor(Math.random()*250))+','+(Math.floor(Math.random()*250))+')';
            this.ctx.fillRect(stella.x, stella.y, stella.sideY, stella.sideX);
        });
        for (let i = 0; i < 7; i++) {
            this.ctx.drawImage(this.image5,
                0, 0,
                this.image5.width, this.image5.height,
                this.getX() * this.sideX + 160 * i, this.getY() * this.sideY - 15,
                200, 90);
        }
    }

    private disegnaGiorno() {
        this.ctx.fillStyle = 'rgb(164, 255, 149)';
        this.ctx.fillRect(0, 90, this.ctx.canvas.width, 700);
        this.ctx.fillStyle = 'rgb(26, 233, 252)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, 100);
        this.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            0, 690,
            this.image.width / 2, this.image.height / 2);
        this.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            200, 690,
            this.image.width / 2, this.image.height / 2);

        this.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            500, 690,
            this.image.width / 2, this.image.height / 2);
        this.ctx.drawImage(this.imageGrass,
            0, 0,
            this.image.width, this.image.height,
            630, 690,
            this.image.width / 2, this.image.height / 2);


        this.ctx.drawImage(this.imageSun,
            0, 0,
            this.image.width, this.image.height,
            230, 3,
            400, 80);
        this.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            220, 20,
            200, 50);
        this.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            420, -10,
            200, 50);

        this.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            460, 14,
            200, 50);
        this.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            630, -20,
            200, 50);
        this.ctx.drawImage(this.imageCloud1,
            0, 0,
            this.image.width, this.image.height,
            880, 10,
            200, 50);

        for (let i = 0; i < 11; i++) {
            this.ctx.drawImage(this.image,
                0, 0,
                this.image.width, this.image.height,
                this.getX() * this.sideX + 100 * i, this.getY() * this.sideY,
                160, 50);
        }
    }
}