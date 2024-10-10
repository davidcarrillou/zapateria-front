import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;  // URL base de la API de citas
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData); // Asegúrate de que tu backend tenga este endpoint
  }

  // Puedes guardar el token o datos del usuario si es necesario
  saveUserData(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
