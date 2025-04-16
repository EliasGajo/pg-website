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
    { id: 'textGeneration', name: 'Génération de texte', image: 'mail.webp' },
    { id: 'exportData', name: 'Export de données', image: 'excel.webp' },
    // Ajouter les outils ici
  ];

  constructor(private router: Router) {}

  openTool(toolId: string) {
    this.router.navigate([`/${toolId}`]);
  }
}
