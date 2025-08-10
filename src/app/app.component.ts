import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar *ngIf="showNavbar && !hasError"></app-navbar>
      <div class="main-content">
        <div *ngIf="hasError" class="error-container">
          <h2>Something went wrong</h2>
          <p>Please refresh the page to try again.</p>
          <button class="btn btn-primary" (click)="refreshPage()">Refresh Page</button>
        </div>
        <router-outlet *ngIf="!hasError"></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-content {
      flex: 1;
    }
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      padding: 2rem;
      text-align: center;
    }
    .error-container h2 {
      color: #dc3545;
      margin-bottom: 1rem;
    }
    .error-container p {
      color: #666;
      margin-bottom: 2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  showNavbar = true;
  hasError = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('App component initializing...');

    try {
      // Hide navbar on login/register pages
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe({
        next: (event) => {
          if (event instanceof NavigationEnd) {
            this.showNavbar = !this.isAuthPage(event.url);
            console.log('Navigation completed to:', event.url);
          }
        },
        error: (error) => {
          console.error('Router navigation error:', error);
        }
      });
    } catch (error) {
      console.error('Error setting up router subscription:', error);
    }

    // Enhanced global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
      this.hasError = true;
      event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise,
        stack: event.reason?.stack
      });
      this.hasError = true;
      event.preventDefault();
    });
  }

  private isAuthPage(url: string): boolean {
    return url === '/login' || url === '/register';
  }

  refreshPage(): void {
    window.location.reload();
  }
}
