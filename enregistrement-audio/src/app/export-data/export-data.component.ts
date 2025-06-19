import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export-data',
  imports: [CommonModule],
  templateUrl: './export-data.component.html',
  styleUrl: './export-data.component.css'
})
export class ExportDataComponent {
  data_types = [
    { id: 'exportFactureDebiteur', name: 'Factures débiteur', image: 'facture.webp' },
    { id: 'exportCoproprietaire', name: 'Copropriétaires', image: 'info.webp' },
    { id: 'exportMoyenPaiement', name: 'Moyens de paiement', image: 'wallet.webp' },
    { id: 'exportLocataire', name: 'Locataires', image: 'info.webp' },
    { id: 'exportProprietaire', name: 'Propriétaires', image: 'info.webp' }
    // Ajouter les autres ici
  ];

  constructor(private router: Router) {}

  openDataType(data_type_id: string) {
    this.router.navigate([`/${data_type_id}`]);
  }
}
