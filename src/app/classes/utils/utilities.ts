import { Square } from "../elements/square";
import { CollisionToDirection, Coordinate, direzione, SquareConfig, SquareParam } from './costants.enum';
import { Guerriero } from "../charters/guerriero";
import { Mago } from "../charters/mago";
import { Bonus } from "../elements/bonus";
import { Charter } from "../abstract/charter";
import { Bullo } from "../charters/bullo";
import { Bottone } from "../elements/bottone";
import { Samurai } from "../charters/samurai";
import { Camion } from "../elements/camion";

export class Utilities {

    static createCamionArray(numeroCamion: number, ctx: CanvasRenderingContext2D): Camion[] {
        const ca: Camion[] = [];
        for (let i = 0; i < numeroCamion; i++) {
            const camion = new Camion(Utilities.getSquareConfig(ctx, 'red'));
            camion.config.x = 29;
            camion.config.y = 3;
            camion.config.velocita = 0.1;
            camion.stand();
            ca.push(camion);
        }
        return ca
    }

    static arrayRandomicoNumerico(array: number[]): number {
        return array[Utilities.getSecureRandom(array.length)];
    }

    static rectsColliding(rect1: Square, rect2: Square) {
        return rect1.config.x < rect2.config.x + rect2.config.w &&
            rect1.config.x + rect1.config.w > rect2.config.x &&
            rect1.config.y < rect2.config.y + rect2.config.h &&
            rect1.config.h + rect1.config.y > rect2.config.y
    }

    static rectsCollidingToDirection(cacciatore: SquareParam, preda: SquareParam): CollisionToDirection {
        const cto = new CollisionToDirection();
        cto.collisionFromBottom = preda.h + preda.y - (cacciatore.h + cacciatore.y);
        cto.collisionFromTop = cacciatore.h + cacciatore.y - (preda.h + preda.y);
        cto.collisionFromLeft = cacciatore.x + cacciatore.w - (preda.x + preda.w);
        cto.collisionFromRight = preda.x + preda.w - (cacciatore.x + cacciatore.w);
        cto.isColliding = cacciatore.x < preda.x + preda.w &&
            cacciatore.x + cacciatore.w > preda.x &&
            cacciatore.y < preda.y + preda.h &&
            cacciatore.h + cacciatore.y > preda.y;
        return cto;
    }

    static rectsCollidingWrong(r1: SquareParam, r2: SquareParam) {
        return !(
            r1.x > r2.x + 1 ||
            r1.x + 1 < r2.x ||
            r1.y > r2.y + 1 ||
            r1.y + 1 < r2.y
        );
    }

    static direzionaRandomicamenteCharter(charter: Square) {
        const d: direzione[] = ["TOP", "BOTTOM", "LEFT", "RIGHT", "STAND"];
        const random = Utilities.getSecureRandom(d.length);
        charter.setDirection(d[random]);
    }

    static directionToMoveSwitch(charter: Square) {
        switch (charter.getDirection()) {
            case 'TOP':
                charter.moveTop();
                break;
            case 'BOTTOM':
                charter.moveBottom();
                break;
            case 'LEFT':
                charter.moveLeft();
                break;
            case 'RIGHT':
                charter.moveRight();
                break;
            case 'STAND':
                charter.stand();
        }
    }

    static createBonusArray(j: number, ctx: CanvasRenderingContext2D): Bonus[] {
        const ba: Bonus[] = [];
        const bonus1 = new Bonus(Utilities.getSquareConfig(ctx, 'red'), 'salute', 1000, 1000);
        bonus1.spriteSheetImage.src = 'assets/images/polloo.png';
        bonus1.config.x = Utilities.getSecureRandom(9) + 1;
        bonus1.config.y = Utilities.getSecureRandom(8) + 1;
        bonus1.config.velocita = 0;
        bonus1.stand();
        ba.push(bonus1);
        const bonus2 = new Bonus(Utilities.getSquareConfig(ctx, 'red'), 'salute', 200, 200);
        bonus2.spriteSheetImage.src = 'assets/images/panino.png';
        bonus2.config.x = Utilities.getSecureRandom(9) + 1;
        bonus2.config.y = Utilities.getSecureRandom(8) + 1;
        bonus2.config.velocita = 0;
        bonus2.stand();
        ba.push(bonus2);
        const bonus3 = new Bonus(Utilities.getSquareConfig(ctx, 'red'), 'salute', 300, 300);
        bonus3.spriteSheetImage.src = 'assets/images/formaggio.png';
        bonus3.config.x = Utilities.getSecureRandom(9) + 1;
        bonus3.config.y = Utilities.getSecureRandom(8) + 1;
        bonus3.config.velocita = 0;
        bonus3.stand();
        ba.push(bonus3);
        const bonus4 = new Bonus(Utilities.getSquareConfig(ctx, 'red'), 'salute', 400, 400);
        bonus4.spriteSheetImage.src = 'assets/images/uovo.png';
        bonus4.config.x = Utilities.getSecureRandom(9) + 1;
        bonus4.config.y = Utilities.getSecureRandom(8) + 1;
        bonus4.config.velocita = 0;
        bonus4.stand();
        ba.push(bonus4);
        console.log(ba);
        return ba
    }

