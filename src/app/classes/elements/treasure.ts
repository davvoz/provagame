import { SquareConfig } from "../utils/costants.enum";
import { Utilities } from "../utils/utilities";
import { Square } from "./square";

export class Treasure extends Square {
    image = new Image();
    money = 0;
    override config!:SquareConfig;
        constructor(configurazioneInziale:SquareConfig) {
        super(configurazioneInziale);
        this.money = Utilities.getSecureRandom(1000);
        this.image.src = 'assets/images/treasure.png';
    }
    override draw(): void {
        this.config.ctx.drawImage(this.image, this.config.w * this.config.x, this.config.h * this.config.y, 50, 75)
    }
}
