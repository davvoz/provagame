import { Charter } from "./charter";
import { tipoBonus } from "./costants.enum";

export class Bonus extends Charter{
    private tipoBonus:tipoBonus;
    quantita=0;
    constructor(public override ctx: CanvasRenderingContext2D, color: string,tipoBonus:tipoBonus,quantita:number) {
        super(ctx, color);
        this.tipoBonus = tipoBonus;
        this.quantita = quantita;
    }
    getTipoBonus(){
        return this.tipoBonus;
    }
    setTipoBonus(tipoBonus:tipoBonus){
        this.tipoBonus= tipoBonus
    }
    override draw() {
        this.ctx.fillStyle = this.getColor();
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(this.getZ() * this.getX(), this.getZ() * this.getY(), this.getZ(), this.getZ());
        this.ctx.strokeRect(this.getZ() * this.getX(), this.getZ() * this.getY(), this.getZ(), this.getZ());
      }
}