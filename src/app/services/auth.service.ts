import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/LoginDto';
import { ApiResponse } from '../models/ApiResponseDto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiUrl;
  private apiUrl = `${this.api}/auth`;

  constructor(private http: HttpClient) { 
  }

  // LOGIN
  login(username: string, password: string): Observable<ApiResponse<LoginDto>> {
    return this.http.post<ApiResponse<LoginDto>>(`${this.apiUrl}/login`, { username, password });
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('mombreMunicipio');
    localStorage.removeItem('municipality_id');
    localStorage.removeItem('access_token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) return false;
  
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
    
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime; // Validación estándar con exp
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
    
  }

  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    return token;
  }
  
}
