import { SquareConfig } from "../utils/costants.enum";
import { Square } from "./square";

export class Pozione extends Square {
    image = new Image();
    override config!:SquareConfig;
    constructor(configurazioneInziale:SquareConfig) {
    super(configurazioneInziale);
        this.image.src = 'assets/images/pozioneverde.png'//src\assets\images\.png
        this.config.w = 50;
        this.config.h = 70;
    }
    override draw(): void {
        this.config.ctx.drawImage(this.image, this.config.w * this.getX(), this.config.h * this.getY(), 50, 75)

    }
}