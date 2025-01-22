import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponseDto';
import { Observable } from 'rxjs';
import { Obras } from '../models/Obras';
import { environment } from '../../environments/environment';
import { CreateObrasDto } from '../models/createObras.dto';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {

  private api = environment.apiUrl;
  private apiUrl = `${this.api}/obras`;

  constructor(private http: HttpClient) { }

  // Obtener lista de obras
  getAll(): Observable<ApiResponse<Obras[]>> {
    return this.http.get<ApiResponse<Obras[]>>(this.apiUrl);
  }

  // Obtener una obra por ID
  getById(id: number): Observable<ApiResponse<CreateObrasDto>> {
    return this.http.get<ApiResponse<CreateObrasDto>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva obra
  create(data: CreateObrasDto): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('nombreArchivo', data.nombreArchivo);
    formData.append('autor', data.autor);
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('nombreArchivoOriginal', data.nombreArchivoOriginal);
    formData.append('archivo', data.archivo);
    formData.append('municipality_id', data.municipality_id.toString());
    formData.append('UsuarioCreacionId', data.UsuarioCreacionId.toString());


    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/createObra`, formData);
  }

  // Actualizar una obra
  update(data: CreateObrasDto): Observable<ApiResponse<any>> {

    const formData = new FormData();
    formData.append('id', data.id ? data.id.toString() : '0');
    formData.append('nombreArchivo', data.nombreArchivo);
    formData.append('autor', data.autor);
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('nombreArchivoOriginal', data.nombreArchivoOriginal);
    formData.append('archivo', data.archivo);
    formData.append('municipality_id', data.municipality_id.toString());
    formData.append('UsuarioCreacionId', data.UsuarioCreacionId.toString());

    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/updateObra`, formData);
  }

  // Eliminar una obra
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

}
