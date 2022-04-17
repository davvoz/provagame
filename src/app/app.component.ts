import { AfterViewInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { TuplaPossibile, UtenteOnline } from "./classes/utils/costants.enum";
import { FirebaseService } from "./services/firebase.service";
import { SessionService } from "./services/session.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Examples BUNDLE';
  errorMessage: any;
  nascondiBottoni = false;
  utente!: UtenteOnline;
  constructor(public fservice: FirebaseService, private router: Router, public sservice: SessionService) { }
  
  ngAfterViewInit(): void {
  }

  routeToGame(): void {
    this.router.navigate(['/game']);
  }

  routeToChat(): void {
    this.router.navigate(['/chat']);
  }

  routeToMGame(): void {
    this.router.navigate(['/mgame']);
  }

  nascondiAltriBottoni(arg: boolean): void {
    this.nascondiBottoni = arg;
    const tupla: TuplaPossibile = {
      dato: this.utente,
      tabella: 'tabella-presenze'
    };
    this.fservice.addItem(tupla);
  }
}


