import { Charter } from "../abstract/charter";
import { Utilities } from "../utils/utilities";
import { Camion } from "./camion";
import { GeneralSprite } from "./general-sprite";
import { GestioneSfondi } from "./gestione-sfondo";
import { Pozione } from "./pozione";
import { Treasure } from "./treasure";

export class Mondo {
    private mondoNumero = 0;
    private sfondo!: GestioneSfondi;
    enemies: Charter[] = [];
    camion!: Camion;
    pozione!: Pozione;
    scudoBonus!: GeneralSprite;
    tesoro!: Treasure;
    constructor(public ctx: CanvasRenderingContext2D, livelloNemici: number, numeroNemici: number, velocitaCamion: number) {
        this.inizialize(numeroNemici, livelloNemici, ctx, velocitaCamion);
    }

    inizialize(numeroNemici: number, livelloNemici: number, ctx: CanvasRenderingContext2D, velocitaCamion: number) {
        this.enemies = Utilities.createEnemiesArray(numeroNemici, this.ctx, livelloNemici);
        this.camion = new Camion(ctx, 'red');
        this.camion.setX(29);
        this.camion.setY(3);
        this.camion.setVelocita(velocitaCamion);
        this.camion.stand();
        this.pozione = new Pozione(this.ctx, 'green');
        this.pozione.setX(2);
        this.pozione.setY(2);
        this.pozione.setVelocita(0);
        this.pozione.stand();
        this.scudoBonus = new GeneralSprite(this.ctx, 'assets/images/scudo.png', 50, 70);
        this.scudoBonus.setX(4);
        this.scudoBonus.setY(4);
        this.scudoBonus.setVelocita(0);
        this.scudoBonus.stand();
        this.tesoro = new Treasure(this.ctx, '');
        this.tesoro.setX(5);
        this.tesoro.setY(5);
        this.tesoro.setVelocita(0);
        this.tesoro.stand();
        this.sfondo = new GestioneSfondi(this.ctx, '');
    }

    startSchema() {
        this.sfondo.setX(0);
        this.sfondo.setY(1);
        this.sfondo.setVelocita(0);
    }

    aggiornaLivello() {
        this.sfondo.livello = this.mondoNumero;
    }

    aggiorna(livello: number) {
        this.sfondo.livello = livello === 0 ? livello = 1 : livello;
        this.sfondo.stand();
        this.pozione.stand();
        // this.scudoBonus.stand();
        //sthis.tesoro.stand();

    }
}