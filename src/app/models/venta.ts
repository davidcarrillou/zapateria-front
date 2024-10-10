import { Producto } from './producto';
export interface Venta {
    id_ventas?: number | null;
    Producto?: Producto | null;
    cantidad?: number | null;
    total?: number | null;
    id_usuario?: number | null;
    pago_con?: number | null;
    metodo_pago?: string | null;
    cambio?: number | null;
    fecha_registro?: Date | null;
}