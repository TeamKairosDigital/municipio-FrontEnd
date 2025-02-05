import { Component, ViewChild } from '@angular/core';
import { DocumentosService } from '../../services/documentos.service';
import { DocumentosDto } from '../../models/DocumentosDto';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { DocumentosFiltrosDto } from '../../models/DocumentosFiltrosDto';
import { periodoDto } from '../../models/periodoDto';
import { yearsDto } from '../../models/yearsDto';
import { ley } from '../../models/ley';
import { ModalData } from '../../models/ModalData';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { createFileDto } from '../../models/createFileDto';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Documents } from '../../models/archivo';
import { ImportsModule } from '../../imports';
import { StorageService } from '../../services/storage-service.service';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
  providers: [ConfirmationService, MessageService, SideBarComponent]
})
export class DocumentosComponent {

  @ViewChild('configSidebar') configSidebar!: SideBarComponent;

  toggleSidebar(): void {
    this.configSidebar.sidebarVisible = !this.configSidebar.sidebarVisible;
  }

  spinner: boolean = false;
  isDisabled: boolean = true;

  DocumentosFiltros: DocumentosFiltrosDto;

  // dataSource = new MatTableDataSource<Archivo>();
  // anualidad: string = '2024';
  periods: periodoDto[] = [];
  displayedColumns: string[] = [];

  // Array de objetos para la seleccion de filtro en la tabla
  years: yearsDto[] = [
    { value: '2024', viewValue: '2024' },
    { value: '2025', viewValue: '2025' },
    { value: '2026', viewValue: '2026' },
    { value: '2027', viewValue: '2027' },
  ];

  selectedYear: yearsDto | any;

  leyes: ley[] = [
    { value: '-1', viewValue: 'Todos' },
    { value: 'LGCG', viewValue: 'LGCG' },
    { value: 'DF', viewValue: 'DF' },
  ];

  selectedLey: ley | any;

  tiposDocumentos: ley[] = [
    { value: '-1', viewValue: 'Todos' },
    { value: '1', viewValue: 'SEVAC' },
    { value: '2', viewValue: 'SRFT' },
  ];

  archivoSeleccionado: ModalData = new ModalData;

  documentos: DocumentosDto[] = [];

  first = 0;
  rows = 10;

  // Para ocultar el dialgo
  fileDialog: boolean = false;

  // Almacena el archivo seleccionado
  selectedFile: File | null = null;
  fileUrl: SafeResourceUrl | null = null;

  // Objeto para enviar archivo nuevo
  createFileDto: createFileDto = {
    idArchivo: 0,
    nombreArchivo: '',
    documentoId: 0,
    periodoId: 0,
    anualidad: '',
    archivo: null,
    usuarioCreacionId: 0,
    municipality_id: 0
  };

  // Variable para definir si es nuevo archivo para ocultar cierto botones
  EsNuevo: boolean = false;

  sanitizedUrl: SafeResourceUrl | null = null;

  currentYear: string = '';

  constructor(
    private documentosService: DocumentosService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private storageService: StorageService
  ) {
    const today = new Date();
    this.currentYear = today.getFullYear().toString();

    this.DocumentosFiltros = {
      year: this.currentYear,
      ley: '-1',
      documento: ''
    }
  }

  ngOnInit() {

    this.selectedYear = this.years.find(year => year.value === this.currentYear);
    this.selectedLey = this.leyes.find(ley => ley.value === '-1');

    //Obtenemos la lista de periodos
    this.getPeriodos();

    //Obtenemos la lista para los documentos juntos con sus archivos existentes
    this.getDocuments(this.DocumentosFiltros);

    this.createFileDto.usuarioCreacionId = Number(this.storageService.getItem('userId'));
    this.createFileDto.municipality_id = Number(this.storageService.getItem('municipality_id'));

  }

  getDocuments(data: DocumentosFiltrosDto): void {
    this.spinner = true;
    this.documentosService.getDocumentsWithFiles(data).subscribe((response) => {
      if (response.success && response.data) {
        this.documentos = response.data;
      }
      this.spinner = false;
    });
  }

  getPeriodos(): void {
    this.documentosService.getPeriodos().subscribe((response) => {
      if (response.success && response.data) {
        this.periods = response.data;
        const periodNames = this.periods.map(period => period.nombrePeriodo);
        this.setupColumns(periodNames);
      }
    })
  }

  setupColumns(periodNames: string[]): void {
    this.displayedColumns = [
      'nombreDocumento', 'ley', 'categoria',
      ...periodNames.map(period => `period_${period}`)
    ];
  }

  onInputChange(value: string) {
    if (value.length >= 5 || value.length == 0) { // Ejecuta la función después de 3 caracteres
      this.onChange(value, 'documento');
    }
  }

  onChange(event: any, filtro: string): void {

    switch (filtro) {
      case 'year':
        this.DocumentosFiltros.year = event.value.value;
        break;
      case 'leyes':
        this.DocumentosFiltros.ley = event.value.value;
        break
      case 'documento':
        this.DocumentosFiltros.documento = event;
        break
    }

    this.getDocuments(this.DocumentosFiltros);
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.documentos ? this.first === this.documentos.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.documentos ? this.first === 0 : true;
  }

  hasFileForPeriod(element: any, period: string): boolean {
    return element.archivos.some((archivo: any) => archivo.periodo === period);
  }

