import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comunus',
  imports: [RouterModule, CommonModule],
  templateUrl: './comunus.component.html',
  styleUrl: './comunus.component.css'
})
export class ComunusComponent {
  pages = [
    { path: 'el', label: 'Etats locatifs' },
    { path: 'sinistres', label: 'Sinistres' },
    { path: 'vacants', label: 'Vacants' }
  ];
}

