import { Charter } from "../abstract/charter";

export class DrawCharter {
    private charter!: Charter;
    private isRallentato = false;
    private fiammeImage = new Image();
    private velenoImage = new Image();
    private stunnoImage = new Image();
    private blockImage = new Image();
    private scudoIcon = new Image();
    private pozioneIcon = new Image();
    private bloodImage = new Image();

    constructor(charter: Charter) {
        this.charter = charter;
    }

    public drawAll(drowSintesi: boolean) {
        this.drawSprite();
        this.drawAurea();
        this.drawBarre();
        if (this.charter.visualizzaDannoCounter.isActive()) {
            this.charter.config.ctx.fillStyle = !this.charter.isCritico ? this.charter.config.color : 'red';
            this.charter.config.ctx.strokeStyle = 'black';
            this.charter.config.ctx.font = (this.charter.ultimiDanni / 100 + 52) + 'px Impact';
            this.charter.config.ctx.strokeText(this.charter.ultimiDanni + '', this.charter.config.x * this.charter.config.w - 30, this.charter.config.y * this.charter.config.h + this.charter.config.h + 30, 300);
            this.charter.config.ctx.fillText(this.charter.ultimiDanni + '', this.charter.config.x * this.charter.config.w - 30, this.charter.config.y * this.charter.config.h + this.charter.config.h + 30, 300);
        }
        if (drowSintesi) {
            this.drawSintesi();
        }
    }

    private drawSprite() {
        this.setSpriteFromCharterAndAction();
        this.drawMalefici();
    }

    private drawSintesi() {
        this.charter.config.ctx.beginPath();
        this.charter.config.ctx.fillStyle = 'black';
        this.charter.config.ctx.font = '15px Impact';
        this.charter.config.ctx.fillText(
            this.charter.name + ' : ' + this.charter.parametriFantasy.salute.toFixed(0),
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY,
            300
        );
        this.charter.config.ctx.fillText(
            'Forza : ' + this.charter.parametriFantasy.forza,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY - 20,
            300
        );
        this.charter.config.ctx.fillText(
            'Resistenza : ' + this.charter.parametriFantasy.resistenzaFisica,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY - 20 - 20,
            300
        );
        this.charter.config.ctx.fillText(
            'intelligenza : ' + this.charter.parametriFantasy.intelligenza,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY - 20 - 20 - 20,
            300
        );
        this.charter.config.ctx.closePath();
        this.charter.config.ctx.fillText(
            'Resistenza m: ' + this.charter.parametriFantasy.resistenzaMagica,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY -
            20 -
            20 -
            20 -
            20,
            300
        );
        this.charter.config.ctx.fillText(
            'RUolo : ' + this.charter.classe,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY -
            20 -
            20 -
            20 -
            20 -
            20,
            300
        );
        if (this.charter.isMorto) {
            this.charter.config.ctx.fillText(
                !this.charter.isMorto ? 'WINNER :)' : 'LOOSER :(',
                this.charter.posizioneInfoLabelX,
                this.charter.posizioneInfoLabelY -
                20 -
                20 -
                20 -
                20 -
                20 -
                20,
                300
            );
            this.charter.config.ctx.fillText(
                'Danni magici ricevuti ' + this.charter.sintesiDati.danniMagiciRicevuti,
                this.charter.posizioneInfoLabelX,
                this.charter.posizioneInfoLabelY -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20,
                300
            );
            this.charter.config.ctx.fillText(
                'Danni fisici ricevuti ' + this.charter.sintesiDati.danniFisiciRicevuti,
                this.charter.posizioneInfoLabelX,
                this.charter.posizioneInfoLabelY -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20,
                300
            );
            this.charter.config.ctx.fillText(
                'Danni critici ricevuti ' + this.charter.sintesiDati.danniCriticiRicevuti,
                this.charter.posizioneInfoLabelX,
                this.charter.posizioneInfoLabelY -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20,
                300
            );
            this.charter.config.ctx.fillText(
                'Danni critici inflitti ' + this.charter.sintesiDati.danniCriticiInflitti,
                this.charter.posizioneInfoLabelX,
                this.charter.posizioneInfoLabelY -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20 -
                20,
                300
            );
        }

    }

