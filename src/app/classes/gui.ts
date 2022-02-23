import { Bottone } from "./bottone";
import { BottonePozione } from "./bottonePozione";
import { Charter } from "./charter";

export class Gui {
    startButton!: Bottone;
    compraBonus!: Bottone;
    incrementaLivelloButton!: Bottone;
    pozioniBottoni: BottonePozione[] = [];
    counterAnimationDieText = 0;
    counterAnimationDieTextThO = 200;
    constructor(public ctx: CanvasRenderingContext2D) {
        this.ctx.font = 'italic bolder 75px Orbitron';
        this.ctx.fillStyle = 'black';

        this.ctx.fillText('CHIAPPARELLO - alfa', 0, 350, 3000);
        this.ctx.fillRect(0, 650, this.ctx.canvas.width, 100);

        this.startButton = new Bottone(this.ctx, 'yellow');
        this.startButton.setX(1);
        this.startButton.setY(9);
        this.startButton.setText('START');
        this.startButton.secondText = ' -> click';

        this.startButton.stand();

        this.incrementaLivelloButton = new Bottone(this.ctx, 'yellow');
        this.incrementaLivelloButton.setX(2);
        this.incrementaLivelloButton.setY(9);
        this.incrementaLivelloButton.setText('LEVEL');
        this.incrementaLivelloButton.secondText = ' -> enter';


        this.compraBonus = new Bottone(this.ctx, 'yellow');
        this.compraBonus.setX(3);
        this.compraBonus.setY(9);
        this.compraBonus.setText('FOOD');
        this.compraBonus.secondText = ' -> space';
        this.compraBonus.terzoText = '$ 10';

        for (let i = 0; i < 3; i++) {
            let pozione = new BottonePozione(this.ctx, 'green');
            pozione.setX(i + 30);
            pozione.setY(8);
            pozione.secondText = ' -> ' + (i + 1);
            pozione.terzoText = 'free';
            pozione.stand();
            this.pozioniBottoni.push(pozione);
        }
    }

    aggiornaGui(livelloSchema: number, player: Charter) {
        //rettangolo sotto
        this.ctx.fillStyle = 'rgb(200,200,200)';
        this.ctx.fillRect(0, 650, this.ctx.canvas.width, 100);
        //exp player
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(300, 650, player.exp, 10);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(player.nextExp , 650, 10, 10);
        this.ctx.fillText('Next  ' + player.nextExp + ' now ' + player.exp, player.nextExp  + 15, 650 + 10, 500);

        this.ctx.font = 'italic bolder 45px Orbitron';
        this.ctx.fillStyle = 'rgb(200,200,200)';
        this.ctx.fillText('Mondo  ' + livelloSchema, 753, 53, 500);
        this.ctx.fillText('$' + player.money, 23, 53, 500);
        this.ctx.fillStyle = 'rgb(250,150,10)';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillText('$' + player.money, 20, 50, 500);
        this.ctx.strokeText('$' + player.money, 20, 50, 500);
        this.ctx.fillText('Mondo  ' + livelloSchema, 750, 50, 500);
        this.ctx.strokeText('Mondo  ' + livelloSchema, 750, 50, 500);

        this.startButton.stand();
        this.incrementaLivelloButton.stand();
        this.compraBonus.stand();
        this.startButton.stand();
        for (let i = 0; i < this.pozioniBottoni.length; i++) {
            this.pozioniBottoni[i].stand();
        }
        if (player.isMorto) {
            this.ctx.font = 'normal bolder 115px Orbitron';
            this.ctx.save();
            this.ctx.translate(0, 19);
            this.ctx.rotate(-Math.PI / -this.counterAnimationDieText);
            this.ctx.fillStyle = 'rgb(200,150,10)';
            this.ctx.fillText('YOU ARE DEAD', 5, this.ctx.canvas.width / 2 + 5, this.counterAnimationDieText * 100);

            this.ctx.fillStyle = 'black';
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeText('YOU ARE DEAD', 0, this.ctx.canvas.width / 2, this.counterAnimationDieText * 100);
            this.ctx.fillText('YOU ARE DEAD', 0, this.ctx.canvas.width / 2, this.counterAnimationDieText * 100);
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(0, 19);
            this.ctx.rotate(-Math.PI / this.counterAnimationDieText);
            this.ctx.fillStyle = 'rgb(200,150,10)';
            this.ctx.fillText('Game - Over', 100 + 5, 350 + 5, this.counterAnimationDieText * 100);
            this.ctx.fillStyle = 'black';
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeText('Game - Over', 100, 350, this.counterAnimationDieText * 100);
            this.ctx.fillText('Game - Over', 100, 350, this.counterAnimationDieText * 100);
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(10, 19);
            this.ctx.rotate(-Math.PI / 4);
            this.ctx.font = 'normal bolder 115px Orbitron';

            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(20,100,70)';

            this.ctx.fillRect(-100, 1020, 1000, 110);
            this.ctx.fillStyle = 'rgb(252, 101, 23)';
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeText("FAiL", 200, 1120, 1500);
            this.ctx.fillText("FAiL", 200, 1120, 1500);
            this.ctx.restore();
            if (this.counterAnimationDieText < this.counterAnimationDieTextThO) {
                this.counterAnimationDieText++;
            } else {
                this.counterAnimationDieText = this.counterAnimationDieTextThO + 1;
            }

        }
    }
}
