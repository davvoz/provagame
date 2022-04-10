import { GameComponent } from "src/app/components/game/game.component";
import { Bullo } from "../charters/bullo";
import { Guerriero } from "../charters/guerriero";
import { Mago } from "../charters/mago";
import { Samurai } from "../charters/samurai";
import { Utilities } from "./utilities";

export class SetCanvasListener {

    constructor(public game: GameComponent) {
        this.setCanvasListener();
    }
    
    private setCanvasListener() {
        this.game.ctx.canvas.addEventListener(
            'click',
            (evt: MouseEvent) => {
                const startButtonTouched = this.startButton(evt);
                this.scegliPersonaggioButton(evt, startButtonTouched);
                this.scegliProiettileButton(evt, startButtonTouched);
                this.restartButton(evt);
                //se non sono nella prima fase non servono gli handler/mostrare ai bottoni di gioco e alla pausa
                if (!this.game.isFaseScelta) {
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
        for (const charter of this.game.gui.sceltaCharter) {
            const scegliCharterButtonTouched = Utilities.changeButtonState(evt, charter, this.game.ctx);
            if (scegliCharterButtonTouched) {
                this.game.gui.classeCharterScelto = charter.typeOfCharter;
            }
            if (this.game.gui.classeCharterScelto && !this.game.isStarted) {

                if (startButtonTouched) {
                    switch (this.game.gui.classeCharterScelto) {
                        case 'BULLO': this.game.player = new Bullo(Utilities.getSquareConfig(this.game.ctx, 'azure')); this.game.startGame(); break;
                        case 'MAGO': this.game.player = new Mago(Utilities.getSquareConfig(this.game.ctx, 'pink')); this.game.startGame(); break;
                        case 'GUERRIERO': this.game.player = new Guerriero(Utilities.getSquareConfig(this.game.ctx, 'violet')); this.game.startGame(); break;
                        case 'SAMURAI': this.game.player = new Samurai(Utilities.getSquareConfig(this.game.ctx, 'gold')); this.game.startGame(); break;
                    }
                    this.game.isStarted = true;
                    this.game.gui.classeCharterScelto = 'ABSTRACT';
                }
            }
        }
    }

    private pauseButton(evt: MouseEvent) {
        const attivaPauseTouched = Utilities.changeButtonState(evt, this.game.gui.pauseButton, this.game.ctx);
        if (attivaPauseTouched) {
            if (this.game.isPause) { this.game.isPause = false; this.game.animate() } else { this.game.isPause = true; }
        }
    }

    private compraScudoButton(evt: MouseEvent) {
        const compraScudoTouched = Utilities.changeButtonState(evt, this.game.gui.scudoButton, this.game.ctx);
        if (compraScudoTouched) {
            this.game.gui.scudoButton.attivaScudo(this.game.player);
        }
    }

    private pozioniButtons(evt: MouseEvent) {
        for (const pozione of this.game.gui.pozioniBottoni) {
            const bottonPozioneButtonTouched = Utilities.changeButtonState(evt, pozione, this.game.ctx);
            if (bottonPozioneButtonTouched && this.game.player.pozioni.length > 0) {
                this.game.player.pozioneCounter.attiva();
                this.game.player.pozioni.pop();
                pozione.svuotaCasella();
            }
        }
    }

    private compraBonusButton(evt: MouseEvent) {
        const compraBonusTouched = Utilities.changeButtonState(evt, this.game.gui.compraBonus, this.game.ctx);
        if (compraBonusTouched && this.game.player.parametriFantasy.money > 0) {
            this.game.bonus = [];
            this.game.bonus = Utilities.createBonusArray( this.game.ctx);
            this.game.player.parametriFantasy.money -= 20;
        }
    }

    private incrementaLivelloButton(evt: MouseEvent) {
        const incrementaLivelloButtonTouched = Utilities.changeButtonState(evt, this.game.gui.incrementaLivelloButton, this.game.ctx);
        if (incrementaLivelloButtonTouched && this.game.player.parametriFantasy.money > 0) {
            if (this.game.player.parametriFantasy.money > 100 * this.game.player.parametriFantasy.livello) {
                this.game.player.incrementaLivello();
                this.game.player.parametriFantasy.money -= 100 * this.game.player.parametriFantasy.livello;
            }
        }
    }

    private restartButton(evt: MouseEvent) {
        if (this.game.player) {
            if (this.game.player.isMorto) {
                const restartButtonTouched = Utilities.changeButtonState(evt, this.game.gui.restartButton, this.game.ctx);
                if (restartButtonTouched) {
                    this.game.isFromStart = true;
                    this.game.isFaseScelta = true;
                    this.game.gui.isRestartTouched = true;
                    this.game.gui.classeCharterScelto = 'ABSTRACT';
                    this.game.mn = 1;
                    this.game.player.parametriFantasy.money = 0;
                    this.game.isStarted = false;
                    this.game.getMondo().enemies = [];
                }
            }
        }
    }

    getMondo() {
        throw new Error("Method not implemented.");
    }

    private scegliProiettileButton(evt: MouseEvent, startButtonTouched: boolean) {
        for (const sp of this.game.gui.sceltaProiettile) {
            const scegliProiettileButtonTouched = Utilities.changeButtonState(evt, sp, this.game.ctx);
            if (scegliProiettileButtonTouched) {
                this.game.gui.classeProiettileScelto = sp.typeOfProiettile;
            }
            if (this.game.gui.classeProiettileScelto && !this.game.isStarted) {
                if (startButtonTouched) {
                    Utilities.newProiettile(this.game.gui.classeProiettileScelto, this.game.player.config);
                    this.game.isStarted = true;
                    this.game.gui.classeProiettileScelto = 'ABSTRACT';
                }
            }
        }
    }

    private startButton(evt: MouseEvent) {
        return Utilities.changeButtonState(evt, this.game.gui.startButton, this.game.ctx);
    }
}
