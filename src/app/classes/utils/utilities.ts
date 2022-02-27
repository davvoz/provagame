import { Square } from "../elements/square";
import { direzione } from './costants.enum';
import { Guerriero } from "../charters/guerriero";
import { Mago } from "../charters/mago";
import { Bonus } from "../elements/bonus";
import { Charter } from "../abstract/charter";
import { Arcere } from "../charters/arcere";
import { Bottone } from "../elements/bottone";
import { Samurai } from "../charters/samurai";

export class Utilities {
    static arrayRandomicoNumerico(array: number[]): number {
        return array[Math.floor(Math.random() * array.length)];
    }

    static rectsColliding(r1: Square, r2: Square) {
        return !(
            r1.getX() > r2.getX() + 1 ||
            r1.getX() + 1 < r2.getX() ||
            r1.getY() > r2.getY() + 1 ||
            r1.getY() + 1 < r2.getY()
        );
    }
    static direzionaRandomicamenteCharter(charter: Square) {
        const direzione: direzione[] = ["TOP", "BOTTOM", "LEFT", "RIGHT", "STAND"];
        const random = Math.floor(Math.random() * direzione.length);
        charter.setDirection(direzione[random]);
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
            case 'STAND'://console.log('charter direction'+charter.getDirection())
                charter.stand();
        }
    }

    static createBonusArray(j: number, ctx: CanvasRenderingContext2D): Bonus[] {

        const ba: Bonus[] = [];

        const bonus1 = new Bonus(ctx, 'red', 'salute', 1000, 1000);
        //bonus1.spriteSheetCharterPath ='assets/images/polloo.png';
        bonus1.spriteSheetImage.src = 'assets/images/polloo.png';
        bonus1.setX(Math.floor(Math.random() * 19) + 1);
        bonus1.setY(Math.floor(Math.random() * 7) + 1);
        bonus1.setVelocita(0);
        bonus1.stand();
        ba.push(bonus1);
        const bonus2 = new Bonus(ctx, 'red', 'salute', 200, 200);
        bonus2.spriteSheetImage.src = 'assets/images/panino.png';
        bonus2.setX(Math.floor(Math.random() * 19) + 1);
        bonus2.setY(Math.floor(Math.random() * 7) + 1);
        bonus2.setVelocita(0);
        bonus2.stand();
        ba.push(bonus2);
        const bonus3 = new Bonus(ctx, 'red', 'salute', 300, 300);
        bonus3.spriteSheetImage.src = 'assets/images/formaggio.png';
        bonus3.setX(Math.floor(Math.random() * 19) + 1);
        bonus3.setY(Math.floor(Math.random() * 7) + 1);
        bonus3.setVelocita(0);
        bonus3.stand();
        ba.push(bonus3);
        const bonus4 = new Bonus(ctx, 'red', 'salute', 400, 400);
        bonus4.spriteSheetImage.src = 'assets/images/uovo.png';
        bonus4.setX(Math.floor(Math.random() * 19) + 1);
        bonus4.setY(Math.floor(Math.random() * 7) + 1);
        bonus4.setVelocita(0);
        bonus4.stand();
        ba.push(bonus4);
        console.log(ba);
        return ba
    }

    static createEnemiesArray(quantitaDiNemici: number, ctx: CanvasRenderingContext2D, livelloNemici: number): Charter[] {
        const enemies: Charter[] = []
        for (let i = 0; i < quantitaDiNemici; i++) {
            let enemy: Charter;
            switch (i % 4) {
                case 0: enemy = new Guerriero(ctx, 'rgb(255, 155, 124)', livelloNemici - 1);
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
                case 1:
                    enemy = new Mago(ctx, 'rgb(254,66,10)', livelloNemici - 1);
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
                case 2:
                    enemy = new Arcere(ctx, 'rgb(66,66,200)', livelloNemici)
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
                case 3:
                    enemy = new Samurai(ctx, 'rgb(190,190,200)', livelloNemici - 1)
                    Utilities.setEnemiesArray(enemy, i, livelloNemici, enemies);
                    break;
            }
        }
        return enemies;
    }
    private static setEnemiesArray(enemy: Charter, i: number, livelloNemici: number, enemies: Charter[]) {
        for (let j = 0; j < livelloNemici; j++) {
            enemy.incrementaLivello();
        }
        enemy.setX(Math.floor(Math.random() * 20));
        enemy.setY(Math.floor(Math.random() * i) + 1);
        enemy.setVelocita(0.1);
        enemy.posizioneInfoLabelX = 370 + i * 120;
        enemy.posizioneInfoLabelY = 700;
        enemy.dannoCritico = 10 * livelloNemici;
        enemy.counterForCriticoTreshold = 10;
        enemy.name = this.nomeRandomico();
        enemy.money = Math.floor(Math.random() * 100);
        enemy.stand();
        enemies.push(enemy);
    }

    static getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    static isInside(mousePosition: { x: any; y: any; }, rect: { x: any; y: any; width: any; height: any; }) {
        return (
            mousePosition.x > rect.x &&
            mousePosition.x < rect.x + rect.width &&
            mousePosition.y < rect.y + rect.height &&
            mousePosition.y > rect.y
        );
    }
    static nomeRandomico(): string {
        return Utilities.arrayRandomico(['Piero', 'Luigi', 'Aleg', 'Pistolius', 'Agricanto', 'Tacimela', 'Rambaudo', 'Coletta', 'Rimarro', 'Sgrunf', 'Prux', 'Laida', 'Skyre', 'Pantone', 'Ramira', 'Astofele', 'Carima', 'Stangolo',
            'Aldo', 'Maria', 'Marco', 'Derrer', 'Skutillo', 'Rafranco']);
    }
    static arrayRandomico(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }
    static changeButtonState(evt: MouseEvent, button: Bottone, ctx: CanvasRenderingContext2D): boolean {

        const mousePos = Utilities.getMousePos(ctx.canvas, evt);
        const rect = {
            x: button.getX() * button.sideX,
            y: button.getY() * button.sideY,
            width: button.sideX,
            height: button.sideY,
        };
        let out = false;
        if (Utilities.isInside(mousePos, rect)) {
            button.state == 'ON' ? button.state = 'OFF' : button.state = 'ON';
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
        if (!difensore.isScudoAttivato) {
            attaccante.attaccare(difensore);
        }
        if (attaccante.mana >= attaccante.maxMana) {
            attaccante.mana = 0;
            attaccante.lanciaAbilita(difensore);
        }
    }
}
