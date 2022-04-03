import { Charter } from "../abstract/charter";
import { MondoConfigurations } from "../utils/costants.enum";
import { CounterToTrashold } from "../utils/counter-to-treshold";
import { Utilities } from "../utils/utilities";
import { Camion } from "./camion";
import { GeneralSprite } from "./general-sprite";
import { GestioneSfondi } from "./gestione-sfondo";
import { Pozione } from "./pozione";
import { Square } from "./square";
import { Treasure } from "./treasure";

export class Mondo {
    private sfondo!: GestioneSfondi;
    enemies: Charter[] = [];
    camion!: Camion;
    pozione!: Pozione;
    scudoBonus!: GeneralSprite;
    tesoro!: Treasure;
    superProiettile!: Square;
    superProiettileCounter = new CounterToTrashold(1000, false);

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
        if (!this.superProiettile) {
            this.superProiettile = new Square(Utilities.getSquareConfig(ctx, 'red'));
        }
        this.superProiettile.config.x = 7;
        this.superProiettile.config.y = 7;
        this.superProiettile.config.velocita = 0;
        this.superProiettile.stand();
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
        this.camion.config.x = 29;
        this.camion.config.y = 3;
        this.camion.config.velocita = this.configurazioneMondo.velocitaCamion;
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
        this.pozione.config.x = 2;
        this.pozione.config.y = 2;
        this.pozione.config.velocita = 0;
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
        this.scudoBonus.config.x = 4;
        this.scudoBonus.config.y = 4;
        this.scudoBonus.config.velocita = 0;
        this.scudoBonus.stand();
        this.tesoro = new Treasure(Utilities.getSquareConfig(ctx,''));
        this.tesoro.config.x = 5;
        this.tesoro.config.y = 5;
        this.tesoro.config.velocita = 0;
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
        this.sfondo.tipoSfondo = this.configurazioneMondo.id % 4 == 0 ? 'GIORNO' : 'NOTTE';
        this.startSchema();
    }

    startSchema() {
        this.sfondo.config.x = 0;
        this.sfondo.config.y = 1;
        this.sfondo.config.velocita = 0;
    }

    aggiorna() {
        this.superProiettileCounter.counting();
        this.sfondo.stand();
        this.pozione.stand();
        if(!this.superProiettileCounter.isActive()){
            this.superProiettile.stand();
        }
    }
}