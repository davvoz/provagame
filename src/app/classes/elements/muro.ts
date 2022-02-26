import { Square } from "./square";

export class Muro extends Square {
    image = new Image();
    constructor(  public override ctx: CanvasRenderingContext2D,  color: string, x: number, y: number
    ) {
        super(ctx, color);
       // this.image.src = 'assets/images/pozioneverde.png'//src\assets\src\assets\images\MURO.png\.png
        this.sideX = 50;
        this.sideY = 50;
        this.image.src = 'assets/images/MURO.png';
        this.setX(x);
        this.setY(y);
    }
    override draw(): void {
        this.ctx.fillStyle = 'rgb(20,20,20)';
       // this.ctx.fillRect(this.sideX * this.getX(), this.sideY * this.getY(), 50, 50);
        this.ctx.drawImage(this.image, this.sideX * this.getX(), this.sideY * this.getY(), 50, 50);
    }
}