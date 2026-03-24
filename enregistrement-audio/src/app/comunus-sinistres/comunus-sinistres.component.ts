import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';

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

}

