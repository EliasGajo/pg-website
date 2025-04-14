import { Component } from '@angular/core';
import { AudioRecorderComponent } from '../audio-recorder/audio-recorder.component';
import { EmailGeneratorComponent } from '../email-generator/email-generator.component';

@Component({
  selector: 'app-text-generation',
  imports: [AudioRecorderComponent, EmailGeneratorComponent],
  templateUrl: './text-generation.component.html',
  styleUrl: './text-generation.component.css'
})
export class TextGenerationComponent {

}
