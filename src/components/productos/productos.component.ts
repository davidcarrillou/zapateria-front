import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

import { Producto } from '../../app/models/producto';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from '../../app/material/material.module';
import { ProductoService } from '../../app/services/producto.service';
import { Catalogo } from '../../app/models/catalogo';
import { CatalogoService } from '../../app/services/catalogo.service';

@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  listaProductos: Producto[] = [];


  productForm: FormGroup;
  busquedaForm: FormGroup;

  productId: number | null = null;

  isActualizacion = false;

  displayedColumns: string[] = [
    'index', 'nombre', 'categoria', 'marca', 'modelo', 'color', 'talla',
    'precioCompra', 'precioVenta', 'stock', 'fechaRegistro', 'acciones'
  ];

  dataSource = new MatTableDataSource<Producto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  listaCatalogos: Catalogo = {
    Categoria: [],
    Marca: [],
    Modelo: [],
    Color: [],
    Talla: []
  };
  mensajeError: string = 'mensajeError';


  constructor(
    private productoService: ProductoService,
    private catalogoService: CatalogoService,
    private fb: FormBuilder
  ) {
    this.busquedaForm = this.fb.group({
      search: ['']
    })
    this.productForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      categoria: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      talla: ['', Validators.required],
      precioCompra: ['', [Validators.required, Validators.min(1)]],
      precioVenta: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(1)]],
    });

    this.busquedaForm.get('search')?.valueChanges.subscribe(value => {
      if (value === null || value === undefined || value === '') {
        this.buscarProducto();
      }

    });
  }
  async ngOnInit() {
    this.cargaCatalogos();
    this.cargaProductos();
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

  cargaProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        console.log(productos);
        this.listaProductos = productos;
        this.dataSource.data = this.listaProductos;
      }, error(err) {

      }, complete() {
        console.log("carga de productos completa");
      },
    });
    this.dataSource.data = this.listaProductos;
  }

  cargaFiltros() {
    // Configura el filtro para que funcione en múltiples campos
    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      // Busca en todos los campos relevantes
      const matchId = data.id_producto.toString().includes(transformedFilter);
      const matchNombre = data.nombre.toLowerCase().includes(transformedFilter);
      const matchCategoria = data.Categoria.nombre.toLowerCase().includes(transformedFilter);
      const matchMarca = data.Marca.nombre.toLowerCase().includes(transformedFilter);
      const matchModelo = data.Modelo.nombre.toLowerCase().includes(transformedFilter);
      const matchColor = data.Color.nombre.toLowerCase().includes(transformedFilter);
      const matchTalla = data.Talla.talla_mx.toLowerCase().includes(transformedFilter);

      // Retorna true si el filtro coincide con alguno de los campos
      return matchId || matchNombre || matchCategoria || matchMarca || matchModelo || matchColor || matchTalla;
    };
  }

  // Función para aplicar el filtro
  buscarProducto() {
    const criterio = this.busquedaForm.get('search')?.value || ''; // Asegúrate de que no sea null
    this.dataSource.filter = criterio.trim().toLowerCase(); // Aplica el filtro en minúsculas
  }

  editarProducto(producto: Producto): void {
    console.log(producto)
    console.log(producto.nombre);
    this.isActualizacion = true;
    this.productId = producto.id_producto;
    this.productForm.setValue({
      nombreProducto: producto.nombre,
      categoria: producto.Categoria.id_categoria,
      marca: producto.Marca.id_marca,
      modelo: producto.Modelo.id_modelos,
      color: producto.Color.id_color,
      talla: producto.Talla.id_talla,
      precioCompra: producto.precio_compra,
      precioVenta: producto.precio_venta,
      stock: producto.stock,
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminarProducto(producto: Producto): void {
    const index = this.listaProductos.indexOf(producto);
    if (index !== -1) {
      this.listaProductos.splice(index, 1);
      this.dataSource.data = [...this.listaProductos];
    }
  }

  altaProducto() {
    if (this.productForm.valid) {
      const producto = {
        nombre: this.productForm.get('nombreProducto')?.value,
        id_categoria: this.productForm.get('categoria')?.value,
        id_marca: this.productForm.get('marca')?.value,
        id_modelo: this.productForm.get('modelo')?.value,
        id_color: this.productForm.get('color')?.value,
        id_talla: this.productForm.get('talla')?.value,
        precio_compra: this.productForm.get('precioCompra')?.value,
        precio_venta: this.productForm.get('precioVenta')?.value,
        stock: this.productForm.get('stock')?.value,
      }
      console.log('Registro:', producto);
      // Add your form submission logic here
    }
  }

  descartarCambio() {
    this.productForm.setValue({
      nombreProducto: '',
      categoria: '',
      marca: '',
      modelo: '',
      color: '',
      talla: '',
      precioCompra: '',
      precioVenta: '',
      stock: '',
    });
    this.isActualizacion = false;
  }

  actualizarRegistro() {
    if (this.productForm.valid) {
      const producto = {
        nombre: this.productForm.get('nombreProducto')?.value,
        id_categoria: this.productForm.get('categoria')?.value,
        id_marca: this.productForm.get('marca')?.value,
        id_modelo: this.productForm.get('modelo')?.value,
        id_color: this.productForm.get('color')?.value,
        id_talla: this.productForm.get('talla')?.value,
        precio_compra: this.productForm.get('precioCompra')?.value,
        precio_venta: this.productForm.get('precioVenta')?.value,
        stock: this.productForm.get('stock')?.value,
      }
      console.log('Actualizacion:', producto);
      // Add your form submission logic here
    }
  }

}
