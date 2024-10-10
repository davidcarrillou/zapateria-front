import { Producto } from './producto';

export interface Proveedores {
    id_proveedores:number,
    nombre:string,
    codigo:string,
    direccion:string,
    giro:string,
    telefono:number,
    producto:Producto,
    gmail:string,
    fecha_registro:Date,
}