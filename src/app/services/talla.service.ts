import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Talla } from '../models/talla';

@Injectable({
  providedIn: 'root'
})
export class TallaService {

    private apiUrl = `${environment.apiUrl}/talla`;
    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    constructor(private http: HttpClient) { }
  
    // Obtener todos los tallaes
    getAllTallas(): Observable<Talla[]> {
      return this.http.get<Talla[]>(this.apiUrl);
    }
  
    // Obtener un talla por ID
    getTallaById(id: number): Observable<Talla> {
      return this.http.get<Talla>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un nuevo talla
    createTalla(talla: Partial<Talla>): Observable<Talla> {
      return this.http.post<Talla>(this.apiUrl, talla);
    }
  
    // Actualizar un talla existente
    updateTalla(id: number, talla: Partial<Talla>): Observable<Talla> {
      return this.http.put<Talla>(`${this.apiUrl}/${id}`, talla);
    }
  
    // Eliminar un talla
    deleteTalla(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
