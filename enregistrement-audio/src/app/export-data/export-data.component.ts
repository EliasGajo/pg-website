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
    { id: 'exportDiversDebiteur', name: 'Divers débiteur', image: 'facture.webp' },
    { id: 'exportCoproprietaire', name: 'Copropriétaires', image: 'info.webp' },
    { id: 'exportMoyenPaiement', name: 'Moyens de paiement', image: 'wallet.webp' },
    { id: 'exportLocataire', name: 'Locataires', image: 'info.webp' },
    { id: 'exportLocataireGrille', name: 'Locataires Grille', image: 'info.webp' },
    { id: 'exportProprietaire', name: 'Propriétaires', image: 'info.webp' },
    { id: 'exportEtatLocatif', name: 'Etat locatif', image: 'info.webp' },
    { id: 'exportDocument', name: 'Documents', image: 'info.webp' },
    { id: 'exportContentieux', name: 'Contentieux', image: 'info.webp' },
    { id: 'exportQrMultiple', name: 'QR multiples', image: 'facture.webp' },
    { id: 'elementBail', name: 'Eléments de bail', image: 'info.webp' },
    { id: 'exportEmail', name: 'Emails', image: 'info.webp' }
    // Ajouter les autres ici
  ];

  constructor(private router: Router) {}

  openDataType(data_type_id: string) {
    this.router.navigate([`/${data_type_id}`]);
  }
}
