import { Charter } from "../abstract/charter";

export class DrawCharter  {
    private charter!:Charter;
    
    constructor(charter: Charter) {
        this.charter = charter;
    }

    public drawAll(drowSintesi: boolean) {
        this.drawSprite();
        this.drawBarre();
        if (drowSintesi) {
            this.drawSintesi();
        }
    }

    private drawSintesi() {
        this.charter.ctx.beginPath();
        this.charter.ctx.fillStyle = 'black';
        this.charter.ctx.font = '15px Impact';
        this.charter.ctx.fillText(
            this.charter.name + ' : ' + this.charter.parametriFantasy.salute.toFixed(0),
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY,
            300
        );
        this.charter.ctx.fillText(
            'Forza : ' + this.charter.parametriFantasy.forza,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY - 20,
            300
        );
        this.charter.ctx.fillText(
            'Resistenza : ' + this.charter.parametriFantasy.resistenzaFisica,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY - 20 - 20,
            300
        );
        this.charter.ctx.fillText(
            'intelligenza : ' + this.charter.parametriFantasy.intelligenza,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY - 20 - 20 - 20,
            300
        );
        this.charter.ctx.closePath();
        this.charter.ctx.fillText(
            'Resistenza m: ' + this.charter.parametriFantasy.resistenzaMagica,
            this.charter.posizioneInfoLabelX,
            this.charter.posizioneInfoLabelY -
            20 -
            20 -
            20 -
            20,
            300
        );
        this.charter.ctx.fillText(
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
            this.charter.ctx.fillText(
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
            this.charter.ctx.fillText(
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
            this.charter.ctx.fillText(
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
            this.charter.ctx.fillText(
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
            this.charter.ctx.fillText(
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

    private drawSprite() {
        this.setSpriteFromCharterAndAction();
        //situazione fire
        if (this.charter.malefici.fiery.value && this.charter.malefici.fiery.totTurni > 0) {
            this.charter.malefici.fiery.totTurni--;
            this.charter.ctx.fillStyle = 'red';
            this.charter.ctx.font = "20px Impact";
            this.charter.ctx.fillText('ON FIRE !!!', this.charter.getX() * this.charter.sideX - 50, this.charter.getY() * this.charter.sideY, 300)
            if (!this.charter.fiammeImage.src) {
                this.charter.fiammeImage.src = 'assets/images/FUOCO.png';
            }

            this.charter.ctx.drawImage(this.charter.fiammeImage, this.charter.fiammeImage.width / 4 * this.charter.counterAnimation, 0, this.charter.fiammeImage.width / 4, this.charter.fiammeImage.height / 2, this.charter.getX() * this.charter.sideX - 30, this.charter.getY() * this.charter.sideY, 70, 90)
            console.log(this.charter.name + ' riceve danni da ' + this.charter.malefici.fiery.malus + ' : ' + this.charter.malefici.fiery.quantita);
            this.charter.parametriFantasy.salute -= this.charter.malefici.fiery.quantita;

        }
        //situazione poison
        if (this.charter.malefici.poisoned.value && this.charter.malefici.poisoned.totTurni > 0) {
            this.charter.malefici.poisoned.totTurni--;
            this.charter.ctx.fillStyle = 'green';
            this.charter.ctx.font = "20px Impact";
            this.charter.ctx.fillText('POISONED', this.charter.getX() * this.charter.sideX - 70, this.charter.getY() * this.charter.sideY + 60, 300)
            this.charter.ctx.drawImage(this.charter.velenoImage, this.charter.velenoImage.width / 4 * this.charter.counterAnimation, 0, this.charter.velenoImage.width / 4, this.charter.velenoImage.height / 2, this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY - 30, 70, 90)

            if (!this.charter.velenoImage.src) {
                this.charter.velenoImage.src = 'assets/images/avvelenamento.png';
            }
            console.log(this.charter.name + ' riceve danni da ' + this.charter.malefici.poisoned.malus + ' : ' + this.charter.malefici.poisoned.quantita);
            this.charter.parametriFantasy.salute -= this.charter.malefici.poisoned.quantita;
            if (!this.charter.isVelenoApplicato) {
                this.charter.isVelenoApplicato = true;
            }
        } else {
            this.charter.isVelenoApplicato = false;
        }
        //situazione stun
        if (this.charter.malefici.stunned.value && this.charter.malefici.stunned.totTurni > 0) {
            console.log(this.charter.name + ' riceve danni da ' + this.charter.malefici.stunned.malus + ' : ' + this.charter.malefici.stunned.quantita);
            if (!this.charter.stunnoImage.src) {
                this.charter.stunnoImage.src = 'assets/images/star.png';
            }
            this.charter.ctx.fillStyle = 'gold';
            this.charter.ctx.font = "20px Impact";
            this.charter.ctx.fillText('STUNNED', this.charter.getX() * this.charter.sideX - 30, this.charter.getY() * this.charter.sideY + 60, 300);
            this.charter.ctx.drawImage(this.charter.stunnoImage, this.charter.stunnoImage.width / 4 * this.charter.counterAnimation, 0, this.charter.stunnoImage.width / 4, this.charter.stunnoImage.height, this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY - 30, 70, 90)
            this.charter.parametriFantasy.salute -= this.charter.malefici.stunned.quantita;
            this.charter.malefici.stunned.totTurni--;
        }
        //situazione block
        if (this.charter.malefici.stunned.value && this.charter.malefici.stunned.totTurni > 0) {
            console.log(this.charter.name + ' riceve danni da ' + this.charter.malefici.stunned.malus + ' : ' + this.charter.malefici.stunned.quantita);
            if (!this.charter.stunnoImage.src) {
                this.charter.stunnoImage.src = 'assets/images/star.png';
            }
            this.charter.ctx.fillStyle = 'gold';
            this.charter.ctx.font = "20px Impact";
            this.charter.ctx.fillText('STUNNED', this.charter.getX() * this.charter.sideX - 30, this.charter.getY() * this.charter.sideY + 60, 300);
            this.charter.ctx.drawImage(this.charter.stunnoImage, this.charter.stunnoImage.width / 4 * this.charter.counterAnimation, 0, this.charter.stunnoImage.width / 4, this.charter.stunnoImage.height, this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY - 30, 70, 90)
            this.charter.parametriFantasy.salute -= this.charter.malefici.stunned.quantita;
            this.charter.malefici.stunned.totTurni--;
        }
    }

    private drawBarre() {
        let maxLength = 100;
        //salute
        this.drawBarra('red', maxLength * this.charter.parametriFantasy.salute / this.charter.maxSalute, 30, 10);
        this.drawFineCorsa(maxLength, 30);
        //mana
        this.drawBarra('blue', this.charter.parametriFantasy.mana, 40, 10);
        this.drawFineCorsa(this.charter.parametriFantasy.maxMana, 40);
        //scudo
        if (this.charter.scudoCounter.isActive()) {
            this.drawBarra('orangered', this.charter.scudoCounter.counter / 3, 10, 10)
            this.charter.scudoIcon.src = 'assets/images/scudo.png';
            this.charter.ctx.drawImage(this.charter.scudoIcon,
                0,//colonna ws
                0,//riga hs
                this.charter.scudoIcon.width, //ws
                this.charter.scudoIcon.height,//hs
                this.charter.getX() * this.charter.sideX - 10 + this.charter.scudoCounter.counter / 3,
                this.charter.getY() * this.charter.sideY - 10,
                this.charter.sideX / 3,
                this.charter.sideY / 3);
        }
        //pozione
        if (this.charter.pozioneCounter.isActive()) {
            this.drawBarra('green', this.charter.pozioneCounter.counter / 3, 20, 10)
            this.charter.pozioneIcon.src = 'assets/images/pozioneverde.png';
            this.charter.ctx.drawImage(this.charter.pozioneIcon,
                0,//colonna ws
                0,//riga hs
                this.charter.pozioneIcon.width, //ws
                this.charter.pozioneIcon.height,//hs
                this.charter.getX() * this.charter.sideX - 10 + this.charter.pozioneCounter.counter / 3,
                this.charter.getY() * this.charter.sideY - 30,
                this.charter.sideX / 3,
                this.charter.sideY / 3);
        }
        this.drawTexts();
    }

    private drawFineCorsa(max: number, heigt: number) {
        this.charter.ctx.fillStyle = 'white';
        this.charter.ctx.fillRect(
            this.charter.getX() * this.charter.sideX + max,
            this.charter.getY() * this.charter.sideY - heigt,
            5, 10
        );
    }

    private drawTexts() {
        this.charter.ctx.fillStyle = this.charter.getColor();
        this.charter.ctx.strokeStyle = 'black';
        this.charter.ctx.font = '18px Impact';
        this.charter.ctx.strokeText(
            this.charter.classe + ' - ' + this.charter.name + ' - Level ' + this.charter.parametriFantasy.livello + ' - $ ' + this.charter.parametriFantasy.money + '     ' + this.charter.parametriFantasy.salute + '     ' + this.charter.maxSalute,
            this.charter.getX() * this.charter.sideX,
            this.charter.getY() * this.charter.sideY - 55, 500
        );
        this.charter.ctx.font = '18px Impact';
        this.charter.ctx.fillText(
            'F' + this.charter.parametriFantasy.forza + ' I ' + this.charter.parametriFantasy.intelligenza + 'A' + this.charter.parametriFantasy.agilita + ' RF ' + this.charter.parametriFantasy.resistenzaFisica + ' RM ' + this.charter.parametriFantasy.resistenzaMagica,
            this.charter.getX() * this.charter.sideX,
            this.charter.getY() * this.charter.sideY - 75, 500
        );
        this.charter.ctx.fillText(
            this.charter.classe + ' - ' + this.charter.name + ' - Level ' + this.charter.parametriFantasy.livello + ' - $ ' + this.charter.parametriFantasy.money,
            this.charter.getX() * this.charter.sideX,
            this.charter.getY() * this.charter.sideY - 55, 500
        );
    }

    private drawBarra(color: string, counter: number, posHeight: number, heigt: number) {
        this.charter.ctx.fillStyle = color;
        this.charter.ctx.fillRect(
            this.charter.getX() * this.charter.sideX,
            this.charter.getY() * this.charter.sideY - posHeight,
            counter, heigt);
    }

    private setSpriteFromCharterAndAction() {
        let colonna = 0;
        let riga = 0;
        switch (this.charter.stato) {

            case 'camminando':
                switch (this.charter.getDirection()) {
                    case 'TOP': riga = this.charter.spriteSheetImage.height / 4 * 3; //riga 4
                        break;
                    case 'BOTTOM': riga = 0; //riga 1
                        break;
                    case 'LEFT': ; //riga 2

                        //se = 0 then SX = 1; se = 1 SX = 2 
                        if (this.charter.genereSprite === 0) {
                            riga = this.charter.spriteSheetImage.height / 4 * 2;

                        } else {
                            riga = this.charter.spriteSheetImage.height / 4;
                        }
                        break;
                    case 'RIGHT': ; //riga 3

                        //se = 0  dx = 2 ; se = 1 DX = 1
                        if (this.charter.genereSprite === 0) {
                            riga = this.charter.spriteSheetImage.height / 4;
                        } else {
                            riga = this.charter.spriteSheetImage.height / 4 * 2;
                        }
                        break;
                }
                colonna = this.charter.spriteSheetImage.width / 4 * this.charter.counterAnimation;
                this.charter.ctx.drawImage(this.charter.spriteSheetImage, colonna, riga, this.charter.spriteSheetImage.width / 4, this.charter.spriteSheetImage.height / 4, this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY, 70, 90);
                break;
            case 'attaccando':
                switch (this.charter.getDirection()) {
                    case 'TOP': riga = this.charter.spriteSheetImageAttack.height / 4 * 3; //riga 4
                        break;
                    case 'BOTTOM': riga = 0; //riga 1
                        break;
                    case 'LEFT': ; //riga 2

                        //se = 0 then SX = 1; se = 1 SX = 2 
                        if (this.charter.genereSprite === 0) {
                            riga = this.charter.spriteSheetImageAttack.height / 4 * 2;

                        } else {
                            riga = this.charter.spriteSheetImageAttack.height / 4;
                        }
                        break;
                    case 'RIGHT': ; //riga 3

                        //se = 0  dx = 2 ; se = 1 DX = 1
                        if (this.charter.genereSprite === 0) {
                            riga = this.charter.spriteSheetImageAttack.height / 4;
                        } else {
                            riga = this.charter.spriteSheetImageAttack.height / 4 * 2;
                        }
                        break;
                }
                colonna = this.charter.spriteSheetImageAttack.width / 4 * this.charter.counterAnimation;
                this.charter.ctx.drawImage(this.charter.spriteSheetImageAttack, colonna, riga, this.charter.spriteSheetImageAttack.width / 4, this.charter.spriteSheetImageAttack.height / 4, this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY, 70, 90);
                break;

            case 'difendendo':
                switch (this.charter.getDirection()) {
                    case 'TOP': riga = this.charter.spriteSheetImageAttack.height / 4 * 3; //riga 4
                        break;
                    case 'BOTTOM': riga = 0; //riga 1
                        break;
                    case 'LEFT': ; //riga 2

                        //se = 0 then SX = 1; se = 1 SX = 2 
                        if (this.charter.genereSprite === 0) {
                            riga = this.charter.spriteSheetImageAttack.height / 4 * 2;

                        } else {
                            riga = this.charter.spriteSheetImageAttack.height / 4;
                        }
                        break;
                    case 'RIGHT': ; //riga 3

                        //se = 0  dx = 2 ; se = 1 DX = 1
                        if (this.charter.genereSprite === 0) {
                            riga = this.charter.spriteSheetImageAttack.height / 4;
                        } else {
                            riga = this.charter.spriteSheetImageAttack.height / 4 * 2;
                        }
                        break;
                }
                colonna = this.charter.spriteSheetImageAttack.width / 4 * this.charter.counterAnimation;
                this.charter.ctx.drawImage(this.charter.spriteSheetImageAttack, colonna, riga, this.charter.spriteSheetImageAttack.width / 4, this.charter.spriteSheetImageAttack.height / 4, this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY, 70, 90);
                break;

            case 'morendo':
                this.charter.ctx.fillText('morto', this.charter.getX() * this.charter.sideX, this.charter.getY() * this.charter.sideY, 300);
                break;
        }
    }
}
