import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { defaultLanguage, languages } from '../shared/model/languages';
import { SpeechErrorMessage } from '../shared/model/speech-error';
import { SpeechEvent } from '../shared/model/speech-event';
import { SpeechNotification } from '../shared/model/speech-notification';
import { SpeechRecognizerService } from '../shared/services/web-apis/speech-recognizer.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-web-speech',
  templateUrl: './web-speech.component.html',
  styleUrls: ['./web-speech.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebSpeechComponent implements OnInit {
  languages: string[] = languages;
  currentLanguage = new FormControl(defaultLanguage);
  totalTranscript = new FormControl('');

  transcript$: Observable<string>;
  listening$: BehaviorSubject<boolean>;
  error$: Observable<string>;

  constructor(private readonly speechRecognizer: SpeechRecognizerService) {
    this.listening$ = this.speechRecognizer.listening$;
  }

  ngOnInit(): void {
    const browserHaveSpeechAPI = this.speechRecognizer.initialize(this.currentLanguage.value);
    if (browserHaveSpeechAPI) {
      this.initRecognition();
    }else {
      this.error$ = of('Your Browser is not supported. Please try Google Chrome.');
    }
  }

  start(): void {
    if (this.listening$.getValue()) {
      this.stop();
      return;
    }

    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  selectLanguage(language: string): void {
    if (this.listening$.getValue()) {
      this.stop();
    }
    this.currentLanguage.setValue(language);
    this.speechRecognizer.setLanguage(this.currentLanguage.value);
  }

  private initRecognition(): void {
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        this.error$ = this.speechRecognizer.onError().pipe(map(({ error }: SpeechNotification<string>) => SpeechErrorMessage[error]));
        this.processNotification(notification);
      }),
      map(({ content }: SpeechNotification<string>) => content)
    );

    this.error$ = this.speechRecognizer.onError().pipe(map(({ error }: SpeechNotification<string>) => SpeechErrorMessage[error]));
  }

  processNotification({ event, content}: SpeechNotification<string>): void {
    if (event === SpeechEvent.FinalContent || event === SpeechEvent.InterimContent) {
      this.totalTranscript.setValue(content.trim())
    }
  }
}
