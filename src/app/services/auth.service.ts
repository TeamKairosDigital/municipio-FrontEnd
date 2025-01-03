import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/LoginDto';
import { ApiResponse } from '../models/ApiResponseDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<ApiResponse<LoginDto>> {
    return this.http.post<ApiResponse<LoginDto>>(`${this.apiUrl}/login`, { username, password });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('mombreMunicipio');
    localStorage.removeItem('municipality_id');
    localStorage.removeItem('access_token');
  }


}
