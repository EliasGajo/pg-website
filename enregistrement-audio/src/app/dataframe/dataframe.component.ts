import { Component, NgZone, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-dataframe',
  imports: [CommonModule, FormsModule],
  templateUrl: './dataframe.component.html',
  styleUrl: './dataframe.component.css'
})
export class DataframeComponent {

  data: any[] = [];
  data_filtered: any[] = []; // Les données affichées
  @Output() data_filtered_update = new EventEmitter<any[]>();
  colonnes: string[] = [];
  traductions: {[key:string]:string} = {};
  backend_endpoint: string = '10.209.10.215:8000';
  @Input() fetch_data_url: string = '';
  @Input() data_to_load: any[] = [];
  @Input() traductions_to_load: {[key:string]:string} = {};
  @Input() export_title: string = '';
  isLoadingData = false;
  @Input() table_max_height: string = '900px';

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

  constructor(private zone: NgZone, private cdRef: ChangeDetectorRef, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
      if(this.fetch_data_url) {
        this.isLoadingData = true;
        fetch(`https://${this.backend_endpoint}/${this.fetch_data_url}`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.init_data(JSON.parse(data.values) || []);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
          this.isLoadingData = false;
        });
      } else if(this.data_to_load) {
          this.traductions = this.traductions_to_load;
          this.init_data(this.data_to_load);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data_to_load']) {
      const newData = changes['data_to_load'].currentValue;
      this.init_data(newData);
    }
    else if (changes['traductions_to_load']) {
      const newData = changes['traductions_to_load'].currentValue;
      this.traductions = newData;
    }
  }

  init_data(data_to_init: any[]) {
    this.data = data_to_init;
    this.data_filtered = this.data;
    this.data_filtered_update.emit(this.data_filtered);
    if (this.data.length > 0) {
      this.colonnes = Object.keys(this.data[0]); // On récupère les colonnes dynamiquement
    }
    this.initialiser_filtres();
    this.isLoadingData = false;
    this.cdRef.detectChanges();
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
    if(value) {
      if (typeof value === 'number') return 'number';
      if (this.isProbablyDate(value)) return 'date';
    }
    return 'text';
  }

  isProbablyDate(value: string): boolean {
    const trimmed = value.trim();
  
    // N'autorise que chiffres, tirets, barres, espaces et deux-points (ex: pour l'heure)
    const allowedDateChars = /^[\d\s:\/\-]+$/;
  
    // Vérifie que la chaîne ne contient *que* des caractères valides
    if (!allowedDateChars.test(trimmed)) {
      return false;
    }
  
    // Vérifie que le parsing donne un timestamp valide
    const parsed = Date.parse(trimmed);
    return !isNaN(parsed);
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
    this.data_filtered_update.emit(this.data_filtered);
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
    this.data_filtered_update.emit(this.data_filtered);
  }

  exporterExcel() {
    this.exportExcelService.exporter_table(this.data_filtered, this.export_title, this.traductions);
  }

}
