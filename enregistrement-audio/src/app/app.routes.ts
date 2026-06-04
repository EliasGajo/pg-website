import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TextGenerationComponent } from './text-generation/text-generation.component';
import { ExportDataComponent } from './export-data/export-data.component';
import { ExportFactureDebiteurComponent } from './export-facture-debiteur/export-facture-debiteur.component';
import { ExportCoproprietaireComponent } from './export-coproprietaire/export-coproprietaire.component';
import { ExportLocataireComponent } from './export-locataire/export-locataire.component';
import { LocataireExportGrilleComponent } from './locataire-export-grille/locataire-export-grille.component';
import { ExportProprietaireComponent } from './export-proprietaire/export-proprietaire.component';
import { TournusImmeubleComponent } from './tournus-immeuble/tournus-immeuble.component';
import { ExportMoyenPaiementComponent } from './export-moyen-paiement/export-moyen-paiement.component';
import { ExportDiversDebiteurComponent } from './export-divers-debiteur/export-divers-debiteur.component';
import { QrMultipleComponent } from './qr-multiple/qr-multiple.component';
import { ExportEtatLocatifComponent } from './export-etat-locatif/export-etat-locatif.component';
import { ModificationExcelComponent } from './modification-excel/modification-excel.component';
import { RemplirExcelContentieuxComponent } from './remplir-excel-contentieux/remplir-excel-contentieux.component';
import { ExportDocumentComponent } from './export-document/export-document.component';
import { ExportContentieuxComponent } from './export-contentieux/export-contentieux.component';
import { ElementBailComponent } from './element-bail/element-bail.component';
import { ExportEmailComponent } from './export-email/export-email.component';
import { MergeExcelsComponent } from './merge-excels/merge-excels.component';
import { ComunusComponent } from './comunus/comunus.component';
import { ComunusElComponent } from './comunus-el/comunus-el.component';
import { ComunusSinistresComponent } from './comunus-sinistres/comunus-sinistres.component';
import { ComunusVacantsComponent } from './comunus-vacants/comunus-vacants.component';
import { EnqueteNEComponent } from './enquete-ne/enquete-ne.component';
import { EnqueteNeVacantsLogementsComponent } from './enquete-ne-vacants-logements/enquete-ne-vacants-logements.component';
import { EnqueteNeVacantsCommercialComponent } from './enquete-ne-vacants-commercial/enquete-ne-vacants-commercial.component';
import { EnqueteNeObjetsLogementComponent } from './enquete-ne-objets-logement/enquete-ne-objets-logement.component';
import { EnqueteNeObjetsCommercialComponent } from './enquete-ne-objets-commercial/enquete-ne-objets-commercial.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'textGeneration', component: TextGenerationComponent},
    {path: 'exportData', component: ExportDataComponent},
    {path: 'exportFactureDebiteur', component: ExportFactureDebiteurComponent},
    {path: 'exportDiversDebiteur', component: ExportDiversDebiteurComponent},
    {path: 'exportCoproprietaire', component: ExportCoproprietaireComponent},
    {path: 'exportLocataire', component: ExportLocataireComponent},
    {path: 'exportLocataireGrille', component: LocataireExportGrilleComponent},
    {path: 'exportProprietaire', component: ExportProprietaireComponent},
    {path: 'exportEtatLocatif', component: ExportEtatLocatifComponent},
    {path: 'exportDocument', component: ExportDocumentComponent},
    {path: 'exportContentieux', component: ExportContentieuxComponent},
    {path: 'tournusImmeuble', component: TournusImmeubleComponent},
    {path: 'exportMoyenPaiement', component: ExportMoyenPaiementComponent},
    {path: 'exportQrMultiple', component: QrMultipleComponent},
    {path: 'modificationExcel', component: ModificationExcelComponent},
    {path: 'remplirExcelContentieux', component: RemplirExcelContentieuxComponent},
    {path: 'elementBail', component: ElementBailComponent},
    {path: 'exportEmail', component: ExportEmailComponent},
    {path: 'mergeExcels', component: MergeExcelsComponent},
    {path: 'comunus', component: ComunusComponent},
    {
        path: 'comunus',
        component: ComunusComponent,
        children: [
            { path: 'el', component: ComunusElComponent },
            { path: 'sinistres', component: ComunusSinistresComponent },
            { path: 'vacants', component: ComunusVacantsComponent }
        ]
    },
    {path: 'enqueteNE', component: EnqueteNEComponent},
    {
        path: 'enqueteNE',
        component: EnqueteNEComponent,
        children: [
            { path: 'vacants-logements', component: EnqueteNeVacantsLogementsComponent },
            { path: 'vacants-commercial', component: EnqueteNeVacantsCommercialComponent },
            { path: 'objets-logement', component: EnqueteNeObjetsLogementComponent },
            { path: 'objets-commercial', component: EnqueteNeObjetsCommercialComponent }
        ]
    }
];
