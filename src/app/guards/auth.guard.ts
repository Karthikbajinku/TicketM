import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      // Redirect to appropriate dashboard based on user role
      const user = this.authService.getCurrentUser();
      if (user) {
        switch (user.role) {
          case 'ADMIN':
            this.router.navigate(['/admin-dashboard']);
            break;
          case 'AGENT':
            this.router.navigate(['/agent-dashboard']);
            break;
          case 'USER':
            this.router.navigate(['/user-dashboard']);
            break;
        }
      }
      return false;
    }

    return true;
  }
}
