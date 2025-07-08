import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-divers-debiteur',
  imports: [DataframeComponent],
  templateUrl: './export-divers-debiteur.component.html',
  styleUrl: './export-divers-debiteur.component.css'
})
export class ExportDiversDebiteurComponent {
  all_divers: any[] = [];
  all_divers_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/divers-debiteur`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_divers = JSON.parse(data.values) || [];
          this.all_divers_filtered = this.all_divers;
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.all_divers_filtered = data_filtered;
  }

  update_traductions(new_traductions: {[key:string]:string}) {
    this.traductions = new_traductions;
  }
}