    private drawAurea() {
        this.charter.config.ctx.save();
        this.charter.config.ctx.strokeStyle = 'yellow';
        this.charter.config.ctx.lineWidth = 1;
        this.charter.config.ctx.strokeRect(
            this.charter.getAurea().x,
            this.charter.getAurea().y,
            this.charter.getAurea().w,
            this.charter.getAurea().h);
        this.charter.config.ctx.strokeStyle = 'orangered';
        this.charter.config.ctx.lineWidth = 1;
        this.charter.config.ctx.strokeRect(
            this.charter.getVisionAurea().x,
            this.charter.getVisionAurea().y,
            this.charter.getVisionAurea().w,
            this.charter.getVisionAurea().h);
        this.charter.config.ctx.restore();

    }

    private drawMalefici() {
        this.charter.config.ctx.save();
        this.charter.config.ctx.strokeStyle = 'black';
        this.charter.config.ctx.lineWidth = 5;
        this.fire();
        this.poison();
        this.stun();
        this.slow();
        this.blood();
        this.charter.config.ctx.restore();
    }

    private blood() {
        if (this.charter.malefici.blooding.value && this.charter.malefici.blooding.totTurni > 0) {
            if (!this.bloodImage.src) {
                this.bloodImage.src = 'assets/images/blooding2.png';
            }
            this.charter.parametriFantasy.salute -= this.charter.malefici.blooding.quantita;
            this.charter.malefici.blooding.totTurni--;
            this.charter.config.ctx.fillStyle = 'red';
            this.charter.config.ctx.font = "20px Impact";
            this.charter.config.ctx.fillText('BLOODING ' + this.charter.malefici.blooding.quantita, this.charter.config.x * this.charter.config.w - 30, this.charter.config.y * this.charter.config.h + 60, 300);
            this.charter.config.ctx.drawImage(this.bloodImage, this.bloodImage.width / 4 * this.charter.counterAnimation, 0, this.bloodImage.width / 4, this.bloodImage.height / 2, this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h - 30, 70, 30);

        }
    }

    private slow() {
        if (this.charter.malefici.slowed.value && this.charter.malefici.slowed.totTurni > 0) {
            this.isRallentato = true;
            if (!this.blockImage.src) {
                this.blockImage.src = 'assets/images/singlespiderweb.png';
            }
            this.charter.config.velocita = 0.05;
            this.charter.parametriFantasy.salute -= this.charter.malefici.slowed.quantita;
            this.charter.malefici.slowed.totTurni--;
            this.charter.config.ctx.fillStyle = 'white';
            this.charter.config.ctx.font = "20px Impact";
            this.charter.config.ctx.fillText('BLOCKED ' + this.charter.malefici.slowed.quantita, this.charter.config.x * this.charter.config.w - 30, this.charter.config.y * this.charter.config.h + 60, 300);
            this.charter.config.ctx.drawImage(this.blockImage, 0, 0, this.blockImage.width, this.blockImage.height, this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h, 70, 90);

        } else {
            if (this.isRallentato) {
                this.charter.config.velocita = this.charter.velocitaIniziale;
                this.isRallentato = false;
            }
        }
    }

    private stun() {
        if (this.charter.malefici.stunned.value && this.charter.malefici.stunned.totTurni > 0) {
            if (!this.stunnoImage.src) {
                this.stunnoImage.src = 'assets/images/hammero.png';
            }
            this.charter.config.ctx.fillStyle = 'gold';
            this.charter.config.ctx.font = "20px Impact";
            this.charter.config.ctx.fillText('STUNNED ' + this.charter.malefici.stunned.quantita, this.charter.config.x * this.charter.config.w + this.charter.config.w, this.charter.config.y * this.charter.config.h + 60, 300);
            this.charter.config.ctx.drawImage(this.stunnoImage, this.stunnoImage.width / 4 * this.charter.counterAnimation, 0, this.stunnoImage.width / 4, this.stunnoImage.height, this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h - 30, 70, 90);
            this.charter.parametriFantasy.salute -= this.charter.malefici.stunned.quantita;
            this.charter.malefici.stunned.totTurni--;

        }
    }

