import { Component, Input } from '@angular/core';
import { AudioRecorderService } from '../audio-recorder.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-generator',
  imports: [FormsModule],
  templateUrl: './email-generator.component.html',
  styleUrl: './email-generator.component.css'
})
export class EmailGeneratorComponent {
  text_brut: string = ''; // Reçoit le transcript du service
  resultat: string = '';
  backend_endpoint: string = '10.209.10.215:8000';
  constructor(private audioRecorderService: AudioRecorderService) {}

  ngOnInit() {
    // S'abonner à l'observable du service pour recevoir les mises à jour de transcript
    this.audioRecorderService.transcript$.subscribe((transcript) => {
      this.text_brut = transcript;
    });
  }

  generer_email() {
    const apiKey = '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';
    const params = new URLSearchParams();

    fetch(`https://${this.backend_endpoint}/ask_to_chat_gpt`, {
      method: 'POST',
      body: JSON.stringify({
        input: `Génère un email formel à partir de ce texte : "${this.text_brut}"`
      }),
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      this.resultat = this.extract_email_from_gpt_answer(data.message);
    })
    .catch(error => console.error('Erreur lors de la génération de l\'email : ', error));
  }

  extract_email_from_gpt_answer(gpt_answer: string) {
    let debut_idx: number = 0;
    let fin_idx: number = gpt_answer.length;
    let objet_idx: number = gpt_answer.indexOf('Objet');
    if(objet_idx !== -1) {
      debut_idx = objet_idx
    }
    let dernier_crochet_idx: number = gpt_answer.lastIndexOf(']');
    if(dernier_crochet_idx !== -1) {
      fin_idx = dernier_crochet_idx
    }
    return gpt_answer.substring(debut_idx, fin_idx + 1)
  }
}
