import { Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { Sidebar } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [ImportsModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  checked: boolean = false;
  sidebarVisible: boolean = false;

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    // Cargar el estado del tema desde el localStorage al iniciar el componente
    const savedTheme = localStorage.getItem('theme');

    // Si está guardado en localStorage y es el tema oscuro, marcar el switch como activo
    if (savedTheme === 'arya-blue') {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  // Cambiar el tema cuando el switch cambia de estado
  onThemeChange(event: any) {
    if (this.checked) {
      this.themeService.changeTheme('arya-blue'); // Tema oscuro
    } else {
      this.themeService.changeTheme('saga-blue'); // Tema claro
    }
  }

}
