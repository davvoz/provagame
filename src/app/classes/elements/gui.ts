import { Bottone } from "./bottone";
import { BottonePozione } from "../buttons/bottone-pozione";
import { Charter } from "../abstract/charter";
import { BottoneSceltaCharter } from "../buttons/bottone-scelta-charter";
import { classe, classeProiettile } from "../utils/costants.enum";
import { BottoneScudoAttiva } from "../buttons/bottone-scudo-attiva";
import { Utilities } from "../utils/utilities";
import { BottoneSceltaProiettile } from "../buttons/bottone-scelta-proiettile";

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
    sceltaProiettile: BottoneSceltaProiettile[] = [];
    classeCharterScelto: classe = 'ABSTRACT';
    classeProiettileScelto: classeProiettile = 'ABSTRACT';
    isRestartTouched = false;
    private selectedImageCharter = new Image();
    private selectedImageProiettile = new Image();
    descrizioneProiettile = 'ABSTRACT';
    descrizioneCharter = 'ABSTRACT';

    constructor(public ctx: CanvasRenderingContext2D) {
        this.startButton = new Bottone({
            color: 'yellow',
            ctx: ctx,
            velocita: 0,
            h: 90,
            w: 70,
            x: 5,
            y: 6
        }, false);
        this.startButton.setText('START');
        this.startButton.stand();
        this.restartButton = new Bottone({
            color: 'orangered',
            ctx: ctx,
            velocita: 0.0,
            h: 90,
            w: 70,
            x: 0,
            y: 7
        }, false);
        this.restartButton.setText('RESTART');
        this.restartButton.stand();
        this.pauseButton = new Bottone({
            color: 'orangered',
            ctx: ctx,
            velocita: 0.0,
            h: 90,
            w: 70,
            x: 2,
            y: 7
        }, true);
        this.pauseButton.setText('PAUSE');
        this.pauseButton.isShowState = true;
        this.pauseButton.stand();
        this.incrementaLivelloButton = new Bottone({
            color: 'yellow',
            ctx: ctx,
            velocita: 0.0,
            h: 90,
            w: 70,
            x: 1,
            y: 7
        }, false);
        this.incrementaLivelloButton.setText('LEVEL');
        this.incrementaLivelloButton.secondText = ' key \\';
        this.compraBonus = new Bottone({
            color: 'yellow',
            ctx: ctx,
            velocita: 0.0,
            h: 90,
            w: 70,
            x: 0,
            y: 7
        }, false);
        this.compraBonus.setText('FOOD');
        this.compraBonus.secondText = ' key space';
        this.compraBonus.terzoText = '$ 10';
        this.scudoButton = new BottoneScudoAttiva(Utilities.getSquareConfig(this.ctx, 'red'), true);
        this.scudoButton.config.x = 17;
        this.scudoButton.config.y = 9.1;
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
            let pozione = new BottonePozione(Utilities.getSquareConfig(this.ctx, ''), true);
            pozione.config.x = i + 30;
            pozione.config.y = 8;
            pozione.secondText = ' key ' + (i + 1);
            pozione.terzoText = 'free';
            pozione.stand();
            this.pozioniBottoni.push(pozione);
        }

        for (let i = 0; i <= 3; i++) {
            let sc = new BottoneSceltaCharter(Utilities.getSquareConfig(this.ctx, ''), '', false);
            switch (i) {
                case 0:
                    sc = new BottoneSceltaCharter(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/samuraiAtk2.png', false);
                    sc.typeOfCharter = 'SAMURAI';
                    break;
                case 1:
                    sc = new BottoneSceltaCharter(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/discotraspooAtck.png', false);
                    sc.typeOfCharter = 'MAGO';
                    break;
                case 2:
                    sc = new BottoneSceltaCharter(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/biondotraspoAtck_1.png', false);
                    sc.typeOfCharter = 'GUERRIERO';
                    break;
                case 3:
                    sc = new BottoneSceltaCharter(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/edwardAtk.png', false);
                    sc.typeOfCharter = 'BULLO';
                    break;
            }
            sc.config.x = i;
            sc.config.y = 6;
            sc.secondText = ' -> ' + (i + 1);
            sc.terzoText = 'free';
            sc.stand();
            this.sceltaCharter.push(sc);
        }
        for (let i = 0; i <= 3; i++) {
            let sc = new BottoneSceltaProiettile(Utilities.getSquareConfig(this.ctx, ''), '', false);
            switch (i) {
                case 0:
                    sc = new BottoneSceltaProiettile(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/coltello.png', false);
                    sc.typeOfProiettile = 'COLTELLO';
                    break;
                case 1:
                    sc = new BottoneSceltaProiettile(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/hammero.png', false);
                    sc.typeOfProiettile = 'HAMMER';
                    break;
                case 2:
                    sc = new BottoneSceltaProiettile(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/spidero.png', false);
                    sc.typeOfProiettile = 'RAGNO';
                    break;
                case 3:
                    sc = new BottoneSceltaProiettile(Utilities.getSquareConfig(this.ctx, ''), 'assets/images/fireball.png', false);
                    sc.typeOfProiettile = 'PALLADIFUOCO';
                    break;
            }
            sc.config.x = i + 9;
            sc.config.y = 6;
            sc.secondText = ' -> ' + (i + 1);
            sc.terzoText = 'free';
            sc.stand();
            this.sceltaProiettile.push(sc);
        }
    }

    aggiornaGui(livelloSchema: number, player: Charter, counterAnimation: number, isFaseScelta: boolean) {
        //rettangolo sotto
        this.ctx.save();
        this.ctx.fillStyle = 'rgb(200,200,200)';
        this.ctx.fillRect(0, 650, this.ctx.canvas.width, 100);
        this.ctx.restore();
        if (isFaseScelta) {
            this.faseSceltaProcedure(player, counterAnimation);
        } else {
            if (!player.isMorto) {
                this.incrementaLivelloButton.stand();
                this.pauseButton.stand()
                this.compraBonus.stand();
                this.scudoButton.stand();
                for (const pozioneBottone of this.pozioniBottoni) {
                    pozioneBottone.stand();
                }
            }
        }

        if (player) {

            this.notMortoProcedure(player, livelloSchema);
            this.mortoAndNotRestartProcedure(player);
        }

        this.ctx.restore();
    }

    private notMortoProcedure(player: Charter, livelloSchema: number) {
        if (!player.isMorto) {
            this.ctx.font = 'italic bolder 45px Orbitron';
            this.ctx.fillStyle = 'rgb(200,200,200)';
            this.ctx.fillText('Mondo  ' + livelloSchema, 753, 53, 500);
            this.ctx.fillText('$' + player.parametriFantasy.money, 23, 53, 500);
            this.ctx.fillStyle = 'rgb(250,150,10)';
            this.ctx.strokeStyle = 'black';
            this.ctx.fillText('$' + player.parametriFantasy.money, 20, 50, 500);
            this.ctx.strokeText('$' + player.parametriFantasy.money, 20, 50, 500);
            this.ctx.fillText('Mondo  ' + livelloSchema, 750, 50, 500);
            this.ctx.strokeText('Mondo  ' + livelloSchema, 750, 50, 500);
            let maxLength = 100;
            const perCent = maxLength * player.exp / player.nextExp;
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(300, 650, perCent, 10);
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(300 + maxLength, 650, 5, 10);
            this.ctx.font = 'italic bolder 15px Orbitron';
            this.ctx.fillStyle = 'rgb(60,160,60)';
            this.ctx.fillText('EXP ' + player.classe + ' ' + player.parametriFantasy.livello + ' - NOW  ' + player.exp + ' NEXT ' + player.nextExp, maxLength / player.nextExp + 300, 690 + 10, 500);

        }
    }

    private mortoAndNotRestartProcedure(player: Charter) {
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

    private faseSceltaProcedure(player: Charter, counterAnimation: number) {
        if (!player || this.isRestartTouched) {
            this.ctx.save();
            this.ctx.font = 'italic bolder 75px Orbitron';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText('Alfa - alfa', 0, 250, 3000);
            for (let i = 0; i < this.sceltaProiettile.length; i++) {
                this.sceltaProiettile[i].terzoText = this.sceltaProiettile[i].typeOfProiettile;
                this.sceltaProiettile[i].counterAnimation = counterAnimation;
                this.sceltaProiettile[i].index = i;
                this.sceltaProiettile[i].stand();
            }
            if (this.classeProiettileScelto !== 'ABSTRACT') {
                this.ctx.save();
                this.ctx.font = 'italic bolder 45px Orbitron';
                this.ctx.fillStyle = 'black';
                this.drawImage(counterAnimation);
                this.ctx.fillText('Proiettile ' + this.classeProiettileScelto + ' ' + this.descrizioneProiettile, 0, 450, 3000);
                this.ctx.restore();
                this.startButton.stand();
            } else {
                this.ctx.save();
                this.ctx.font = 'italic bolder 45px Orbitron';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText('Scegliere proiettile', 600, 550, 300);
                this.ctx.restore();
            }

            for (let i = 0; i < this.sceltaCharter.length; i++) {
                this.sceltaCharter[i].terzoText = this.sceltaCharter[i].typeOfCharter;
                this.sceltaCharter[i].counterAnimation = counterAnimation;
                this.sceltaCharter[i].index = i;
                this.sceltaCharter[i].stand();
            }
            if (this.classeCharterScelto !== 'ABSTRACT') {
                this.ctx.save();
                this.ctx.font = 'italic bolder 45px Orbitron';
                this.ctx.fillStyle = 'black';
                switch (this.classeCharterScelto) {
                    case 'SAMURAI': this.selectedImageCharter.src = 'assets/images/samuraiAtk2.png'; this.descrizioneCharter = 'Incendia';
                        break; //samurai
                    case 'MAGO': this.selectedImageCharter.src = 'assets/images/discotraspooAtck.png'; this.descrizioneCharter = 'Avvelena e mana veloce';
                        break; //mago
                    case 'GUERRIERO': this.selectedImageCharter.src = 'assets/images/biondotraspoAtck_1.png'; this.descrizioneCharter = 'Stunna';
                        break; //guerriero
                    case 'BULLO': this.selectedImageCharter.src = 'assets/images/edwardAtk.png'; this.descrizioneCharter = 'Avvelena';
                        break; //arcere
                }
                this.ctx.fillText('Eroe ' + this.classeCharterScelto + ' ' + this.descrizioneCharter, 0, 350, 3000);
                this.ctx.restore();
                this.ctx.drawImage(this.selectedImageCharter,
                    this.selectedImageCharter.width / 4 * counterAnimation,
                    0,
                    this.selectedImageCharter.width / 4,
                    this.selectedImageCharter.height / 4,
                    450, 500,
                    100,
                    140);
                this.startButton.stand();
            } else {
                this.ctx.save();
                this.ctx.font = 'italic bolder 45px Orbitron';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText('Scegliere eroe', 0, 550, 300);
                this.ctx.restore();
            }
        }
    }

    private drawImage(counterAnimation: number) {
        switch (this.classeProiettileScelto) {
            case 'RAGNO':
                this.selectedImageProiettile.src = 'assets/images/spidero.png';
                this.descrizioneProiettile = 'rallenta';
                break;
            case 'COLTELLO':
                this.selectedImageProiettile.src = 'assets/images/coltello.png';
                this.descrizioneProiettile = 'stunna';
                break;
            case 'PALLADIFUOCO':
                this.selectedImageProiettile.src = 'assets/images/fireball.png';
                this.descrizioneProiettile = 'incendia';
                break;
            case 'HAMMER':
                this.selectedImageProiettile.src = 'assets/images/hammero.png';
                this.descrizioneProiettile = 'stunna';
                break;
        }
       // const height = this.classeProiettileScelto === 'RAGNO' || this.classeProiettileScelto === 'PALLADIFUOCO' ? this.selectedImageProiettile.width / 4 : this.selectedImageProiettile.width;
        this.ctx.drawImage(this.selectedImageProiettile,
            this.selectedImageProiettile.width / 4 * counterAnimation,
            0,
            this.selectedImageProiettile.width / 4,
            this.selectedImageProiettile.width / 4 ,
            530, 580,
            50,
            65);
    }
}
