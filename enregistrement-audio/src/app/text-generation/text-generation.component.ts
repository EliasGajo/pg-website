import { Component } from '@angular/core';
import { AudioRecorderComponent } from '../audio-recorder/audio-recorder.component';
import { EmailGeneratorComponent } from '../email-generator/email-generator.component';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-text-generation',
  imports: [AudioRecorderComponent, EmailGeneratorComponent, FormsModule],
  templateUrl: './text-generation.component.html',
  styleUrl: './text-generation.component.css'
})
export class TextGenerationComponent {
  prompt: string = '';
  result: string = '';

  constructor(private cdRef: ChangeDetectorRef) {}

  updatePrompt(new_prompt: string) {
    this.prompt = new_prompt;
    this.cdRef.detectChanges();
  }
}
