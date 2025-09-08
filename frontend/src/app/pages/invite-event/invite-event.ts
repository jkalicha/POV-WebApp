import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-invite-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './invite-event.html',
  styleUrls: ['./invite-event.scss']
})
export class InviteEventPage implements OnInit {
  eventId: string = '';
  eventTitle: string = '';
  emailInput: string = '';
  invitedEmails: string[] = [];
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.eventTitle = this.route.snapshot.queryParamMap.get('title') || '';
  }

  addEmail(): void {
    const raw = (this.emailInput || '').trim();
    if (!raw) return;
    // allow comma-separated batch
    const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
    for (const p of parts) {
      if (this.isValidEmail(p) && !this.invitedEmails.includes(p)) {
        this.invitedEmails.push(p);
      }
    }
    this.emailInput = '';
  }

  onEmailKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ',') {
      ev.preventDefault();
      this.addEmail();
    }
  }

  removeEmail(i: number): void {
    this.invitedEmails.splice(i, 1);
  }

  async saveInvites(): Promise<void> {
    if (!this.eventId || this.invitedEmails.length === 0) return;
    try {
      const res = await this.eventService.inviteToEvent(this.eventId, this.invitedEmails);
      const skippedMsg = res.skipped?.length
        ? ` | Omitidas: ${res.skipped.map(s => `${s.email} (${s.reason})`).join(', ')}`
        : '';
      this.message = `Invitaciones enviadas (${res.invited.length}).${skippedMsg}`;
      // Opcional: limpiar lista si todo OK
      // this.invitedEmails = [];
    } catch (e: any) {
      this.message = e?.error?.error || 'No se pudieron enviar las invitaciones';
    }
  }

  private isValidEmail(e: string): boolean {
    return /.+@.+\..+/.test(e);
  }
}
