import { Component } from '@angular/core';
import { AvisoPrivacidadService } from '../../services/aviso-privacidad.service';
import { filterAvisoPrivacidadDto } from '../../models/filterAvisoPrivacidadDto';
import { listAvisoPrivacidad } from '../../models/listAvisoPrivacidadDto';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { ImportsModule } from '../../imports';
import { createAvisoPrivacidadDto } from '../../models/createAvisoPrivacidadDto';

@Component({
  selector: 'app-aviso-privacidad',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.css'
})
export class AvisoPrivacidadComponent {

  constructor(
    private avisoPrivacidadService: AvisoPrivacidadService
  ) { }

  listAvisoPrivacidad: listAvisoPrivacidad[] = [];
  createAvisoPrivacidadDto: createAvisoPrivacidadDto = {
    nombreAvisoPrivacidad: '',
    usuarioId: 0,
    municipality_id: 0
  };
  filterAvisoPrivacidadDto: filterAvisoPrivacidadDto = {
    municipioId: 0
  }

  spinner: boolean = false;
  Dialog: boolean = false;

  first = 0;
  rows = 10;

  ngOnInit() {
    this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);

    // Obtener el valor guardado en localStorage
    const userString = localStorage.getItem('user');

    // Verificar si el valor existe antes de convertirlo a objeto
    if (userString) {
      const userObject = JSON.parse(userString);
      console.log(userObject);  // Aquí puedes acceder a las propiedades del objeto
    }
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  getListAvisoPrivacidad(data: filterAvisoPrivacidadDto): void {
    this.spinner = true;
    this.avisoPrivacidadService.getListAvisoPrivacidad(data).subscribe((response) => {
      if (response.success && response.data) {
        this.listAvisoPrivacidad = response.data;
      }
      this.spinner = false;
    });
  }

  openFileModal() {
    this.Dialog = true;
  }

  hideDialog() {
    this.Dialog = false;
  }

  createAvisoPrivacidad(): void {
    this.spinner = true;
    this.avisoPrivacidadService.createAvisoPrivacidad(this.createAvisoPrivacidadDto).subscribe((response) => {
      if (response.success) {
        this.listAvisoPrivacidad = response.data;
      }
      this.spinner = false;
    });
  }

}
