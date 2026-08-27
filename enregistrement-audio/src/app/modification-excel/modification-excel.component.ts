import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-modification-excel',
  imports: [CommonModule, RouterLink, DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './modification-excel.component.html',
  styleUrl: './modification-excel.component.css'
})
export class ModificationExcelComponent {
  workbook: XLSX.WorkBook | null = null;
  onglets: string[] = [];
  ongletsSelectionnes: string[] = [];
  colonnes: string[] = [];
  colonnesSelectionnees: string[] = [];
  data: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};
  email_columns: string[] = [""];

  workbook2: XLSX.WorkBook | null = null;
  onglets2: string[] = [];
  ongletsSelectionnes2: string[] = [];
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
      this.onglets = [...this.workbook.SheetNames];
      this.ongletsSelectionnes = this.onglets.length ? [this.onglets[0]] : [];
      this.colonnesSelectionnees = [];

      // 🔥 Transformation en tableau d’objets
      this.data = XLSX.utils.sheet_to_json(worksheet, {
        defval: null
      });
      this.importerOngletsSelectionnes();
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
      this.onglets2 = [...this.workbook2.SheetNames];
      this.ongletsSelectionnes2 = this.onglets2.length ? [this.onglets2[0]] : [];
      this.colonnesSelectionnees2 = [];

      // 🔥 Transformation en tableau d’objets
      this.data2 = XLSX.utils.sheet_to_json(worksheet, {
        defval: null
      });
      this.importerOngletsSelectionnes2();
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
    return (data[0] as string[] | undefined)?.filter((col): col is string => typeof col === 'string' && Boolean(col)) ?? [];
  }

  toggleOnglet(onglet: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.ongletsSelectionnes = checked
      ? [...this.ongletsSelectionnes, onglet]
      : this.ongletsSelectionnes.filter(name => name !== onglet);
    this.importerOngletsSelectionnes();
  }

  toggleTousLesOnglets(event: Event) {
    this.ongletsSelectionnes = (event.target as HTMLInputElement).checked ? [...this.onglets] : [];
    this.importerOngletsSelectionnes();
  }

  toggleOnglet2(onglet: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.ongletsSelectionnes2 = checked
      ? [...this.ongletsSelectionnes2, onglet]
      : this.ongletsSelectionnes2.filter(name => name !== onglet);
    this.importerOngletsSelectionnes2();
  }

  toggleTousLesOnglets2(event: Event) {
    this.ongletsSelectionnes2 = (event.target as HTMLInputElement).checked ? [...this.onglets2] : [];
    this.importerOngletsSelectionnes2();
  }

  private importerOngletsSelectionnes() {
    const contenu = this.lireOnglets(this.workbook, this.ongletsSelectionnes);
    this.data = contenu.data;
    this.colonnes = contenu.colonnes;
  }

  private importerOngletsSelectionnes2() {
    const contenu = this.lireOnglets(this.workbook2, this.ongletsSelectionnes2);
    this.data2 = contenu.data;
    this.colonnes2 = contenu.colonnes;
  }

  private lireOnglets(workbook: XLSX.WorkBook | null, ongletsSelectionnes: string[]) {
    if (!workbook) return { data: [] as any[], colonnes: [] as string[] };

    const colonnes = new Set<string>();
    const data = ongletsSelectionnes.flatMap(nomOnglet => {
      this.getColonnes(workbook, nomOnglet).forEach(colonne => colonnes.add(colonne));
      return XLSX.utils.sheet_to_json<any>(workbook.Sheets[nomOnglet], { defval: null });
    });
    return { data, colonnes: Array.from(colonnes) };
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
    const data = this.lireOnglets(this.workbook, this.ongletsSelectionnes).data;

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

    const data = this.lireOnglets(this.workbook, this.ongletsSelectionnes).data;
    const data2 = this.lireOnglets(this.workbook2, this.ongletsSelectionnes2).data;

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
