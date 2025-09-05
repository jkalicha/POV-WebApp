import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private eventService: EventService, private authService: AuthService, private router: Router) {}

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
  const ev = this.ownedEvents.find(e => e.id === eventId);
  const title = ev?.title ?? '';
  this.router.navigate(['/event', eventId, 'invite'], { queryParams: { title } });
  }
}
