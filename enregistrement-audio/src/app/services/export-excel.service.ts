import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  exporter_table(data: any[], fileName: string, traductions: { [key: string]: string } = {}) {
    data = this.clean_data_for_excel(data);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);
    if (data.length > 0) {
      const colonnes = Object.keys(data[0]);
      const headers = [];
      for (let key of colonnes) {
        headers.push(traductions[key]);
      }
      worksheet.addRow(headers);

      data.forEach(item => {
        const row = [];
        for (let key of colonnes) {
          row.push(item[key]);
        }
        worksheet.addRow(row);
      });
    }

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  exporter_liste(data: any[], fileName: string, header: string = "") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);
    const headers = [header];
    worksheet.addRow(headers);

    data.forEach(item => {
      const row = [];
      row.push(item);
      worksheet.addRow(row);
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
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
