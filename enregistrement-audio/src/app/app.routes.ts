import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TextGenerationComponent } from './text-generation/text-generation.component';
import { ExportDataComponent } from './export-data/export-data.component';
import { ExportFactureDebiteurComponent } from './export-facture-debiteur/export-facture-debiteur.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'textGeneration', component: TextGenerationComponent},
    {path: 'exportData', component: ExportDataComponent},
    {path: 'exportFactureDebiteur', component: ExportFactureDebiteurComponent}
];
