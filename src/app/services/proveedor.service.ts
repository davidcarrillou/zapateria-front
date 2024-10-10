import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Proveedores } from '../models/proveedores';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
    private apiUrl = `${environment.apiUrl}/proveedores`;
    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    constructor(private http: HttpClient) { }
  
    // Obtener todos los proveedoreses
    getAllProveedores(): Observable<Proveedores[]> {
      return this.http.get<Proveedores[]>(this.apiUrl);
    }
  
    // Obtener un proveedores por ID
    getProveedoresById(id: number): Observable<Proveedores> {
      return this.http.get<Proveedores>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un nuevo proveedores
    createProveedores(proveedores: Partial<Proveedores>): Observable<Proveedores> {
      return this.http.post<Proveedores>(this.apiUrl, proveedores);
    }
  
    // Actualizar un proveedores existente
    updateProveedores(id: number, proveedores: Partial<Proveedores>): Observable<Proveedores> {
      return this.http.put<Proveedores>(`${this.apiUrl}/${id}`, proveedores);
    }
  
    // Eliminar un proveedores
    deleteProveedores(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
