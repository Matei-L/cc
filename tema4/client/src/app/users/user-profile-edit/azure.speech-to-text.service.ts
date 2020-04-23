import {Injectable} from '@angular/core';

import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

import {BehaviorSubject, Observable} from 'rxjs';
import {serviceRegion, subscriptionKey} from '../../utils/azure/text-to-speech.config';

@Injectable({
  providedIn: 'root'
})
export class AzureSpeechToTextService {

  private currentTranslation = new BehaviorSubject<string>(null);

  public fromBlob(audioBlob: Blob): Observable<string> {

    // create the push stream we need for the speech sdk.
    const pushStream = sdk.AudioInputStream.createPushStream();

    // open the file and push it to the push stream.

    new Response(audioBlob).arrayBuffer()
      .then((arrayBuffer) => {
      pushStream.write(arrayBuffer);
    }).then(() => {
      pushStream.close();
    });

    // we are done with the setup
    console.log('Now recognizing from: Blob');

    // now create the audio-config pointing to our stream and
    // the speech config specifying the language.
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    // setting the recognition language to English.
    speechConfig.speechRecognitionLanguage = 'en-US';

    // create the speech recognizer.
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    // start the recognizer and wait for a result.
    recognizer.recognizeOnceAsync( (result) => {
        this.currentTranslation.next(result.text);

        recognizer.close();
        recognizer = undefined;
      },
       (err) => {
        this.currentTranslation.error(err);
        recognizer.close();
        recognizer = undefined;
      });

    return this.currentTranslation.asObservable();
  }
}
