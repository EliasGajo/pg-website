import { Component } from '@angular/core';
import { ExportFactureDebiteurComponent } from '../export-facture-debiteur/export-facture-debiteur.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export-data',
  imports: [ExportFactureDebiteurComponent, CommonModule],
  templateUrl: './export-data.component.html',
  styleUrl: './export-data.component.css'
})
export class ExportDataComponent {
  data_types = [
    { id: 'exportFactureDebiteur', name: 'Factures débiteur', image: 'facture.webp' }
    // Ajouter les autres ici
  ];

  constructor(private router: Router) {}

  openDataType(data_type_id: string) {
    this.router.navigate([`/${data_type_id}`]);
  }
}
