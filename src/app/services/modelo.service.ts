import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Modelo } from '../models/modelo';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  private apiUrl = `${environment.apiUrl}/modelos`;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  // Obtener todos los modeloes
  getAllModelos(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.apiUrl);
  }

  // Obtener un modelo por ID
  getModeloById(id: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo modelo
  createModelo(modelo: Partial<Modelo>): Observable<Modelo> {
    return this.http.post<Modelo>(this.apiUrl, modelo);
  }

  // Actualizar un modelo existente
  updateModelo(id: number, modelo: Partial<Modelo>): Observable<Modelo> {
    return this.http.put<Modelo>(`${this.apiUrl}/${id}`, modelo);
  }

  // Eliminar un modelo
  deleteModelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
