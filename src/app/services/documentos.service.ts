import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentosDto } from '../models/DocumentosDto';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private apiUrl = 'http://localhost:3000/documentos';

  constructor(private http: HttpClient) { }

  getDocumentsWithFiles(anualidad: string): Observable<any> {
    return this.http.get<DocumentosDto[]>(`${this.apiUrl}/getDocumentsWithFiles?anualidad=${anualidad}`);
  }

}
