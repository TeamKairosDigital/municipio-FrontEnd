import { Component } from '@angular/core';
import { AvisoPrivacidadService } from '../../services/aviso-privacidad.service';
import { filterAvisoPrivacidadDto } from '../../models/filterAvisoPrivacidadDto';
import { listAvisoPrivacidad } from '../../models/listAvisoPrivacidadDto';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { ImportsModule } from '../../imports';
import { createAvisoPrivacidadDto } from '../../models/createAvisoPrivacidadDto';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { createAvisoPrivacidadArchivoDto } from '../../models/createAvisoPrivacidadArchivo';

@Component({
  selector: 'app-aviso-privacidad',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.css',
  providers: [ConfirmationService, MessageService]
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

  createAvisoPrivacidadArchivoDto: createAvisoPrivacidadArchivoDto = {
    id: 0,
    nombreArchivo: '',
    avisoPrivacidadId: 0,
    archivo: null
  }

  filterAvisoPrivacidadDto: filterAvisoPrivacidadDto = {
    municipioId: 0
  }

  // Almacena el archivo seleccionado
  selectedFile: File | null = null;

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

  openFileModal(name: string) {
    if (name == 'archivo') {
      this.DialogArchivo = true;
    } else {
      this.Dialog = true;
    }
  }

  hideDialog(name: string) {
    if (name == 'archivo') {
      this.DialogArchivo = false;
    } else {
      this.Dialog = false;
    }
  }

  createAvisoPrivacidad(): void {
    this.spinner = true;

    if (this.createAvisoPrivacidadDto.id != 0) {
      this.avisoPrivacidadService.editAvisoPrivacidad(this.createAvisoPrivacidadDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
        }
        this.spinner = false;
      });
    } else {
      this.avisoPrivacidadService.createAvisoPrivacidad(this.createAvisoPrivacidadDto).subscribe((response) => {
        if (response.success) {
          this.hideDialog('');
          this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
        }
        this.spinner = false;
      });
    }

  }

  getAvisoPrivacidad(id: number, nuevo: boolean): void {

    if (id != 0 && !nuevo) {

      this.avisoPrivacidadService.getAvisoPrivacidad(id).subscribe((response) => {

        if (response.success && response.data) {
          this.createAvisoPrivacidadDto.id = response.data.id;
          this.createAvisoPrivacidadDto.nombreAvisoPrivacidad = response.data.Nombre;
          this.openFileModal('');
        }

      });

    } else {
      this.createAvisoPrivacidadDto.id = 0;
      this.createAvisoPrivacidadDto.nombreAvisoPrivacidad = '';
      this.openFileModal('');
    }

  }


  confirmDeleteDocument(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este aviso de privacidad?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteAvisoPrivacidad(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }

  deleteAvisoPrivacidad(id: number) {
    this.avisoPrivacidadService.deleteAvisoPrivacidad(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Aviso de privacidad ha sido eliminado' });
        this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al eliminar Aviso de privacidad' });
        console.error('Error deleting document:', response.message);
      }
    });
  }


  openModalArchivo(id: number) {

    if (this.createAvisoPrivacidadArchivoDto.id != 0) {
      this.openFileModal('archivo');
    } else {
      this.selectedFile = null;
      this.createAvisoPrivacidadArchivoDto.nombreArchivo = '';
    }
    this.openFileModal('archivo');

  }

  onFileSelect(event: any): void {

    if (event && event.currentFiles && event.currentFiles.length > 0) {
      const selectedFile = event.currentFiles[0];

      // Verificar que el archivo sea un PDF
      if (selectedFile.type === 'application/pdf') {
        this.selectedFile = selectedFile;
        this.createAvisoPrivacidadArchivoDto.archivo = this.selectedFile;
      } else {
        console.error('Solo se permiten archivos PDF.');
        // Puedes limpiar el archivo seleccionado o mostrar un mensaje al usuario
        this.selectedFile = null;
        this.createAvisoPrivacidadArchivoDto.archivo = null;
      }
    } else {
      console.error('No se pudo obtener el archivo seleccionado.');
    }
  }

  isFormValid(value: string): boolean {

    if (value == 'archivo') {
      if (this.selectedFile != null && this.createAvisoPrivacidadArchivoDto.nombreArchivo.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.createAvisoPrivacidadDto.nombreAvisoPrivacidad.length > 0) {
        return false;
      } else {
        return true;
      }
    }

  }

  // Método para guardar el archivo
  saveFile(): void {
    this.spinner = true;
    if (this.selectedFile) {
      console.log(this.createAvisoPrivacidadArchivoDto)
      this.avisoPrivacidadService.createAvisoPrivacidadArchivo(this.createAvisoPrivacidadArchivoDto).subscribe({
        next: (response) => {
          // if(response)
          this.hideDialog('archivo');

          this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Su archivo ha sido guardado correctamente' });
          console.log('Archivo guardado exitosamente:', response);
          this.spinner = false;
        },
        error: (err) => {
          console.error('Error al guardar el archivo:', err);
          this.spinner = false;
        }
      });
    } else {
      console.error('No se ha seleccionado ningún archivo.');
      this.spinner = false;
    }
  }

}
