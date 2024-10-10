import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class usuarioService {

    private apiUrl = `${environment.apiUrl}/usuarios`;
    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    constructor(private http: HttpClient) { }
  
    // Obtener todos los usuarioes
    getAllUsuario(): Observable<Usuario[]> {
      return this.http.get<Usuario[]>(this.apiUrl);
    }
  
    // Obtener un usuario por ID
    getUsuarioById(id: number): Observable<Usuario> {
      return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un nuevo usuario
    createUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
      return this.http.post<Usuario>(this.apiUrl, usuario);
    }
  
    // Actualizar un usuario existente
    updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
      return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
    }
  
    // Eliminar un usuario
    deleteUsuario(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}