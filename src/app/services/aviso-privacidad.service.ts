import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponseDto';
import { listAvisoPrivacidad } from '../models/listAvisoPrivacidadDto';
import { filterAvisoPrivacidadDto } from '../models/filterAvisoPrivacidadDto';
import { createAvisoPrivacidadDto } from '../models/createAvisoPrivacidadDto';
import { createAvisoPrivacidadArchivoDto } from '../models/createAvisoPrivacidadArchivo';

@Injectable({
  providedIn: 'root'
})
export class AvisoPrivacidadService {

  private apiUrl = 'http://localhost:3000/aviso-privacidad';

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



}
