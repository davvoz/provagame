import { Charter } from "./charter";
import { tipoBonus } from "./costants.enum";

export class Bonus extends Charter {
    private tipoBonus: tipoBonus;
    private plafond = 10000;
    private quantita = 0;
    constructor(public override ctx: CanvasRenderingContext2D, color: string, tipoBonus: tipoBonus, quantita: number,plafond:number) {
        super(ctx, color);
        this.tipoBonus = tipoBonus;
        this.quantita = quantita;
        this.plafond=plafond;
    }
    getTipoBonus() {
        return this.tipoBonus;
    }
    setTipoBonus(tipoBonus: tipoBonus) {
        this.tipoBonus = tipoBonus
    }
    override draw() {
        if(this.plafond>0){
            let baseColor;
            if (this.plafond > 0) {
                baseColor = this.getColor();
            } else {
              baseColor  = 'white';
            }
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = baseColor;
            this.ctx.strokeStyle ='black';
            if(this.tipoBonus == 'salute'){
                this.ctx.fillRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX *this.plafond/1000, this.sideY);
                this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX*this.plafond/1000, this.sideY);
            }else{
                this.ctx.fillRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX *this.plafond/100, this.sideY);
                this.ctx.strokeRect(this.sideX * this.getX(), this.sideY * this.getY(), this.sideX*this.plafond/100, this.sideY);
            }
         
           
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