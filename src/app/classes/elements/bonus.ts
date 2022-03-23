import { SquareConfig, tipoBonus } from "../utils/costants.enum";
import { Square } from "./square";

export class Bonus extends Square {
    private tipoBonus: tipoBonus;
    private plafond = 10000;
    private quantita = 0;
    spriteSheetCharterPath = 'assets/images/panino.png';//src\assets\images\treasure.pngsrc\assets\images\spritesheet.jpg
    spriteSheetImage = new Image();
    constructor(configurazioneInziale:SquareConfig, tb: tipoBonus, quantita: number, plafond: number) {
        super(configurazioneInziale);
        this.config = configurazioneInziale;
        this.tipoBonus = tb;
        this.quantita = quantita;
        this.plafond = plafond;
        if (this.tipoBonus == 'salute') {
            this.spriteSheetImage.src = this.spriteSheetCharterPath;
        }

    }
    getTipoBonus() {
        return this.tipoBonus;
    }
    setTipoBonus(tb: tipoBonus) {
        this.tipoBonus = tb
    }

    override  draw() {
        if (this.plafond > 0) {
            this.config.ctx.drawImage(this.spriteSheetImage, this.config.w * this.config.x, this.config.h * this.config.y, 60, 80);
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