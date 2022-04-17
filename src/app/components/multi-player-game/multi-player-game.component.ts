import { AfterViewInit, Component } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtenteOnline } from 'src/app/classes/utils/costants.enum';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-multi-player-game',
  templateUrl: './multi-player-game.component.html',
  styleUrls: ['./multi-player-game.component.css']
})
export class MultiPlayerGameComponent implements AfterViewInit {

  utenti$!: Observable<UtenteOnline[]>;
  titleLista = 'LISt;A;s;UTe;nt;i';
  constructor(public fservice: FirebaseService, private router: Router) { }

  ngAfterViewInit(): void {

    // @ts-ignore
    this.utenti$ = collectionData(this.fservice.getLista('utenti'));


  }
  goToLogin() {
    this.router.navigate(['/signup']);
    //this.router.navigateByUrl('/login', { state: this.product });

  }
}