    private poison() {
        if (this.charter.malefici.poisoned.value && this.charter.malefici.poisoned.totTurni > 0) {
            this.charter.malefici.poisoned.totTurni--;
            this.charter.config.ctx.fillStyle = 'green';
            this.charter.config.ctx.font = "20px Impact";
            this.charter.config.ctx.fillText('POISONED  ' + this.charter.malefici.poisoned.quantita, this.charter.config.x * this.charter.config.w - 70, this.charter.config.y * this.charter.config.h + 60, 300);
            this.charter.config.ctx.drawImage(this.velenoImage, this.velenoImage.width / 4 * this.charter.counterAnimation, 0, this.velenoImage.width / 4, this.velenoImage.height / 2, this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h - 30, 70, 90);

            if (!this.velenoImage.src) {
                this.velenoImage.src = 'assets/images/avvelenamento.png';
            }
            this.charter.parametriFantasy.salute -= this.charter.malefici.poisoned.quantita;
            if (!this.charter.isVelenoApplicato) {
                this.charter.isVelenoApplicato = true;
            }
        } else {
            this.charter.isVelenoApplicato = false;
        }
    }

    private fire() {
        if (this.charter.malefici.fiery.value && this.charter.malefici.fiery.totTurni > 0) {
            this.charter.malefici.fiery.totTurni--;
            this.charter.config.ctx.fillStyle = 'red';
            this.charter.config.ctx.font = "20px Impact";
            this.charter.config.ctx.fillText('ON FIRE !!!' + this.charter.malefici.fiery.quantita, this.charter.config.x * this.charter.config.w - 50, this.charter.config.y * this.charter.config.h, 300);

            if (!this.fiammeImage.src) {
                this.fiammeImage.src = 'assets/images/FUOCO.png';
            }
            this.charter.config.ctx.drawImage(this.fiammeImage, this.fiammeImage.width / 4 * this.charter.counterAnimation, 0, this.fiammeImage.width / 4, this.fiammeImage.height / 2, this.charter.config.x * this.charter.config.w - 30, this.charter.config.y * this.charter.config.h, 70, 90);
            this.charter.parametriFantasy.salute -= this.charter.malefici.fiery.quantita;
        }
    }

    private drawBarre() {
        let maxLength = 100;
        //salute
        this.drawBarra('red', maxLength * this.charter.parametriFantasy.salute / this.charter.maxSalute(), 30, 10);
        this.drawFineCorsa(maxLength, 30);
        //mana
        this.drawBarra('blue', this.charter.parametriFantasy.mana, 40, 10);
        this.drawFineCorsa(this.charter.parametriFantasy.maxMana, 40);
        //scudo
        if (this.charter.scudoCounter.isActive()) {
            this.drawBarra('orangered', this.charter.scudoCounter.counter / 3, 10, 10)
            this.scudoIcon.src = 'assets/images/scudo.png';
            this.charter.config.ctx.drawImage(this.scudoIcon,
                0,//colonna ws
                0,//riga hs
                this.scudoIcon.width, //ws
                this.scudoIcon.height,//hs
                this.charter.config.x * this.charter.config.w - 10 + this.charter.scudoCounter.counter / 3,
                this.charter.config.y * this.charter.config.h - 10,
                this.charter.config.w / 3,
                this.charter.config.h / 3);
        }
        //pozione
        if (this.charter.pozioneCounter.isActive()) {
            this.drawBarra('green', this.charter.pozioneCounter.counter / 3, 20, 10)
            this.pozioneIcon.src = 'assets/images/pozioneverde.png';
            this.charter.config.ctx.drawImage(this.pozioneIcon,
                0,//colonna ws
                0,//riga hs
                this.pozioneIcon.width, //ws
                this.pozioneIcon.height,//hs
                this.charter.config.x * this.charter.config.w - 10 + this.charter.pozioneCounter.counter / 3,
                this.charter.config.y * this.charter.config.h - 30,
                this.charter.config.w / 3,
                this.charter.config.h / 3);
        }
        this.drawTexts();
    }

    private drawFineCorsa(max: number, heigt: number) {
        this.charter.config.ctx.fillStyle = 'white';
        this.charter.config.ctx.fillRect(
            this.charter.config.x * this.charter.config.w + max,
            this.charter.config.y * this.charter.config.h - heigt,
            5, 10
        );
    }

