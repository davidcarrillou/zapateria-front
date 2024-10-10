import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Marca } from '../models/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
    private apiUrl = `${environment.apiUrl}/marcas`;
    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    constructor(private http: HttpClient) { }
  
    // Obtener todos los marcaes
    getAllMarcas(): Observable<Marca[]> {
      return this.http.get<Marca[]>(this.apiUrl);
    }
  
    // Obtener un marca por ID
    getMarcaById(id: number): Observable<Marca> {
      return this.http.get<Marca>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un nuevo marca
    createMarca(marca: Partial<Marca>): Observable<Marca> {
      return this.http.post<Marca>(this.apiUrl, marca);
    }
  
    // Actualizar un marca existente
    updateMarca(id: number, marca: Partial<Marca>): Observable<Marca> {
      return this.http.put<Marca>(`${this.apiUrl}/${id}`, marca);
    }
  
    // Eliminar un marca
    deleteMarca(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
