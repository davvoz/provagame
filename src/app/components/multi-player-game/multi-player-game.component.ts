import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Player, PlayerParametri } from 'src/app/classes/utils/costants.enum';
import { Utilities } from 'src/app/classes/utils/utilities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-multi-player-game',
  templateUrl: './multi-player-game.component.html',
  styleUrls: ['./multi-player-game.component.css']
})
export class MultiPlayerGameComponent implements AfterViewInit, PlayerParametri {
  @ViewChild('canvasGui', { static: false })
  canvasGui!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  parametriPlayer: Player = Utilities.getDefaultPlayer(this.ctx);

  constructor(public fservice: FirebaseService) {
    
  }


  ngAfterViewInit(): void {
    const res = this.canvasGui.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2d context.');
    }
    this.ctx = res;
  }




}
