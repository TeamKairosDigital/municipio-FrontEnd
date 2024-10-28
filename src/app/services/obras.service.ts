import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponseDto';
import { Observable } from 'rxjs';
import { Obras } from '../models/Obras';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {

  private apiUrl = 'http://localhost:3000/obras';

  constructor(private http: HttpClient) { }

   // Obtener todas las obras
   getAll(): Observable<ApiResponse<Obras[]>> {
    return this.http.get<ApiResponse<Obras[]>>(this.apiUrl);
  }

  // Obtener una obra por ID
  getById(id: number): Observable<ApiResponse<Obras>> {
    return this.http.get<ApiResponse<Obras>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva obra
  create(obras: Obras): Observable<ApiResponse<Obras>> {
    return this.http.post<ApiResponse<Obras>>(this.apiUrl, obras);
  }

  // Actualizar una obra existente
  update(id: number, obras: Obras): Observable<ApiResponse<Obras>> {
    return this.http.put<ApiResponse<Obras>>(`${this.apiUrl}/${id}`, obras);
  }

  // Eliminar una obra por ID
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

}
