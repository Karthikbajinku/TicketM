import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/members';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getAllAgents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/agents`, {
      headers: this.getHeaders()
    });
  }

  getAgentsByCategory(category: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/agents/by-category?category=${category}`, {
      headers: this.getHeaders()
    });
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    const params = new URLSearchParams();
    params.append('role', role);

    return this.http.put<User>(`${this.baseUrl}/${userId}/role?${params.toString()}`, null, {
      headers: this.getHeaders()
    });
  }
}
