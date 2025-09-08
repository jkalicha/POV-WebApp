import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-calendar-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-card.html',
  styleUrls: ['./calendar-card.scss']
})
export class CalendarCard implements OnChanges, OnInit {
  @Input() events: Event[] = [];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth(); // 0-11
  calendarCells: Array<number | null> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.buildCalendar();
    }
  }

  ngOnInit(): void {
    this.buildCalendar();
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
    // Cap to 5 weeks (35 cells) as requested
    if (cells.length > 35) {
      this.calendarCells = cells.slice(0, 35);
    } else if (cells.length < 35) {
      while (cells.length < 35) cells.push(null);
      this.calendarCells = cells;
    } else {
      this.calendarCells = cells;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
    this.buildCalendar();
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
    this.buildCalendar();
  }
}
