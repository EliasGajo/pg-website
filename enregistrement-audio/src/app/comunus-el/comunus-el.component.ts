import { Component, NgZone } from '@angular/core';
import { DataframeComponent } from '../dataframe/dataframe.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-comunus-el',
  imports: [DataframeComponent, HttpClientModule],
  templateUrl: './comunus-el.component.html',
  styleUrl: './comunus-el.component.css'
})
export class ComunusElComponent {
  etats_locatifs: any[] = [];
  data_filtered: any[] = [];
  traductions: {[key:string]:string} = {};

  IMMEUBLE_MAPPING: Record<string, string> = {
    'Locle': 'NE1.2300001',
    'Fiaz': 'NE1.2300001',
    'Vieux-Patriotes': 'NE1.2300002',
    'Max-Petitpierre': 'NE2.2000001',
    'Moulins': 'JU2.2800001'
  };

  ENTREE_MAPPING: Record<string, Number> = {
    'Vieux-Patriotes 47': 1,
    'Vieux-Patriotes 49': 2,
    'Vieux-Patriotes 51': 3,
    'Vieux-Patriotes, garages': 4,
    'Quai Max-Petitpierre 34': 1,
    'Quai Max-Petitpierre 36': 2,
    'Quai Max-Petitpierre 38': 3,
    'Quai Max-Petitpierre 38, parking': 4,
    'Locle 21': 1,
    'Locle 23': 2,
    'Locle 25': 3,
    'Locle 21-23, parking': 4,
    'Locle 25, parking': 4,
    'Fiaz 2, parking': 4
  };

  SORTE_MAPPING: Record<string, Number> = {
    'Appartement': 1,
    'Appartements': 1,
    'Studio': 1,
    'Duplex': 1,
    'Triplex': 1,
    'Loft': 1, // A modifier
    'Bureaux': 2,
    'Local': 3,
    'Restaurant': 5,
    'Parking': 8,
    'Garage': 8,
    'Parking ext.': 8,
    'Places goudronnées': 8,
    'Place ext moto': 8,
    'Place moto': 8,
    'Fitness': 9
  };

  TYPE_MAPPING: Record<string, Number> = {
    'Appartement': 10,
    'Appartements': 10,
    'Studio': 11,
    'Duplex': 12,
    'Triplex': 13,
    'Loft': 14, // A modifier
    'Parking extérieur': 80,
    'Parking intérieur': 81,
    'Garage': 81
  };

  constructor(private zone: NgZone, private http: HttpClient) {}

