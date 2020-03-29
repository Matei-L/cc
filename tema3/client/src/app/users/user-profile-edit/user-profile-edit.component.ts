import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioRecordingService} from '../../audio-recording.service';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {UtilFunctions} from '../../utils/util-functions.ts';
import {UserProfileEditService} from './user-profile-edit.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
  photoUploadErrorMessage: string;
  selectedPhoto = null;
  isRecording = false;
  recordedTime;

  nickname = '';
  description = '';
  audioUrl = '';
  photoUrl = environment.randomAvatars +
    UtilFunctions.getRandomInt(250).toString();
  chosenPhoto: any;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer,
              private userProfileEditService: UserProfileEditService, private snackBar: MatSnackBar) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });
    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob)).toString();
      this.getTranscriptForAudioBlob(data.blob);
    });
  }

  private getTranscriptForAudioBlob(audioBlob: Blob) {
    this.createSnackBar('Counting bytes by hand, please wait...');
    this.userProfileEditService.speechToText(audioBlob).subscribe(
      res => {
        this.createSnackBar('Done.');
        this.description = res.transcription;
      },
      err => {
        console.log(err);
        this.createSnackBar('Something bad happened!');
      });
  }

  private createSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }

  ngOnInit(): void {
  }

  onPhotoSelected($event) {
    const files = $event.target.files;
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (null == mimeType.match(/image\/*/)) {
      this.photoUploadErrorMessage = 'Only images are supported.';
      return;
    }
    this.selectedPhoto = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedPhoto);
    reader.onload = () => {
      this.photoUrl = reader.result.toString();
    };
  }

  onSave() {
    //  todo: send to server
    //  todo: vezi cum sa trimiti separat inregistrarea audio
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.audioUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }
}
