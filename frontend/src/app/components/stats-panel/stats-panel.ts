import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-panel.html',
  styleUrls: ['./stats-panel.scss']
})
export class StatsPanel {
  @Input() invitedEvents: Event[] = [];
  @Input() ownedEvents: Event[] = [];

  get invitedCount(): number { return this.invitedEvents.length; }
  get ownedCount(): number { return this.ownedEvents.length; }

  get monthlyTotal(): number {
    const now = new Date();
    const sameMonth = (d: Date) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    const all = [...this.invitedEvents, ...this.ownedEvents];
    return all.filter(e => sameMonth(new Date(e.date))).length;
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
      .map(e => new Date(e.date))
      .filter(d => !isNaN(d.getTime()) && d.getTime() >= Date.now());
    if (all.length === 0) return null;
    return new Date(Math.min(...all.map(d => d.getTime())));
  }
}