  ngOnInit() {
    this.zone.run(() => {
        fetch(`https://10.209.10.213:8000/communus-EL`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          this.traductions = data.traductions
          this.etats_locatifs = JSON.parse(data.values) || [];
        })
        .catch(error => {
          console.error('Erreur lors du chargement des données : ', error);
        });
    });
  }

  update_data_filtered(data_filtered: any[]) {
    this.data_filtered = data_filtered;
  }

  update_traductions(new_traductions: {[key:string]:string}) {
    this.traductions = new_traductions;
  }

  get_entree_idx(data: any) {
    var immeuble_principal = data["IMMEPR"] || 0;
    var immeuble = data["REIMME"] || 0;
    if(immeuble_principal && immeuble_principal > 0) {
      return immeuble - immeuble_principal + 1;
    }
    return 1
  }

  get_ref_immeuble(immeuble: string): string {
    const foundKey = Object.keys(this.IMMEUBLE_MAPPING)
      .find(key => immeuble?.includes(key));

    return foundKey ? this.IMMEUBLE_MAPPING[foundKey] : '';
  }

  async export_mensuel_immopac() {
    
    const COLUMNS = [
      { header: 'Mandat', key: 'mandat', width: 8 },
      { header: 'Portefeuille', key: 'portefeuille', width: 12 },
      { header: 'Ref immeuble', key: 'ref_immeuble', width: 18 },
      { header: 'Bâtiment', key: 'batiment', width: 10 },
      { header: 'Entrée', key: 'entree', width: 10 },
      { header: 'Unité locative', key: 'unite_locative', width: 20 },
      { header: 'Unité sorte', key: 'unite_sorte', width: 15 },
      { header: 'Unité type', key: 'unite_type', width: 15 },
      { header: 'Pièces', key: 'pieces', width: 8 },
      { header: 'Étage', key: 'etage', width: 12 },
      { header: '', key: 'k', width: 5 },
      { header: 'Nom locataire', key: 'nom_locataire', width: 30 },
      { header: 'Surface', key: 'surface', width: 10 },
      { header: 'Vacant', key: 'vacant', width: 10 },
      { header: 'TVA', key: 'tva', width: 10 },
      { header: 'Début bail', key: 'debut_bail', width: 12 },
      { header: '', key: 'q', width: 5 },
      { header: 'Délai préavis (mois)', key: 'delai_preavis', width: 10 },
      { header: '', key: 's', width: 5 },
      { header: 'Résilitation pour le', key: 'resiliation_pour_le', width: 12 },
      { header: 'Fin bail', key: 'fin_bail', width: 12 },
      { header: 'Loyer net', key: 'loyer_net', width: 12 },
      { header: 'Charges', key: 'charges', width: 12 }
    ];

    const groupedByImmeuble = new Map<string, any[]>();

    this.data_filtered.forEach(item => {
      const ref = this.get_ref_immeuble(item['NOIMME']);

      if (!groupedByImmeuble.has(ref)) {
        groupedByImmeuble.set(ref, []);
      }

      groupedByImmeuble.get(ref)!.push(item);
    });

    for (const [refImmeuble, items] of groupedByImmeuble.entries()) {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Etat locatif');
      worksheet.columns = COLUMNS;

      items.forEach(item => {

        const entreeIndex = this.ENTREE_MAPPING[item['NOIMME']];
        const unite_sorte = this.SORTE_MAPPING[item['GEOBJED']] || '';
        const loyer_net = item['TOTLOY'] || '';
        const loyer_brut = item['LOYBRU'] || '';
        var charges = 0;
        if(loyer_net != '' && loyer_brut != '') {
          charges = loyer_brut - loyer_net;
        }

        worksheet.addRow({
          mandat: 1,
          portefeuille: 1,
          ref_immeuble: this.get_ref_immeuble(item['NOIMME']),
          batiment: entreeIndex,
          entree: entreeIndex,
          unite_locative: item['REFFOR'] || '',
          unite_sorte: unite_sorte,
          unite_type: this.TYPE_MAPPING[item['GEOBJED']] || '',
          pieces: item['NBPIEC'] || '',
          etage: item['ETAGESA'] || '',
          k: 1,

          // L → W (standard)
          nom_locataire: item['NOLOCO'] || '',
          surface: item['surface'] || '',
          vacant: item['LOVACA'] ? 'oui' : 'non',
          tva: item['ASSTVA'] ? 'oui' : 'non',
          debut_bail: item['DADEBA'] || '',
          q: '',
          delai_preavis: item['NBMORT'] || '',
          s: '',
          resiliation_pour_le: item['DASOAC'] || '',
          fin_bail: item['DAFIBA'] || '',
          loyer_net: loyer_net,
          charges: charges || ''
        });
      });

      // Export fichier
      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob(
          [buffer],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        ),
        `etat_locatif_immopac_${refImmeuble}.xlsx`
      );
    }
  }

  remplir_excel_comunus() {
    const colonneMapping: { [key: string]: string } = {
      A: 'V_OBJLOC',
      B: 'ETAGESA',
      C: 'NBPIEC',
      D: 'surface',
      E: 'GEOBJED',
      F: 'MONMEN'
    };
    const workbook = new ExcelJS.Workbook();

    this.http.get('data/COMUNUS_Etat Objets locatifs.xlsx', { responseType: 'arraybuffer' }).subscribe(async (data: ArrayBuffer) => {

      await workbook.xlsx.load(data);

      const sheet = workbook.getWorksheet(1);  // première feuille
      if(sheet) {
        const rowStart = 11;  // remplir à partir de la ligne 11

        this.data_filtered.forEach((item, index) => {

          const rowNumber = rowStart + index;
          const row = sheet.getRow(rowNumber);

          // Remplir les colonnes spécifiées
          for (const col in colonneMapping) {
            const field = colonneMapping[col];
            row.getCell(col).value = item[field];
          }

          row.commit();
        });

        // Exporter le fichier Excel
        const buffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }),
          'export.xlsx'
        );
      }

    }, error => {
      console.error('Erreur lors du chargement du modèle Excel :', error);
    });
  }
}

