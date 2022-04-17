import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuplaPossibile } from 'src/app/classes/utils/costants.enum';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  nome = '';
  cognome = '';
  constructor(public fservice: FirebaseService, private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    const tupla: TuplaPossibile = {
      dato: {
        nome: this.nome,
        cognome: this.cognome,
        registrered: new Date()
      },tabella:
      'utenti'
    }
    this.fservice.addItem(tupla);
    this.router.navigate(['/mgame']);

  }
}
