import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-locataire',
  imports: [DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './export-locataire.component.html',
  styleUrl: './export-locataire.component.css'
})
export class ExportLocataireComponent {
  all_locataire: any[] = [];
  all_locataire_actif: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};
  email_columns: string[] = ["NOEMAI"];

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/locataire`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_locataire = JSON.parse(data.values) || [];
          var date_du_jour = new Date();
          this.all_locataire_actif = this.all_locataire.filter(locataire => !locataire['DAFIMA'] || new Date(locataire['DAFIMA']) > date_du_jour);
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

  export_locataires_non_groupes() {
    const reference_counts: { [key: string]: number } = {};
    this.data_filtered.forEach(item => {
      const key = `${item['REIMME']}-${item['NOLOCO']}`;
      reference_counts[key] = (reference_counts[key] || 0) + 1;
    });

    // Filtrer les locataires avec au moins 2 occurrences
    const locataires_multi = this.data_filtered.filter(item => {
      const key = `${item['REIMME']}-${item['NOLOCO']}`;
      return reference_counts[key] >= 2 && item['LOVACA'] == false;
    });

    const references_present = new Set<string>();
    const locataires_multi_unique = locataires_multi.filter(item => {
      const key = `${item['REIMME']}-${item['NOLOCO']}`;
      if (references_present.has(key)) {
        return false;
      }
      references_present.add(key);
      return true;
    });

    this.exportExcelService.exporter_table(locataires_multi_unique, `Locataires multi`, this.traductions);
  }
}
