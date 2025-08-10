import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Hide navbar on login/register pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !this.isAuthPage(event.url);
      }
    });

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
      event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise,
        stack: event.reason?.stack
      });
      event.preventDefault();
    });
  }

  private isAuthPage(url: string): boolean {
    return url === '/login' || url === '/register';
  }
}
