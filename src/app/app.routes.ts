import { Routes } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { FileViewComponent } from './components/file-view/file-view.component';
import { LoginComponent } from './components/login/login.component';
import { AvisoPrivacidadComponent } from './components/aviso-privacidad/aviso-privacidad.component';
import { ObrasComponent } from './components/obras/obras.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'loginAdmin', component: LoginComponent }, // Acceso directo al login
    { path: 'documentos', component: DocumentosComponent, canActivate: [AuthGuard] },
    { path: 'verArchivo', component: FileViewComponent, canActivate: [AuthGuard] },
    { path: 'avisoPrivacidad', component: AvisoPrivacidadComponent, canActivate: [AuthGuard] },
    { path: 'obras', component: ObrasComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'loginAdmin', pathMatch: 'full' } // Wildcard redirige al componente por defecto
];