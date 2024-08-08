import { Component } from '@angular/core';
import { DocumentosService } from '../../services/documentos.service';
import { TableModule } from 'primeng/table';
import { DocumentosDto } from '../../models/DocumentosDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {

  documentos: DocumentosDto[] = [];

  selected = '2024';

  constructor(
    private documentosService: DocumentosService
  ) {

  }

  ngOnInit() {
    this.getDocuments();
  }

  getDocuments(): void {
    this.documentosService.getDocumentsWithFiles(this.selected).subscribe((response) => {
      this.documentos = response;
    });
  }


}
