import { AppComponent } from "src/app/app.component";
import { Bullo } from "../charters/bullo";
import { Guerriero } from "../charters/guerriero";
import { Mago } from "../charters/mago";
import { Samurai } from "../charters/samurai";
import { Utilities } from "./utilities";

export class SetCanvasListener {

    constructor(public app: AppComponent) {
        this.setCanvasListener();
    }
    
    private setCanvasListener() {
        this.app.ctx.canvas.addEventListener(
            'click',
            (evt: MouseEvent) => {
                const startButtonTouched = this.startButton(evt);
                this.scegliPersonaggioButton(evt, startButtonTouched);
                this.scegliProiettileButton(evt, startButtonTouched);
                this.restartButton(evt);
                //se non sono nella prima fase non servono gli handler/mostrare ai bottoni di gioco e alla pausa
                if (!this.app.isFaseScelta) {
                    this.incrementaLivelloButton(evt);
                    this.compraBonusButton(evt);
                    this.pozioniButtons(evt);
                    this.compraScudoButton(evt);
                    this.pauseButton(evt);
                }
            },
            false
        );
    }

    private scegliPersonaggioButton(evt: MouseEvent, startButtonTouched: boolean) {
        for (const charter of this.app.gui.sceltaCharter) {
            const scegliCharterButtonTouched = Utilities.changeButtonState(evt, charter, this.app.ctx);
            if (scegliCharterButtonTouched) {
                this.app.gui.classeCharterScelto = charter.typeOfCharter;
            }
            if (this.app.gui.classeCharterScelto && !this.app.isStarted) {

                if (startButtonTouched) {
                    switch (this.app.gui.classeCharterScelto) {
                        case 'BULLO': this.app.player = new Bullo(Utilities.getSquareConfig(this.app.ctx, 'azure')); this.app.startGame(); break;
                        case 'MAGO': this.app.player = new Mago(Utilities.getSquareConfig(this.app.ctx, 'pink')); this.app.startGame(); break;
                        case 'GUERRIERO': this.app.player = new Guerriero(Utilities.getSquareConfig(this.app.ctx, 'violet')); this.app.startGame(); break;
                        case 'SAMURAI': this.app.player = new Samurai(Utilities.getSquareConfig(this.app.ctx, 'gold')); this.app.startGame(); break;
                    }
                    this.app.isStarted = true;
                    this.app.gui.classeCharterScelto = 'ABSTRACT';
                }
            }
        }
    }

    private pauseButton(evt: MouseEvent) {
        const attivaPauseTouched = Utilities.changeButtonState(evt, this.app.gui.pauseButton, this.app.ctx);
        if (attivaPauseTouched) {
            if (this.app.isPause) { this.app.isPause = false; this.app.animate() } else { this.app.isPause = true; }
        }
    }

    private compraScudoButton(evt: MouseEvent) {
        const compraScudoTouched = Utilities.changeButtonState(evt, this.app.gui.scudoButton, this.app.ctx);
        if (compraScudoTouched) {
            this.app.gui.scudoButton.attivaScudo(this.app.player);
        }
    }

    private pozioniButtons(evt: MouseEvent) {
        for (const pozione of this.app.gui.pozioniBottoni) {
            const bottonPozioneButtonTouched = Utilities.changeButtonState(evt, pozione, this.app.ctx);
            if (bottonPozioneButtonTouched && this.app.player.pozioni.length > 0) {
                this.app.player.pozioneCounter.attiva();
                this.app.player.pozioni.pop();
                pozione.svuotaCasella();
            }
        }
    }

    private compraBonusButton(evt: MouseEvent) {
        const compraBonusTouched = Utilities.changeButtonState(evt, this.app.gui.compraBonus, this.app.ctx);
        if (compraBonusTouched && this.app.player.parametriFantasy.money > 0) {
            this.app.bonus = [];
            this.app.bonus = Utilities.createBonusArray( this.app.ctx);
            this.app.player.parametriFantasy.money -= 20;
        }
    }

    private incrementaLivelloButton(evt: MouseEvent) {
        const incrementaLivelloButtonTouched = Utilities.changeButtonState(evt, this.app.gui.incrementaLivelloButton, this.app.ctx);
        if (incrementaLivelloButtonTouched && this.app.player.parametriFantasy.money > 0) {
            if (this.app.player.parametriFantasy.money > 100 * this.app.player.parametriFantasy.livello) {
                this.app.player.incrementaLivello();
                this.app.player.parametriFantasy.money -= 100 * this.app.player.parametriFantasy.livello;
            }
        }
    }

    private restartButton(evt: MouseEvent) {
        if (this.app.player) {
            if (this.app.player.isMorto) {
                const restartButtonTouched = Utilities.changeButtonState(evt, this.app.gui.restartButton, this.app.ctx);
                if (restartButtonTouched) {
                    this.app.isFromStart = true;
                    this.app.isFaseScelta = true;
                    this.app.gui.isRestartTouched = true;
                    this.app.gui.classeCharterScelto = 'ABSTRACT';
                    this.app.mn = 1;
                    this.app.player.parametriFantasy.money = 0;
                    this.app.isStarted = false;
                    this.app.getMondo().enemies = [];
                }
            }
        }
    }

    getMondo() {
        throw new Error("Method not implemented.");
    }

    private scegliProiettileButton(evt: MouseEvent, startButtonTouched: boolean) {
        for (const sp of this.app.gui.sceltaProiettile) {
            const scegliProiettileButtonTouched = Utilities.changeButtonState(evt, sp, this.app.ctx);
            if (scegliProiettileButtonTouched) {
                this.app.gui.classeProiettileScelto = sp.typeOfProiettile;
            }
            if (this.app.gui.classeProiettileScelto && !this.app.isStarted) {
                if (startButtonTouched) {
                    Utilities.newProiettile(this.app.gui.classeProiettileScelto, this.app.player.config);
                    this.app.isStarted = true;
                    this.app.gui.classeProiettileScelto = 'ABSTRACT';
                }
            }
        }
    }

    private startButton(evt: MouseEvent) {
        return Utilities.changeButtonState(evt, this.app.gui.startButton, this.app.ctx);
    }
}
