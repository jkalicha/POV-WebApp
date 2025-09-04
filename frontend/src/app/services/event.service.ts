import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  getUserEvents(): Promise<{owner: Event[], invited: Event[]}> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return firstValueFrom(
      this.http.get<{owner: Event[], invited: Event[]}>(this.apiUrl, { headers })
    );
  }
}