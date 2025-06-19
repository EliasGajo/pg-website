import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';

@Component({
  selector: 'app-export-locataire',
  imports: [DataframeComponent],
  templateUrl: './export-locataire.component.html',
  styleUrl: './export-locataire.component.css'
})
export class ExportLocataireComponent {
  all_locataire: any[] = [];
  all_locataire_actif: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/locataire`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_locataire = JSON.parse(data.values) || [];
          var date_du_jour = new Date();
          this.all_locataire_actif = this.all_locataire.filter(locataire => !locataire['DAFIMA'] || new Date(locataire['DAFIMA']) > date_du_jour);
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
}
