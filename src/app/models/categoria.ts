import { Marca } from "./marca";
import { Modelo } from "./modelo";

export interface Categoria {
    id_categoria: number;
    nombre: string;
    Marca:Marca,
    Modelo: Modelo
    descripcion?: string;
    fecha_registro: Date;
  }