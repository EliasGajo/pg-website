import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-locataire-export-grille',
  imports: [DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './locataire-export-grille.component.html',
  styleUrl: './locataire-export-grille.component.css'
})
export class LocataireExportGrilleComponent {
  all_locataire: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/locataire-export-grille`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_locataire = JSON.parse(data.values) || [];
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
      const key = `${item['Immeuble']}-${item['Zone recherche']}`;
      reference_counts[key] = (reference_counts[key] || 0) + 1;
    });

    // Filtrer les locataires avec au moins 2 occurrences
    const locataires_multi = this.data_filtered.filter(item => {
      const key = `${item['Immeuble']}-${item['Zone recherche']}`;
      return reference_counts[key] >= 2 && item['Nom'] != 'V A C A N T';
    });

    const references_present = new Set<string>();
    const locataires_multi_unique = locataires_multi.filter(item => {
      const key = `${item['Immeuble']}-${item['Zone recherche']}`;
      if (references_present.has(key)) {
        return false;
      }
      references_present.add(key);
      return true;
    });

    const locataires_multi_unique_non_groupe = locataires_multi_unique.filter(item => !item['Groupé']);

    this.exportExcelService.exporter_table(locataires_multi_unique_non_groupe, `Locataires multi`, this.traductions);
  }
}

