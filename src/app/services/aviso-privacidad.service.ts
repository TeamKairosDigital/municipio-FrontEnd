import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponseDto';
import { listAvisoPrivacidad } from '../models/listAvisoPrivacidadDto';
import { filterAvisoPrivacidadDto } from '../models/filterAvisoPrivacidadDto';
import { createAvisoPrivacidadDto } from '../models/createAvisoPrivacidadDto';
import { createAvisoPrivacidadArchivoDto } from '../models/createAvisoPrivacidadArchivo';
import { environment } from '../../environments/environment';
import { OtrosDocumentosDto } from '../models/otrosDocumentos.dto';
import { createOtroDocumentoDto } from '../models/createOtroDocumento.dto';

@Injectable({
  providedIn: 'root'
})
export class AvisoPrivacidadService {

  private api = environment.apiUrl;
  private apiUrl = `${this.api}/aviso-privacidad`;

  constructor(private http: HttpClient) { }

  getListAvisoPrivacidad(parameters: filterAvisoPrivacidadDto): Observable<ApiResponse<listAvisoPrivacidad[]>> {
    return this.http.post<ApiResponse<listAvisoPrivacidad[]>>(`${this.apiUrl}/getListAvisoPrivacidad`, parameters);
  }

  createAvisoPrivacidad(data: createAvisoPrivacidadDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createAvisoPrivacidad`, data);
  }

  getAvisoPrivacidad(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAvisoPrivacidad/${id}`);
  }

  editAvisoPrivacidad(data: createAvisoPrivacidadDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/editAvisoPrivacidad`, data);
  }

  deleteAvisoPrivacidad(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/deleteAvisoPrivacidad/${id}`);
  }


  createAvisoPrivacidadArchivo(data: createAvisoPrivacidadArchivoDto): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('nombreArchivo', data.nombreArchivo);
    formData.append('tipo', data.tipo.toString());
    formData.append('nombreArchivoOriginal', data.nombreArchivoOriginal);
    formData.append('avisoPrivacidadId', data.avisoPrivacidadId.toString());
    formData.append('archivo', data.archivo);

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createAvisoPrivacidadArchivo`, formData);
  }

  getAvisoPrivacidadArchivo(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAvisoPrivacidadArchivo/${id}`);
  }

  editAvisoPrivacidadArchivo(data: createAvisoPrivacidadArchivoDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/editAvisoPrivacidadArchivo`, data);
  }

  deleteAvisoPrivacidadArchivo(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/deleteAvisoPrivacidadArchivo/${id}`);
  }


  // Obtener lista de otrosDocumentos
  getOtrosDocumentos(): Observable<ApiResponse<OtrosDocumentosDto[]>> {
    return this.http.get<ApiResponse<OtrosDocumentosDto[]>>(`${this.apiUrl}/getOtrosDocumentos`);
  }

  // Obtener una documento por ID
  findOneOtroDocumento(id: number): Observable<ApiResponse<createOtroDocumentoDto>> {
    return this.http.get<ApiResponse<createOtroDocumentoDto>>(`${this.apiUrl}/findOneOtroDocumento/${id}`);
  }

  // Crear una nueva documento
  createOtroDocumento(data: createOtroDocumentoDto): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('nombreArchivo', data.nombreArchivo);
    formData.append('nombre', data.nombre);
    formData.append('archivo', data.archivo);
    formData.append('municipality_id', data.municipality_id.toString());
    formData.append('UsuarioCreacionId', data.usuarioCreacion_Id.toString());

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createOtroDocumento`, formData);
  }

  // Actualizar una documento
  updateOtroDocumento(data: createOtroDocumentoDto): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('id', data.id ? data.id.toString() : '0');
    formData.append('nombreArchivo', data.nombreArchivo);
    formData.append('nombre', data.nombre);
    formData.append('archivo', data.archivo);
    formData.append('municipality_id', data.municipality_id.toString());
    formData.append('UsuarioCreacionId', data.usuarioCreacion_Id.toString());

    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/updateOtroDocumento`, formData);
  }

  // Eliminar una documento
  deleteOtroDocumento(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/deleteOtroDocumento/${id}`);
  }

}
