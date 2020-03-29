import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioRecordingService} from '../../audio-recording.service';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {UtilFunctions} from '../../utils/util-functions.ts';
import {UserProfileEditService} from './user-profile-edit.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../utils/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
  selectedPhoto = null;
  isRecording = false;
  recordedTime;

  nickname = '';
  description = '';
  audioUrl = null;
  photoUrl = environment.randomAvatars +
    UtilFunctions.getRandomInt(250).toString();
  dirtySave = false;
  audioBlob: Blob;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer,
              private userProfileEditService: UserProfileEditService, private snackBar: MatSnackBar,
              private authService: AuthService, private router: Router) {


    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });
    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.getTranscriptForAudioBlob(data.blob);
      this.audioBlob = data.blob;
    });
  }

  private getTranscriptForAudioBlob(audioBlob: Blob) {
    this.waitingSnackBar();
    this.userProfileEditService.speechToText(audioBlob).subscribe(
      res => {
        this.doneSnackBar();
        this.description = res.transcription;
      },
      err => {
        this.errorSnackBar(err);
      });
  }

  private errorSnackBar(err) {
    console.log(err);
    this.createSnackBar('Something bad happened!');
  }

  private doneSnackBar() {
    this.createSnackBar('Done.');
  }

  private waitingSnackBar() {
    this.snackBar.open('Counting bytes by hand, please wait...', 'Close');
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
    this.dirtySave = true;
    if (!this.forbiddenPhotoUrl()) {
      this.authService.getCurrentUser().subscribe((user) => {
        // post profile picture
        if (this.selectedPhoto) {
          this.waitingSnackBar();
          this.userProfileEditService.postFile(this.selectedPhoto, user.email + '_img').subscribe(
            photoRes => {
              // post audio record
              if (this.audioBlob) {
                this.userProfileEditService.postFile(this.blobToFile(this.audioBlob, 'file.wav'), user.email + '_audio')
                  .subscribe(
                    audioRes => {
                      this.putUserProfile(user, photoRes.url, audioRes.url);
                    },
                    audioErr => {
                      this.errorSnackBar(audioErr);
                    }
                  );
              } else {
                this.putUserProfile(user, photoRes.url, null);
              }
            },
            photoErr => {
              this.errorSnackBar(photoErr);
            }
          );
        }
      });
    }
  }

  private putUserProfile(user, photoUrl: string, audioUrl: string) {
    this.userProfileEditService.putUserProfile({
      uid: user.uid,
      email: user.email,
      nickname: this.nickname,
      description: this.description,
      photoUrl,
      audioUrl
    }).subscribe(
      res => {
        this.doneSnackBar();
        this.router.navigate(['/']);
      },
      err => {
        this.errorSnackBar(err);
      }
    );
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
    this.audioBlob = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  forbiddenPhotoUrl() {
    return this.photoUrl.startsWith(environment.randomAvatars);
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return theBlob as File;
  };
}
