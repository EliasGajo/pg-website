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
    {path: 'tournusImmeuble', component: TournusImmeubleComponent},
    {path: 'exportMoyenPaiement', component: ExportMoyenPaiementComponent},
    {path: 'exportQrMultiple', component: QrMultipleComponent},
    {path: 'modificationExcel', component: ModificationExcelComponent}
];
