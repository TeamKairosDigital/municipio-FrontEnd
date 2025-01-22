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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from '../../services/storage-service.service';

@Component({
  selector: 'app-aviso-privacidad',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.css',
  providers: [ConfirmationService, MessageService]
})
export class AvisoPrivacidadComponent {

  // Tabla
  expandedRows: { [key: string]: boolean } = {};

  listAvisoPrivacidad: listAvisoPrivacidad[] = [];

  filterAvisoPrivacidadDto: filterAvisoPrivacidadDto = {
    municipioId: 0
  }

  first = 0;
  rows = 10;

  // Crear y editar Aviso de privacidad
  createAvisoPrivacidadDto: createAvisoPrivacidadDto = {
    nombreAvisoPrivacidad: '',
    usuarioCreacionId: 0,
    municipality_id: 0
  };

  // Crear y editar archivo de Aviso de privacidad
  createAvisoPrivacidadArchivoDto: createAvisoPrivacidadArchivoDto = {
    id: 0,
    nombreArchivo: '',
    nombreArchivoOriginal: '',
    avisoPrivacidadId: 0,
    archivo: null
  }

  // Almacena el archivo seleccionado
  selectedFile: File | null = null;
  fileUrl: SafeResourceUrl | null = null;

  spinner: boolean = false;
  Dialog: boolean = false;
  DialogArchivo: boolean = false;

  EsNuevo: boolean = false;

  constructor(
    private avisoPrivacidadService: AvisoPrivacidadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
  }

  // Tabla
  // Obtener lista de Aviso de privacidad con sus archivos si existen
  getListAvisoPrivacidad(data: filterAvisoPrivacidadDto): void {
    this.spinner = true;
    this.avisoPrivacidadService.getListAvisoPrivacidad(data).subscribe((response) => {
      if (response.success && response.data) {
        this.listAvisoPrivacidad = response.data;
        this.listAvisoPrivacidad.forEach((element) => {
          element.icon = 'pi pi-chevron-right';
        });
      }
      this.spinner = false;
    });
  }

  // Paginación de tabla
  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  toggleIcon(documento: any): void {
    documento.icon = 
      documento.icon === 'pi pi-chevron-right' ? 
      'pi pi-chevron-down' : 
      'pi pi-chevron-right';
  }
  // Tabla


  // Aviso de privacidad
  // Abrir modal para formulario
  openFileModal(name: string) {
    if (name == 'archivo') {
      this.DialogArchivo = true;
    } else {
      this.Dialog = true;
    }
  }

  // Ocultar modal para formulario
  hideDialog(name: string) {
    if (name == 'archivo') {
      this.DialogArchivo = false;
    } else {
      this.Dialog = false;
    }
  }

