import { NgModule } from '@angular/core';
import { GameComponent } from './components/game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { InfoComponent } from './components/info/info.component';
import { MultiPlayerGameComponent } from './components/multi-player-game/multi-player-game.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path: 'signup', component: SignupComponent},
  { path: 'game', component: GameComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'info', component: InfoComponent },
  {
    path: 'mgame', component: MultiPlayerGameComponent, 
  },
  { path: '**', redirectTo: 'game', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }