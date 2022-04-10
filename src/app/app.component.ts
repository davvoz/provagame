import { Component } from "@angular/core";
import { TuplaPossibile, UtenteOnline } from "./classes/utils/costants.enum";
import { Utilities } from "./classes/utils/utilities";
import { FirebaseService } from "./services/firebase.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'game2k22';
  errorMessage: any;
  nascondiBottoni = false;
  utente!: UtenteOnline;
  constructor(private fservice: FirebaseService) {
   this.utente = {
    name: Utilities.nomeRandomico() + ' ' + Utilities.conomeRandomico(),
    time: new Date()
   }
    const tupla: TuplaPossibile = {
      dato: this.utente,
      tabella: 'utenti-online'
    };
    this.fservice.addItem(tupla);
  }

  nascondiAltriBottoni(arg: boolean) {
    this.nascondiBottoni = arg;
  }
}


