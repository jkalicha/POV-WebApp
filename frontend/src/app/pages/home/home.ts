import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { EventCard } from '../../components/event-card/event-card';
import { AuthService } from '../../services/auth.service';
import { CalendarCard } from '../../components/calendar-card/calendar-card';
import { StatsPanel } from '../../components/stats-panel/stats-panel';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, CommonModule, EventCard, CalendarCard, StatsPanel],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  isLoggedIn = false;
  invitedEvents: Event[] = [];
  ownedEvents: Event[] = [];

  constructor(private eventService: EventService, private authService: AuthService) {}

  loadEvents() {
    this.eventService.getUserEvents().then((events) => {
      this.invitedEvents = (events.invited as any[]).map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        location: e.location,
        ownerId: e.ownerId,
      })) as Event[];
      this.ownedEvents = (events.owner as any[]).map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        location: e.location,
        ownerId: e.ownerId,
      })) as Event[];
    });
  }

  ngOnInit() {
    console.log('Home ngOnInit');
    this.authService.checkAuthState();

    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      console.log('AuthState changed:', isLoggedIn);
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loadEvents();
      } else {
        this.invitedEvents = [];
        this.ownedEvents = [];
      }
    });
  }

  // ---- Combined events for CalendarCard ----
  get allEvents(): Event[] {
    return [...this.invitedEvents, ...this.ownedEvents];
  }

  onInvite(eventId: string) {
    // Placeholder: aquí luego abriremos un modal/página para invitar usuarios al evento
    console.log('Invitar a evento:', eventId);
    // TODO: navegar a /event/:id/invite o abrir modal
  }
}
