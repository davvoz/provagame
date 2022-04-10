import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { MyFormatDataPipe } from './pipes/my-format-data.pipe';
import { MyFormatDataPipeString } from './pipes/my-format-data-string.pipe';
import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './components/game/game.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { InfoComponent } from './components/info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    MyFormatDataPipe,
    MyFormatDataPipeString,
    GameComponent,
    ChatComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,FormsModule,HttpClientModule,
     provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideDatabase(() => getDatabase()), provideFirestore(() => getFirestore()), AppRoutingModule,
      
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
