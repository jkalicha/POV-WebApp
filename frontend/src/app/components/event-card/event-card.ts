import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.html',
  styleUrls: []
})
export class EventCard {
  @Input() event!: Event;
  @Input() isOwner: boolean = false; // para mostrar diferentes acciones según si es dueño o invitado
}