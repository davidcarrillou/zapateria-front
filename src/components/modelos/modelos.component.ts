import { CurrencyPipe, CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../app/material/material.module';
import { Modelo } from '../../app/models/modelo';
import { ModeloService } from '../../app/services/modelo.service';

@Component({
  selector: 'app-modelos',
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
  templateUrl: './modelos.component.html',
  styleUrls: ['./modelos.component.css']
})
export class ModelosComponent implements OnInit {
  listaModelos: Modelo[] = [];
  modeloForm: FormGroup;
  busquedaForm: FormGroup;
  isActualizacion = false;
  mensajeError: string = '';
  mensajeExito: string = '';

  displayedColumns: string[] = [
    'index', 'nombre', 'descripcion', 'fechaRegistro', 'acciones'
  ];
  dataSource = new MatTableDataSource<Modelo>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  modeloId: number = 0;

  constructor(
    private modeloService: ModeloService,
    private fb: FormBuilder
  ) {
    this.busquedaForm = this.fb.group({
      search: ['']
    })
    this.modeloForm = this.fb.group({
      nombreModelo: ['', Validators.required],
      descripcionModelo: ['', [Validators.required, Validators.maxLength(350)]],
    });

    this.busquedaForm.get('search')?.valueChanges.subscribe(value => {
      if (value === null || value === undefined || value === '') {
        this.buscarModelo();
      }

    });
  }
  ngOnInit(): void {
    this.cargaModelos();
    this.cargaFiltros();
  }

  cargaModelos() {
    this.modeloService.getAllModelos().subscribe({
      next: (modelo) => {
        console.log(modelo);
        this.listaModelos = modelo;
        this.dataSource.data = this.listaModelos;
      }, error(err) {

      }, complete() {
        console.log("carga de modelos completa");
      },
    });
  }

  cargaFiltros() {
    // Configura el filtro para que funcione en múltiples campos
    this.dataSource.filterPredicate = (data: Modelo, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      // Busca en todos los campos relevantes
      const matchId = data.id_modelos.toString().includes(transformedFilter);
      const matchNombre = data.nombre.toLowerCase().includes(transformedFilter);
      const matchDescripcion = (data.descripcion ?? '').toLowerCase().includes(transformedFilter);

      // Retorna true si el filtro coincide con alguno de los campos
      return matchId || matchNombre || matchDescripcion;
    };
  }

  // Función para aplicar el filtro
  buscarModelo() {
    const criterio = this.busquedaForm.get('search')?.value || ''; // Asegúrate de que no sea null
    this.dataSource.filter = criterio.trim().toLowerCase(); // Aplica el filtro en minúsculas
  }

  editarModelo(modelo: Modelo): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.isActualizacion = true;
    this.modeloId = modelo.id_modelos;
    this.modeloForm.setValue({
      nombreModelo: modelo.nombre,
      descripcionModelo: modelo.descripcion
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminarModelo(modelo: Modelo) {
    const index = this.listaModelos.indexOf(modelo);
    
    this.modeloService.deleteModelo((modelo.id_modelos??0)).subscribe({
      next(value) {
        console.log('se ha elimido el modelo', value);
      },error(err) {
        console.error(err)
      },
    });

    if (index !== -1) {
      this.listaModelos.splice(index, 1);
      this.dataSource.data = [...this.listaModelos];
    }
  }

  altaModelo() {
    if (this.modeloForm.valid) {
      const modelo = {
        nombre: this.modeloForm.get('nombreModelo')?.value,
        descripcion: this.modeloForm.get('descripcionModelo')?.value,
      }
      this.modeloService.createModelo(modelo).subscribe({
        next:(modelo) =>{
          this.mensajeExito = `Se registrado el modelo:${modelo.nombre}`;
          this.modeloId = modelo.id_modelos
          this.limpiarFormulario();
          this.cargaModelos();
        },error:(err)  =>{
          this.mensajeExito = "Error al registrar el modelo";
        },
      });
    }
  }

  descartarCambio() {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.modeloForm.setValue({
      nombreModelo: '',
      descripcionModelo: ''
    });
    this.isActualizacion = false;
  }

  limpiarFormulario(){
    this.modeloForm.setValue({
      nombreModelo: '',
      descripcionModelo: ''
    });
  }

  async actualizarRegistro() {
    if (this.modeloForm.valid) {
      const modelo = {
        nombre: this.modeloForm.get('nombreModelo')?.value,
        descripcion: this.modeloForm.get('descripcionModelo')?.value,
      }
      this.modeloService.updateModelo(this.modeloId,modelo).subscribe({
        next:(modelo) => {
          this.mensajeExito = "Modelo actualizado con exito";
          this.cargaModelos();
        },error:(err) =>{
           this.mensajeError = "Error al actualizar el modelo";
        },
      });
    }
    
    this.busquedaForm.patchValue({search:this.busquedaForm.get('search')?.value})
  }

}
