import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {

  private apiUrl = 'http://localhost:3000/aviso-privacidad';

  constructor(private http: HttpClient) { }
}
