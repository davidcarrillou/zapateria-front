// src/app/venta/venta.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../app/services/producto.service';
import { VentaService } from '../../app/services/ventas.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../../app/models/producto';
import { VentaItem } from '../../app/models/venta-item';
import { Venta } from '../../app/models/venta';
import { HistorialVenta } from '../../app/models/historialVenta';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  // Campos del formulario
  productId: number | null = null;
  registroProducto: FormGroup;

  // Lista de ítems de venta
  listaProductosVenta: Venta[] = [];
  listaProductos: Producto[] = [];
  idVentaRegistrada?: number | null = null;
  // Producto seleccionado
  productoItem: Producto | null = null;
  productoVenta?: Venta | null = {
    Producto: null,
    cantidad: 0,
    total: 0,
    id_usuario: 0,
    pago_con: 0,
    metodo_pago: '',
    cambio: 0,
  };

  // Totales
  subtotal: number = 0;
  total: number = 0;
  payment: number = 0;
  change: number = 0;
  totalProductos: number = 0;



  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private fb: FormBuilder,
  ) {
    this.registroProducto = this.fb.group({
      search: ['', Validators.required],
      producto: [{ value: '', disabled: true }, Validators.required],
      modelo: [{ value: '', disabled: true }, Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precio: [{ value: 0, disabled: true }, Validators.required],
    });
  }

  ngOnInit() { }

  // Método para buscar el producto por ID
  buscarProducto(): void {
    const criterio = this.registroProducto.get('search')?.value;

    console.log('primerLog', criterio);

    if (criterio == null || criterio === '' || criterio === undefined) {
      alert('Por favor, ingresa un ID de producto válido.');
      return;
    }

    const id = Number(criterio);
    if (isNaN(id) || id <= 0) {
      alert('El ID debe ser un número entero positivo.');
      return;
    }

    this.productoService.getProductoById(id).subscribe({
      next: (data) => {
        console.log('logRespuesta', data);
        this.agregarProductoAFormulario(data);
      },
      error: (err) => {
        console.error(err);
        alert('Producto no encontrado.');
        this.productId = null;
        this.registroProducto.patchValue({
          producto: '',
          modelo: '',
          precio: 0,
          cantidad: ''
        });
        this.productoItem = null;
      }
    });
  }

  // Método para actualizar el formulario con el producto encontrado
  agregarProductoAFormulario(producto: Producto): void {
    this.registroProducto.patchValue({
      producto: producto.nombre,
      modelo: producto.Modelo.nombre,
      precio: producto.precio_venta,
    });
    this.productId = producto.id_producto;
    this.productoItem = producto;
  }

  // Método para agregar el producto a la tabla
  agregarProducto(): void {
    if (this.registroProducto.invalid) {
      alert('Por favor, completa todos los campos correctamente antes de agregar el producto.');
      return;
    }

    if (this.productId === null || this.productoItem === null) {
      alert('Debe buscar un producto válido antes de agregarlo.');
      return;
    }

    const cantidad = this.registroProducto.get('cantidad')?.value;
    const precioVenta = this.registroProducto.get('precio')?.value;

    if (cantidad > this.productoItem.stock) {
      alert('La cantidad solicitada supera el stock disponible.');
      return;
    }

    this.productoVenta = {
      Producto: this.productoItem,
      cantidad: cantidad,
      total: precioVenta * cantidad,
      id_usuario: 12,
      metodo_pago: 'EFECTIVO'
    };

    // Verificar si el producto ya está en la lista
    const existe = this.listaProductosVenta.some(item => item.Producto?.id_producto === this.productoVenta?.Producto?.id_producto);
    if (existe) {
      alert('El producto ya está en la lista de venta.');
      return;
    }

    this.listaProductosVenta.push(this.productoVenta);
    this.calcularTotales();

    // Limpiar los campos del formulario
    this.registroProducto.reset({
      search: '',
      producto: '',
      modelo: '',
      cantidad: '',
      precio: 0
    });
    this.productId = null;
    this.productoItem = null;
  }

  // Método para calcular totales
  calcularTotales(): void {
    if (!this.listaProductosVenta) {

    }
    this.totalProductos = this.listaProductosVenta.reduce((acc, item) => acc + (item.cantidad ?? 0), 0);
    this.subtotal = this.listaProductosVenta.reduce((acc, item) => acc + (item.total ?? 0), 0);
    this.total = this.subtotal; // Puedes agregar impuestos u otros cargos si es necesario
    this.calculateChange();

  }

  // Método para calcular el cambio
  calculateChange(): void {
    this.change = this.payment - this.total;
  }

  // Método para eliminar un producto de la tabla
  eliminarProducto(index: number): void {
    this.listaProductosVenta.splice(index, 1);
    this.calcularTotales();
  }

  // Método para cancelar la venta
  cancelarVenta(): void {
    this.listaProductosVenta = [];
    this.calcularTotales();
    this.payment = 0;
    this.change = 0;
    this.registroProducto.reset({
      search: '',
      producto: '',
      modelo: '',
      cantidad: '',
      precio: 0
    });
    this.productId = null;
    this.productoItem = null;
    this.productoVenta = null;
  }
  limpiarformulario() {
    this.registroProducto.reset({
      search: '',
      producto: '',
      modelo: '',
      cantidad: '',
      precio: 0
    });
    this.productId = null;
    this.productoItem = null;
    this.productoVenta = null;
  }

  // Método para cobrar la venta
  cobrar(): void {
    if (this.payment < this.total) {
      alert('El pago no es suficiente.');
      return;
    }

    if (this.listaProductosVenta.length === 0) {
      alert('No hay productos en la venta.');
      return;
    }

    const idUsuario = 1; // Reemplaza con el ID del usuario actual, posiblemente obtenido de autenticación

    // Crear el objeto Venta
    console.log(this.listaProductosVenta);


    this.productoVenta = {
      cantidad: this.totalProductos,
      total: this.total,
      id_usuario: idUsuario,
      pago_con: this.payment,
      metodo_pago: 'EFECTIVO',
      cambio: this.change
    }

    this.ventaService.altaVenta(this.productoVenta).subscribe({
      next: (data) => {
        this.idVentaRegistrada = data.id_ventas;
        this.registroHistorial();
      },
      error: (err) => {
        console.error(err);
        alert('Error al realizar la venta.');
      },
    });
  }
  async registroHistorial(){
    this.listaProductosVenta.forEach(producto => {
      const historialVenta: HistorialVenta = {
        id_venta:this.idVentaRegistrada,
        id_producto: producto.Producto?.id_producto,
        cantidad: producto.cantidad,
        total: producto.total
      };
      console.log('data para el historial:',historialVenta);
      this.ventaService.altaHistorialVenta(historialVenta).subscribe({
        next: (data) => {
          console.log('Registro historial:', data);
        },
        error: (err) => {
          console.error('Error al crear historial venta:', err);
        }
      });
    });
    this.cancelarVenta();
    alert("Venta realizada con exito");
  }

}