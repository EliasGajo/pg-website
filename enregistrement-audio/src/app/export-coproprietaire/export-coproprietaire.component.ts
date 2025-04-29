import { Component } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';

@Component({
  selector: 'app-export-coproprietaire',
  imports: [DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './export-coproprietaire.component.html',
  styleUrl: './export-coproprietaire.component.css'
})
export class ExportCoproprietaireComponent {

  data_filtered: any[] = [];
  liste_email: any[] = [];

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.liste_email = data_filtered.map(item => item["NOEMAI"]);
  }
}