  // Crear y editar aviso de privacidad
  createAvisoPrivacidad(): void {
    this.spinner = true;
    this.createAvisoPrivacidadDto.usuarioCreacionId = Number(this.storageService.getItem('userId'));
    this.createAvisoPrivacidadDto.municipality_id = Number(this.storageService.getItem('municipality_id'));

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

  // Obtener aviso de privacidad por id
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

  // Alerta de confirmación para eliminación
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
  // Aviso de privacidad


  // Aviso de privacidad archivo
  // Abrir modal para formulario
  openModalArchivo(id: number) {

    // if (this.createAvisoPrivacidadArchivoDto.id != 0) {
    //   this.openFileModal('archivo');
    // } else {
    //   this.selectedFile = null;
    //   this.createAvisoPrivacidadArchivoDto.id = 0;
    //   this.createAvisoPrivacidadArchivoDto.nombreArchivo = '';
    //   this.EsNuevo = true;
    // }
    // this.createAvisoPrivacidadArchivoDto.avisoPrivacidadId = id;
    // this.openFileModal('archivo');

    this.selectedFile = null;
    this.createAvisoPrivacidadArchivoDto.id = 0;
    this.createAvisoPrivacidadArchivoDto.nombreArchivo = '';
    this.createAvisoPrivacidadArchivoDto.avisoPrivacidadId = id;
    this.EsNuevo = true;
    this.openFileModal('archivo');
  }

  // Seleccionar archivo
  onFileSelect(event: any): void {

    if (event && event.currentFiles && event.currentFiles.length > 0) {
      const selectedFile = event.currentFiles[0];

      // Verificar que el archivo sea un PDF
      if (selectedFile.type === 'application/pdf') {
        this.selectedFile = selectedFile;
        this.createAvisoPrivacidadArchivoDto.archivo = this.selectedFile;
        this.createAvisoPrivacidadArchivoDto.nombreArchivoOriginal = selectedFile.name;
      } else {
        console.error('Solo se permiten archivos PDF.');
        // Puedes limpiar el archivo seleccionado o mostrar un mensaje al usuario
        this.selectedFile = null;
        this.createAvisoPrivacidadArchivoDto.archivo = null;
        this.createAvisoPrivacidadArchivoDto.nombreArchivoOriginal = '';
      }
    } else {
      console.error('No se pudo obtener el archivo seleccionado.');
    }
  }

  // Obtener archivo de aviso de privaciad por id
  getAvisoPrivacidadArchivo(id: number, nuevo: boolean): void {

    // if (id != 0 && !nuevo) {

      this.avisoPrivacidadService.getAvisoPrivacidadArchivo(id).subscribe((response) => {

        if (response.success && response.data) {
          // console.log(response.data);
          this.createAvisoPrivacidadArchivoDto.id = response.data.id;
          this.createAvisoPrivacidadArchivoDto.nombreArchivo = response.data.nombreArchivo;
          if(response.data.url.length > 0){
            const blob = this.base64ToBlob(response.data.url, 'application/pdf');
            const url = URL.createObjectURL(blob);
            this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Esto ahora usará un URL seguro
            this.EsNuevo = false;
          }
          this.openFileModal('archivo');
        }

      });

    // } else {
    //   this.createAvisoPrivacidadDto.id = 0;
    //   this.createAvisoPrivacidadDto.nombreAvisoPrivacidad = '';
    //   this.openFileModal('archivo');
    // }

  }

  // Alerta de confirmación para eliminación de archivo
  confirmDeleteDocumentArchivo(event: Event, id: number) {

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
        this.deleteAvisoPrivacidadArchivo(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }
  // Aviso de privacidad archivo


  // Método para guardar el archivo
  saveFile(): void {
    this.spinner = true;
    // console.log(this.createAvisoPrivacidadArchivoDto)
    if(this.createAvisoPrivacidadArchivoDto.id != 0){
      //if (this.selectedFile) {

        this.avisoPrivacidadService.editAvisoPrivacidadArchivo(this.createAvisoPrivacidadArchivoDto).subscribe({
          next: (response) => {
            // if(response)
            this.hideDialog('archivo');

            this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Su archivo ha sido guardado correctamente' });
            // console.log('Archivo guardado exitosamente:', response);
            this.spinner = false;
          },
          error: (err) => {
            console.error('Error al guardar el archivo:', err);
            this.spinner = false;
          }
        });
      // } else {
      //   console.error('No se ha seleccionado ningún archivo.');
      //   this.spinner = false;
      // }
    }else{
      if (this.selectedFile) {

        this.avisoPrivacidadService.createAvisoPrivacidadArchivo(this.createAvisoPrivacidadArchivoDto).subscribe({
          next: (response) => {
            // if(response)
            this.hideDialog('archivo');

            this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Su archivo ha sido guardado correctamente' });
            // console.log('Archivo guardado exitosamente:', response);
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

  // Validación de boton de guardar
  isFormValid(value: string): boolean {

    if (value == 'archivo') {
      if (this.EsNuevo && this.selectedFile != null && this.createAvisoPrivacidadArchivoDto.nombreArchivo.length > 0) {
        return false;
      } else if(!this.EsNuevo && this.createAvisoPrivacidadArchivoDto.id != 0 && this.createAvisoPrivacidadArchivoDto.nombreArchivo.length > 0){
        return false;
      }else{
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
  
  // conversion de base64 para archivos
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.prototype.map.call(slice, (char) => char.charCodeAt(0)) as number[];
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  // Eliminar aviso de privacidad 
  private deleteAvisoPrivacidad(id: number) {
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

  // Eliminar aviso de privacidad archivo
  private deleteAvisoPrivacidadArchivo(id: number) {
    this.avisoPrivacidadService.deleteAvisoPrivacidadArchivo(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Aviso de privacidad ha sido eliminado' });
        this.getListAvisoPrivacidad(this.filterAvisoPrivacidadDto);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al eliminar Aviso de privacidad' });
        console.error('Error deleting document:', response.message);
      }
    });
  }

}