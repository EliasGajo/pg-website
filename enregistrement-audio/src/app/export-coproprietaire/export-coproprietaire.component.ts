import { Component } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-coproprietaire',
  imports: [DataframeComponent, FormsModule],
  templateUrl: './export-coproprietaire.component.html',
  styleUrl: './export-coproprietaire.component.css'
})
export class ExportCoproprietaireComponent {

  data_filtered: any[] = [];
  liste_email: string = "";
  copied = false;

  compute_liste_email() {
    this.liste_email = "";
    for (let data of this.data_filtered) {
      let email = data['NOEMAI'];
      if(email.length > 0){
        if (this.liste_email.length > 0) {
          this.liste_email += ";";
        }
        this.liste_email += email;
      }
    }
  }

  exporter_liste_email() {

  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.compute_liste_email();
  }

  copy_emails_to_clipboard() {
    if (this.liste_email) {
      navigator.clipboard.writeText(this.liste_email).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 3000); // Disparaît après 3s
      });
    }
  }
}
