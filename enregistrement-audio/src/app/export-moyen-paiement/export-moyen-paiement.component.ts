import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-moyen-paiement',
  imports: [DataframeComponent, CommonModule, FormsModule, EmailsPublipostageComponent],
  templateUrl: './export-moyen-paiement.component.html',
  styleUrl: './export-moyen-paiement.component.css'
})
export class ExportMoyenPaiementComponent {

  data_filtered: any[] = [];
  immeuble: string = '';
  immeubles: string[] = [];
  mode_paiement: string = '';
  mode_paiements: string[] = [];
  data: any[] = [];
  liste_email: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/moyen-paiement`, {
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
          this.mode_paiements = Array.from(
            new Set(this.data.map(item => item['MOYPAID'] ? item['MOYPAID'] : ""))
          ).sort((a, b) => a.localeCompare(b));
          console.log(this.mode_paiements);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.liste_email = data_filtered.map(item => item["NOEMAI"]);
  }

  onFiltreChange(new_data: string) {
    this.update_data_filtered(this.compute_immeuble_data(this.immeuble, this.mode_paiement));
  }

  compute_immeuble_data(immeuble: string, mode_paiement: string): any {
    var immeuble_data: any[] = immeuble && immeuble.length > 0 ? this.data.filter(item => item['NOIMME'] === immeuble) : this.data;
    immeuble_data = mode_paiement && mode_paiement.length > 0 ? immeuble_data.filter(item => item['MOYPAID'] === mode_paiement) : immeuble_data;
    return immeuble_data;
  }

}

