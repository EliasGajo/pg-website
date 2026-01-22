import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-merge-excels',
  imports: [CommonModule, FormsModule],
  templateUrl: './merge-excels.component.html',
  styleUrl: './merge-excels.component.css'
})
export class MergeExcelsComponent {
  file1!: File;
  file2!: File;

  columnsFile1: { name: string; position?: number }[] = [];
  columnsFile2: { name: string; position?: number }[] = [];
  selectedColumnsFile1: string[] = [];
  selectedColumnsFile2: string[] = [];
  dedupColumns: string[] = [];

  previewColumnsFile1: string[] = [];
  previewColumnsFile2: string[] = [];

  finalColumnsOrdered: { name: string; fileSource: 1 | 2; dedup?: boolean }[] = [];

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

      const data: string[] = await response.json();

      const mapped = data.map(name => ({ name, position: undefined }));

      if (fileNumber === 1) {
        this.columnsFile1 = mapped;
      } else {
        this.columnsFile2 = mapped;
      }

    } catch (err: any) {
      alert('Erreur lors de la lecture des colonnes : ' + err.message);
      console.error(err);
    }
  }

  getFinalColumnsOrdered() {
    // Combine toutes les colonnes numérotées des 2 fichiers
    const allCols: { name: string; position: number; fileSource: 1 | 2 }[] = [];

    this.columnsFile1.forEach(c => {
      if (c.position) allCols.push({ name: c.name, position: c.position, fileSource: 1 });
    });

    this.columnsFile2.forEach(c => {
      if (c.position) allCols.push({ name: c.name, position: c.position, fileSource: 2 });
    });

    // Grouper par position
    const byPosition = new Map<number, { position: number; name: string; file1_name?: string; file2_name?: string }>();

    allCols.forEach(col => {
      if (!byPosition.has(col.position)) {
        byPosition.set(col.position, { position: col.position, name: '', file1_name: undefined, file2_name: undefined });
      }
      const entry = byPosition.get(col.position)!;
      if (col.fileSource === 1) {
        entry.file1_name = col.name;
        entry.name = col.name; // priorité fichier 1 pour le nom final
      } else {
        entry.file2_name = col.name;
        // ne change pas entry.name si fichier1 présent
        if (!entry.name) entry.name = col.name;
      }
    });

    // Retourner en ordre de position
    return Array.from(byPosition.values()).sort((a, b) => a.position - b.position);
  }

  async mergeFiles() {
    if (!this.file1 || !this.file2) {
      alert('Veuillez uploader les deux fichiers.');
      return;
    }

    const formData = new FormData();
    formData.append('file1', this.file1);
    formData.append('file2', this.file2);
    const finalColumnsOrdered = this.getFinalColumnsOrdered();
    formData.append('final_columns_ordered', JSON.stringify(finalColumnsOrdered));
    formData.append('dedup_columns', this.dedupColumnsToSend.join(','));

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

  toggleDedup(col: { name: string; dedup?: boolean }) {
    col.dedup = !col.dedup;
  }

  get dedupColumnsToSend(): string[] {
    return this.finalColumnsOrdered.filter(c => c.dedup).map(c => c.name);
  }

  updateFinalColumns() {
    const byPosition = new Map<number, {
      name: string;
      position: number;
      fileSource: 1 | 2;
      dedup: boolean;
    }>();

    // 1️⃣ Fichier 1 → priorité absolue
    this.columnsFile1.forEach(c => {
      if (c.position && c.position > 0) {
        byPosition.set(c.position, {
          name: c.name,
          position: c.position,
          fileSource: 1,
          dedup: false
        });
      }
    });

    // 2️⃣ Fichier 2 → seulement si la position n'existe pas déjà
    this.columnsFile2.forEach(c => {
      if (c.position && c.position > 0 && !byPosition.has(c.position)) {
        byPosition.set(c.position, {
          name: c.name,
          position: c.position,
          fileSource: 2,
          dedup: false
        });
      }
    });

    // 3️⃣ Résultat final ordonné
    this.finalColumnsOrdered = Array
      .from(byPosition.values())
      .sort((a, b) => a.position - b.position);
  }

  // Appeler cette fonction quand l’utilisateur change la position
  onPositionChange() {
    this.updateFinalColumns();
  }

}
