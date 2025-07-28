import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';

@Component({
  selector: 'app-qr-multiple',
  imports: [DataframeComponent],
  templateUrl: './qr-multiple.component.html',
  styleUrl: './qr-multiple.component.css'
})
export class QrMultipleComponent {
  all_qr_multiples: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/qr-multiple`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_qr_multiples = JSON.parse(data.values) || [];
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

