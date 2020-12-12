import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { defaultLanguage, languages } from '../shared/model/languages';
import { SpeechError } from '../shared/model/speech-error';
import { SpeechEvent } from '../shared/model/speech-event';
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

  private initRecognition(): void {
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        if(notification.event === SpeechEvent.FinalContent) {
          this.totalTranscript = this.totalTranscript 
          ? `${this.totalTranscript}\n${notification.content?.trim()}`
          : notification.content;
        }
      }),
      map((notification) => notification.content || '')
    );

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(
      map((notification) => notification.event === SpeechEvent.Start)
    );

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if(data === undefined) {
          return '';
        }
        let message;
        switch(data.error) {
          case SpeechError.NotAllowed:
            message = `Cannot run the demo.
            Your browser is not authorized to access your microphone.
            Verify that your browser has access to your microphone and try again.`;
            break;
          case SpeechError.NoSpeech:
            message = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.AudioCapture:
            message = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    )
  }
}
