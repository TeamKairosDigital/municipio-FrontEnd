import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ImportsModule } from '../../imports';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { StorageService } from '../../services/storage-service.service';
import { UserLS } from '../../models/userLS';
import { MessageService } from 'primeng/api';
import { LoginDto } from '../../models/LoginDto';
import { ApiResponse } from '../../models/ApiResponseDto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ImportsModule, ReactiveFormsModule, FormsModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
     private messageService: MessageService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const { username, password } = this.loginForm.value;
  //     this.authService.login(username, password).subscribe({
  //       next: (response) => {

  //         if(response.success && response.data != null){
  //           // Guardar datos en localStorage usando el servicio
  //           this.storageService.setItem('user', response.data.username);
  //           this.storageService.setItem('mombreMunicipio', response.data.mombreMunicipio);
  //           this.storageService.setItem('municipality_id', response.data.municipality_id);
  //           this.storageService.setItem('access_token', response.data.access_token);
  //           // Redirigir al usuario a la página principal
  //           this.router.navigate(['/documentos']);
            
  //         }else{
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
  //         }

  //       },
  //       error: (err) => {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error del servidor' });
  //         // this.errorMessage = 'Invalid username or password';
  //       },
  //     });
  //   }
  // }

  onSubmit() {
    if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        this.authService.login(username, password).subscribe({
            next: (response) => {
              if(response.success && response.data != null){
                  // Almacenar datos del usuario
                  this.storeUserData(response.data);
                  // Redirigir al usuario
                  this.router.navigate(['/documentos']);
              } else {
                  this.messageService.add({
                      severity: 'error', 
                      summary: 'Error', 
                      detail: response.message 
                  });
              }
            },
            error: (err) => {
              let errorMessage = 'Error del servidor, intenta nuevamente';

              // Si el error es 401 o 404, se muestran mensajes específicos
              if (err.status === 401) {
                  errorMessage = 'Contraseña incorrecta';
              } else if (err.status === 404) {
                  errorMessage = 'Usuario no encontrado';
              }

              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: errorMessage
              });
            }
        });
    }
}


  // Función para almacenar datos del usuario en el localStorage
  private storeUserData(data: LoginDto): void {
    this.storageService.setItem('userId', data.id);
    this.storageService.setItem('username', data.username);
    this.storageService.setItem('municipality_id', data.municipality_id);
    this.storageService.setItem('mombreMunicipio', data.mombreMunicipio);
    this.storageService.setItem('access_token', data.access_token);
  }

}
