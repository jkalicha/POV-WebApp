import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth/login';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return firstValueFrom(
      this.http.post<{ token: string }>(this.apiUrl, { email, password })
    );
  }

  checkAuthState() {
    const isLoggedIn = !!localStorage.getItem('token');
    this.isLoggedInSubject.next(isLoggedIn);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }
}