import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-modification-excel',
  imports: [CommonModule, DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './modification-excel.component.html',
  styleUrl: './modification-excel.component.css'
})
export class ModificationExcelComponent {
  workbook: XLSX.WorkBook | null = null;
  colonnes: string[] = [];
  colonnesSelectionnees: string[] = [];
  data: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};
  email_columns: string[] = [""];

  // Quand l'utilisateur charge un fichier
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      this.workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = this.workbook.SheetNames[0];
      const worksheet = this.workbook.Sheets[firstSheetName];

      // 🔥 Transformation en tableau d’objets
      this.data = XLSX.utils.sheet_to_json(worksheet, {
        defval: null
      });
    };
    reader.readAsArrayBuffer(file);
  }

  // Séparer chaque onglet en fichier Excel distinct
  splitSheets() {
    if (!this.workbook) return;

    this.workbook.SheetNames.forEach((sheetName, index) => {
      const sheet = this.workbook!.Sheets[sheetName];
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, sheet, sheetName);
      const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });

      setTimeout(() => {
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${sheetName}.xlsx`);
      }, index * 200); // 200 ms de délai entre chaque téléchargement
    });
  }

  getColonnes(workbook: XLSX.WorkBook, sheetName: string): string[] {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

    // première ligne = en-têtes
    return data[0] as string[];
  }

  toggleColonne(col: string, event: any) {
    if (event.target.checked) {
      this.colonnesSelectionnees.push(col);
    } else {
      this.colonnesSelectionnees =
        this.colonnesSelectionnees.filter(c => c !== col);
    }
  }

  supprimerDoublons() {
    if (!this.workbook) return;
    if (this.colonnesSelectionnees.length === 0) {
      alert('Veuillez sélectionner au moins une colonne');
      return;
    }
    const sheetName = this.workbook.SheetNames[0];
    const worksheet = this.workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json<any>(worksheet);

    const uniqueRows = new Map<string, any>();

    data.forEach(row => {
      // clé basée uniquement sur les colonnes choisies
      const key = this.colonnesSelectionnees
        .map(col => row[col])
        .join('|');

      if (!uniqueRows.has(key)) {
        uniqueRows.set(key, row);
      }
    });

    const newData = Array.from(uniqueRows.values());

    this.genererNouveauExcel(newData, "excel_épuré.xlsx", "sans doublons");
  }

  genererNouveauExcel(data: any[], file_name: string, sheet_name: string) {
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook: XLSX.WorkBook = {
      Sheets: { [sheet_name]: newWorksheet },
      SheetNames: [sheet_name]
    };

    XLSX.writeFile(newWorkbook, file_name);
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
  }
}
