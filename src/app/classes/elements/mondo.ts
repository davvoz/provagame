import { Charter } from "../abstract/charter";
import { MondoConfigurations } from "../utils/costants.enum";
import { Utilities } from "../utils/utilities";
import { Camion } from "./camion";
import { GeneralSprite } from "./general-sprite";
import { GestioneSfondi } from "./gestione-sfondo";
import { Pozione } from "./pozione";
import { Treasure } from "./treasure";

export class Mondo {
    private sfondo!: GestioneSfondi;
    enemies: Charter[] = [];
    camion!: Camion;
    pozione!: Pozione;
    scudoBonus!: GeneralSprite;
    tesoro!: Treasure;
    configurazioneMondo: MondoConfigurations = {
        livelloNemici: 0,
        numeroNemici: 0,
        velocitaCamion: 0,
        id: 0
    }
    constructor(configuration: MondoConfigurations) {
        this.configurazioneMondo = configuration;
    }

    inizialize(ctx: CanvasRenderingContext2D) {
        this.enemies = Utilities.createEnemiesArray(this.configurazioneMondo.numeroNemici, ctx, this.configurazioneMondo.livelloNemici);
        this.camion = new Camion({
            color: 'red',
            ctx: ctx,
            velocita: 0.1,
            h: 70,
            w: 50,
            x: 0,
            y: 0
        });
        this.camion.setX(29);
        this.camion.setY(3);
        this.camion.setVelocita(this.configurazioneMondo.velocitaCamion);
        this.camion.stand();
        this.pozione = new Pozione({
            color: 'green',
            ctx: ctx,
            velocita: 0.1,
            h: 70,
            w: 50,
            x: 0,
            y: 0
        });
        this.pozione.setX(2);
        this.pozione.setY(2);
        this.pozione.setVelocita(0);
        this.pozione.stand();
        this.scudoBonus = new GeneralSprite({
            color: 'green',
            ctx: ctx,
            velocita: 0.1,
            h: 70,
            w: 50,
            x: 0,
            y: 0
        }, 'assets/images/scudo.png');
        this.scudoBonus.setX(4);
        this.scudoBonus.setY(4);
        this.scudoBonus.setVelocita(0);
        this.scudoBonus.stand();
        this.tesoro = new Treasure({
            color: 'green',
            ctx: ctx,
            velocita: 0.1,
            h: 70,
            w: 50,
            x: 0,
            y: 0
        });
        this.tesoro.setX(5);
        this.tesoro.setY(5);
        this.tesoro.setVelocita(0);
        this.tesoro.stand();
        this.sfondo = new GestioneSfondi({
            color: 'green',
            ctx: ctx,
            velocita: 0.1,
            h: 70,
            w: 50,
            x: 0,
            y: 0
        });
        this.sfondo.tipoSfondo = this.configurazioneMondo.id % 2 == 0 ? 'GIORNO' : 'NOTTE';
        this.startSchema();
    }

    startSchema() {
        this.sfondo.setX(0);
        this.sfondo.setY(1);
        this.sfondo.setVelocita(0);
    }

    aggiorna() {
        this.sfondo.stand();
        this.pozione.stand();
    }
}