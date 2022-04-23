import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UtenteOnline } from "./classes/utils/costants.enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'Examples BUNDLE';
  errorMessage: any;
  nascondiBottoni = false;
  utente!: UtenteOnline;
  constructor( private router: Router) { }

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
  }
}


