import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import {Observable, Subject} from 'rxjs';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private stream;
  private recorder;
  private interval;
  private startTime;
  private mRecorded = new Subject<any>();
  private mRecordingTime = new Subject<string>();
  private mRecordingFailed = new Subject<string>();
  constructor() { }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this.mRecorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this.mRecordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this.mRecordingFailed.asObservable();
  }

  startRecording() {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this.mRecordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.record();
    }).catch(() => {
      this.mRecordingFailed.next();
    });

  }

  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      desiredSampRate: 16000
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this.mRecordingTime.next(time);
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {

    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this.mRecorded.next({ blob, title: mp3Name });
        }
      }, () => {
        this.stopMedia();
        this.mRecordingFailed.next();
      });
    }

  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  abortRecording() {
    this.stopMedia();
  }

}
