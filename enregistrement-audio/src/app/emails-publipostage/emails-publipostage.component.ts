import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-emails-publipostage',
  imports: [FormsModule],
  templateUrl: './emails-publipostage.component.html',
  styleUrl: './emails-publipostage.component.css'
})
export class EmailsPublipostageComponent {
  @Input() liste_email: any[] = [];
  email_str: string = "";
  copied = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['liste_email']) {
      this.clean_liste_email();
      this.compute_email_str();
    }
  }

  clean_liste_email() {
    const emails = this.liste_email
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

  copy_emails_to_clipboard() {
    if (this.liste_email) {
      navigator.clipboard.writeText(this.email_str).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 3000); // Disparaît après 3s
      });
    }
  }
}
