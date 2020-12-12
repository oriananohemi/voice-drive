import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSpeechComponent } from './web-speech.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [WebSpeechComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class WebSpeechModule { }
