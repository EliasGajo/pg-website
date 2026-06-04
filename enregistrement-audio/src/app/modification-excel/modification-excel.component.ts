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

  workbook2: XLSX.WorkBook | null = null;
  data2: any[] = [];
  colonnes2: string[] = [];
  colonnesSelectionnees2: string[] = [];

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

      this.colonnes = this.getColonnes(this.workbook, firstSheetName);

      // 🔥 Transformation en tableau d’objets
      this.data = XLSX.utils.sheet_to_json(worksheet, {
        defval: null
      });
    };
    reader.readAsArrayBuffer(file);
  }

  onFile2Change(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      this.workbook2 = XLSX.read(data, { type: 'array' });

      const firstSheetName = this.workbook2.SheetNames[0];
      const worksheet = this.workbook2.Sheets[firstSheetName];

      this.colonnes2 = this.getColonnes(this.workbook2, firstSheetName);

      // 🔥 Transformation en tableau d’objets
      this.data2 = XLSX.utils.sheet_to_json(worksheet, {
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

  toggleColonne2(col: string, event: any) {
    if (event.target.checked) {
      this.colonnesSelectionnees2.push(col);
    } else {
      this.colonnesSelectionnees2 =
        this.colonnesSelectionnees2.filter(c => c !== col);
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

  supprimerDoublons2() {
    if (!this.workbook || !this.workbook2) return;

    if (this.colonnesSelectionnees.length === 0 || this.colonnesSelectionnees2.length === 0) {
      alert('Veuillez sélectionner au moins une colonne dans chaque fichier');
      return;
    }

    const sheetName = this.workbook.SheetNames[0];
    const worksheet = this.workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(worksheet);

    const sheetName2 = this.workbook2.SheetNames[0];
    const worksheet2 = this.workbook2.Sheets[sheetName2];
    const data2 = XLSX.utils.sheet_to_json<any>(worksheet2);

    // 1. Construire un Set des clés de data2
    const keysData2 = new Set<string>();

    data2.forEach(row => {
      const key = this.colonnesSelectionnees2
        .map(col => row[col])
        .join('|');

      keysData2.add(key);
    });

    // 2. Filtrer data en excluant ceux présents dans data2
    const filteredData = data.filter(row => {
      const key = this.colonnesSelectionnees
        .map(col => row[col])
        .join('|');

      return !keysData2.has(key);
    });

    // 3. Générer le nouveau fichier
    this.genererNouveauExcel(filteredData, "excel_sans_doublons_entre_fichiers.xlsx", "diff");
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
