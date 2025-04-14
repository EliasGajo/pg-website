import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  private transcriptSource = new BehaviorSubject<string>(''); // Valeur initiale vide
  transcript$ = this.transcriptSource.asObservable(); // Observable pour récupérer la valeur de transcript

  // Mettre à jour la valeur de transcript
  updateTranscript(newTranscript: string) {
    this.transcriptSource.next(newTranscript); // On envoie la nouvelle valeur
  }
}
