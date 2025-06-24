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
  @Input() email_column: string = "";
  @Input() data_to_load: any[] = [];
  @Input() traductions: {[key:string]:string} = {};
  data_filtered: any[] = [];
  email_str: string = "";
  copied = false;

  constructor(private exportExcelService: ExportExcelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data_to_load']) {
      this.clean_liste_email();
      this.compute_email_str();
    }
  }

  clean_liste_email() {
    const emails_unique = new Set<string>();
    this.data_filtered = this.data_to_load
      .filter(item => !!item[this.email_column]?.trim())
      .map(item => ({...item, [this.email_column]: item[this.email_column].trim().toLowerCase()}))
      .filter(item => {
        if(emails_unique.has(item[this.email_column])) {
          return false;
        } else {
          emails_unique.add(item[this.email_column]);
          return true;
        }
      });
  }

  compute_email_str() {
    this.email_str = "";
    for (let item of this.data_filtered) {
      if (this.email_str.length > 0) {
        this.email_str += ";";
      }
      this.email_str += item[this.email_column];
    }
  }

  exporter_liste_email() {
    this.exportExcelService.exporter_table(this.data_filtered, 'Emails', this.traductions);
  }

  exporter_liste_without_email() {
    const data_without_email = this.data_to_load.filter(item => !item[this.email_column]?.trim());
    this.exportExcelService.exporter_table(data_without_email, 'Sans email', this.traductions);
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
