import { Component } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-coproprietaire',
  imports: [DataframeComponent, EmailsPublipostageComponent],
  templateUrl: './export-coproprietaire.component.html',
  styleUrl: './export-coproprietaire.component.css'
})
export class ExportCoproprietaireComponent {

  data_filtered: any[] = [];
  liste_email: any[] = [];
  traductions: {[key:string]:string} = {};
  email_column: string = "NOEMAI";

  constructor(private exportExcelService: ExportExcelService) {}

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.liste_email = data_filtered.map(item => item["NOEMAI"]);
  }

  copro_sans_email() {
    var copro_sans_email = this.supprimer_doublons(this.data_filtered.filter(data => !data['NOEMAI'] || data['NOEMAI'].trim() === ''));
    this.exportExcelService.exporter_table(copro_sans_email, 'Copropriétaires sans email', this.traductions);
    console.log(copro_sans_email);
  }

  supprimer_doublons(liste_copro: any[]) {
    const set_copro = new Set<string>();
    return liste_copro.filter(copro => {
      const identifiant = `${copro['NOIMME']}-${copro['NOLOCO']}`;
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
