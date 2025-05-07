import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TournusResult {
  ref: string;
  etage: string;
  designation: string;
  surface: number;
  nb_tournus: number;
}

@Component({
  selector: 'app-tournus-immeuble',
  imports: [DataframeComponent, CommonModule, FormsModule],
  templateUrl: './tournus-immeuble.component.html',
  styleUrl: './tournus-immeuble.component.css'
})

export class TournusImmeubleComponent {

  data_filtered: any[] = [];
  grouped_data: any[] = [];
  immeuble: string = '';
  immeubles: string[] = [];
  dateDebut: string = '';
  dateFin: string = '';
  afficher_historique: boolean = false;
  tournus_result_traductions: {[key:string]:string} = {
    'ref': 'Référence',
    'etage': 'Etage objet',
    'designation': 'Désignation objet',
    'surface': 'Surface',
    'nb_tournus': 'Nb tournus'
  };
  isLoadingData = false;
  all_locataire_data: any[] = [];
  all_locataire_traductions: {[key:string]:string} = {};
  nb_tournus_tot: number = 0;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.run(() => {
        this.isLoadingData = true;
        fetch(`https://10.209.10.215:8000/tournus-immeuble`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.all_locataire_traductions = data.traductions
          this.all_locataire_data = JSON.parse(data.values) || [];
          this.immeubles = Array.from(
            new Set(this.all_locataire_data.map(item => item['NOIMME']))
          ).sort((a, b) => a.localeCompare(b));
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
          this.isLoadingData = false;
        });
    });
  }

  onFiltreChange(new_data: string) {
    this.update_data_filtered(this.compute_immeuble_data(this.immeuble));
  }

  compute_immeuble_data(immeuble: string): any {
    const debut = this.dateDebut ? new Date(this.dateDebut) : false;
    const fin = this.dateFin ? new Date(this.dateFin) : false;
    return this.all_locataire_data.filter(data => {
      const objDebut = data['DADEBA'] ? new Date(data['DADEBA']) : false;
      const objFin = data['DASOAC'] ? new Date(data['DASOAC']) : false;
      const dates_in_interval = (debut ? (objFin ? objFin >= debut : true) : true) && (fin ? (objDebut ? objDebut <= fin : true) : true);
      return data['NOIMME'] === immeuble && dates_in_interval;
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.grouped_data = data_filtered.reduce((acc, obj) => {
      const refLoca = obj["REFFOR"];
      const lastDotIndex = refLoca.lastIndexOf('.') || refLoca.length;
      const refObj = refLoca.substring(0, lastDotIndex);
      const existing_obj = acc.find((elem: TournusResult) => elem.ref === refObj);
      if (!existing_obj) {
        const new_obj: TournusResult = {
          ref: refObj,
          etage: obj['ETAGESD'],
          designation: obj["DEOBJED"],
          surface: obj["SURFOB"],
          nb_tournus: 0
        }
        acc.push(new_obj);
      } else {
        existing_obj.nb_tournus = existing_obj.nb_tournus + 1;
      }
      return acc;
    }, [] as TournusResult[]);
    this.nb_tournus_tot = this.grouped_data.reduce((acc, obj) => acc + obj.nb_tournus, 0);
    console.log(this.grouped_data);
  }

  update_grouped_data_filtered(grouped_data_filtered: any[]) {
    console.log(grouped_data_filtered);
  }

  display_historique() {
    this.afficher_historique = !this.afficher_historique;
  }

}
