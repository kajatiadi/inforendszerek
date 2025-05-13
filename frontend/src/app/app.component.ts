import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  username: string | null = null;

  ngOnInit() {
    this.username = localStorage.getItem("username");
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    location.reload();
  }
}