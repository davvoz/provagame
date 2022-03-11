import { SquareConfig } from "../utils/costants.enum";
import { Square } from "./square";

export class Treasure extends Square {
    image = new Image();
    money = 0;
    override config!:SquareConfig;
        constructor(configurazioneInziale:SquareConfig) {
        super(configurazioneInziale);
        this.config = configurazioneInziale
        this.money = Math.floor(Math.random() * 1000);
        
        this.image.src = 'assets/images/treasure.png';
    }
    override draw(): void {
        this.config.ctx.drawImage(this.image, this.config.w * this.getX(), this.config.h * this.getY(), 50, 75)
    }
}
