import { NgModule } from '@angular/core';
import { GameComponent } from './components/game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { InfoComponent } from './components/info/info.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'info', component: InfoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
