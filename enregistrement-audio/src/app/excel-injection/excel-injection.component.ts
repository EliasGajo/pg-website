import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel-injection',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './excel-injection.component.html',
  styleUrl: './excel-injection.component.css'
})
export class ExcelInjectionComponent {

  @Input() data: any[] = [];

  // Colonnes DATA (backend)
  availableColumns: string[] = [];

  // Colonnes EXCEL
  excelColumns: string[] = [];

  // Mapping dynamique de référence pour matching : Excel ← Data
  referenceMappings: { excelColumn: string; dataColumn: string }[] = [];

  // Mapping dynamique Excel ← Data pour l’injection
  columnMappings: { excelColumn: string; dataColumn: string }[] = [];

  workbook!: XLSX.WorkBook;
  worksheet!: XLSX.WorkSheet;
  fileName: string = '';

  matchErrors: any[] = [];

  // ===============================
  // Chargement du fichier Excel
  // ===============================
  onFileChange(event: any): void {

    const target: DataTransfer = event.target;
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    this.fileName = target.files[0].name;

    reader.onload = (e: any) => {

      const binaryStr: string = e.target.result;
      this.workbook = XLSX.read(binaryStr, { type: 'binary' });

      const sheetName = this.workbook.SheetNames[0];
      this.worksheet = this.workbook.Sheets[sheetName];

      const excelJson = XLSX.utils.sheet_to_json<Record<string, any>>(
        this.worksheet,
        { defval: '' }
      );

      if (excelJson.length > 0) {
        this.excelColumns = Object.keys(excelJson[0]);
      }

      if (this.data.length > 0) {
        this.availableColumns = Object.keys(this.data[0]);
      }

      // Reset config si nouveau fichier
      this.referenceMappings = [];
      this.columnMappings = [];
      this.matchErrors = [];
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // ===============================
  // Injection par matching + mapping
  // ===============================
  injectByMatching(): void {

    if (!this.worksheet) return;
    if (!this.isReferenceMappingValid()) return;
    if (!this.isMappingValid()) return;

    this.matchErrors = [];

    const excelRows = XLSX.utils.sheet_to_json<Record<string, any>>(
      this.worksheet,
      { defval: '' }
    );

    // 🔥 Index des données pour performance O(n)
    const dataIndex = new Map<string, any>();

    this.data.forEach(row => {
      const key = this.buildReferenceDataKey(row, this.referenceMappings);
      if (!dataIndex.has(key)) {
        dataIndex.set(key, row);
      } else {
        console.log("doublon");
      }
    });

    // 🔥 Matching
    excelRows.forEach((excelRow, index) => {

      const key = this.buildReferenceExcelKey(excelRow, this.referenceMappings);
      const matchedRow = dataIndex.get(key);

      if (!matchedRow) {
        this.matchErrors.push({
          row: index + 2,
          reason: 'Aucun match ou match multiple'
        });
        return;
      }

      // 🔥 Injection via mapping dynamique
      this.columnMappings.forEach(mapping => {
        if (!mapping.excelColumn || !mapping.dataColumn) return;
        excelRow[mapping.excelColumn] = matchedRow[mapping.dataColumn] ?? '';
      });

    });

    // 🔥 Reconstruction feuille
    const newSheet = XLSX.utils.json_to_sheet(excelRows);
    this.workbook.Sheets[this.workbook.SheetNames[0]] = newSheet;

    const newFile = XLSX.write(this.workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([newFile], {
      type: 'application/octet-stream'
    });

    saveAs(blob, 'excel_modifie.xlsx');

    console.log('Injection terminée');
    console.log('Erreurs de matching :', this.matchErrors);
  }

  // ===============================
  // Validation mapping injection
  // ===============================
  public isMappingValid(): boolean {
    if (this.columnMappings.length === 0) return false;
    return this.columnMappings.every(m =>
      m.excelColumn.trim() !== '' &&
      m.dataColumn.trim() !== ''
    );
  }

  // ===============================
  // Validation mapping référence
  // ===============================
  public isReferenceMappingValid(): boolean {
    if (this.referenceMappings.length === 0) return false;
    return this.referenceMappings.every(m =>
      m.excelColumn.trim() !== '' &&
      m.dataColumn.trim() !== ''
    );
  }

  // ===============================
  // Création clé composite pour matching
  // ===============================
  private buildReferenceDataKey(row: any, mapping: { excelColumn: string; dataColumn: string }[]): string {
    return mapping.map(m => (row[m.dataColumn] ?? '').toString().trim()).join('|');
  }
  private buildReferenceExcelKey(row: any, mapping: { excelColumn: string; dataColumn: string }[]): string {
    return mapping.map(m => (row[m.excelColumn] ?? '').toString().trim()).join('|');
  }

  // ===============================
  // Gestion mapping injection UI
  // ===============================
  addMapping(): void {
    this.columnMappings.push({
      excelColumn: '',
      dataColumn: ''
    });
  }

  removeMapping(index: number): void {
    this.columnMappings.splice(index, 1);
  }

  // ===============================
  // Gestion mapping référence UI
  // ===============================
  addReferenceMapping(): void {
    this.referenceMappings.push({
      excelColumn: '',
      dataColumn: ''
    });
  }

  removeReferenceMapping(index: number): void {
    this.referenceMappings.splice(index, 1);
  }

}