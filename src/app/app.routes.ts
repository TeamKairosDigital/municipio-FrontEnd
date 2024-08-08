import { Routes } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';

export const routes: Routes = [
    { path: 'documentos', component: DocumentosComponent },
    // { path: 'file-modal/:id', component: FileModalComponent },
    { path: '', redirectTo: '/documentos', pathMatch: 'full' }
];
