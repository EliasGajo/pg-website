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
  liste_email: any[] = [];
  email_str: string = "";
  copied = false;

  compute_liste_email() {
    this.liste_email = [];
    
  }

  compute_email_str() {
    this.email_str = "";
    for (let data of this.data_filtered) {
      let email = data['NOEMAI'];
      if(email.length > 0){
        if (this.email_str.length > 0) {
          this.email_str += ";";
        }
        this.email_str += email;
      }
    }
  }

  exporter_liste_email() {

  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.compute_liste_email();
    this.compute_email_str()
  }

  copy_emails_to_clipboard() {
    if (this.liste_email) {
      navigator.clipboard.writeText(this.email_str).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 3000); // Disparaît après 3s
      });
    }
  }
}
