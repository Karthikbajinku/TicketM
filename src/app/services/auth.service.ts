import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/members';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<User> {
    // Backend expects form data, not JSON
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    return this.http.post<User>(`${this.baseUrl}/login`, formData)
      .pipe(
        tap(user => {
          try {
            // No token in response, just store user
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          } catch (error) {
            console.error('Error storing login data:', error);
            throw error;
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    // Backend expects JSON body for registration
    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private loadUserFromStorage(): void {
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    }
  }
}
