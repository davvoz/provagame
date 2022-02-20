import { tipoBonus } from "./costants.enum";
import { Square } from "./square";

export class Bonus extends Square {
    private tipoBonus: tipoBonus;
    private plafond = 10000;
    private quantita = 0;
     spriteSheetCharterPath = 'assets/images/panino.png';//src\assets\images\treasure.pngsrc\assets\images\spritesheet.jpg
    spriteSheetImage= new Image();
    constructor(public override ctx: CanvasRenderingContext2D, color: string, tipoBonus: tipoBonus, quantita: number, plafond: number) {
        super(ctx, color);
        this.tipoBonus = tipoBonus;
        this.quantita = quantita;
        this.plafond = plafond;
        if (this.tipoBonus == 'salute') {
            this.spriteSheetImage.src = this.spriteSheetCharterPath;
        }

    }
    getTipoBonus() {
        return this.tipoBonus;
    }
    setTipoBonus(tipoBonus: tipoBonus) {
        this.tipoBonus = tipoBonus
    }

    override  draw() {

        if (this.plafond > 0) {
            this.ctx.drawImage(this.spriteSheetImage, this.sideX * this.getX(), this.sideY * this.getY(),60, 80);
        }
    }
    setQuantita(quantita: number) {
        this.quantita = quantita;
    }
    setPlafond(plafond: number) {
        this.plafond = plafond;

    }
    getQuantita(): number {
        return this.quantita
    }
    getPlafond(): number {
        return this.plafond
    }
}