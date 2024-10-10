import { Categoria } from './categoria';
import { Marca } from './marca';
import { Modelo } from './modelo';
import { Color } from './color';
import { Talla } from './talla';

export interface Producto {
  id_producto: number;
  nombre: string;
  Categoria: Categoria;
  Marca: Marca;
  Modelo: Modelo;
  Color: Color;
  Talla: Talla;
  precio_venta: number;
  precio_compra: number;
  stock: number;
  fecha_registro: Date;
}