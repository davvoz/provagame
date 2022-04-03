import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,FormsModule,
     provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideDatabase(() => getDatabase()), provideFirestore(() => getFirestore()),
      
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
