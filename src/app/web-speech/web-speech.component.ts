import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { defaultLanguage, languages } from '../shared/model/languages';
import { SpeechRecognizerService } from '../shared/services/web-apis/speech-recognizer.service';

@Component({
  selector: 'app-web-speech',
  templateUrl: './web-speech.component.html',
  styleUrls: ['./web-speech.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebSpeechComponent implements OnInit {
  languages: string[] = languages;
  currentLanguage: string = defaultLanguage;
  totalTranscript: string;

  transcript$: Observable<string>;
  listening$: Observable<boolean>;
  errorMessage$: Observable<string>;
  defaultError$ = new Subject<undefined>();

  constructor(private speechRecognizer: SpeechRecognizerService) { }

  ngOnInit(): void {
    this.speechRecognizer.initialize(this.currentLanguage);
    // this.initRecognition()
  }

  start(): void {
    if(this.speechRecognizer.isListening) {
      this.stop();
      return;
    }

    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  selectLanguage(language: string): void {
    if(this.speechRecognizer.isListening) {
      this.stop()
    }

    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage)
  }
}
