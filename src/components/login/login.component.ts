import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  

  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['0', Validators.required]
    });
  }

  ngOnInit() {
    
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const { email, password } = this.loginForm.value;

      // Llama al servicio de autenticación
      this.authService.login(email, password).subscribe({
        next: response => {
          // Si el login es exitoso, guarda los datos del usuario y redirige
          this.authService.saveUserData(response);
          console.log('Login exitoso');
          console.log(localStorage.getItem);
          
          /*/ Redirigir al usuario según su rol
          if (response.rol === 1) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }*/
        },
        error: error => {
          console.error('Error en el login', error);
          // Muestra un mensaje de error
        },
        complete: () => {
          // Opcional: código que quieres ejecutar cuando se complete la suscripción
          console.log('Petición de inicio de sesión completada');
        }
    });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}