import { Square } from "./square";

export class Pozione extends Square {
    image = new Image();
    constructor(
        public override ctx: CanvasRenderingContext2D,
        color: string,
    ) {
        super(ctx, color);
        this.image.src = 'assets/images/pozioneverde.png'//src\assets\images\.png
        this.sideX = 50;
        this.sideY = 70;
        this.image.src ='assets/images/pozioneverde.png';
    }
    override draw(): void {
        this.ctx.drawImage(this.image, this.sideX * this.getX(), this.sideY * this.getY(), 50, 80)

    }
}