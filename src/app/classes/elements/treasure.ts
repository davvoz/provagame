import { Square } from "./square";

export class Treasure extends Square {
    image = new Image();
    money = 0;
    constructor(
        public override ctx: CanvasRenderingContext2D,
        color: string,
    ) {
        super(ctx, color);
        this.money = Math.floor(Math.random() * 1000);
        
        this.image.src = 'assets/images/treasure.png';
    }
    override draw(): void {
        this.ctx.drawImage(this.image, this.sideX * this.getX(), this.sideY * this.getY(), 50, 75)
    }
}
