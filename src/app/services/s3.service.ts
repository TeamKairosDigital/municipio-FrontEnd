import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/ApiResponseDto';
import { Observable } from 'rxjs';
import { getFileDto } from '../models/getFile.dto';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

    private api = environment.apiUrl;
    private apiUrl = `${this.api}/s3`;
  
    constructor(private http: HttpClient) { }

    getFileBase64(getFileDto: getFileDto): Observable<ApiResponse<string>> {
      const url = `${this.apiUrl}/getFileBase64`; // Aquí va la ruta de tu controlador
      return this.http.post<ApiResponse<string>>(url, getFileDto);
    }
}
