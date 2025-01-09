import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from './assets/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideAnimations(),  // Agregando BrowserAnimationsModule aquí
    provideHttpClient(withInterceptors([authInterceptorFn])),
  ]
})
  .catch((err) => console.error(err));