import { Routes } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { FileViewComponent } from './components/file-view/file-view.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'documentos', component: DocumentosComponent },
    { path: 'verArchivo', component: FileViewComponent },
    { path: '**', redirectTo: 'login' }
];
