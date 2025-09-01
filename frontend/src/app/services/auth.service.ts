import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return firstValueFrom(
      this.http.post<{ token: string }>(this.apiUrl, { email, password })
    );
  }
}