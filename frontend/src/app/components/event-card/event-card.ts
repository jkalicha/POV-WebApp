import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() invite = new EventEmitter<string>();
  @Output() photos = new EventEmitter<string>();

  onInviteClick() {
    if (this.event?.id) {
      this.invite.emit(this.event.id);
    }
  }

  onPhotosClick() {
    if (this.event?.id) {
      this.photos.emit(this.event.id);
    }
  }
}