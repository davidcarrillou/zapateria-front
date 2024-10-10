import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, of, throwError } from 'rxjs';
import { Catalogo } from '../models/catalogo';
import { ColorService } from './color.service';
import { MarcaService } from './marca.service';
import { ModeloService } from './modelo.service';
import { TallaService } from './talla.service';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../models/categoria';
import { Color } from '../models/color';
import { Marca } from '../models/marca';
import { Modelo } from '../models/modelo';
import { Talla } from '../models/talla';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private categoriaService: CategoriaService,
    private colorService: ColorService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private tallaService: TallaService
  ) { }

  /**
   * Obtiene todos los catálogos de forma paralela.
   * @returns Observable<Catalogo>
   */
  getCatalogo(): Observable<Catalogo> {
    return forkJoin({
      Categoria: this.categoriaService.getAllCategorias().pipe(
        catchError(error => {
          console.error('Error al obtener Categorias:', error);
          return of([] as Categoria[]);
        })
      ),
      Marca: this.marcaService.getAllMarcas().pipe(
        catchError(error => {
          console.error('Error al obtener Marcas:', error);
          return of([] as Marca[]);
        })
      ),
      Modelo: this.modeloService.getAllModelos().pipe(
        catchError(error => {
          console.error('Error al obtener Modelos:', error);
          return of([] as Modelo[]);
        })
      ),
      Color: this.colorService.getAllColores().pipe(
        catchError(error => {
          console.error('Error al obtener Colores:', error);
          return of([] as Color[]);
        })
      ),
      Talla: this.tallaService.getAllTallas().pipe(
        catchError(error => {
          console.error('Error al obtener Tallas:', error);
          return of([] as Talla[]);
        })
      ),
    });
  }
}


