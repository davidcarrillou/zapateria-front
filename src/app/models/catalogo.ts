import { Categoria } from "./categoria";
import { Color } from "./color";
import { Marca } from "./marca";
import { Modelo } from "./modelo";
import { Talla } from "./talla";

export interface Catalogo {
    Categoria: Categoria[];
    Marca: Marca[];
    Modelo: Modelo[];
    Color: Color[];
    Talla: Talla[];
}