import { Component, Output, EventEmitter, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-recorder',
  imports: [FormsModule, CommonModule],
  templateUrl: './audio-recorder.component.html',
  styleUrl: './audio-recorder.component.css'
})
export class AudioRecorderComponent {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: any[] = [];
  isRecording = false;
  isConvertingToText = false;
  @Output() transcript = new EventEmitter<string>();
  backend_endpoint: string = '10.209.10.215:8000';

  constructor(private zone: NgZone, private cdRef: ChangeDetectorRef) {}

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = event => {
          this.audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioChunks = [];
          this.convertAudioToText(audioBlob);
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch(error => console.error('Error accessing microphone:', error));
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
  }

  convertAudioToText(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('file', audioBlob);

    this.zone.run(() => {
      this.isConvertingToText = true;
      fetch(`https://${this.backend_endpoint}/audio-to-text`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data => {
        this.transcript.emit(data.message);
        this.cdRef.detectChanges();
        this.isConvertingToText = false;
      })
      .catch(error => {
        console.error('Error transcribing audio:', error);
        this.isConvertingToText = false;
      });
    }); 
  }
}
