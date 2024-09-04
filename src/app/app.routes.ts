import { Routes } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { FileViewComponent } from './components/file-view/file-view.component';

export const routes: Routes = [
    { path: 'documentos', component: DocumentosComponent },
    { path: 'verArchivo', component: FileViewComponent },
    { path: '', redirectTo: '/documentos', pathMatch: 'full' }
];
