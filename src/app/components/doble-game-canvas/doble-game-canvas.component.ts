import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Charter } from 'src/app/classes/abstract/charter';
import { BottoneSceltaCharter } from 'src/app/classes/buttons/bottone-scelta-charter';
import { Bullo } from 'src/app/classes/charters/bullo';
import { Guerriero } from 'src/app/classes/charters/guerriero';
import { Mago } from 'src/app/classes/charters/mago';
import { Samurai } from 'src/app/classes/charters/samurai';
import { classe, FirePlayer, Pletora, tipoProgressivi } from 'src/app/classes/utils/costants.enum';
import { Utilities } from 'src/app/classes/utils/utilities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-doble-game-canvas',
  templateUrl: './doble-game-canvas.component.html',
  styleUrls: ['./doble-game-canvas.component.css']
})
export class DobleGameCanvasComponent implements AfterViewInit {
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  sceltaCharter: BottoneSceltaCharter[] = [];
  counterAnimation = 0;
  counterRoutine = 0;
  players!: Observable<FirePlayer[]>;
  pletora: Pletora = { personaggi: [] };
  listaPlayers: FirePlayer[] = [];
  playerScelto: FirePlayer = Utilities.getDefaultFirePlayer(1);
  nemicoScelto: FirePlayer = Utilities.getDefaultFirePlayer(1);
  playerCharter!: Charter;
  enemyCharter!: Charter;
  isFaseScelta = true;//scegliere personaggio
  isFasePreparazione = false; //dopo la fase di scelta , si aspetta il rivale
  classeCharterScelto: classe = 'ABSTRACT';
  isNemicoScelto = false;
  haScelto = false;
  haiScelto = false;
  constructor(private ngZone: NgZone, public fservice: FirebaseService) { }

  ngAfterViewInit(): void {
    this.inizializzaPlayers();
    const res = this.canvasGui.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2d context.');
    }
    // @ts-ignore
    this.players = collectionData(this.fservice.getLista('players'));

    this.ctx = res;
    this.ctx.canvas.width = 1000;
    this.ctx.canvas.height = 500;
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
      sc.isToggle = true;
      sc.isShowState = false;
      sc.config.x = i;
      sc.config.y = 1;
      sc.config.w = this.ctx.canvas.width / 4;
      sc.config.h = this.ctx.canvas.height / 4;

      sc.secondText = ' -> ' + (i + 1);
      sc.terzoText = sc.typeOfCharter;
      sc.stand();
      this.sceltaCharter.push(sc);

