import { Component, OnInit } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chates, UtenteOnline } from 'src/app/classes/utils/costants.enum';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  utente!: UtenteOnline;
  item$!: Observable<Chates[]>;
  speakInput: string = '';
  numero = 10;
  constructor(public fservice: FirebaseService, private route: ActivatedRoute, public sservice: SessionService) { }

  ngOnInit(): void {
    // @ts-ignore
    this.item$ = collectionData(this.fservice.getListaOrdinataChat(this.numero));
  }

  limitLista() {
    // @ts-ignore
    this.item$ = collectionData(this.fservice.getListaOrdinataChat(this.numero));
  }

  onSave() {
    this.fservice.addItem({ dato: { speak: this.speakInput, time: new Date(), utente: '' }, tabella: 'chates' });
  }
}
