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
    configurazione: MondoConfigurations = {
        livelloNemici: 0,
        numeroNemici: 0,
        velocitaCamion: 0,
        id: 0
    }
    constructor(configuration: MondoConfigurations) {
        this.configurazione = configuration;
    }

    inizialize(ctx: CanvasRenderingContext2D) {
        this.enemies = Utilities.createEnemiesArray(this.configurazione.numeroNemici, ctx, this.configurazione.livelloNemici);
        this.camion = new Camion(ctx, 'red');
        this.camion.setX(29);
        this.camion.setY(3);
        this.camion.setVelocita(this.configurazione.velocitaCamion);
        this.camion.stand();
        this.pozione = new Pozione(ctx, 'green');
        this.pozione.setX(2);
        this.pozione.setY(2);
        this.pozione.setVelocita(0);
        this.pozione.stand();
        this.scudoBonus = new GeneralSprite(ctx, 'assets/images/scudo.png', 50, 70);
        this.scudoBonus.setX(4);
        this.scudoBonus.setY(4);
        this.scudoBonus.setVelocita(0);
        this.scudoBonus.stand();
        this.tesoro = new Treasure(ctx, '');
        this.tesoro.setX(5);
        this.tesoro.setY(5);
        this.tesoro.setVelocita(0);
        this.tesoro.stand();
        this.sfondo = new GestioneSfondi(ctx, '');
        this.sfondo.tipoSfondo = this.configurazione.id % 2 == 0 ? 'GIORNO' : 'NOTTE';
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