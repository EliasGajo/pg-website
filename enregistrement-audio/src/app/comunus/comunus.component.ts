import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-comunus',
  imports: [DataframeComponent, HttpClientModule],
  templateUrl: './comunus.component.html',
  styleUrl: './comunus.component.css'
})
export class ComunusComponent {
  etats_locatifs: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  constructor(private zone: NgZone, private http: HttpClient) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/communus-EL`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.etats_locatifs = JSON.parse(data.values) || [];
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

  remplir_excel_comunus() {
    const colonneMapping: { [key: string]: string } = {
      A: 'V_OBJLOC',
      B: 'ETAGESA',
      C: 'NBPIEC',
      D: 'surface',
      E: 'GEOBJED',
      F: 'MONMEN'
    };
    const workbook = new ExcelJS.Workbook();

    this.http.get('data/COMUNUS_Etat Objets locatifs.xlsx', { responseType: 'arraybuffer' }).subscribe(async (data: ArrayBuffer) => {

      await workbook.xlsx.load(data);

      const sheet = workbook.getWorksheet(1);  // première feuille
      if(sheet) {
        const rowStart = 11;  // remplir à partir de la ligne 11

        this.data_filtered.forEach((item, index) => {

          const rowNumber = rowStart + index;
          const row = sheet.getRow(rowNumber);

          // Remplir les colonnes spécifiées
          for (const col in colonneMapping) {
            const field = colonneMapping[col];
            row.getCell(col).value = item[field];
          }

          row.commit();
        });

        // Exporter le fichier Excel
        const buffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }),
          'export.xlsx'
        );
      }

    }, error => {
      console.error('Erreur lors du chargement du modèle Excel :', error);
    });
  }
}

