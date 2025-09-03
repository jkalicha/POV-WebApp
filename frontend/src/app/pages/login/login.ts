import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: [],
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async login() {
    try {
      const res = await this.auth.login(this.email, this.password);
      localStorage.setItem('token', res.token);
      this.router.navigate(['/']);
    } catch (err) {
      this.error = 'Credenciales inválidas';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async crearUsuario() {
    try {
      await this.userService.createUser('Usuario de prueba', this.email, this.password);
      alert('Usuario creado correctamente');
    } catch (err) {
      alert('Error al crear usuario');
    }
  }
}
