import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-comunus-sinistres',
  imports: [DataframeComponent],
  templateUrl: './comunus-sinistres.component.html',
  styleUrl: './comunus-sinistres.component.css'
})
export class ComunusSinistresComponent {

  all_sinistres: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};
  traductions_locataire: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/comunus-sinistres`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_sinistres = JSON.parse(data.values) || [];
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
    const fileName: string = 'sinistres.xlsx';
    const payload = {
      data: this.data_filtered,
      template_name: 'modele/comunus/sinistres.xlsx',
      start_row: 5,
      rules: [
        {
          condition: { field: " Assurance Date du rbt ", operator: "not_empty" },
          color: "#C4D79B"
        },
        {
          condition: { operator: "else" },
          color: "#FCD5B4"
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