  openFileModal(document: Documents, period: periodoDto, nuevo: boolean): void {
    this.selectedFile = null;
    this.fileUrl = null;

    this.archivoSeleccionado.IdDocumento = document.id;
    this.archivoSeleccionado.Anualidad = this.selectedYear.value;
    this.archivoSeleccionado.IdArchivo = 0;
    this.archivoSeleccionado.NombreDocumento = document.nombreDocumento;
    this.archivoSeleccionado.PeriodoNombre = period.nombrePeriodo;
    this.archivoSeleccionado.PeriodoId = period.id;

    if (!nuevo) {

      let documentoSeleccionado = document.archivos.filter(archivo => archivo.periodo === period.nombrePeriodo);
      this.archivoSeleccionado.IdArchivo = documentoSeleccionado[0].id;
      this.createFileDto.idArchivo = this.archivoSeleccionado.IdArchivo;
      this.EsNuevo = false;

      if (this.archivoSeleccionado.IdArchivo > 0) {
        this.getFileBase64(this.archivoSeleccionado.IdArchivo);
        this.createFileDto.idArchivo = this.archivoSeleccionado.IdArchivo;
      }

    } else {
      this.EsNuevo = true;
    }

    this.createFileDto.documentoId = document.id;
    this.createFileDto.periodoId = period.id;
    this.createFileDto.anualidad = this.selectedYear.value;


    this.fileDialog = true;

    // if (this.archivoSeleccionado) {
    //   const dialogRef = this.dialog.open(FileModalComponent, {
    //     maxWidth: '100vw',
    //     maxHeight: '100vh',
    //     width: '60%',
    //     panelClass: 'full-screen-modal',
    //     data: this.archivoSeleccionado // Pasa el archivo seleccionado al modal
    //   });

    //   dialogRef.afterClosed().subscribe(result => {

    //   });
    // } else {
    //   console.log('No se encontró archivo para el período:', period);
    // }
  }

  getFileBase64(id: number): void {
    this.spinner = true;
    this.documentosService.getFileBase64(id).subscribe({
      next: (response) => {
        const base64 = response.data?.base64;
        if (base64) {
          const blob = this.base64ToBlob(base64, 'application/pdf');
          const url = URL.createObjectURL(blob);
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Esto ahora usará un URL seguro
          this.spinner = false;
        }
      },
      error: (err) => {
        console.error('Error fetching file base64', err);
        this.spinner = false;
      }
    });
  }
  
  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.prototype.map.call(slice, (char) => char.charCodeAt(0)) as number[];
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    return new Blob(byteArrays, { type: mimeType });
  }

  hideDialog() {
    this.fileDialog = false;
  }

  isFormValid(): boolean {
    if (this.selectedFile) {
      return false;
    } else {
      return true;
    }

  }

  onFileSelect(event: any): void {

    if (event && event.currentFiles && event.currentFiles.length > 0) {
      const selectedFile = event.currentFiles[0];

      // Verificar que el archivo sea un PDF
      if (selectedFile.type === 'application/pdf') {
        this.selectedFile = selectedFile;
        this.createFileDto.archivo = this.selectedFile;
        this.createFileDto.nombreArchivo = selectedFile.name;
      } else {
        console.error('Solo se permiten archivos PDF.');
        // Puedes limpiar el archivo seleccionado o mostrar un mensaje al usuario
        this.selectedFile = null;
        this.createFileDto.archivo = null;
        this.createFileDto.nombreArchivo = '';
      }
    } else {
      console.error('No se pudo obtener el archivo seleccionado.');
    }
  }

  // Método para guardar el archivo
  saveFile(): void {
    if (this.selectedFile) {
      // console.log(this.createFileDto)
      this.documentosService.uploadFile(this.createFileDto).subscribe({
        next: (response) => {
          // if(response)
          this.fileDialog = false;

          this.getDocuments(this.selectedYear.value);
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Su archivo ha sido guardado correctamente' });
          // console.log('Archivo guardado exitosamente:', response);
        },
        error: (err) => {
          console.error('Error al guardar el archivo:', err);
        }
      });
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }

  confirmDeleteDocument(event: Event) {

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
        this.fileDialog = false;
        this.deleteDocument();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado' });
      }
    });
  }

  deleteDocument() {
    this.documentosService.deleteDocument(this.archivoSeleccionado.IdArchivo).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Su archivo ha sido eliminado' });
        this.getDocuments(this.selectedYear.value);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se produjo un error al eliminar su archivo' });
        console.error('Error deleting document:', err);
      }
    });
  }

  verArchivo() {
    // const url = this.router.createUrlTree(['/verArchivo', { id: this.archivoSeleccionado.IdArchivo }]).toString();
    // window.open(url, '_blank');

    // const url = this.router.createUrlTree(['/verArchivo', { id: this.archivoSeleccionado.IdArchivo }]).toString();
    // this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // window.open(this.sanitizedUrl as string, '_blank');

    // const urlTree = this.router.createUrlTree(['/verArchivo'], { queryParams: { id: this.archivoSeleccionado.IdArchivo } });
    // const url = this.router.serializeUrl(urlTree);
    // const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // window.open(sanitizedUrl as string, '_blank');

    const idArchivo = this.archivoSeleccionado.IdArchivo;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/verArchivo'], { queryParams: { id: idArchivo } })
    );
    window.open(url, '_blank');
  }

  // getFileBase64(id: number): void {
  //   this.spinner = true;
  //   this.documentosService.getFileBase64(id).subscribe({
  //     next: (response) => {
  //       const base64 = response.data?.base64;
  //       this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${base64}`);
  //       this.spinner = false;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching file base64', err);
  //       this.spinner = false;
  //     }
  //   });
  // }

}
