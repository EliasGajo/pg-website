import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';

@Component({
  selector: 'app-export-document',
  imports: [DataframeComponent],
  templateUrl: './export-document.component.html',
  styleUrl: './export-document.component.css'
})
export class ExportDocumentComponent {
  all_documents: any[] = [];
  all_locataire: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};
  traductions_locataire: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/document`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_documents = JSON.parse(data.values) || [];
          this.joinDocumentsWithLocataires();
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });

    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/locataire`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions_locataire = data.traductions
          this.all_locataire = JSON.parse(data.values) || [];
          this.joinDocumentsWithLocataires();
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  private joinDocumentsWithLocataires(): void {
    if (!this.all_documents?.length || !this.all_locataire?.length) {
      return;
    }

    const locataireMap = new Map<string, any>();

    // Construction de la Map (clé normalisée)
    for (const loc of this.all_locataire) {
      const key = this.normalizeKey(loc.REFFOR);
      if (key && !locataireMap.has(key)) {
        locataireMap.set(key, loc);
      }
    }

    // Jointure + ajout des colonnes voulues
    this.all_documents = this.all_documents.map(doc => {
      const loc = locataireMap.get(this.normalizeKey(doc.LETTRE_DESI));

      return {
        ...doc,
        'Immeuble': loc?.NOIMME ?? null,
        'Nom locataire': loc?.NOLOCO ?? null
      };
    });
  }

  private normalizeKey(value: string): string {
    if (!value) return '';

    return value
      .replace(/\s+/g, '')          // enlève tous les espaces
      .split('.')                   // découpe en blocs
      .map(part => String(Number(part))) // supprime zéros non significatifs
      .join('.');
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
  }

  update_traductions(new_traductions: {[key:string]:string}) {
    this.traductions = new_traductions;
  }
}

