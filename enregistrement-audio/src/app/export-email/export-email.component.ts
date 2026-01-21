import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-email',
  imports: [DataframeComponent],
  templateUrl: './export-email.component.html',
  styleUrl: './export-email.component.css'
})
export class ExportEmailComponent {
  all_email_data: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/export-email`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_email_data = JSON.parse(data.values) || [];
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
  }

  update_traductions(new_traductions: {[key:string]:string}) {
    this.traductions = new_traductions;
  }

  export_concept_b180() {
    var email_nom_prenom = this.data_filtered.map(data => {
      var email: string = data['De: (adresse)'] || '';

      const nom_email: string = data['De: (nom)'] || '';
      var nom = '';
      var prenom = '';

      if(email == "wordpress@concept-b180.ch"){
        const body: string =
          data['Corps'] || '';

        const nomMatch = body.match(/Nom\s*:\s*([^\n\r]+)/i);
        const prenomMatch = body.match(/Pr[eé]nom\s*:\s*([^\n\r]+)/i);
        const emailMatch = body.match(
          /From\s*:\s*.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
        );
        nom = nomMatch ? nomMatch[1].trim() : nom;
        prenom = prenomMatch ? prenomMatch[1].trim() : prenom;
        email = emailMatch ? emailMatch[1].trim() : email;
      }

      return {
        email,
        nom_email,
        nom_extrait: nom,
        prenom_extrait: prenom
      };
    });
    this.exportExcelService.exporter_table(email_nom_prenom, 'Email nom prenom', this.traductions);
  }
}

