import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-event.html',
  styleUrls: []
})
export class CreateEventPage {
  title = '';
  date = '';
  location = '';
  error = '';

  constructor(private eventService: EventService, private router: Router) {}

  async submit() {
    this.error = '';
    if (!this.title || !this.date || !this.location) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    try {
      await this.eventService.createEvent({ title: this.title.trim(), date: this.date, location: this.location.trim() });
      this.router.navigate(['/']);
    } catch (err: any) {
      const msg = err?.error?.error || 'No se pudo crear el evento';
      this.error = msg;
    }
  }
}
