import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { Obras } from '../../models/Obras';
import { ObrasService } from '../../services/obras.service';
import { CreateObrasDto } from '../../models/createObras.dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from '../../services/storage-service.service';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './obras.component.html',
  styleUrl: './obras.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ObrasComponent {
  
  listObras: Obras[] = [];

  createObras: CreateObrasDto = {
    id: 0,
    nombre: '',
    autor: '',
    archivo: null,
    nombreArchivoOriginal: '',
    descripcion: '',
    nombreArchivo: '',
    municipality_id: 0,
    UsuarioCreacionId: 0
  }

  // Almacena el archivo seleccionado
  selectedFile: File | null = null;
  fileUrl: SafeResourceUrl | null = null;

  spinner: boolean = false;
  Dialog: boolean = false;
  DialogObra: boolean = false;

  first = 0;
  rows = 10;

  EsNuevo: boolean = false;
  
  constructor(
    private obrasService: ObrasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.getAllObras();

  }

  // Obtener lista de obras
  getAllObras(): void {
    this.spinner = true;
    this.obrasService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.listObras = response.data || [];
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
      this.createObras.id = id;
      this.getById(id);
    }
    this.DialogObra = true;
  }

  // Ocultar el modal
  hideDialog() {
    this.DialogObra = false;
    
  }

  // Seleccionar archivo
  onFileSelect(event: any): void {
    if (event && event.currentFiles && event.currentFiles.length > 0) {
      const selectedFile = event.currentFiles[0];
  
      // Verificar que el archivo sea una imagen JPG o PNG
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (validImageTypes.includes(selectedFile.type)) {
        // Opciones de compresión
        const options = {
          maxSizeMB: 5, // Tamaño máximo del archivo en MB
          maxWidthOrHeight: 1920, // Resolución máxima
          useWebWorker: true, // Usar Web Workers para mejor rendimiento
        };
  
        imageCompression(selectedFile, options)
          .then((compressedFile) => {
            this.selectedFile = compressedFile;
            this.createObras.archivo = compressedFile;
            this.createObras.nombreArchivo = compressedFile.name;
  
            // console.log('Tamaño original:', selectedFile.size / 1024, 'KB');
            // console.log('Tamaño comprimido:', compressedFile.size / 1024, 'KB');
          })
          .catch((error) => {
            console.error('Error al comprimir la imagen:', error);
          });
      } else {
        console.error('Solo se permiten imágenes en formato JPG o PNG.');
        // Puedes limpiar el archivo seleccionado o mostrar un mensaje al usuario
        this.selectedFile = null;
        this.createObras.archivo = null;
        this.createObras.nombreArchivo = '';
      }
    } else {
      console.error('No se pudo obtener el archivo seleccionado.');
    }
  }

  // Crear una nueva obra & Actualizar obra
  create(): void {

    this.spinner = true;
    this.createObras.municipality_id = Number(this.storageService.getItem('municipality_id'));
    this.createObras.UsuarioCreacionId = Number(this.storageService.getItem('userId'));

    if (this.createObras.id != 0) {

      this.obrasService.update(this.createObras).subscribe({
        next: (response) => {
          if (response.success) {
            this.hideDialog();
            this.getAllObras();
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

      this.obrasService.create(this.createObras).subscribe({
        next: (response) => {
          if (response.success) {
            this.hideDialog();
            this.getAllObras();
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

  // Validación de boton de guardar
  botonValid(): boolean {

    if (this.createObras.autor.length > 0 && this.createObras.nombre.length > 0  &&  this.createObras.descripcion.length > 0 && 
      this.createObras.nombreArchivo.length > 0)
    {
      return false;
    } else {
      return true;
    }

  }

  // Alerta de confirmación para eliminación obra
  confirmDeleteObra(event: Event, id: number) {

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
        this.deleteObra(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });

  }

  // Advertencia para eliminar imagen del front
  confirmDeleteImagen(event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quieres eliminar esta imagen?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deleteImagen();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }

  // Eliminar imagen del front
  private deleteImagen(){
    this.fileUrl = null;
    this.selectedFile = null;
    this.createObras.archivo = null;
    this.createObras.nombreArchivo = '';
  }

  // Obtener obra por ID
  private getById(id: number) {
    this.spinner = true;
    this.obrasService.getById(id).subscribe((response) => {
      if (response.success && response.data) {
        this.createObras = response.data;
        if (response.data.url && response.data.url.length > 0) {
          const mimeType = this.detectMimeType(response.data.url); // Detectar MIME dinámicamente
          const blob = this.base64ToBlob(response.data.url, mimeType);
          const url = URL.createObjectURL(blob);
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Esto ahora usará un URL seguro
          this.EsNuevo = false;
        }
      }
      this.spinner = false;
    });
  }
  
  // conversion de base64 para archivos
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.prototype.map.call(slice, (char) =>
        char.charCodeAt(0)
      ) as number[];
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    return new Blob(byteArrays, { type: mimeType });
  }
  
  // Detecta dinámicamente el MIME según el prefijo del Base64
  private detectMimeType(base64: string): string {
    if (base64.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (base64.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    }
    return 'image/jpeg'; // Valor predeterminado
  }

  // Eliminar obra
  private deleteObra(id: number) {
    this.spinner = true;
    this.obrasService.delete(id).subscribe((response) => {

      if (response.success) {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: response.message });
        this.getAllObras();
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
    this.createObras.id = 0;
    this.createObras.nombre = '';
    this.createObras.autor = '';
    this.createObras.archivo = '';
    this.createObras.nombreArchivoOriginal = '';
    this.createObras.descripcion = '';
    this.createObras.nombreArchivo = '';

    this.fileUrl = '';
  }

}
