import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-comunus-vacants',
  imports: [DataframeComponent],
  templateUrl: './comunus-vacants.component.html',
  styleUrl: './comunus-vacants.component.css'
})
export class ComunusVacantsComponent {

  all_vacants: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/comunus-vacants`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_vacants = JSON.parse(data.values) || [];
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
  }

  update_traductions(new_traductions: {[key:string]:string}) {
    this.traductions = new_traductions;
  }

  exporter_avec_modele() {
    const fileName: string = 'vacants.xlsx';
    const payload = {
      data: this.data_filtered,
      template_name: 'modele/comunus/vacants.xlsx',
      start_row: 6,
      rules: [
        {
          condition: { field: "Travaux désignation", operator: "not_empty" },
          color: "#FBE2D5"
        },
        {
          condition: { field: "Début", operator: "not_empty" },
          color: "#92D050"
        },
        {
          condition: { operator: "else" },
          color: "#FF0000"
        }
      ]
    };

    fetch('https://10.209.10.213:8000/export-excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur serveur ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      FileSaver.saveAs(blob, fileName);
    })
    .catch(err => {
      console.error('Erreur export Excel', err);
    });
  }
}


