import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportExcelService } from '../services/export-excel.service';

interface TournusResult {
  ref: string;
  etage: string;
  designation: string;
  locataires: string;
  nb_tournus: number;
}

interface SumTournus {
  year: string;
  count: number;
}

@Component({
  selector: 'app-tournus-immeuble',
  imports: [DataframeComponent, MultiSelectComponent, CommonModule, FormsModule],
  templateUrl: './tournus-immeuble.component.html',
  styleUrl: './tournus-immeuble.component.css'
})

export class TournusImmeubleComponent {

  data_filtered: any[] = [];
  grouped_data: any[] = [];
  immeubles: string[] = [];
  immeubles_selected: string[] = [];
  dateDebut: string = '';
  dateFin: string = '';
  showPopup = false;
  export_annee_start!: number;
  export_annee_end!: number;
  afficher_historique: boolean = false;
  tournus_result_traductions: {[key:string]:string} = {
    'ref': 'Référence',
    'etage': 'Etage objet',
    'designation': 'Désignation objet',
    'locataires': 'Locataires',
    'nb_tournus': 'Nb tournus'
  };
  isLoadingData = false;
  all_locataire_data: any[] = [];
  all_locataire_traductions: {[key:string]:string} = {};
  nb_tournus_tot: number = 0;

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        this.isLoadingData = true;
        fetch(`https://10.209.10.213:8000/tournus-immeuble`, {
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

  update_immeubles_selected(immeubles_selected: string[]) {
    this.immeubles_selected = immeubles_selected;
    this.update_data_filtered(this.compute_immeuble_data());
  }

  onFiltreChange(new_data: string) {
    this.update_data_filtered(this.compute_immeuble_data());
  }

  compute_immeuble_data() {
    const debut = this.dateDebut ? new Date(this.dateDebut) : false;
    const fin = this.dateFin ? new Date(this.dateFin) : false;
    return this.compute_immeuble_data_between_dates(debut, fin);
  }

  compute_immeuble_data_between_dates(debut: Date | boolean, fin: Date | boolean) {
    var filter_dates: boolean = true;
    if (!debut && !fin) {
      filter_dates = false;
    }
    var locataires_filtered = this.all_locataire_data.filter(data => {
      const objDebut = data['DADELO'] ? new Date(data['DADELO']) : false;
      const objFin = data['DASOAC'] ? new Date(data['DASOAC']) : false;
      const debut_in_interval = debut ? (objFin ? objFin >= debut : true) : true;
      const fin_in_interval = fin ? (objDebut ? objDebut <= fin : true) : true;
      const dates_in_interval = debut_in_interval && fin_in_interval;
      return !data['LOVACA'] && this.immeubles_selected.includes(data['NOIMME']) && (!filter_dates || dates_in_interval);
    });
    return locataires_filtered;
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.grouped_data = this.compute_tournus_data(data_filtered);
    this.nb_tournus_tot = this.grouped_data.reduce((acc, obj) => acc + obj.nb_tournus, 0);
  }

  compute_tournus_data(data: any[]) {
    return data.reduce((acc, obj) => {
      const refLoca = obj["REFFOR"];
      const lastDotIndex = refLoca.lastIndexOf('.') || refLoca.length;
      const refObj = refLoca.substring(0, lastDotIndex);
      const existing_obj = acc.find((elem: TournusResult) => elem.ref === refObj);
      if (!existing_obj) {
        const new_obj: TournusResult = {
          ref: refObj,
          etage: obj['ETAGESD'],
          designation: obj["DEOBJED"],
          locataires: obj["NOLOCO"],
          nb_tournus: 0
        }
        acc.push(new_obj);
      } else {
        existing_obj.nb_tournus = existing_obj.nb_tournus + 1;
        existing_obj.locataires += ` / ${obj["NOLOCO"]}`;
      }
      return acc;
    }, [] as TournusResult[]);
  }

  update_grouped_data_filtered(grouped_data_filtered: any[]) {
    console.log(grouped_data_filtered);
  }

  display_historique() {
    this.afficher_historique = !this.afficher_historique;
  }

  load_export_tournus_annuel_popup() {
    var data_immeubles = this.compute_immeuble_data_between_dates(false, false);
    const current_date = new Date();
    const extreme_dates = data_immeubles.reduce(
      (acc: any, item: any) => {
        const date_debut = item['DADELO'] ? new Date(item['DADELO']) : current_date;
        const date_fin = item['DASOAC'] ? new Date(item['DASOAC']) : current_date;

        if (date_debut < acc.minDate) acc.minDate = date_debut;
        if (date_fin > acc.maxDate) acc.maxDate = date_fin;

        return acc;
      },
      { minDate: current_date, maxDate: current_date }
    );
    this.export_annee_start = extreme_dates.minDate.getFullYear();
    this.export_annee_end = extreme_dates.maxDate.getFullYear();
    this.showPopup = true;
  }

  export_tournus_annuel() {
    for(let annee = this.export_annee_start; annee <= this.export_annee_end; annee ++) {
      const date_start: Date = new Date(annee, 0, 1);
      const date_end: Date = new Date(annee, 11, 31, 23, 59, 59);
      const data_annuel = this.compute_immeuble_data_between_dates(date_start, date_end);
      const tournus_data = this.compute_tournus_data(data_annuel);
      this.exportExcelService.exporter_table(tournus_data, `Tournus_${annee}`, this.tournus_result_traductions);
    }
  }

  export_sum_tournus_annuel() {
    var sum_tournus_by_year: SumTournus[] = [];
    for(let annee = this.export_annee_start; annee <= this.export_annee_end; annee ++) {
      const date_start: Date = new Date(annee, 0, 1);
      const date_end: Date = new Date(annee, 11, 31, 23, 59, 59);
      const data_annuel = this.compute_immeuble_data_between_dates(date_start, date_end);
      const tournus_data = this.compute_tournus_data(data_annuel);
      const sum_tournus = tournus_data.reduce((sum: number, item: TournusResult) => sum + item.nb_tournus, 0);
      sum_tournus_by_year.push({
        year: '' + annee,
        count: sum_tournus
      });
    }
    this.exportExcelService.exporter_table(sum_tournus_by_year, `Tournus`, {
      year: 'Année',
      count: 'Nombre de tournus'
    });
  }

}
