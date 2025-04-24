import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-tournus-immeuble',
  imports: [CommonModule, FormsModule],
  templateUrl: './tournus-immeuble.component.html',
  styleUrl: './tournus-immeuble.component.css'
})

export class TournusImmeubleComponent {

  data: any[] = [];
  data_filtered: any[] = []; // Les données affichées
  colonnes: string[] = [];
  traductions: {[key:string]:string} = {};
  backend_endpoint: string = '10.209.10.215:8000';
  isLoadingData = false;

  filtres: {
    [colonne: string]: {
      type: 'text' | 'number' | 'date',
      value?: string, // pour les filtres texte
      min?: number | string,
      max?: number | string
    }
  } = {};
  colonne_triee: string = '';
  ordre_tri: 'asc' | 'desc' = 'asc';

  constructor(private zone: NgZone, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.zone.run(() => {
      this.isLoadingData = true;
      fetch(`https://${this.backend_endpoint}/tournus-immeuble`, {
        method: 'GET',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data => {
        this.traductions = data.traductions
        this.data = JSON.parse(data.tournus) || []
        this.data_filtered = this.data;
        if (this.data.length > 0) {
          this.colonnes = Object.keys(this.data[0]); // On récupère les colonnes dynamiquement
        }
        this.initialiser_filtres();
        this.isLoadingData = false;
        this.cdRef.detectChanges();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données : ', error);
        this.isLoadingData = false;
      });
    });
  }

  initialiser_filtres() {
    if (this.data.length === 0) return;
    this.colonnes.forEach(col => {
      const sampleValue = this.data[0][col];
      const type = this.type_detector(sampleValue);
      this.filtres[col] = { type };

      if (type === 'text') {
        this.filtres[col].value = '';
      } else {
        this.filtres[col].min = '';
        this.filtres[col].max = '';
      }
    });
  }

  type_detector(value: any): 'text' | 'number' | 'date' {
    if (typeof value === 'number') return 'number';
    if (!isNaN(Date.parse(value))) return 'date';
    return 'text';
  }

  filtrer() {
    this.data_filtered = this.data.filter(ligne => {
      return this.colonnes.every(col => {
        const filtre = this.filtres[col];
        const valeur = ligne[col];

        if (filtre.type === 'text') {
          const filtre_val = filtre.value?.toLowerCase() || '';
          return filtre_val == '' || valeur?.toString().toLowerCase().includes(filtre_val);
        }

        if (filtre.type === 'number') {
          const valNum = Number(valeur);
          const min = filtre.min ? Number(filtre.min) : -Infinity;
          const max = filtre.max ? Number(filtre.max) : Infinity;
          return !isNaN(valNum) && valNum >= min && valNum <= max;
        }

        if (filtre.type === 'date') {
          const valDate = new Date(valeur);
          const minDate = filtre.min ? new Date(filtre.min) : new Date(-8640000000000000);
          const maxDate = filtre.max ? new Date(filtre.max) : new Date(8640000000000000);
          return valDate >= minDate && valDate <= maxDate;
        }

        return true;
      });
    });
    this.trier(this.colonne_triee, true); // pour garder le tri actif après filtrage
  }

  trier(colonne: string, interne: boolean = false) {
    if (!interne && this.colonne_triee === colonne) {
      this.ordre_tri = this.ordre_tri === 'asc' ? 'desc' : 'asc';
    } else if (!interne) {
      this.colonne_triee = colonne;
      this.ordre_tri = 'asc';
    }

    this.data_filtered.sort((a, b) => {
      const valA = a[colonne];
      const valB = b[colonne];

      if (valA == null) return -1;
      if (valB == null) return 1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.ordre_tri === 'asc' ? valA - valB : valB - valA;
      } else {
        return this.ordre_tri === 'asc'
          ? valA.toString().localeCompare(valB.toString())
          : valB.toString().localeCompare(valA.toString());
      }
    });
  }

  exporterExcel() {
    const data = this.clean_data_for_excel(this.data_filtered);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tournus immeuble');
    const headers = [];
    for (let key of this.colonnes) {
      headers.push(this.traductions[key]);
    }
    worksheet.addRow(headers);

    data.forEach(item => {
      const row = [];
      for (let key of this.colonnes) {
        row.push(item[key]);
      }
      worksheet.addRow(row);
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'tournus_export.xlsx');
    });
  }

  clean_data_for_excel(data_to_clean: any) {
    let cleaned_data: any[] = [];
    for(let i = 0; i < data_to_clean.length; i ++) {
      let item_to_clean = data_to_clean[i];
      let cleaned_item: any = {}
      for(let key in item_to_clean) {
        const value = item_to_clean[key];
        if(value === null || value === undefined) {
          cleaned_item[key] = '';
        } else {
          cleaned_item[key] = value;
        }
      }
      cleaned_data.push(cleaned_item);
    }
    return cleaned_data;
  }

}
