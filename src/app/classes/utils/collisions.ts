import { Charter } from "../abstract/charter";
import { BottonePozione } from "../buttons/bottone-pozione";
import { BottoneScudoAttiva } from "../buttons/bottone-scudo-attiva";
import { Bonus } from "../elements/bonus";
import { Mondo } from "../elements/mondo";
import { Pozione } from "../elements/pozione";
import { Proiettile } from "../elements/proiettile";
import { Square } from "../elements/square";
import { Treasure } from "../elements/treasure";
import { CollisionsParams } from "./costants.enum";
import { CounterToTrashold } from "./counter-to-treshold";
import { Utilities } from "./utilities";

export class Collisions {
  isScudoRaccolto = false;
  isTesoroRaccolto = false;
  aggiungiPozioneAdArray = false;
  counterAnimation = 0;
  constructor(public config: CollisionsParams) {
    this.counterAnimation = config.counterAnimation;
    //rilevo collisione player vs enemies[]
    this.collisionsEnemies(this.getMondo().enemies, config.player, config.proiettile);
    //rilevo collisione player vs camion
    this.collisionsPlayerVsCamion(config.player, this.getMondo().camion, config.mondoNumero);
    //rilevo collisione player vs bonus[]
    this.collisionsPlayerVsBonus(config.bonus, config.player);
    //rilevo collisione player vs pozione
    this.aggiungiPozioneAdArray = this.collisionsPlayerVsPozione(this.aggiungiPozioneAdArray, config.player, this.getMondo().pozione, config.pozioniBottoni);
    //rilevo collisione player vs tesoro
    this.isTesoroRaccolto = this.collisionsPlayerVsTesoro(this.isTesoroRaccolto, config.player, this.getMondo().tesoro, config.mondoNumero);
    //rilevo collisione player vs scudo
    this.isScudoRaccolto = this.collisionsPlayerVsScudo(this.isScudoRaccolto, config.player, this.getMondo().scudoBonus, config.scudoButton);
    //rilevo collisione player vs superProiettile
    //this.collisionsPlayerVsSuperProiettile(this.getMondo().superProiettileCounter, config.player, config.proiettile);
  }

  private collisionsEnemies(enemies: Charter[], player: Charter, proiettile: Proiettile) {
    for (const nemico of enemies) {
      // rilevo solo se questo enemy non è morto
      if (!nemico.isMorto) {
        // 1)rilevo se questo enemy collide con altri enemies
        this.collisionsTraLoro(nemico);
        // 2) rilevo se questo enemy collide con il player
        const ctoEnemyI = Utilities.rectCollisionRealCollision(player, nemico.getAurea());
        if (ctoEnemyI.isColliding) {
          player.isColliding = true;
          nemico.isColliding = true;
          //se collidono deve partire la routine di combattimento
          this.combattimento(player, nemico);
        } else {
          player.isColliding = false;
          nemico.isColliding = false;
        }
        // 3) rilevo se questo enemy collide con il proiettile
        if (proiettile && Utilities.rectCollisionRealCollision(nemico, proiettile.getSquareParam()).isColliding) {
          this.proiettileVs(nemico, proiettile, player);
        }

        //rilevo se il nemico vede il player e se lo vede setta la sua direzione di conseguenza
       // this.collisionsAuree(nemico, player);

      }
    }
  }

  private combattimento(c1: Charter, c2: Charter) {
    if (this.counterAnimation === 3) {
      if (c1.parametriFantasy.agilita >= c2.parametriFantasy.agilita) {
        Utilities.algoAttack(c1, c2);
        Utilities.algoAttack(c2, c1);
      } else {
        Utilities.algoAttack(c2, c1);
        Utilities.algoAttack(c1, c2);
      }
    }
    c1.isOnAttack = true;
    c1.stato = 'attaccando';
    c2.isOnAttack = true;
    c2.stato = 'attaccando';
  }

  private proiettileVs(charter: Charter, proiettile: Proiettile, giocatore: Charter) {
    charter.incrementaSalute(-100 * giocatore.parametriFantasy.livello);
    proiettile.lanciaAbilita(charter);
    //se muore gli rubo i soldi
    if (charter.isMorto && charter.parametriFantasy.money > 0) {
      giocatore.rubaSoldiA(charter);
      giocatore.exp = giocatore.exp + giocatore.parametriFantasy.livello * charter.parametriFantasy.livello * 100;
    }
  }

