import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-export-facture-debiteur',
  imports: [CommonModule, FormsModule],
  templateUrl: './export-facture-debiteur.component.html',
  styleUrl: './export-facture-debiteur.component.css'
})
export class ExportFactureDebiteurComponent {

  data: any[] = [];
  data_filtered: any[] = []; // Les données affichées
  colonnes: string[] = [];
  traductions: {[key:string]:string} = {};
  backend_endpoint: string = '10.209.10.215:8000';
  isLoadingData = false;

  filtres: { [colonne: string]: string } = {};
  colonne_triee: string = '';
  ordre_tri: 'asc' | 'desc' = 'asc';

  constructor(private zone: NgZone, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.zone.run(() => {
      this.isLoadingData = true;
      fetch(`https://${this.backend_endpoint}/facture-debiteur`, {
        method: 'GET',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data => {
        this.traductions = data.traductions
        this.data = JSON.parse(data.factures) || []
        this.data_filtered = this.data;
        if (this.data.length > 0) {
          this.colonnes = Object.keys(this.data[0]); // On récupère les colonnes dynamiquement
        }
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
    this.colonnes.forEach(col => {
      this.filtres[col] = '';
    });
  }

  filtrer() {
    this.data_filtered = this.data.filter(ligne => {
      return this.colonnes.every(col => {
        const filtre = this.filtres[col]?.toLowerCase() || '';
        return filtre == '' || ligne[col]?.toString().toLowerCase().includes(filtre);
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
    const worksheet = workbook.addWorksheet('Factures débiteur');
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
      FileSaver.saveAs(blob, 'factures_export.xlsx');
    });
  }

  exporterExcelAlto() {
    const data = this.clean_data_for_excel(this.data_filtered);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Factures débiteur');
    worksheet.columns = [
      { header: 'Immeuble', key: 'REFGEN', width: 15 },
      { header: 'Factures date', key: 'DATFAC', width: 20 },
      { header: 'Montant HT', key: 'MNTFAC', width: 15 },
      { header: 'Montant TVA', key: 'MNTTVA', width: 15 },
      { header: 'Montant TTC', key: 'MNTTOT', width: 15 },
      { header: 'Propriétaire', key: 'NOMGEN', width: 40 }
    ];
    //const headers = ['Immeuble', 'Factures date', 'Montant HT', 'Montant TVA', 'Montant TTC', 'Propriétaire'];
    //const colonnes = ['REFGEN', 'DATFAC', 'MNTFAC', 'MNTTVA', 'MNTTOT', 'NOMGEN'];
    //worksheet.addRow(headers);
    worksheet.getRow(1).font = { italic: true };
    data.forEach(item => {
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'factures_export.xlsx');
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
