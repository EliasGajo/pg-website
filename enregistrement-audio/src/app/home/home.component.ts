import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tools = [
    { id: 'textGeneration', name: 'Génération de texte', description: 'Préparez vos communications en quelques instants.', image: 'mail.webp', category: 'Communication' },
    { id: 'exportData', name: 'Export de données', description: 'Créez les extractions dont vous avez besoin.', image: 'excel.webp', category: 'Données' },
    { id: 'tournusImmeuble', name: 'Tournus immeubles', description: 'Organisez les tournus et vos visites terrain.', image: 'tournus.webp', category: 'Immeubles' },
    { id: 'excel', name: 'Espace Excel', description: 'Modifiez, fusionnez et préparez tous vos fichiers Excel.', image: 'excel.webp', category: 'Données' },
    { id: 'comunus/el', name: 'Exports Comunus', description: 'Préparez vos exports pour Comunus.', image: 'excel.webp', category: 'Données' },
    { id: 'enqueteNE/vacants-logements', name: 'Enquêtes NE', description: 'Centralisez les informations sur les vacants.', image: 'excel.webp', category: 'Enquêtes' },
  ];

  constructor(private router: Router) {}

  openTool(toolId: string) {
    this.router.navigate([`/${toolId}`]);
  }
}
