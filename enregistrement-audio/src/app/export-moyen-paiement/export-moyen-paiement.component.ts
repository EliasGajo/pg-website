import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { EmailsPublipostageComponent } from '../emails-publipostage/emails-publipostage.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

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
        fetch(`https://10.209.10.215:8000/moyen-paiement`, {
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

