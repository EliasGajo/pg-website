import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';

@Component({
  selector: 'app-tournus-immeuble',
  imports: [DataframeComponent],
  templateUrl: './tournus-immeuble.component.html',
  styleUrl: './tournus-immeuble.component.css'
})

export class TournusImmeubleComponent {

  data_filtered: any[] = [];
  grouped_data: any[] = [];

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.grouped_data = data_filtered.reduce((acc, obj) => {
      const refLoca = obj["Réf."];
      const lastDotIndex = refLoca.lastIndexOf('.') || refLoca.length;
      const refObj = refLoca.substring(0, lastDotIndex);
      if (!acc[refObj]) {
        acc[refObj] = {
          'Référence' : refObj,
          'Etage objet': obj['Etage objet'],
          'Désignation objet' : obj["Dési. objet"],
          'Surface': obj["Surface"],
          'Nb pces': obj["Nb pces cantonales"],
          'Nb tournus': 0
        };
      } else {
        acc[refObj]['Nb tournus'] = acc[refObj]['Nb tournus'] + 1;
      }
      return acc;
    }, {} as { [key: string]: any });
  }

}
