import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextGenerationComponent } from './text-generation/text-generation.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TextGenerationComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enregistrement-audio';
}
