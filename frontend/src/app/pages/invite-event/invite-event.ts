import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

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

  saveInvites(): void {
    // Backend not ready yet: just show a friendly message and log payload
    const payload = { eventId: this.eventId, invitees: this.invitedEmails };
    console.log('Draft invites (to be sent when backend is ready):', payload);
    this.message = 'Invitaciones preparadas. Se enviarán cuando el backend esté listo.';
  }

  private isValidEmail(e: string): boolean {
    return /.+@.+\..+/.test(e);
  }
}
