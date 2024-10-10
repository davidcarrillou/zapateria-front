import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Categoria } from '../../app/models/categoria';
import { CategoriaService } from '../../app/services/categoria.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from '../../app/material/material.module';
import { Catalogo } from '../../app/models/catalogo';
import { CatalogoService } from '../../app/services/catalogo.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  listaCategorias: Categoria[] = [];
  listaCatalogos: Catalogo = {
    Categoria: [],
    Marca: [],
    Modelo: [],
    Color: [],
    Talla: []
  };
  categoriaForm: FormGroup;
  busquedaForm: FormGroup;
  isActualizacion = false;
  mensajeError: string = '';
  mensajeExito: string = '';

  displayedColumns: string[] = [
    'index', 'nombre', 'marca', 'modelo', 'descripcion', 'fechaRegistro', 'acciones'
  ];
  dataSource = new MatTableDataSource<Categoria>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  categoriaId: number = 0;

  constructor(
    private categoriaService: CategoriaService,
    private catalogoService: CatalogoService,
    private fb: FormBuilder
  ) {
    this.busquedaForm = this.fb.group({
      search: ['']
    })
    this.categoriaForm = this.fb.group({
      nombreCategoria: ['', Validators.required],
      descripcionCategoria: ['', [Validators.required, Validators.maxLength(350)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
    });

    this.busquedaForm.get('search')?.valueChanges.subscribe(value => {
      if (value === null || value === undefined || value === '') {
        this.buscarCategoria();
      }

    });
  }
  ngOnInit(): void {
    this. cargaCatalogos();
    this.cargaCategorias();
    this.cargaFiltros();
  }

  cargaCatalogos(): void {
    this.catalogoService.getCatalogo().subscribe({
      next: (catalogo) => {
        console.log('Catálogos cargados:', catalogo);
        this.listaCatalogos = catalogo;
      },
      error: (err) => {
        this.mensajeError = "error en carga de catalogos:" + err;
      }
    });
  }

  cargaCategorias() {
    this.categoriaService.getAllCategorias().subscribe({
      next: (categoria) => {
        console.log(categoria);
        this.listaCategorias = categoria;
        this.dataSource.data = this.listaCategorias;
      }, error(err) {

      }, complete() {
        console.log("carga de categorias completa");
      },
    });
  }

  cargaFiltros() {
    // Configura el filtro para que funcione en múltiples campos
    this.dataSource.filterPredicate = (data: Categoria, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      // Busca en todos los campos relevantes
      const matchId = data.id_categoria.toString().includes(transformedFilter);
      const matchNombre = data.nombre.toLowerCase().includes(transformedFilter);
      const matchDescripcion = (data.descripcion ?? '').toLowerCase().includes(transformedFilter);
      const matchMarca = data.Marca.nombre.toLowerCase().includes(transformedFilter);
      const matchModelo = data.Modelo.nombre.toLowerCase().includes(transformedFilter);

      // Retorna true si el filtro coincide con alguno de los campos
      return matchId || matchNombre || matchDescripcion || matchMarca || matchModelo;
    };
  }

  // Función para aplicar el filtro
  buscarCategoria() {
    const criterio = this.busquedaForm.get('search')?.value || ''; // Asegúrate de que no sea null
    this.dataSource.filter = criterio.trim().toLowerCase(); // Aplica el filtro en minúsculas
  }

  editarCategoria(categoria: Categoria): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.isActualizacion = true;
    this.categoriaId = categoria.id_categoria;
    this.categoriaForm.setValue({
      nombreCategoria: categoria.nombre,
      descripcionCategoria: categoria.descripcion,
      marca: categoria.Marca.id_marca,
      modelo: categoria.Modelo.id_modelos
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminarCategoria(categoria: Categoria) {
    const index = this.listaCategorias.indexOf(categoria);

    this.categoriaService.deleteCategoria((categoria.id_categoria ?? 0)).subscribe({
      next(value) {
        console.log('se ha elimido la categoria', value);
      }, error(err) {
        console.error(err)
      },
    });

    if (index !== -1) {
      this.listaCategorias.splice(index, 1);
      this.dataSource.data = [...this.listaCategorias];
    }
  }

  altaCategoria() {
    if (this.categoriaForm.valid) {
      const categoria = {
        nombre: this.categoriaForm.get('nombreCategoria')?.value,
        descripcion: this.categoriaForm.get('descripcionCategoria')?.value,
        id_marca: this.categoriaForm.get('marca')?.value,
        id_modelo: this.categoriaForm.get('modelo')?.value,
      }
      this.categoriaService.createCategoria(categoria).subscribe({
        next: (categoria) => {
          this.mensajeExito = `Se registrado la categoria:${categoria.nombre}`;
          this.categoriaId = categoria.id_categoria
          this.limpiarFormulario();
          this.cargaCategorias();
        }, error: (err) => {
          this.mensajeExito = "Error al registrar la categoria";
        },
      });
    }
  }

  descartarCambio() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.categoriaForm.setValue({
      nombreCategoria: '',
      descripcionCategoria: '',
      marca: '',
      modelo: ''
    });
    this.isActualizacion = false;
  }

  limpiarFormulario() {
    this.categoriaForm.setValue({
      nombreCategoria: '',
      descripcionCategoria: '',
      marca: '',
      modelo: ''
    });
  }

  async actualizarRegistro() {
    if (this.categoriaForm.valid) {
      const categoria = {
        nombre: this.categoriaForm.get('nombreCategoria')?.value,
        id_marca: this.categoriaForm.get('marca')?.value,
        id_modelo: this.categoriaForm.get('modelo')?.value,
        descripcion: this.categoriaForm.get('descripcionCategoria')?.value,
      }
      this.categoriaService.updateCategoria(this.categoriaId, categoria).subscribe({
        next: (categoria) => {
          this.mensajeExito = `Categoria ${categoria.nombre} actualizada con exito`;
          this.cargaCategorias();
        }, error: (err) => {
          this.mensajeError = "Error al actualizar la categoria";
        },
      });
    }

    this.busquedaForm.patchValue({ search: this.busquedaForm.get('search')?.value })
  }

}