  private collisionsAuree(nemico: Charter, giocatore: Charter) {
    let cto = Utilities.rectsCollidingToDirection(nemico.getVisionAurea(), giocatore.getVisionAurea());
    if (cto.isColliding) {
      //se le auree si scontrano il nemico mi insegue
      nemico.setDirection(cto.getBetterDirection());
      nemico.haPresoUnaDirezioneCounter.attiva();
    }
  }

  private collisionsTraLoro(nemico: Charter) {
    for (const collisore of this.getMondo().enemies) {
      //se il protagonista(questo enemy) non è il collisore e il collisore non è morto
      if (nemico !== collisore && !collisore.isMorto) {
        //lascio che l'utility setti la velocita del protagonista(questo enemy)
        Utilities.rectCollisionRealCollision(nemico, collisore.getAurea());
      }
    }
  }

  private collisionsPlayerVsCamion(player: Charter, camion: Square, mondoNummero: number) {
    if (Utilities.rectsCollidingWrong(player.getSquareParam(), camion.getSquareParam())) {
      player.incrementaSalute(-(500 * mondoNummero));
      if (player.getSalute() <= 0) {
        player.isMorto = true;
      }
    }
  }

  private collisionsPlayerVsBonus(bonuses: Bonus[], player: Charter) {
    for (const bonus of bonuses) {
      bonus.stand();
      if (bonus.getPlafond() > 0) {
        if (Utilities.rectsCollidingWrong(bonus.getSquareParam(), player.getSquareParam())) {
          this.config.player.incrementaSalute(bonus.getQuantita() * player.parametriFantasy.livello);
          bonus.setPlafond(bonus.getPlafond() - bonus.getQuantita());
        }
      }
    }
  }

  private collisionsPlayerVsPozione(aggiungiPozioneAdArray: boolean, player: Charter, pozione: Pozione, pozioniBottoni: BottonePozione[]): boolean {
    if (Utilities.rectsCollidingWrong(player.getSquareParam(), pozione.getSquareParam())) {
      player.pozioni.push(pozione);
      for (const p of pozioniBottoni) {
        if (!p.isCasellaPiena && !aggiungiPozioneAdArray) {
          p.riempiCasella();
          Utilities.setRandomXY(pozione);
          return true;
        }
      }
    }
    return false;
  }

  private collisionsPlayerVsTesoro(isTesoroRaccolto: boolean, player: Charter, tesoro: Treasure, mondoNumero: number): boolean {
    if ((!isTesoroRaccolto && Utilities.rectsCollidingWrong(player.getSquareParam(), tesoro.getSquareParam())) && //
      (mondoNumero % 3 == 0 && (mondoNumero % 3 == 0 || !this.isTesoroRaccolto))) {
      player.parametriFantasy.money += tesoro.money;
      Utilities.setRandomXY(tesoro);
      return true;
    }
    if (mondoNumero % 3 != 0) {
      return false;
    }
    return false;
  }

  private collisionsPlayerVsSuperProiettile(sProiettileCounter: CounterToTrashold, player: Charter, proiettile: Proiettile) {
    if (!sProiettileCounter.isActive() && Utilities.rectsCollidingWrong(player.getSquareParam(), proiettile.getSquareParam())) {
      sProiettileCounter.attiva();
      Utilities.setRandomXY(this.getMondo().superProiettile);
    }
  }

  private collisionsPlayerVsScudo(isScudoRaccolto: boolean, player: Charter, scudoBonus: Square, scudoButton: BottoneScudoAttiva): boolean {
    if (!isScudoRaccolto && Utilities.rectsCollidingWrong(player.getSquareParam(), scudoBonus.getSquareParam())) {
      scudoButton.riempiScudo();
      Utilities.setRandomXY(this.getMondo().scudoBonus);
      return true;
    }
    return false;
  }

  private getMondo(): Mondo {
    return this.config.mondo;
  }
  
  public setMondo(mondo: Mondo) {
    this.config.mondo = mondo;
  }
}