      this.players.subscribe((reso) => {
        this.listaPlayers = reso;
        let conterScvelti = 0;
        this.catchEnemy(conterScvelti);
      })
    }
    this.ctx.canvas.addEventListener(
      'click',
      (evt: MouseEvent) => {
        if (this.isFaseScelta) {
          this.scegliPersonaggioButton(evt);
        }
      });

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private catchEnemy(conterScvelti: number) {
    this.listaPlayers.forEach(
      (el) => {
        if (el.progressivo !== this.playerScelto.progressivo && !this.haiScelto) {

          this.inizializzaNemicoDaCatch(el);

          if (this.enemyCharter && !this.playerCharter) {
            this.haScelto = true;
          }

        }
        if (el.progressivo !== this.playerScelto.progressivo && !this.enemyCharter && el.classeCharter !== 'ABSTRACT' && el.scelto && this.playerScelto.classeCharter !== 'ABSTRACT') {
          this.inizializzaNemico(el);
        }
        if (el.scelto) {
          conterScvelti++;
        }
        if (conterScvelti === 2) {
          this.isFaseScelta = false;
        }
      }
    );
  }

  private inizializzaNemicoDaCatch(el: FirePlayer) {
    if (el.progressivo !== 0 &&
      (el.progressivo !== this.playerScelto.progressivo && this.playerScelto.progressivo !== 0) &&
      !this.isNemicoScelto &&
      el.scelto && !this.enemyCharter) {
      this.inizializzaNemico(el);
    }


    if (!el.nome.startsWith('Default_name_') && !this.enemyCharter) {
      this.inizializzaNemico(el);
    }
  }

  private inizializzaNemico(el: FirePlayer) {
    this.nemicoScelto = el;
    this.isNemicoScelto = true;
    this.enemyCharter = this.initializeCharter(el.classeCharter);
    this.enemyCharter.name = el.nome;
    this.enemyCharter.config.x = el.x
    this.enemyCharter.config.y = el.y;
  }

  private inizializzaPlayers() {
    this.fservice.updatePlayers('player-one', Utilities.getDefaultFirePlayer(1));
    this.fservice.updatePlayers('player-two', Utilities.getDefaultFirePlayer(2))
  }

  private scegliPersonaggioButton(evt: MouseEvent) {
    for (const charter of this.sceltaCharter) {
      if (!this.haiScelto) {
        this.haiSceltoProcedure(evt, charter);
      }

    }
  }

  private haiSceltoProcedure(evt: MouseEvent, charter: BottoneSceltaCharter) {
    if (Utilities.changeButtonState(evt, charter, this.ctx)) {
      this.haiScelto = true;
      let brk = false;
      for (const player of this.listaPlayers) {
        if ((!player.scelto && player !== this.playerScelto) && !brk) {
          this.setPlayer(player, charter);
          brk = true;
        }
      }
    }
  }

  private setPlayer(player: FirePlayer, charter: BottoneSceltaCharter) {
    player.nome = Utilities.nomeRandomico() + ' ' + Utilities.conomeRandomico() + ' : ' + charter.typeOfCharter;
    const x = Utilities.getSecureRandom(4) + 1;
    const y = Utilities.getSecureRandom(4) + 1;
    player.scelto = true;
    player.classeCharter = charter.typeOfCharter;
    player.x = x;
    player.y = y;
    this.fservice.updatePlayers(this.getFirebaseName(player), player).then(
      (res) => {
        this.playerScelto = res;
        this.isFasePreparazione = true;
        this.classeCharterScelto = charter.typeOfCharter;
        this.playerCharter = this.initializeCharter(charter.typeOfCharter);
        this.playerCharter.config.x = res.x;
        this.playerCharter.config.y = res.y;
        this.playerCharter.name = player.nome;
      }
    );
  }

  private initializeCharter(cl: classe): Charter {
    switch (cl) {
      case 'BULLO': return new Bullo(Utilities.getSquareConfig(this.ctx, 'azure'));
      case 'MAGO': return new Mago(Utilities.getSquareConfig(this.ctx, 'pink'));
      case 'GUERRIERO': return new Guerriero(Utilities.getSquareConfig(this.ctx, 'violet'));
      case 'SAMURAI': return new Samurai(Utilities.getSquareConfig(this.ctx, 'gold'));
      default: throw new Error();
    }
  }

  private getFirebaseName(player: FirePlayer): tipoProgressivi {
    return player.progressivo === 1 ? 'player-one' : 'player-two';
  }

  animate(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(0, this.ctx.canvas.height - 100, this.ctx.canvas.width, 100);
    if (this.isFaseScelta) {
      this.faseScelta();
    }
    if (this.isFasePreparazione) {
      this.fasePreparazione();
    }


    //velocità animazione ogni n frame
    if (this.counterRoutine % 8 == 0) {
      //step animazione 
      if (this.counterAnimation === 3) {
        this.counterAnimation = 0
      } else {
        this.counterAnimation++;
      }
    }
    if (this.counterRoutine === 399) {
      this.counterRoutine = 0
    } else {
      this.counterRoutine++;
    }
    requestAnimationFrame(this.animate.bind(this));
  }

  fasePreparazione() {
    this.playerCharter.counterAnimation = this.counterAnimation;
    this.playerCharter.stand();
    if (this.enemyCharter) {
      this.enemyCharter.counterAnimation = this.counterAnimation;
      this.enemyCharter.stand();
    }
  }

  private faseScelta() {

    this.ctx.fillStyle = 'hotpink';
    this.ctx.font = 'italic bolder 45px Orbitron';
    this.ctx.fillText('SCEGLI', 400, this.ctx.canvas.height - 50);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'hotpink';
    if (this.enemyCharter) {
      this.enemyCharter.counterAnimation = this.counterAnimation;
      this.enemyCharter.stand();
    }
    this.sceltaCharter.forEach((scelta) => {
      scelta.counterAnimation = this.counterAnimation;
      scelta.stand();
    });
  }
}
