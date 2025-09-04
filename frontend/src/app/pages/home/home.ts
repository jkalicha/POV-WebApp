import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { filter } from 'rxjs';
import { EventCard } from '../../components/event-card/event-card';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, CommonModule, EventCard],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  isLoggedIn = false;
  invitedEvents: Event[] = [];
  ownedEvents: Event[] = [];
  isLoadingInvited = true;
  isLoadingOwned = true;

  constructor(
    private router: Router, 
    private eventService: EventService,
    private authService: AuthService
  ) {}

  loadEvents() {
    this.isLoadingInvited = true;
    this.isLoadingOwned = true;
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
      this.isLoadingInvited = false;
      this.isLoadingOwned = false;
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
  this.isLoadingInvited = false;
  this.isLoadingOwned = false;
      }
    });
  }

  // ---- Stats helpers (desempeño) ----
  get invitedCount(): number {
    return this.invitedEvents.length;
  }

  get ownedCount(): number {
    return this.ownedEvents.length;
  }

  get monthlyTotal(): number {
    const now = new Date();
    const sameMonth = (d: Date) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    const all = [...this.invitedEvents, ...this.ownedEvents];
    return all.filter((e) => {
      const d = new Date(e.date);
      return sameMonth(d);
    }).length;
  }

  get nextEventLabel(): string {
    const next = this.getNextEventDate();
    if (!next) return 'Sin próximos eventos';
    const now = new Date();
    const diffMs = next.getTime() - now.getTime();
    const oneHour = 1000 * 60 * 60;
    const oneDay = oneHour * 24;
    if (diffMs <= 0) return 'Hoy';
    const days = Math.floor(diffMs / oneDay);
    if (days >= 1) return `En ${days} día${days > 1 ? 's' : ''}`;
    const hours = Math.max(1, Math.floor(diffMs / oneHour));
    return `En ${hours} hora${hours > 1 ? 's' : ''}`;
  }

  private getNextEventDate(): Date | null {
    const all = [...this.invitedEvents, ...this.ownedEvents]
      .map((e) => new Date(e.date))
      .filter((d) => !isNaN(d.getTime()) && d.getTime() >= Date.now());
    if (all.length === 0) return null;
    return new Date(Math.min(...all.map((d) => d.getTime())));
  }

  // ---- Calendar helpers ----
  hasEventOn(day: number): boolean {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const date = new Date(year, month, day);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const all = [...this.invitedEvents, ...this.ownedEvents];
    return all.some((e) => {
      const t = new Date(e.date).getTime();
      return t >= dayStart && t < dayEnd;
    });
  }
}
