import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebSpeechComponent } from './web-speech.component';

const routes: Routes = [
  {
    path: '',
    component: WebSpeechComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSpeechRoutingModule { }
