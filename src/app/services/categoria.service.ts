import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

    private apiUrl = `${environment.apiUrl}/categorias`;
    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    constructor(private http: HttpClient) { }
  
    // Obtener todos los categorias
    getAllCategorias(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(this.apiUrl);
    }
  
    // Obtener un categoria por ID
    getCategoriaById(id: number): Observable<Categoria> {
      return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un nuevo categoria
    createCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
      return this.http.post<Categoria>(this.apiUrl, categoria);
    }
  
    // Actualizar un categoria existente
    updateCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
      return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
    }
  
    // Eliminar un categoria
    deleteCategoria(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
