import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExportExcelService } from '../services/export-excel.service';

@Component({
  selector: 'app-emails-publipostage',
  imports: [FormsModule, CommonModule],
  templateUrl: './emails-publipostage.component.html',
  styleUrl: './emails-publipostage.component.css'
})
export class EmailsPublipostageComponent {
  @Input() email_columns_input: string[] = [];
  @Input() data_to_load: any[] = [];
  @Input() traductions: {[key:string]:string} = {};
  data_filtered: any[] = [];
  colonnesDisponibles: string[] = [];
  colonnesSelectionnees: string[] = [];
  taille_paquets: number = 100;
  showPopup = false;
  email_str: string = "";
  copied = false;
  emailRegex = /^[\p{L}\p{N}._%+-]+@(?:[\p{L}\p{N}-]+\.)+[\p{L}]{2,}$/u;

  constructor(private exportExcelService: ExportExcelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data_to_load']) {
      if(this.data_to_load && this.data_to_load.length > 0) {
        this.colonnesDisponibles = Object.keys(this.data_to_load[0]);
      }
      this.colonnesSelectionnees = this.email_columns_input;
      this.clean_liste_email();
      this.email_str = this.compute_email_str(this.data_filtered);
    }
  }

  clean_liste_email() {
    this.data_filtered = this.data_to_load.filter(item =>
      this.colonnesSelectionnees.some(col => {
        const email = item[col]?.trim();
        return email && this.emailRegex.test(email);
      })
    );
  }

  compute_email_str(data: any[]) {
    const emails: string[] = [];
    for (let item of data) {
      for (let col of this.colonnesSelectionnees) {
        const email = item[col]?.trim();
        if (email) {
          emails.push(email);
        }
      }
    }
    const emails_unique = Array.from(new Set(emails));
    return emails_unique.join(";");
  }

  exporter_liste_email() {
    this.exportExcelService.exporter_table(this.data_filtered, 'Emails', this.traductions);
  }

  exporter_liste_without_email() {
    const data_without_email = this.data_to_load.filter(item => {
      const hasEmail = this.colonnesSelectionnees.some(col => {
        const value = item[col];
        return value && value.trim() !== '';
      });
      return !hasEmail;
    });
    this.exportExcelService.exporter_table(data_without_email, 'Sans email', this.traductions);
  }

  exporter_liste_with_invalid_email() {
    const data_without_email = this.data_to_load.filter(item => {
      const hasInvalidEmail = this.colonnesSelectionnees.some(col => {
        const value = item[col]?.trim();
        return value && !this.emailRegex.test(value);
      });
      return hasInvalidEmail;
    });
    this.exportExcelService.exporter_table(data_without_email, 'Avec email invalide', this.traductions);
  }

  exporter_liste_without_valid_email() {
    const data_with_invalid_email = this.data_to_load.filter(item => {
      const hasValidEmail = this.colonnesSelectionnees.some(col => {
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

  onColumnToggle(event: any) {
    const column = event.target.value;

    if (event.target.checked) {
      this.colonnesSelectionnees.push(column);
    } else {
      this.colonnesSelectionnees =
        this.colonnesSelectionnees.filter(c => c !== column);
    }
    this.clean_liste_email();
    this.email_str = this.compute_email_str(this.data_filtered);
  }

  exporter_string_par_paquet_popup() {
    this.showPopup = true;
  }

  exporter_string_par_paquet() {
    let globalText = '';
    for (let i = 0; i < this.data_filtered.length; i += this.taille_paquets) {
      const paquet = this.data_filtered.slice(i, i + this.taille_paquets);

      const text = this.compute_email_str(paquet);

      globalText += `===== PAQUET ${i / this.taille_paquets + 1} =====\n`;
      globalText += text + '\n\n';
    }
    this.generateTextFile(globalText, 'emails.txt');
  }

  generateTextFile(txt: string, filename: string): void {
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
  }

}
