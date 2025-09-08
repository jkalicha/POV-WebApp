import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  createUser(name: string, email: string, password: string) {
    return firstValueFrom(
      this.http.post(this.apiUrl, { name, email, password })
    );
  }
}
