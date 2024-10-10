import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { VentasComponent } from '../components/ventas/ventas.component';
import { MarcasComponent } from '../components/marcas/marcas.component';
import { ModelosComponent } from '../components/modelos/modelos.component';
import { ProductosComponent } from '../components/productos/productos.component';
import { CategoriaComponent } from '../components/categoria/categoria.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ProveedoresComponent } from '../components/proveedores/proveedores.component';
import { CorteCajaComponent } from '../components/corteCaja/corteCaja.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {
        path: 'home', component: HomeComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'ventas', component: VentasComponent },
            { path: 'productos', component: ProductosComponent },
            { path: 'marcas', component: MarcasComponent },
            { path: 'modelos', component: ModelosComponent },
            { path: 'categorias', component: CategoriaComponent },
            { path: 'proveedores', component: ProveedoresComponent },
            { path: 'corte-caja', component: CorteCajaComponent },
        ]
    }
];
