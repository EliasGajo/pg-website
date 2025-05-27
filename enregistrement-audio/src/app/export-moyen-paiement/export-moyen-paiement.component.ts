import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-moyen-paiement',
  imports: [DataframeComponent, CommonModule, FormsModule],
  templateUrl: './export-moyen-paiement.component.html',
  styleUrl: './export-moyen-paiement.component.css'
})
export class ExportMoyenPaiementComponent {

  data_filtered: any[] = [];
  immeuble: string = '';
  immeubles: string[] = [];
  data: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.215:8000/moyen-paiement`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(params => {
          this.traductions = params.traductions
          this.data = JSON.parse(params.values) || [];
          this.data_filtered = this.data;
          this.immeubles = Array.from(
            new Set(this.data.map(item => item['NOIMME']))
          ).sort((a, b) => a.localeCompare(b));
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
  }

}

