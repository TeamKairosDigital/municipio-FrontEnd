import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponseDto';
import { listAvisoPrivacidad } from '../models/listAvisoPrivacidadDto';
import { filterAvisoPrivacidadDto } from '../models/filterAvisoPrivacidadDto';
import { createAvisoPrivacidadDto } from '../models/createAvisoPrivacidadDto';

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
    debugger
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createAvisoPrivacidad`, data);
  }

  // deleteDocument(id: number): Observable<ApiResponse<any>> {
  //   return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  // }




}
