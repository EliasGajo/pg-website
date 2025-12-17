import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-contentieux',
  imports: [DataframeComponent],
  templateUrl: './export-contentieux.component.html',
  styleUrl: './export-contentieux.component.css'
})
export class ExportContentieuxComponent {
  all_contentieux: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/contentieux`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_contentieux = JSON.parse(data.values) || [];
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

  compute_nombre_par_immeuble() {

    const immeubles = Array.from(new Set(this.data_filtered.map(c => c['NOIMME'])));

    const locatairesParImmeuble: { [key: string]: string[] } = {};

    immeubles.forEach(immeuble => {
      locatairesParImmeuble[immeuble] = this.data_filtered
        .filter(c => c['NOIMME'] === immeuble)
        .map(c => c['NOMLOS']);
    });

    // 2️⃣ Trouver le nombre maximum de locataires pour équilibrer les lignes
    const maxLocataires = Math.max(...Object.values(locatairesParImmeuble).map(l => l.length));

    // 3️⃣ Construire le tableau pour Excel
    const tableauExcel: any[] = [];

    for (let i = 0; i < maxLocataires; i++) {
      const ligne: any = {};
      immeubles.forEach(immeuble => {
        ligne[immeuble] = locatairesParImmeuble[immeuble][i] || ''; // vide si pas de locataire
      });
      tableauExcel.push(ligne);
    }

    // 4️⃣ Ajouter la ligne total
    const total: any = {};
    immeubles.forEach(immeuble => {
      total[immeuble] = locatairesParImmeuble[immeuble].length;
    });
    tableauExcel.push(total);

    this.exportExcelService.exporter_table(this.pivoterTableau(tableauExcel), 'Contentieux par immeuble');
  }

  pivoterTableau(tableau: any[]): any[] {
    if (!tableau || tableau.length === 0) return [];

    // Colonnes d'origine (immeubles)
    const colonnes = Object.keys(tableau[0]);

    const tableauPivote: any[] = [];
    const derniereLigneIndex = tableau.length - 1;

    colonnes.forEach(colonne => {
      const ligne: any = { Immeuble: colonne };

      tableau.forEach((row, index) => {
        const nomColonne =
          index === derniereLigneIndex
            ? 'Total'
            : `Locataire ${index + 1}`;

        ligne[nomColonne] = row[colonne];
      });

      tableauPivote.push(ligne);
    });

    return tableauPivote;
  }
}

