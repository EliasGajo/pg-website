import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-generator',
  imports: [FormsModule],
  templateUrl: './email-generator.component.html',
  styleUrl: './email-generator.component.css'
})
export class EmailGeneratorComponent {
  @Input() text_brut: string = ''; // Reçoit le transcript du service
  resultat: string = '';
  backend_endpoint: string = '10.209.10.215:8000';

  generer_email() {
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
