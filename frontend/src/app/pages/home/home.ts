import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: []
})
export class Home {
  isLoggedIn = false;

  constructor(private router: Router) {}

  checkLogin(){
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  ngOnInit(){
    this.checkLogin();
    this.router.events.subscribe(() => {
      this.checkLogin();
    });
  }
}
