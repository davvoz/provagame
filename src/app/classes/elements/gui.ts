import { Bottone } from "./bottone";
import { BottonePozione } from "../buttons/bottone-pozione";
import { Charter } from "../abstract/charter";
import { BottoneSceltaCharter } from "../buttons/bottone-scelta-charter";
import { classe } from "../utils/costants.enum";
import { BottoneScudoAttiva } from "../buttons/bottone-scudo-attiva";
import { GestioneSfondi } from "./gestione-sfondo";

export class Gui {
    startButton!: Bottone;
    compraBonus!: Bottone;
    restartButton!: Bottone;
    pauseButton!: Bottone;
    incrementaLivelloButton!: Bottone;
    pozioniBottoni: BottonePozione[] = [];
    scudoButton !: BottoneScudoAttiva;
    counterAnimationDieText = 0;
    counterAnimationDieTextThO = 200;
    sceltaCharter: BottoneSceltaCharter[] = [];
    classeCharterScelto: classe = 'ABSTRACT';
    isRestartTouched = false;
    private selectedImage = new Image();
    constructor(public ctx: CanvasRenderingContext2D) {
        this.startButton = new Bottone(this.ctx, 'yellow', false);
        this.startButton.setX(4);
        this.startButton.setY(8);
        this.startButton.setText('START');
        this.startButton.stand();
        this.restartButton = new Bottone(this.ctx, 'orangered', false);
        this.restartButton.setX(0);
        this.restartButton.setY(9);
        this.restartButton.setText('RESTART');
        this.restartButton.stand();
        this.pauseButton = new Bottone(this.ctx, 'orangered', true);
        this.pauseButton.setX(2);
        this.pauseButton.setY(9);
        this.pauseButton.setText('PAUSE');
        this.pauseButton.isShowState = true;
        this.pauseButton.stand();
        this.incrementaLivelloButton = new Bottone(this.ctx, 'yellow', false);
        this.incrementaLivelloButton.setX(0);
        this.incrementaLivelloButton.setY(9);
        this.incrementaLivelloButton.setText('LEVEL');
        this.incrementaLivelloButton.secondText = ' key enter';
        this.compraBonus = new Bottone(this.ctx, 'yellow', false);
        this.compraBonus.setX(1);
        this.compraBonus.setY(9);
        this.compraBonus.setText('FOOD');
        this.compraBonus.secondText = ' key space';
        this.compraBonus.terzoText = '$ 10';
        this.scudoButton = new BottoneScudoAttiva(this.ctx, '', true);
        this.scudoButton.setX(17);
        this.scudoButton.setY(9.1);
        this.scudoButton.setText('SCUDO');
        this.scudoButton.secondText = ' key 3';
        this.scudoButton.terzoText = 'free';
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(1, 1, this.ctx.canvas.width / 4, this.ctx.canvas.height / 4);
        this.ctx.strokeRect(this.ctx.canvas.width / 4, 1, this.ctx.canvas.width / 4, this.ctx.canvas.height / 4);
        this.ctx.strokeRect(this.ctx.canvas.width / 2, 1, this.ctx.canvas.width / 4, this.ctx.canvas.height / 4);
        this.ctx.strokeRect(this.ctx.canvas.width - this.ctx.canvas.width / 4, 1, this.ctx.canvas.width / 4, this.ctx.canvas.height / 4);

        for (let i = 0; i < 3; i++) {
            let pozione = new BottonePozione(this.ctx, 'green', true);
            pozione.setX(i + 30);
            pozione.setY(8);
            pozione.secondText = ' key ' + (i + 1);
            pozione.terzoText = 'free';
            pozione.stand();
            this.pozioniBottoni.push(pozione);
        }

        for (let i = 0; i <= 3; i++) {
            let sc = new BottoneSceltaCharter(this.ctx, '', false);
            switch (i) {
                case 0:
                    sc = new BottoneSceltaCharter(this.ctx, 'assets/images/samuraiAtk2.png', false);
                    sc.typeOfCharter = 'SAMURAI';
                    break;
                case 1:
                    sc = new BottoneSceltaCharter(this.ctx, 'assets/images/discotraspooAtck.png', false);
                    sc.typeOfCharter = 'MAGO';
                    break;
                case 2:
                    sc = new BottoneSceltaCharter(this.ctx, 'assets/images/biondotraspoAtck_1.png', false);
                    sc.typeOfCharter = 'GUERRIERO';
                    break;
                case 3:
                    sc = new BottoneSceltaCharter(this.ctx, 'assets/images/edwardAtk.png', false);
                    sc.typeOfCharter = 'ARCERE';
                    break;
            }
            sc.setX(i);
            sc.setY(6);
            sc.secondText = ' -> ' + (i + 1);
            sc.terzoText = 'free';
            sc.stand();
            this.sceltaCharter.push(sc);
        }
    }

