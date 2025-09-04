import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { filter } from 'rxjs';
import { EventCard } from '../../components/event-card/event-card';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, CommonModule, EventCard],
  templateUrl: './home.html',
  styleUrls: [],
})
export class Home {
  isLoggedIn = false;
  invitedEvents: Event[] = [];
  ownedEvents: Event[] = [];

  constructor(private router: Router, private eventService: EventService) {}

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

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
    this.checkLogin();
    if (this.isLoggedIn) {
      this.loadEvents();
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.checkLogin();
      if (this.isLoggedIn) {
        this.loadEvents();
      } else {
        this.invitedEvents = [];
        this.ownedEvents = [];
      }
    });
  }
}
