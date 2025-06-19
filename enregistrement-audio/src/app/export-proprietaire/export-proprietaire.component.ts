import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-proprietaire',
  imports: [DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './export-proprietaire.component.html',
  styleUrl: './export-proprietaire.component.css'
})
export class ExportProprietaireComponent {
  all_proprietaire: any[] = [];
  all_proprietaire_actif: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};
  liste_email: any[] = [];
  email_column: string = "NOEMAI";

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/proprietaire`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.all_proprietaire = JSON.parse(data.values) || [];
          var date_du_jour = new Date();
          this.all_proprietaire_actif = this.all_proprietaire.filter(proprietaire => !proprietaire['DAFIMA'] || new Date(proprietaire['DAFIMA']) > date_du_jour);
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

  proprio_sans_email() {
    var copro_sans_email = this.supprimer_doublons(this.data_filtered.filter(data => !data['NOEMAI'] || data['NOEMAI'].trim() === ''));
    this.exportExcelService.exporter_table(copro_sans_email, 'Propriétaires sans email', this.traductions);
    console.log(copro_sans_email);
  }

  supprimer_doublons(liste_copro: any[]) {
    const set_copro = new Set<string>();
    return liste_copro.filter(copro => {
      const identifiant = `${copro['REIMME']}-${copro['NOINTE']}`;
      if (set_copro.has(identifiant)) {
        return false;
      } else {
        set_copro.add(identifiant);
        return true;
      }
    });
  }

  update_traductions(new_traductions: {[key:string]:string}) {
    this.traductions = new_traductions;
  }
}
