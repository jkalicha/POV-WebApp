import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventsUrl = 'http://localhost:3000/events';
  private eventUrl = 'http://localhost:3000/event';

  constructor(private http: HttpClient) {}

  getUserEvents(): Promise<{owner: Event[], invited: Event[]}> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return firstValueFrom(
      this.http.get<{owner: Event[], invited: Event[]}>(this.eventsUrl, { headers })
    );
  }

  createEvent(payload: { title: string; date: string; location: string }): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return firstValueFrom(
      this.http.post<void>(this.eventUrl, payload, { headers })
    );
  }
}