    static createEnemiesArray(quantitaDiNemici: number, ctx: CanvasRenderingContext2D, livelloNemici: number): Charter[] {
        const enemies: Charter[] = []
        for (let i = 0; i < quantitaDiNemici; i++) {
            let enemy: Charter;

            let config;
            switch (i % 4) {
                case 0:
                    config = Utilities.getSquareConfig(ctx, 'red');
                    enemy = new Guerriero(config);
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
                case 1:
                    config = Utilities.getSquareConfig(ctx, 'green');
                    enemy = new Mago(config);
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
                case 2:
                    config = Utilities.getSquareConfig(ctx, 'blue');
                    enemy = new Bullo(config)
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
                case 3:
                    config = Utilities.getSquareConfig(ctx, 'violet');
                    enemy = new Samurai(config)
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
            }
        }
        return enemies;
    }

    static getSquareConfig(ctx: CanvasRenderingContext2D, color: string): SquareConfig {
        return {
            color: color,
            ctx: ctx,
            h: 70,
            w: 50,
            velocita: 0.1,
            x: 0,
            y: 0
        };
    }

    private static setEnemiesArray(enemy: Charter, i: number, livelloNemici: number, enemies: Charter[]) {
        for (let j = 0; j < livelloNemici; j++) {
            enemy.incrementaLivello();
        }
        enemy.config.x = Utilities.getSecureRandom(15) + 5;
        enemy.config.y = Utilities.getSecureRandom(i) + 1;
        enemy.config.velocita = 0.1;
        enemy.posizioneInfoLabelX = 370 + i * 120;
        enemy.posizioneInfoLabelY = 700;
        enemy.dannoCritico = 10 * livelloNemici;
        enemy.counterForCriticoTreshold = 10;
        enemy.name = this.nomeRandomico();
        enemy.parametriFantasy.money = Utilities.getSecureRandom(100);
        enemy.stand();
        enemies.push(enemy);
    }

    static getMousePos(canvas: HTMLCanvasElement, event: MouseEvent): Coordinate {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    static isInside(mousePosition: { x: number; y: number; }, rect: SquareParam) {
        return (
            mousePosition.x > rect.x &&
            mousePosition.x < rect.x + rect.w &&
            mousePosition.y < rect.y + rect.h &&
            mousePosition.y > rect.y
        );
    }

    static nomeRandomico(): string {
        return Utilities.arrayRandomico(['Piero', 'Luigi', 'Aleg', 'Pistolius',
            'Agricanto', 'Tacimela', 'Rambaudo', 'Coletta', 'Rimarro', 'Sgrunf',
            'Prux', 'Laida', 'Skyre', 'Pantone', 'Ramira', 'Astofele', 'Carima', 'Stangolo',
            'Aldo', 'Maria', 'Marco', 'Derrer', 'Skutillo', 'Rafranco', 'Tetramarco']);
    }

    static arrayRandomico(array: string[]): any {
        return array[Utilities.getSecureRandom(array.length)];
    }

    static changeButtonState(evt: MouseEvent, button: Bottone, ctx: CanvasRenderingContext2D): boolean {
        const mousePos = Utilities.getMousePos(ctx.canvas, evt);
        const rect = {
            x: button.config.x * button.config.w,
            y: button.config.y * button.config.h,
            w: button.config.w,
            h: button.config.h,
        };
        let out = false;
        if (Utilities.isInside(mousePos, rect)) {
            if (button.state == 'ON') { button.state = 'OFF' } else { button.state = 'ON' }
            out = true;
        }
        return out;
    }

    static charterMovmentRandomRoutine(charter: Square, counterRoutine: number, treshold: number) {
        if (counterRoutine % treshold == 0) {
            Utilities.direzionaRandomicamenteCharter(charter);
        }
        Utilities.directionToMoveSwitch(charter);
    }

    static algoAttack(attaccante: Charter, difensore: Charter) {
        if (!difensore.scudoCounter.isActive() || (attaccante.malefici.stunned.totTurni == 0 && !difensore.scudoCounter.isActive())) {
            attaccante.attaccare(difensore);
        }
        if (attaccante.parametriFantasy.mana >= attaccante.parametriFantasy.maxMana && attaccante.malefici.stunned.totTurni == 0) {
            attaccante.parametriFantasy.mana = 0;
            attaccante.lanciaAbilita(difensore);
        }
    }

    static setRandomXY(square: Square) {
        square.config.x = Utilities.getSecureRandom(8) + 1;
        square.config.y = Utilities.getSecureRandom(5) + 1;
    }

    static getSecureRandom(max: number) {
        let min = 0;
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        let randomNumber = randomBuffer[0] / (0xffffffff + 1);
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(randomNumber * (max - min + 1)) + min;
    }
}
