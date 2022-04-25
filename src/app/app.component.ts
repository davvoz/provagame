import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UtenteOnline } from "./classes/utils/costants.enum";
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Examples BUNDLE';
  errorMessage: any;
  nascondiBottoni = false;
  utente!: UtenteOnline;
  message: any = null;

  constructor(private router: Router) {
    this.requestPermission();
    this.listen();
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
  }
  requestPermission() {

    // try {
    //   getToken(getMessaging(),
    //     { vapidKey: environment.firebase.vapidKey }).then(
    //       (currentToken) => {
    //         if (currentToken) {
    //           console.log("Hurraaa!!! we got the token.....");
    //           console.log(currentToken);
    //         } else {
    //           console.log('No registration token available. Request permission to generate one.');
    //         }
    //       }).catch((err) => {
    //         console.log('An error occurred while retrieving token. ', err);
    //       });
    // } catch (error) {
    //   console.log(error);
    // }

  }

  listen() {
    // const messaging = getMessaging();
    // onMessage(messaging, (payload) => {
    //   console.log('Message received. ', payload);
    //   this.message = payload;
    // });
  }
}


