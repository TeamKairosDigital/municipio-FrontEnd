import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvisoPrivacidadService } from '../../services/aviso-privacidad.service';
import { StorageService } from '../../services/storage-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OtrosDocumentosDto } from '../../models/otrosDocumentos.dto';
import { createOtroDocumentoDto } from '../../models/createOtroDocumento.dto';

@Component({
  selector: 'app-otros-documentos',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './otros-documentos.component.html',
  styleUrl: './otros-documentos.component.css',
  providers: [ConfirmationService, MessageService]
})
export class OtrosDocumentosComponent {

  list: OtrosDocumentosDto[] = [];

  create: createOtroDocumentoDto = {
    id: 0,
    nombreArchivo: '',
    nombre: '',
    municipality_id: 0,
    usuarioCreacion_Id: 0,
    archivo: null
  };

  // Almacena el archivo seleccionado
  selectedFile: File | null = null;
  fileUrl: SafeResourceUrl | null = null;

  spinner: boolean = false;
  Dialog: boolean = false;

  first = 0;
  rows = 10;

  constructor(
    private avisoPrivacidadService: AvisoPrivacidadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.spinner = true;
    this.avisoPrivacidadService.getOtrosDocumentos().subscribe({
      next: (response) => {
        if (response.success) {
          this.list = response.data || [];
          // console.log('Listado de documentos:', this.list.length);
          // this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message, life: 10000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
        }
        this.spinner = false; // Detén el spinner en ambos casos
      },
      error: (error) => {
        // Maneja el error del backend y muestra un mensaje
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al crear el empleado',
          life: 10000
        });
        this.spinner = false; // Detén el spinner en caso de error
      },
    });

  }

  // Paginación de tabla
  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Abrir modal para formulario
  openModal(id: number = 0){
    // this.EsNuevo = true;
    this.clear();
    if(id != 0){
      this.create.id = id;
      this.getById(id);
    }
    this.Dialog = true;
  }

  // Ocultar el modal
  hideDialog() {
    this.Dialog = false;
  }

  onFileSelect(event: any): void {
    if (event && event.currentFiles && event.currentFiles.length > 0) {
      const selectedFile = event.currentFiles[0];

      // Verificar que el archivo sea un PDF
      if (selectedFile.type === 'application/pdf') {
        this.selectedFile = selectedFile;
        this.create.archivo = this.selectedFile;
        this.create.nombreArchivo = selectedFile.name;
      } else {
        console.error('Solo se permiten archivos PDF.');
        // Puedes limpiar el archivo seleccionado o mostrar un mensaje al usuario
        this.selectedFile = null;
        this.create.archivo = null;
        this.create.nombreArchivo = '';
      }
    } else {
      console.error('No se pudo obtener el archivo seleccionado.');
    }
  }

  createDocument(): void {

    this.spinner = true;
    this.create.municipality_id = Number(this.storageService.getItem('municipality_id'));
    this.create.usuarioCreacion_Id = Number(this.storageService.getItem('userId'));

    if (this.create.id != 0) {

      this.avisoPrivacidadService.updateOtroDocumento(this.create).subscribe({
        next: (response) => {
          if (response.success) {
            this.hideDialog();
            this.getAll();
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message, life: 10000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
          }
          this.spinner = false; // Detén el spinner en ambos casos
        },
        error: (error) => {
          // Maneja el error del backend y muestra un mensaje
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al crear el empleado',
            life: 10000
          });
          this.spinner = false; // Detén el spinner en caso de error
        },
      });

    } else {

      this.avisoPrivacidadService.createOtroDocumento(this.create).subscribe({
        next: (response) => {
          if (response.success) {
            this.hideDialog();
            this.getAll();
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: response.message, life: 10000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
          }
          this.spinner = false; // Detén el spinner en ambos casos
        },
        error: (error) => {
          // Maneja el error del backend y muestra un mensaje
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al crear el empleado',
            life: 10000
          });
          this.spinner = false; // Detén el spinner en caso de error
        },
      });

    }

  }

  confirmDelete(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar este empleado?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.delete(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });

  }

  // Advertencia para eliminar Archivo del front
  confirmDeleteArchivo(event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar esta Archivo?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteArchivo();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }

  // Eliminar Archivo del front
  private deleteArchivo(){
    this.fileUrl = null;
    this.selectedFile = null;
    this.create.archivo = null;
    this.create.nombreArchivo = '';
  }

  botonValid(): boolean {

    if (this.create.nombre.length > 0 && this.create.nombreArchivo.length > 0)
    {
      return false;
    } else {
      return true;
    }

  }

  // Obtener obra por ID
  private getById(id: number) {
    this.spinner = true;
    this.avisoPrivacidadService.findOneOtroDocumento(id).subscribe((response) => {
      if (response.success && response.data) {
        this.create = response.data;
        if (response.data.url && response.data.url.length > 0) {

          const blob = this.base64ToBlob(response.data.url, 'application/pdf');
          const url = URL.createObjectURL(blob);
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Esto ahora usará un URL seguro

          // this.EsNuevo = false;
        }
      }
      this.spinner = false;
    });
  }

  private detectMimeType(base64: string): string {
    if (base64.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (base64.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    }
    return 'image/jpeg'; // Valor predeterminado
  }

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

  // Eliminar obra
  private delete(id: number) {
    this.spinner = true;
    this.avisoPrivacidadService.deleteOtroDocumento(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: response.message });
        this.getAll();
        this.clear();
        this.spinner = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        console.error('Error deleting document:', response.message);
        this.spinner = false;
      }

    });
  }

  // Limpiar variables
  private clear(){

    //createObras
    this.create.id = 0;
    this.create.nombre = '';
    this.create.archivo = '';
    this.create.nombreArchivo = '';

    this.fileUrl = '';
  }

}
