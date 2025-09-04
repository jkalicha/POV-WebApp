import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-calendar-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-card.html',
  styleUrls: ['./calendar-card.scss']
})
export class CalendarCard implements OnChanges {
  @Input() events: Event[] = [];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth(); // 0-11
  calendarCells: Array<number | null> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.buildCalendar();
    }
  }

  get monthDate(): Date { return new Date(this.currentYear, this.currentMonth, 1); }

  hasEventOn(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    return this.events.some((e) => {
      const t = new Date(e.date).getTime();
      return t >= dayStart && t < dayEnd;
    });
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  private buildCalendar() {
    const firstOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const jsDay = firstOfMonth.getDay(); // 0=Sun..6=Sat
    const startOffset = (jsDay + 6) % 7; // Monday-first
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const cells: Array<number | null> = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    while (cells.length < 42) cells.push(null);
    this.calendarCells = cells;
  }
}
