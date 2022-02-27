import { Square } from "./square";

export class GeneralSprite extends Square {
    image = new Image();
    constructor(public override ctx: CanvasRenderingContext2D, path: string, sideX: number, sideY: number) {
        super(ctx, path);
        this.image.src = path;
        this.sideX = sideX;
        this.sideY = sideY;
    }

    override draw(): void {
        this.ctx.drawImage(this.image, this.sideX * this.getX(), this.sideY * this.getY(), this.sideX, this.sideY);
        this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX, this.sideY);

    }
}