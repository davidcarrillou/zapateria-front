import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../app/material/material.module';
import { Marca } from '../../app/models/marca';
import { MarcaService } from '../../app/services/marca.service';

@Component({
  selector: 'app-marcas',
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
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  listaMarcas: Marca[] = [];
  marcaForm: FormGroup;
  busquedaForm: FormGroup;
  isActualizacion = false;
  mensajeError: string = '';
  mensajeExito: string = '';

  displayedColumns: string[] = [
    'index', 'nombre', 'descripcion', 'fechaRegistro', 'acciones'
  ];
  dataSource = new MatTableDataSource<Marca>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  marcaId: number = 0;

  constructor(
    private marcaService: MarcaService,
    private fb: FormBuilder
  ) {
    this.busquedaForm = this.fb.group({
      search: ['']
    })
    this.marcaForm = this.fb.group({
      nombreMarca: ['', Validators.required],
      descripcionMarca: ['', [Validators.required, Validators.maxLength(350)]],
    });

    this.busquedaForm.get('search')?.valueChanges.subscribe(value => {
      if (value === null || value === undefined || value === '') {
        this.buscarMarca();
      }

    });
  }
  ngOnInit(): void {
    this.cargaMarcas();
    this.cargaFiltros();
  }

  cargaMarcas() {
    this.marcaService.getAllMarcas().subscribe({
      next: (marca) => {
        console.log(marca);
        this.listaMarcas = marca;
        this.dataSource.data = this.listaMarcas;
      }, error(err) {

      }, complete() {
        console.log("carga de marcas completa");
      },
    });
  }

  cargaFiltros() {
    // Configura el filtro para que funcione en múltiples campos
    this.dataSource.filterPredicate = (data: Marca, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      // Busca en todos los campos relevantes
      const matchId = data.id_marca.toString().includes(transformedFilter);
      const matchNombre = data.nombre.toLowerCase().includes(transformedFilter);
      const matchDescripcion = (data.descripcion ?? '').toLowerCase().includes(transformedFilter);

      // Retorna true si el filtro coincide con alguno de los campos
      return matchId || matchNombre || matchDescripcion;
    };
  }

  // Función para aplicar el filtro
  buscarMarca() {
    const criterio = this.busquedaForm.get('search')?.value || ''; // Asegúrate de que no sea null
    this.dataSource.filter = criterio.trim().toLowerCase(); // Aplica el filtro en minúsculas
  }

  editarMarca(marca: Marca): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.isActualizacion = true;
    this.marcaId = marca.id_marca;
    this.marcaForm.setValue({
      nombreMarca: marca.nombre,
      descripcionMarca: marca.descripcion
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminarMarca(marca: Marca) {
    const index = this.listaMarcas.indexOf(marca);
    
    this.marcaService.deleteMarca((marca.id_marca??0)).subscribe({
      next(value) {
        console.log('se ha elimido el marca', value);
      },error(err) {
        console.error(err)
      },
    });

    if (index !== -1) {
      this.listaMarcas.splice(index, 1);
      this.dataSource.data = [...this.listaMarcas];
    }
  }

  altaMarca() {
    if (this.marcaForm.valid) {
      const marca = {
        nombre: this.marcaForm.get('nombreMarca')?.value,
        descripcion: this.marcaForm.get('descripcionMarca')?.value,
      }
      this.marcaService.createMarca(marca).subscribe({
        next:(marca) =>{
          this.mensajeExito = `Se registrado la marca:${marca.nombre}`;
          this.marcaId = marca.id_marca
          this.limpiarFormulario();
          this.cargaMarcas();
        },error:(err)  =>{
          this.mensajeExito = "Error al registrar el marca";
        },
      });
    }
  }

  descartarCambio() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.marcaForm.setValue({
      nombreMarca: '',
      descripcionMarca: ''
    });
    this.isActualizacion = false;
  }

  limpiarFormulario(){
    this.marcaForm.setValue({
      nombreMarca: '',
      descripcionMarca: ''
    });
  }

  async actualizarRegistro() {
    if (this.marcaForm.valid) {
      const marca = {
        nombre: this.marcaForm.get('nombreMarca')?.value,
        descripcion: this.marcaForm.get('descripcionMarca')?.value,
      }
      this.marcaService.updateMarca(this.marcaId,marca).subscribe({
        next:(marca) => {
          this.mensajeExito = `Marca ${marca.nombre} actualizada con exito`;
          this.cargaMarcas();
        },error:(err) =>{
           this.mensajeError = "Error al actualizar el marca";
        },
      });
    }
    
    this.busquedaForm.patchValue({search:this.busquedaForm.get('search')?.value})
  }

}