    aggiornaGui(livelloSchema: number, player: Charter, counterAnimation: number, isFaseScelta: boolean) {
        //rettangolo sotto
        this.ctx.fillStyle = 'rgb(200,200,200)';
        this.ctx.fillRect(0, 650, this.ctx.canvas.width, 100);

        if (isFaseScelta) {

            if (!player || this.isRestartTouched) {
                this.ctx.font = 'italic bolder 75px Orbitron';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText('CHIAPPARELLO - alfa', 0, 250, 3000);
                this.ctx.font = 'italic bolder 45px Orbitron';
                this.ctx.fillStyle = 'black';
                for (let i = 0; i < this.sceltaCharter.length; i++) {
                    this.sceltaCharter[i].terzoText = this.sceltaCharter[i].typeOfCharter;
                    this.sceltaCharter[i].counterAnimation = counterAnimation;
                    this.sceltaCharter[i].index = i;
                    this.sceltaCharter[i].stand();
                }
                if (this.classeCharterScelto !== 'ABSTRACT') {
                    //this.ctx.fillText('Hai scelto il ', 0, 450, 3000);
                    this.ctx.fillText(this.classeCharterScelto, 400, 450, 3000);
                    switch (this.classeCharterScelto) {
                        case 'SAMURAI': this.selectedImage.src = 'assets/images/samuraiAtk2.png';
                            break;//samurai
                        case 'MAGO': this.selectedImage.src = 'assets/images/discotraspooAtck.png';
                            break;//mago
                        case 'GUERRIERO': this.selectedImage.src = 'assets/images/biondotraspoAtck_1.png';
                            break;//guerriero
                        case 'ARCERE': this.selectedImage.src = 'assets/images/edwardAtk.png';
                            break;//arcere
                    }
                    this.ctx.drawImage(this.selectedImage,
                        this.selectedImage.width / 4 * counterAnimation,//colonna ws
                        0,//riga hs
                        this.selectedImage.width / 4, //ws
                        this.selectedImage.height / 4,//hs
                        500, 500,
                        100,
                        140);
                    this.startButton.stand();
                } else {
                    this.ctx.fillText('Scegliere eroe', 0, 450, 3000);
                }
            }
        } else {
            if (!player.isMorto) {
                this.incrementaLivelloButton.stand();
                this.pauseButton.stand()
                this.compraBonus.stand();
                this.scudoButton.stand();
                for (let i = 0; i < this.pozioniBottoni.length; i++) {
                    this.pozioniBottoni[i].stand();
                }
            }
        }

        if (player) {

            if (!player.isMorto) {
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
                let maxLength = 100;
                const perCent = maxLength * player.exp / player.nextExp;
                this.ctx.fillStyle = 'green';
                this.ctx.fillRect(300, 650, perCent, 10);
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(500 + maxLength / player.nextExp, 650, 10, 10);
                this.ctx.font = 'italic bolder 15px Orbitron';
                this.ctx.fillStyle = 'rgb(60,160,60)';
                this.ctx.fillText('EXP ' + player.classe + ' ' + player.livello + ' - NOW  ' + player.exp + ' NEXT ' + player.nextExp, maxLength / player.nextExp + 300, 690 + 10, 500);

            }
            if (player.isMorto && !this.isRestartTouched) {
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
                this.restartButton.stand();
                if (this.counterAnimationDieText < this.counterAnimationDieTextThO) {
                    this.counterAnimationDieText++;
                } else {
                    this.counterAnimationDieText = this.counterAnimationDieTextThO + 1;
                }
            }
        }
    }
}
