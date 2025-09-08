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
  styleUrls: ['./create-event.scss']
})
export class CreateEventPage {
  title = '';
  date = '';
  location = '';
  error = '';
  ok = false;
  emojiHint = '';
  loading = false;
  confettiPieces: { left: string; background: string }[] = [];

  private generateConfetti(count = 24) {
    const colors = [
      ['#7dd3fc', '#c7d2fe'],
      ['#86efac', '#c7d2fe'],
      ['#fcd34d', '#fda4af']
    ];
    this.confettiPieces = Array.from({ length: count }).map(() => {
      const c = colors[Math.floor(Math.random() * colors.length)];
      const left = `${Math.random() * 100}%`;
      const background = `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
      return { left, background };
    });
  }

  constructor(private eventService: EventService, private router: Router) {}

  async submit() {
    this.error = '';
    if (!this.title || !this.date || !this.location) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    try {
      this.loading = true;
      await this.eventService.createEvent({ title: this.title.trim(), date: this.date, location: this.location.trim() });
      this.ok = true; this.title = ''; this.date = ''; this.location = '';
      this.generateConfetti();
  this.loading = false;
  setTimeout(() => this.router.navigate(['/']), 1200);
    } catch (err: any) {
      const msg = err?.error?.error || 'No se pudo crear el evento';
      this.error = msg;
  this.loading = false;
    }
  }

  onTitleInput(val: string) {
    const v = val.toLowerCase();
    if (v.includes('cumple')) this.emojiHint = '🎉';
    else if (v.includes('yoga')) this.emojiHint = '🧘';
    else if (v.includes('reunión') || v.includes('reunion')) this.emojiHint = '🤝';
    else this.emojiHint = '';
  }
}
