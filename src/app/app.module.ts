import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MyFormatDataPipe } from './pipes/my-format-data.pipe';
import { MyFormatDataPipeString } from './pipes/my-format-data-string.pipe';
import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './components/game/game.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { InfoComponent } from './components/info/info.component';
import { MultiPlayerGameComponent } from './components/multi-player-game/multi-player-game.component';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { AngularFireModule } from '@angular/fire/compat';
@NgModule({
  declarations: [
    AppComponent,
    MyFormatDataPipe,
    MyFormatDataPipeString,
    GameComponent,
    ChatComponent,
    InfoComponent,
    MultiPlayerGameComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()), provideFirestore(() => getFirestore()),
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
