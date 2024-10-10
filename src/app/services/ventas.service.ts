import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Venta } from '../models/venta';


@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/ventas`;
  private apiUrlhistorial = `${environment.apiUrl}/venta/historial`;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  // Obtener historial de ventas
  getListaVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  // Obtener historial por ID
  getListaVentasById(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  // Crear registro de la venta
  altaVenta(venta: Partial<Venta>): Observable<Venta> {
    console.log('datos para el alta',venta)
    return this.http.post<Venta>(this.apiUrl, venta);
  }
  // Crear registro de la venta
  altaHistorialVenta(venta: Partial<Venta>): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrlhistorial, venta);
  }

  // Actualizar 
  actualizarResgistro(id: number, venta: Partial<Venta>): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/${id}`, venta);
  }

  // Eliminar un producto
  EliminarRegistro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
