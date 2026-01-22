import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merge-excels',
  imports: [CommonModule],
  templateUrl: './merge-excels.component.html',
  styleUrl: './merge-excels.component.css'
})
export class MergeExcelsComponent {
  file1!: File;
  file2!: File;

  columnsFile1: string[] = [];
  columnsFile2: string[] = [];
  selectedColumnsFile1: string[] = [];
  selectedColumnsFile2: string[] = [];
  dedupColumns: string[] = [];

  previewColumnsFile1: string[] = [];
  previewColumnsFile2: string[] = [];

  constructor() {}

  // Upload fichiers
  onFile1Change(event: any) {
    this.file1 = event.target.files[0];
    this.readColumns(this.file1, 1);
  }

  onFile2Change(event: any) {
    this.file2 = event.target.files[0];
    this.readColumns(this.file2, 2);
  }

  async readColumns(file: File, fileNumber: number) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://10.209.10.213:8000/get-columns', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur serveur');

      const columns: string[] = await response.json();

      if (fileNumber === 1) {
        this.columnsFile1 = columns;
      } else {
        this.columnsFile2 = columns;
      }

    } catch (err: any) {
      alert('Erreur lors de la lecture des colonnes : ' + err.message);
      console.error(err);
    }
  }


  async mergeFiles() {
    if (!this.file1 || !this.file2) {
      alert('Veuillez uploader les deux fichiers.');
      return;
    }

    const formData = new FormData();
    formData.append('file1', this.file1);
    formData.append('file2', this.file2);
    formData.append('columns_file_1', this.selectedColumnsFile1.join(','));
    formData.append('columns_file_2', this.selectedColumnsFile2.join(','));
    formData.append('dedup_columns', this.dedupColumns.join(','));

    try {
      const response = await fetch('https://10.209.10.213:8000/merge-excel', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur serveur');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      alert('Erreur lors de la fusion : ' + err.message);
      console.error(err);
    }
  }

  toggleSelection(event: any, fileNumber: number) {
    const col = event.target.value;
    const checked = event.target.checked;

    let targetArray = fileNumber === 1 ? this.selectedColumnsFile1 : this.selectedColumnsFile2;

    if (checked) {
      targetArray.push(col);
    } else {
      targetArray = targetArray.filter(c => c !== col);
      if (fileNumber === 1) this.selectedColumnsFile1 = targetArray;
      else this.selectedColumnsFile2 = targetArray;
    }
  }

  toggleDedup(event: any) {
    const col = event.target.value;
    const checked = event.target.checked;

    if (checked) this.dedupColumns.push(col);
    else this.dedupColumns = this.dedupColumns.filter(c => c !== col);
  }

  get allColumnsUnique(): string[] {
    const combined = (this.columnsFile1 || []).concat(this.columnsFile2 || []);
    // retourne uniquement les valeurs uniques
    return Array.from(new Set(combined));
  }

}
