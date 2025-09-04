import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: [],
})
export class Register {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(public userService: UserService, private router: Router) {}

  async register() {
    try {
      await this.userService.createUser(this.name, this.email, this.password);
      alert('Usuario creado correctamente');
    } catch (err: any) {
      // Extraer el mensaje de error del backend
      if (err.error && err.error.error) {
        this.error = err.error.error;
      } else if (err.message) {
        this.error = err.message;
      } else {
        this.error = 'Error al crear usuario';
      }
      console.error('Error completo:', err);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
