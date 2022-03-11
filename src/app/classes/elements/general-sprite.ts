import { SquareConfig } from "../utils/costants.enum";
import { Square } from "./square";

export class GeneralSprite extends Square {
    image = new Image();
    override config!:SquareConfig;
    constructor(configurazioneInziale:SquareConfig,path:string) {
    super(configurazioneInziale);
        this.image.src = path;
    }

    override draw(): void {
        this.config.ctx.drawImage(this.image, this.config.w * this.getX(), this.config.h * this.getY(), this.config.w, this.config.h);
        this.config.ctx.strokeRect(this.config.w * this.getX(), this.config.h * this.getY(), this.config.w, this.config.h);

    }
}