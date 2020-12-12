import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSpeechComponent } from './web-speech.component';
import { SharedModule } from '../shared/shared.module';
import { WebSpeechRoutingModule } from './web-speech-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
@NgModule({
  declarations: [WebSpeechComponent],
  imports: [
    WebSpeechRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class WebSpeechModule { }
