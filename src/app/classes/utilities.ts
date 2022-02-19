import { Square } from "./square";
import { direzione } from '../classes/costants.enum';
import { Guerriero } from "./guerriero";
import { Mago } from "./mago";
import { Bonus } from "./bonus";
import { Charter } from "./charter";
import { Arcere } from "./arcere";

export class Utilities {

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
        for (let i = 0; i < j; i++) {
            let bonus: Bonus;
            switch (i % 3) {
                case 0: bonus = new Bonus(ctx, 'red', 'forza', 2, Math.floor(Math.random()));
                    bonus.setX(Math.floor(Math.random() * 10));
                    bonus.setY(Math.floor(Math.random() * 10));
                    bonus.setVelocita(0);

                    ba.push(bonus);
                    break;
                case 1: bonus = new Bonus(ctx, 'green', 'intelligenza', 2, Math.floor(Math.random()));
                    bonus.setX(Math.floor(Math.random() * 10));
                    bonus.setY(Math.floor(Math.random() * 10));
                    bonus.setVelocita(0);
                    ba.push(bonus);
                    break;
                case 2: bonus = new Bonus(ctx, 'blue', 'salute', 10, Math.floor(Math.random() * 40));
                    bonus.setX(Math.floor(Math.random() * 10));
                    bonus.setY(Math.floor(Math.random() * 10));
                    bonus.setVelocita(0);
                    ba.push(bonus);
                    break;
            }
        }
        return ba
    }

    static createEnemiesArray(n: number, ctx: CanvasRenderingContext2D, init: number, salutePlayer: number): Charter[] {
        const enemies: Charter[] = []
        for (let i = 0; i < n; i++) {
            let enemy: Charter;
            switch (i % 3) {
                case 0: enemy = new Guerriero(ctx, 'rgb(66,100,100)', init);
                    Utilities.setEnemiesArray(enemy, i, init, salutePlayer, enemies);
                    break;
                case 1:
                    enemy = new Mago(ctx, 'rgb(254,66,10)', init);
                    Utilities.setEnemiesArray(enemy, i, init, salutePlayer, enemies);
                    break;
                case 2:
                    enemy = new Arcere(ctx, 'rgb(66,66,200)', init)
                    Utilities.setEnemiesArray(enemy, i, init, salutePlayer, enemies);
                    break;
            }



        }

        return enemies;
    }
    private static setEnemiesArray(enemy: Charter, i: number, init: number, salutePlayer: number, enemies: Charter[]) {
        enemy.setX(Math.floor(Math.random() * 20));
        enemy.setY(Math.floor(Math.random() * i));
        enemy.setVelocita(0.1);
        enemy.posizioneInfoLabelX = 370 + i * 120;
        enemy.posizioneInfoLabelY = 700;
        enemy.numeriFortunati = [8, 9, 2, 3];
        enemy.dannoCritico = 10 * init;
        enemy.counterForCriticoTreshold = 10;
        enemy.name = this.nomeRandomico();
        enemy.money = Math.floor(Math.random() * 10) * (init + 1);
        enemy.salute = salutePlayer;
        enemy.incrementaLivello();
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
        const nomi = ['Piero', 'Luigi', 'Aleg', 'Pistolius', 'Agricanto', 'Tacimela', 'Rambaudo', 'Coletta', 'Rimarro', 'Sgrunf', 'Prux', 'Laida', 'Skyre', 'Pantone', 'Ramira', 'Astofele', 'Carima', 'Stangolo',
            'Aldo', 'Maria', 'Marco', 'Derrer', 'Skutillo', 'Rafranco'];
        return nomi[Math.floor(Math.random() * nomi.length)];
    }
}