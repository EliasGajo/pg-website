import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-emails-publipostage',
  imports: [FormsModule],
  templateUrl: './emails-publipostage.component.html',
  styleUrl: './emails-publipostage.component.css'
})
export class EmailsPublipostageComponent {
  @Input() email_columns: string[] = [];
  @Input() data_to_load: any[] = [];
  @Input() traductions: {[key:string]:string} = {};
  data_filtered: any[] = [];
  email_str: string = "";
  copied = false;
  emailRegex = /^[\p{L}\p{N}._%+-]+@(?:[\p{L}\p{N}-]+\.)+[\p{L}]{2,}$/u;

  constructor(private exportExcelService: ExportExcelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data_to_load']) {
      this.clean_liste_email();
      this.compute_email_str();
    }
  }

  clean_liste_email() {
    this.data_filtered = this.data_to_load.filter(item =>
      this.email_columns.some(col => {
        const email = item[col]?.trim();
        return email && this.emailRegex.test(email);
      })
    );
  }

  compute_email_str() {
    const emails: string[] = [];
    for (let item of this.data_filtered) {
      for (let col of this.email_columns) {
        const email = item[col]?.trim();
        if (email) {
          emails.push(email);
        }
      }
    }
    const emails_unique = Array.from(new Set(emails));
    this.email_str = emails_unique.join(";");
  }

  exporter_liste_email() {
    this.exportExcelService.exporter_table(this.data_filtered, 'Emails', this.traductions);
  }

  exporter_liste_without_email() {
    const data_without_email = this.data_to_load.filter(item => {
      const hasEmail = this.email_columns.some(col => {
        const value = item[col];
        return value && value.trim() !== '';
      });
      return !hasEmail;
    });
    this.exportExcelService.exporter_table(data_without_email, 'Sans email', this.traductions);
  }

  exporter_liste_with_invalid_email() {
    const data_without_email = this.data_to_load.filter(item => {
      const hasInvalidEmail = this.email_columns.some(col => {
        const value = item[col]?.trim();
        return value && !this.emailRegex.test(value);
      });
      return hasInvalidEmail;
    });
    this.exportExcelService.exporter_table(data_without_email, 'Avec email invalide', this.traductions);
  }

  exporter_liste_without_valid_email() {
    const data_with_invalid_email = this.data_to_load.filter(item => {
      const hasValidEmail = this.email_columns.some(col => {
        const value = item[col]?.trim();
        return value && this.emailRegex.test(value);
      });
      return !hasValidEmail;
    });
    this.exportExcelService.exporter_table(data_with_invalid_email, 'Sans email valide', this.traductions);
  }

  copy_emails_to_clipboard() {
    if (this.data_filtered) {
      navigator.clipboard.writeText(this.email_str).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 3000); // Disparaît après 3s
      });
    }
  }
}
