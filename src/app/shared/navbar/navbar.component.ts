import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  getRoleClass(): string {
    return this.currentUser ? `role-${this.currentUser.role.toLowerCase()}` : '';
  }

  getUserRole(): string {
    return this.currentUser ? this.currentUser.role : '';
  }

  getUserName(): string {
    return this.currentUser ? this.currentUser.name : '';
  }
}
