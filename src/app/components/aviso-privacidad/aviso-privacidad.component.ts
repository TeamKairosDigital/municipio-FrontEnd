import { Component } from '@angular/core';
import { AvisoPrivacidadService } from '../../services/aviso-privacidad.service';
import { filterAvisoPrivacidadDto } from '../../models/filterAvisoPrivacidadDto';
import { listAvisoPrivacidad } from '../../models/listAvisoPrivacidadDto';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { ImportsModule } from '../../imports';
import { createAvisoPrivacidadDto } from '../../models/createAvisoPrivacidadDto';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-aviso-privacidad',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.css'
})
export class AvisoPrivacidadComponent {

  constructor(
    private avisoPrivacidadService: AvisoPrivacidadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  expandedRows: { [key: string]: boolean } = {};

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
  DialogArchivo: boolean = false;

  first = 0;
  rows = 10;

  ngOnInit() {
    this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);

    // Obtener el valor guardado en localStorage
    const userString = localStorage.getItem('user');

    // Verificar si el valor existe antes de convertirlo a objeto
    if (userString) {
      const userObject = JSON.parse(userString);
      this.createAvisoPrivacidadDto.municipality_id = userObject.municipality_id;
      this.createAvisoPrivacidadDto.usuarioId = userObject.id;
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

  hideDialogArchivo() {
    this.DialogArchivo = false;
  }

  createAvisoPrivacidad(): void {
    this.spinner = true;

    this.avisoPrivacidadService.createAvisoPrivacidad(this.createAvisoPrivacidadDto).subscribe((response) => {
      if (response.success) {
        this.hideDialog();
        this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
      }
      this.spinner = false;
    });
  }

  getAvisoPrivacidad(id: number): void {

  }

  confirmDeleteDocument(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este documento?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteDocument(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }

  deleteDocument(id: number) {
    this.avisoPrivacidadService.deleteAvisoPrivacidad(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Su archivo ha sido eliminado' });
        this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al eliminar su archivo' });
        console.error('Error deleting document:', err);
      }
    });
  }

  createAvisoPrivacidadArchivo(): void {
    this.spinner = true;

    this.avisoPrivacidadService.createAvisoPrivacidad(this.createAvisoPrivacidadDto).subscribe((response) => {
      if (response.success) {
        this.hideDialog();
        this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
      }
      this.spinner = false;
    });
  }

}
