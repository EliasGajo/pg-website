import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TextGenerationComponent } from './text-generation/text-generation.component';
import { ExportDataComponent } from './export-data/export-data.component';
import { ExportFactureDebiteurComponent } from './export-facture-debiteur/export-facture-debiteur.component';
import { ExportCoproprietaireComponent } from './export-coproprietaire/export-coproprietaire.component';
import { TournusImmeubleComponent } from './tournus-immeuble/tournus-immeuble.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'textGeneration', component: TextGenerationComponent},
    {path: 'exportData', component: ExportDataComponent},
    {path: 'exportFactureDebiteur', component: ExportFactureDebiteurComponent},
    {path: 'exportCoproprietaire', component: ExportCoproprietaireComponent},
    {path: 'tournusImmeuble', component: TournusImmeubleComponent}
];
