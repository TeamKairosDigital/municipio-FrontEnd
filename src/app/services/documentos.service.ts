import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentosDto } from '../models/DocumentosDto';
import { DocumentosFiltrosDto } from '../models/DocumentosFiltrosDto';
import { ApiResponse } from '../models/ApiResponseDto';
import { createFileDto } from '../models/createFileDto';
import { periodoDto } from '../models/periodoDto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private api = environment.apiUrl;
  private apiUrl = `${this.api}/auth`;

  constructor(private http: HttpClient) { }

  getDocumentsWithFiles(parameters: DocumentosFiltrosDto): Observable<ApiResponse<DocumentosDto[]>> {
    return this.http.post<ApiResponse<DocumentosDto[]>>(`${this.apiUrl}/getDocumentsWithFiles`, parameters);
  }

  uploadFile(parameters: createFileDto): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('nombreArchivo', parameters.nombreArchivo);
    formData.append('documentoId', parameters.documentoId.toString());
    formData.append('periodoId', parameters.periodoId.toString());
    formData.append('anualidad', parameters.anualidad);
    formData.append('archivo', parameters.archivo);

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/create-file`, formData);
  }

  getFileURL(id: number): Observable<ApiResponse<{ url: string }>> {
    return this.http.get<ApiResponse<{ url: string }>>(`${this.apiUrl}/getFileURL/${id}`);
  }

  getFileBase64(id: number): Observable<ApiResponse<{ base64: string }>> {
    return this.http.get<ApiResponse<{ base64: string }>>(`${this.apiUrl}/base64/${id}`);
  }

  getPeriodos(): Observable<ApiResponse<periodoDto[]>> {
    return this.http.get<ApiResponse<periodoDto[]>>(`${this.apiUrl}/periodos`);
  }

  deleteDocument(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

}
