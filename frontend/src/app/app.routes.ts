import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { CreateEventPage } from './pages/create-event/create-event';
import { InviteEventPage } from './pages/invite-event/invite-event';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'event', component: CreateEventPage },
  { path: 'event/:id/invite', component: InviteEventPage }
];
