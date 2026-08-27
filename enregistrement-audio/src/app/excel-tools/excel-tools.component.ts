import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-excel-tools',
  imports: [CommonModule, RouterLink],
  templateUrl: './excel-tools.component.html',
  styleUrl: './excel-tools.component.css'
})
export class ExcelToolsComponent {
  tools = [
    {
      route: '/excel/modifier',
      title: 'Modifier un fichier',
      description: 'Importez un ou plusieurs onglets, filtrez les données et supprimez les doublons.',
      icon: '✦',
      tone: 'blue',
      tag: 'Préparation des données'
    },
    {
      route: '/excel/fusionner',
      title: 'Fusionner des fichiers',
      description: 'Alignez les colonnes de deux fichiers puis créez un export unique.',
      icon: '⇄',
      tone: 'violet',
      tag: 'Consolidation'
    },
    {
      route: '/excel/contentieux',
      title: 'Remplir un modèle contentieux',
      description: 'Sélectionnez les onglets d’un modèle et préparez votre fichier de suivi.',
      icon: '▤',
      tone: 'teal',
      tag: 'Modèles Excel'
    }
  ];

  constructor(private router: Router) {}

  openTool(route: string) {
    this.router.navigateByUrl(route);
  }
}
