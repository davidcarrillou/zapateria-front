import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Color } from '../models/color';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
    private apiUrl = `${environment.apiUrl}/colores`;
    private headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    constructor(private http: HttpClient) { }
  
    // Obtener todos los colores
    getAllColores(): Observable<Color[]> {
      return this.http.get<Color[]>(this.apiUrl);
    }
  
    // Obtener un color por ID
    getColorById(id: number): Observable<Color> {
      return this.http.get<Color>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un nuevo color
    createColor(color: Partial<Color>): Observable<Color> {
      return this.http.post<Color>(this.apiUrl, color);
    }
  
    // Actualizar un color existente
    updateColor(id: number, color: Partial<Color>): Observable<Color> {
      return this.http.put<Color>(`${this.apiUrl}/${id}`, color);
    }
  
    // Eliminar un color
    deleteColor(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
