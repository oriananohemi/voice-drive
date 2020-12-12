import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebSpeechModule } from './web-speech/web-speech.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./web-speech/web-speech.module').then(m => WebSpeechModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
