import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-select',
  imports: [MatIconModule, MatSelectModule, CommonModule, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css'
})
export class MultiSelectComponent {
  values_selected: string[] = [];
  @Output() values_selected_update = new EventEmitter<string[]>();
  @Input() values_all: string[] = [];

  supprimer_value(value: string) {
    this.values_selected = this.values_selected.filter(i => i !== value);
    this.update_values_selected();
  }

  update_values_selected() {
    this.values_selected_update.emit(this.values_selected);
  }
}
