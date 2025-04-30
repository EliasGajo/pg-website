import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';

interface TournusResult {
  ref: string;
  etage: string;
  designation: string;
  surface: number;
  nb_pces: number;
  nb_tournus: number;
}

@Component({
  selector: 'app-tournus-immeuble',
  imports: [DataframeComponent],
  templateUrl: './tournus-immeuble.component.html',
  styleUrl: './tournus-immeuble.component.css'
})

export class TournusImmeubleComponent {

  data_filtered: any[] = [];
  grouped_data: any[] = [];
  tournus_result_traductions: {[key:string]:string} = {
    'ref': 'Référence',
    'etage': 'Etage objet',
    'designation': 'Désignation objet',
    'surface': 'Surface',
    'nb_pces': 'Nb pces',
    'nb_tournus': 'Nb tournus'
  };

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
    this.grouped_data = data_filtered.reduce((acc, obj) => {
      const refLoca = obj["Réf."];
      const lastDotIndex = refLoca.lastIndexOf('.') || refLoca.length;
      const refObj = refLoca.substring(0, lastDotIndex);
      const existing_obj = acc.find((elem: TournusResult) => elem.ref === refObj);
      if (!existing_obj) {
        const new_obj: TournusResult = {
          ref: refObj,
          etage: obj['Etage objet'],
          designation: obj["Dési. objet"],
          surface: obj["Surface"],
          nb_pces: obj["Nb pces cantonales"],
          nb_tournus: 0
        }
        acc.push(new_obj);
      } else {
        existing_obj.nb_tournus = existing_obj.nb_tournus + 1;
      }
      return acc;
    }, [] as TournusResult[]);
    console.log(this.grouped_data);
  }

  update_grouped_data_filtered(grouped_data_filtered: any[]) {
    console.log(grouped_data_filtered);
  }

  display_historique() {

  }

}
