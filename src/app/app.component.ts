import { Component } from "@angular/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'game2k22';
  errorMessage: any;
  nascondiBottoni= false;
  nascondiAltriBottoni(arg:boolean){
    this.nascondiBottoni = arg;
  }
}