    private drawTexts() {
        this.charter.config.ctx.fillStyle = this.charter.config.color;
        this.charter.config.ctx.strokeStyle = 'black';
        this.charter.config.ctx.font = '18px Impact';
        this.charter.config.ctx.strokeText(
            this.charter.classe + ' - ' + this.charter.name + ' - Level ' + this.charter.parametriFantasy.livello + ' - $ ' + this.charter.parametriFantasy.money + '     ' + this.charter.parametriFantasy.salute + '     ' + this.charter.maxSalute(),
            this.charter.config.x * this.charter.config.w,
            this.charter.config.y * this.charter.config.h - 55, 500
        );
        this.charter.config.ctx.font = '18px Impact';
        this.charter.config.ctx.fillText(
            'F' + this.charter.parametriFantasy.forza + ' I ' + this.charter.parametriFantasy.intelligenza + ' A ' + this.charter.parametriFantasy.agilita + ' RF ' + this.charter.parametriFantasy.resistenzaFisica + ' RM ' + this.charter.parametriFantasy.resistenzaMagica,
            this.charter.config.x * this.charter.config.w,
            this.charter.config.y * this.charter.config.h - 75, 500
        );
        this.charter.config.ctx.fillText(
            this.charter.classe + ' - ' + this.charter.name + ' - Level ' + this.charter.parametriFantasy.livello + ' - $ ' + this.charter.parametriFantasy.money,
            this.charter.config.x * this.charter.config.w,
            this.charter.config.y * this.charter.config.h - 55, 500
        );
    }

    private drawBarra(color: string, counter: number, posHeight: number, heigt: number) {
        this.charter.config.ctx.fillStyle = color;
        this.charter.config.ctx.fillRect(
            this.charter.config.x * this.charter.config.w,
            this.charter.config.y * this.charter.config.h - posHeight,
            counter, heigt);
    }

    private setSpriteFromCharterAndAction() {
        switch (this.charter.stato) {
            case 'camminando':
                this.setCamminando();
                break;
            case 'attaccando':
                this.setAttaccando();
                break;
            case 'difendendo':
                this.setAttaccando();
                break;
            case 'morendo':
                this.charter.config.ctx.fillText('morto', this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h, 300);
                break;
        }
    }

    private setAttaccando() {
        let riga = 0; let colonna = 0;
        switch (this.charter.getDirection()) {
            case 'TOP': riga = this.charter.spriteSheetImageAttack.height / 4 * 3; //riga 4
                break;
            case 'BOTTOM': //riga 1
                break;
            case 'LEFT': //riga 2
                //se = 0 then SX = 1; se = 1 SX = 2 
                if (this.charter.genereSprite === 0) {
                    riga = this.charter.spriteSheetImageAttack.height / 4 * 2;

                } else {
                    riga = this.charter.spriteSheetImageAttack.height / 4;
                }
                break;
            case 'RIGHT':  //riga 3
                //se = 0  dx = 2 ; se = 1 DX = 1
                if (this.charter.genereSprite === 0) {
                    riga = this.charter.spriteSheetImageAttack.height / 4;
                } else {
                    riga = this.charter.spriteSheetImageAttack.height / 4 * 2;
                }
                break;
        }
        colonna = this.charter.spriteSheetImageAttack.width / 4 * this.charter.counterAnimation;
        this.charter.config.ctx.drawImage(this.charter.spriteSheetImageAttack, colonna, riga, this.charter.spriteSheetImageAttack.width / 4, this.charter.spriteSheetImageAttack.height / 4, this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h, 70, 90);
    }

    private setCamminando() {
        let riga = 0; let colonna = 0;
        switch (this.charter.getDirection()) {
            case 'TOP': riga = this.charter.spriteSheetImage.height / 4 * 3; //riga 4
                break;
            case 'BOTTOM': //riga 1
                break;
            case 'LEFT': //riga 2
                //se = 0 then SX = 1; se = 1 SX = 2 
                if (this.charter.genereSprite === 0) {
                    riga = this.charter.spriteSheetImage.height / 4 * 2;

                } else {
                    riga = this.charter.spriteSheetImage.height / 4;
                }
                break;
            case 'RIGHT': //riga 3
                //se = 0  dx = 2 ; se = 1 DX = 1
                if (this.charter.genereSprite === 0) {
                    riga = this.charter.spriteSheetImage.height / 4;
                } else {
                    riga = this.charter.spriteSheetImage.height / 4 * 2;
                }
                break;
        }
        colonna = this.charter.spriteSheetImage.width / 4 * this.charter.counterAnimation;
        this.charter.config.ctx.drawImage(this.charter.spriteSheetImage, colonna, riga, this.charter.spriteSheetImage.width / 4, this.charter.spriteSheetImage.height / 4, this.charter.config.x * this.charter.config.w, this.charter.config.y * this.charter.config.h, 70, 90);
    }
}
