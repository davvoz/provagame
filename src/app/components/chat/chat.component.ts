import { Component, OnInit } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Chates } from 'src/app/classes/utils/costants.enum';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  item$!: Observable<Chates[]>;
  speakInput: string = '';
  numero = 10;
  constructor(public fservice: FirebaseService) { }

  ngOnInit(): void {
    // @ts-ignore
    this.item$ = collectionData(this.fservice.getListaOrdinataChat(this.numero));
  }

  limitLista() {
    // @ts-ignore
    this.item$ = collectionData(this.fservice.getListaOrdinataChat(this.numero));
  }

  onSave() {
    this.fservice.addItem({ speak: this.speakInput, time: new Date() }, 'chates');
  }
}
