import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getFileDto } from '../../models/getFile.dto';
import { S3Service } from '../../services/s3.service';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-file-view',
  standalone: true,
    imports: [ImportsModule],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.css',
  providers: [S3Service, MessageService]
})
export class FileViewComponent implements OnInit{

  idArchivo: string = '';
  spinner: boolean = false;
  fileUrl: SafeResourceUrl | null = null;

  getFileDto: getFileDto = {
    id: 0,
    repository: 'archivosRepository',
    folder: 'Documentos',  
  };

  constructor(
    private route: ActivatedRoute,
    private s3Service: S3Service,
    private messageService: MessageService,
        private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idArchivo = params['id']; // Accedes al parámetro 'id'
      this.getFileDto.id = Number(this.idArchivo);
      console.log('ID del archivo:', this.idArchivo);
    });

    this.getFile();
  }

  getFile(){
    this.spinner = true; // Muestra el spinner mientras se procesa la solicitud
    this.s3Service.getFileBase64(this.getFileDto).subscribe({
      next: (response) => {
        if (response.success) {
          // this.archivoBase64 = response.data; // Aquí obtienes el archivo en base64
          // console.log('Archivo en base64:', this.archivoBase64);
          if (typeof response.data === 'string') {
            const blob = this.base64ToBlob(response.data, 'application/pdf');
            const url = URL.createObjectURL(blob);
            this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Esto ahora usará un URL seguro
          } else {
            throw new Error('Invalid file data');
          }
          // const url = URL.createObjectURL(blob);
          // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Esto ahora usará un URL seguro
          this.spinner = false;
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Archivo recuperado con éxito', 
            life: 5000 
          });
        } else {
          this.messageService.add({
            severity: 'error', 
            summary: 'Error', 
            detail: response.message, 
            life: 5000 
          });
        }
        this.spinner = false; // Detén el spinner en ambos casos
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al recuperar el archivo',
          life: 5000
        });
        this.spinner = false; // Detén el spinner en caso de error
      },
      complete: () => {
        console.log('La solicitud ha sido completada.');
      }
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

}
