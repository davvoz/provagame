import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IMyGeolocation, IMyUint8Array } from 'src/app/classes/utils/costants.enum';
import { Utilities } from 'src/app/classes/utils/utilities';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  item$!: Observable<IMyUint8Array[]>;
  out: IMyGeolocation = {
    IPv4: '',
    city: '',
    country_code: '',
    country_name: '',
    latitude: 0,
    longitude: 0,
    postal: '',
    state: ''
  };
  added = false;
  constructor(private http: HttpClient, private fservice: FirebaseService) {

    this.http.get('https://geolocation-db.com/json/').subscribe(
      (reso: any) => {
        this.out = reso;
        // if (!this.added) {
        //   this.fservice.addItem({ dato: reso, tabella: 'location' });
        //   this.added = true;
        //   const ba: IMyUint8Array = {
        //     byteArrayStringFormat: Utilities.bin2String(["0101", "0101", "0100", "0101", "0011", "1001", "0101", "0011", "0101", "0001", "0011", "0000", "0100", "0101", "0110", "0111", "0101", "0110", "0100", "0110", "0100", "1010", "0101", "0000", "0101", "0011", "0101", "0101", "0100", "0101", "0110", "0111", "0101", "0001", "0011", "0000", "0110", "1000", "0100", "0110", "0100", "1001", "0100", "0101", "0100", "1010", "0100", "0110", "0101", "0100", "0100", "0101", "0111", "1000", "0101", "0000", "0100", "1001", "0100", "0101", "0110", "1100", "0100", "1101", "0100", "1001", "0100", "0101", "0100", "1110", "0100", "0010", "0101", "0111", "0110", "1100", "0111", "0000", "0101", "0000"])
        //   }
        //   console.log(ba);
        //   this.fservice.addItem({ dato: ba, tabella: 'byteArray' });
        //}
      });
    // @ts-ignore
    this.item$ = collectionData(this.fservice.getLista('byteArray'));
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  getIpCliente() {
    return this.out
  }


}
