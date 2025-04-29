import { Component } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-export-coproprietaire',
  imports: [DataframeComponent, FormsModule],
  templateUrl: './export-coproprietaire.component.html',
  styleUrl: './export-coproprietaire.component.css'
})
export class ExportCoproprietaireComponent {

  data_filtered: any[] = [];
  liste_email: any[] = [];
  email_str: string = "";
  copied = false;

  compute_liste_email() {
    const emails = this.data_filtered
      .map(item => item['NOEMAI'])
      .filter(email => !!email?.trim())
      .map(email => email.trim().toLowerCase());

    // Supprimer les doublons
    this.liste_email = Array.from(new Set(emails));
  }

  compute_email_str() {
    this.email_str = "";
    for (let email of this.liste_email) {
      if (this.email_str.length > 0) {
        this.email_str += ";";
      }
      this.email_str += email;
    }
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

  exporter_liste_email() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Emails');
    const headers = ['Emails'];
    worksheet.addRow(headers);

    this.liste_email.forEach(item => {
      const row = [];
      row.push(item);
      worksheet.addRow(row);
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `Emails.xlsx`);
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.compute_liste_email();
    this.compute_email_str()
  }

  copy_emails_to_clipboard() {
    if (this.liste_email) {
      navigator.clipboard.writeText(this.email_str).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 3000); // Disparaît après 3s
      });
    }
  }
}
