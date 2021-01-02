import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpeechError } from '../../model/speech-error';
import { SpeechEvent } from '../../model/speech-event';
import { SpeechNotification } from '../../model/speech-notification';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = window as unknown as IWindow;

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognizerService {
  recognition: SpeechRecognition;
  language: string;
  listening$ = new BehaviorSubject<boolean>(false);

  initialize(language: string): boolean {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.setLanguage(language);
      return true;
    }

    return false;
  }

  setLanguage(language: string): void {
    this.language = language;
    this.recognition.lang = language;
  }

  start(): void {
    if (!this.recognition) {
      return;
    }

    this.recognition.start();
    this.listening$.next(true);
  }
  
  stop(): void {
    this.recognition.stop();
    this.listening$.next(false);
  }
  
  onStart(): Observable<SpeechNotification<never>> {
    if (!this.recognition) {
      this.initialize(this.language);
    }

    return new Observable(observer => {
      this.recognition.onstart = () => observer.next({
        event: SpeechEvent.Start
      });
    });
  }
  
  onEnd(): Observable<SpeechNotification<never>> {
    return new Observable(observer => {
      this.recognition.onend = () => {
          observer.next({
            event: SpeechEvent.End
          });
          this.listening$.next(false) };
    });
  }

  onResult(): Observable<SpeechNotification<string>> {
    return new Observable(observer => {
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimContent = '';
        let finalContent = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalContent += event.results[i][0].transcript;
              observer.next({
                event: SpeechEvent.FinalContent,
                content: finalContent
              });
          } else {
            interimContent += event.results[i][0].transcript;
              observer.next({
                event: SpeechEvent.InterimContent,
                content: interimContent
              });
          }
        }
      };
    });
  }

  onError(): Observable<SpeechNotification<SpeechError>> {
    return new Observable<SpeechNotification<SpeechError>>(observer => {
      this.recognition.onerror = ({ error }: ErrorEvent) => {
        let message: SpeechError;

        switch (error) {
          case 'no-speech':
            message = SpeechError.NoSpeech;
            break;
          case 'audio-capture':
            message = SpeechError.AudioCapture;
            break;
          case 'not-allowed':
            message = SpeechError.NotAllowed;
            break;
          default:
            message = SpeechError.Unknown;
            break;
        }

          observer.next({ error });
      };
    });
  }
}
