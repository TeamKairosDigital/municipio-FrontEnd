import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme: string;

  constructor() {
    // Cargar el tema desde localStorage al iniciar la aplicación
    this.currentTheme = localStorage.getItem('theme') || 'saga-blue'; // Tema por defecto

    // Aplicar el tema actual al iniciar la aplicación
    this.applyTheme(this.currentTheme);
  }

  changeTheme(theme: string) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `https://cdn.jsdelivr.net/npm/primeng/resources/themes/${theme}/theme.css`;
      this.currentTheme = theme;

      // Guardar el tema seleccionado en localStorage
      localStorage.setItem('theme', theme);
    } else {
      console.error('Elemento link para el tema no encontrado.');
    }
  }

  // Aplicar el tema actual (para ser llamado al iniciar la aplicación)
  private applyTheme(theme: string) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `https://cdn.jsdelivr.net/npm/primeng/resources/themes/${theme}/theme.css`;
    } else {
      console.error('Elemento link para el tema no encontrado.');
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}
