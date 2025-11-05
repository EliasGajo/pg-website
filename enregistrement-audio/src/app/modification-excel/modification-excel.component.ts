import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-modification-excel',
  imports: [],
  templateUrl: './modification-excel.component.html',
  styleUrl: './modification-excel.component.css'
})
export class ModificationExcelComponent {
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
}
