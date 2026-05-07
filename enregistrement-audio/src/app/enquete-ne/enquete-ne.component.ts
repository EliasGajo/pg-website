import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enquete-ne',
  imports: [RouterModule, CommonModule],
  templateUrl: './enquete-ne.component.html',
  styleUrl: './enquete-ne.component.css'
})
export class EnqueteNEComponent {
  pages = [
    { path: 'vacants-logements', label: 'Vacants logement' },
    { path: 'vacants-commercial', label: 'Vacants commercial' },
  ];
}

