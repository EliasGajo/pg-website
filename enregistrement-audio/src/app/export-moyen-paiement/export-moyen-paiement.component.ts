import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-export-moyen-paiement',
  imports: [DataframeComponent, CommonModule, FormsModule, EmailsPublipostageComponent, MatIconModule, MatSelectModule],
  templateUrl: './export-moyen-paiement.component.html',
  styleUrl: './export-moyen-paiement.component.css'
})
export class ExportMoyenPaiementComponent {

  data_filtered: any[] = [];
  immeubles_selected: string[] = [];
  immeubles: string[] = [];
  data: any[] = [];
  immeubles_selected_data: any[] = [];
  liste_email: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone, private exportExcelService: ExportExcelService) {}

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
          this.immeubles_selected_data = this.data;
          this.immeubles = Array.from(
            new Set(this.data.map(item => item['NOIMME']))
          ).sort((a, b) => a.localeCompare(b));
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  supprimer_immeuble(immeuble: string) {
    this.immeubles_selected = this.immeubles_selected.filter(i => i !== immeuble);
    this.update_immeubles();
  }

  update_immeubles() {
    this.immeubles_selected_data = this.immeubles_selected.length > 0 ? this.data.filter(item => this.immeubles_selected.includes(item["NOIMME"])) : this.data;
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.liste_email = data_filtered.map(item => item["NOEMAI"]);
  }

  copro_sans_email() {
    var copro_sans_email = this.supprimer_doublons(this.data_filtered.filter(data => !data['NOEMAI'] || data['NOEMAI'].trim() === ''));
    this.exportExcelService.exporter_table(copro_sans_email, 'Locataires sans email', this.traductions);
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

  export_complet() {
    const data = this.clean_data_for_excel(this.data);
    data.sort((a, b) => {
      const immeubleCompare = a['NOIMME'].localeCompare(b['NOIMME']);
      if (immeubleCompare !== 0) {
        return immeubleCompare;
      }
      return a['MOYPAID'].localeCompare(b['MOYPAID']);
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Moyens de paiement par immeuble');
    worksheet.columns = [
      { header: 'Immeuble', key: 'NOIMME', width: 40 },
      { header: 'Référence', key: 'REFFOR', width: 20 },
      { header: 'Nom', key: 'NOLOCO', width: 40 },
      { header: 'Moyen de paiement', key: 'MOYPAID', width: 30 },
      { header: 'Email', key: 'NOEMAI', width: 40 }
    ];

    data.forEach(item => {
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'moyens_paiement_immeubles.xlsx');
    });
  }

  clean_data_for_excel(data_to_clean: any) {
    let cleaned_data: any[] = [];
    for(let i = 0; i < data_to_clean.length; i ++) {
      let item_to_clean = data_to_clean[i];
      let cleaned_item: any = {}
      for(let key in item_to_clean) {
        const value = item_to_clean[key];
        if(value === null || value === undefined) {
          cleaned_item[key] = '';
        } else {
          cleaned_item[key] = value;
        }
      }
      cleaned_data.push(cleaned_item);
    }
    return cleaned_data;
  }

}

