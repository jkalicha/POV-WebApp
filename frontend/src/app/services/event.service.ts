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

  inviteToEvent(
    eventId: string,
    invitees: string[]
  ): Promise<{ message: string; invited: string[]; skipped: { email: string; reason: string }[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.eventUrl}/${eventId}/invite`;
    return firstValueFrom(
      this.http.post<{ message: string; invited: string[]; skipped: { email: string; reason: string }[] }>(
        url,
        { invitees },
        { headers }
      )
    );
  }

  // Métodos para fotos
  uploadPhoto(eventId: string, file: File, caption?: string): Promise<any> {
    const token = localStorage.getItem('token');
    console.log('Upload Photo - Token exists:', !!token);
    console.log('Upload Photo - EventId:', eventId);
    console.log('Upload Photo - File:', file.name, file.size);
    
    if (!token) {
      return Promise.reject(new Error('No authentication token found'));
    }

    // Verificar si el token no está vacío o no es solo espacios
    if (token.trim().length === 0) {
      return Promise.reject(new Error('Invalid authentication token'));
    }

    const formData = new FormData();
    formData.append('photo', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
      // No agregar Content-Type para FormData, Angular lo maneja automáticamente
    });

    return firstValueFrom(
      this.http.post<any>(`${this.eventUrl}/${eventId}/photos`, formData, { headers })
    ).catch(error => {
      console.error('HTTP Error:', error);
      if (error.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
      throw error;
    });
  }

  getEventPhotos(eventId: string): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return firstValueFrom(
      this.http.get<any[]>(`${this.eventUrl}/${eventId}/photos`, { headers })
    );
  }

  deletePhoto(photoId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return firstValueFrom(
      this.http.delete<any>(`http://localhost:3000/photo/${photoId}`, { headers })
    );
  }

  getCurrentUserId(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || '';
    } catch {
      return '';
    }
  }
}