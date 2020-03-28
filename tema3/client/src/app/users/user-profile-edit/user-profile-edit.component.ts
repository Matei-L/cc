import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioRecordingService} from '../../audio-recording.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
  photoUploadErrorMessage: string;
  selectedPhoto = null;
  selectedPhotoUrl = 'https://api.adorable.io/avatars/' +
    this.getRandomInt(250).toString();
  isRecording = false;
  recordedTime;
  blobUrl;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
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
      this.selectedPhotoUrl = reader.result.toString();
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
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
