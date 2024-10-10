import { Producto } from './producto';

export interface VentaItem {
    producto: Producto;
    cantidad: number;
    precio_total: number; // precio_venta * cantidad
  }