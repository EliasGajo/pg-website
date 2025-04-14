import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AudioRecorderService } from '../audio-recorder.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-recorder',
  imports: [FormsModule],
  templateUrl: './audio-recorder.component.html',
  styleUrl: './audio-recorder.component.css'
})
export class AudioRecorderComponent {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: any[] = [];
  isRecording = false;
  transcript = '';
  backend_endpoint: string = '10.209.10.215:8000';

  constructor(private cdRef: ChangeDetectorRef, private audioRecorderService: AudioRecorderService) {}

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
          const text = this.convertAudioToText(audioBlob);
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

    fetch(`https://${this.backend_endpoint}/audio-to-text`, {
      method: 'POST',
      body: formData,
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      this.updateTranscript(data.message);
    })
    .catch(error => console.error('Error transcribing audio:', error));
  }

  updateTranscript(newTranscript: string) {
    this.transcript = newTranscript;
    this.cdRef.detectChanges();
    this.audioRecorderService.updateTranscript(newTranscript); // Mise à jour dans le service
  }
}
