import { Sfondo } from "./sfondo";

export class Mondo {
    mondoNumero = 0;
    sfondo!: Sfondo;
    constructor(public ctx: CanvasRenderingContext2D) { }
    startSchema() {
        this.sfondo = new Sfondo(this.ctx, '');
        this.sfondo.setX(0);
        this.sfondo.setY(1);
        this.sfondo.setVelocita(0);
    }

    aggiornaLivello() {
        this.sfondo.livello = this.mondoNumero;
    }
    
    aggiorna(livello:number) {
        //this.sfondo.livello = 1;
        this.sfondo.livello = livello;
        this.sfondo.stand();
    }
}