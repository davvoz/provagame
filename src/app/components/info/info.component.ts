import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IMyGeolocation, IMyUint8Array } from 'src/app/classes/utils/costants.enum';
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
