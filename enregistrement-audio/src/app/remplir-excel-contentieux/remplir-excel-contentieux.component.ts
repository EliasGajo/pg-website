import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-remplir-excel-contentieux',
  imports: [],
  templateUrl: './remplir-excel-contentieux.component.html',
  styleUrl: './remplir-excel-contentieux.component.css'
})
export class RemplirExcelContentieuxComponent {
  workbook: XLSX.WorkBook | null = null;

  // Quand l'utilisateur charge un fichier
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      this.workbook = XLSX.read(data, { type: 'array' });
    };
    reader.readAsArrayBuffer(file);
  }

  // Séparer chaque onglet en fichier Excel distinct
  showSheets() {
    if (!this.workbook) return;

    var sheets: string[] = [];

    this.workbook.SheetNames.forEach((sheetName, index) => {
      sheets.push(sheetName);
    });
    console.log(sheets.join("\n"));
  }
}
