import { Square } from "./square";
import { direzione } from '../classes/costants.enum';
import { Guerriero } from "./guerriero";
import { Mago } from "./mago";
import { Bonus } from "./bonus";
import { Charter } from "./charter";

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

    static getDirectionFromEnemy({ cercatore, cercato }: { cercatore: Square; cercato: Square; }): direzione {//todo non va
        let out: direzione = 'STAND';
        if (cercato.getX() > cercatore.getX()) {//cercato a sinisistra del Cercatore
            out = 'RIGHT';
        }
        if (cercatore.getX() > cercato.getX()) {//cercato a destra del cercatore
            out = 'LEFT';
        }

        if (cercato.getX() - cercatore.getX() < 1) {//cercato e cercatore in linea

            if (cercato.getY() > cercatore.getY()) { //cercato sotto il cercatore
                out = 'BOTTOM';
            } else if (cercato.getY() < cercatore.getY()) {//cercato sopra il cercatore
                out = 'TOP';
            }
            else if (cercato.getX() > cercatore.getX()) {//cercato a sinisistra del Cercatore
                out = 'RIGHT';
            }
            if (cercatore.getX() > cercato.getX()) {//cercato a destra del cercatore
                out = 'LEFT';
            }
        }
        return out;
    }

    static createBonusArray(j: number, ctx: CanvasRenderingContext2D): Bonus[] {

        const ba: Bonus[] = [];
        for (let i = 0; i < j; i++) {
            let bonus: Bonus;
            switch (Math.floor(Math.random() * 3)) {
                case 0: bonus = new Bonus(ctx, 'red', 'forza', 2, Math.floor(Math.random() * 100));
                    bonus.setX(Math.floor(Math.random() * 10));
                    bonus.setY(Math.floor(Math.random() * 10));
                    bonus.setVelocita(0);
                    ba.push(bonus);
                    break;
                case 1: bonus = new Bonus(ctx, 'green', 'intelligenza', 2, Math.floor(Math.random() * 100));
                    bonus.setX(Math.floor(Math.random() * 10));
                    bonus.setY(Math.floor(Math.random() * 10));
                    bonus.setVelocita(0);
                    ba.push(bonus);
                    break;
                case 2: bonus = new Bonus(ctx, 'blue', 'salute', 10, Math.floor(Math.random() * 4000));
                    bonus.setX(Math.floor(Math.random() * 10));
                    bonus.setY(Math.floor(Math.random() * 10));
                    bonus.setVelocita(0);
                    ba.push(bonus);
                    break;
            }
        }
        return ba
    }

    static createEnemiesArray(n: number, ctx: CanvasRenderingContext2D, init: number): Charter[] {
        const enemies: Charter[] = []
        for (let i = 0; i < n; i++) {
            let bound: Charter;
            if (Math.floor(Math.random() * 2) == 1) {
                bound = new Guerriero(ctx, 'rgb(66,100,100)', init);
            } else {
                bound = new Mago(ctx, 'rgb(254,66,10)', init)
            }

            bound.setX(Math.floor(Math.random() * 20));
            bound.setY(Math.floor(Math.random() * i));
            bound.setVelocita(0.1);
            bound.name = i + '_ANNA_' + i;
            bound.posizioneInfoLabelX = 370 + i * 120;
            bound.posizioneInfoLabelY = 700;
            bound.numeriFortunati = [8, 9, 2, 3, 4, 5, 6, 7];
            bound.dannoCritico = 10 * init;
            bound.counterForCriticoTreshold = 10;
            bound.money = Math.floor(Math.random() * 20);
            bound.stand();
            enemies.push(bound);
        }
        enemies.forEach((enemy) => {
            for (let i = 1; i < init; i++) {
                enemy.incrementaLivello();
            }
        })
        return enemies;
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
}