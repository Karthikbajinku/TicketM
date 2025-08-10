import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, CreateTicketRequest, TicketNote, TicketHistory, Rating } from '../models/ticket.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Ticket CRUD operations
  createTicket(ticketData: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}/tickets/create`, ticketData, {
      headers: this.getHeaders()
    });
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/all`, {
      headers: this.getHeaders()
    });
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/tickets/${id}`, {
      headers: this.getHeaders()
    });
  }

  getTicketsByUser(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getTicketsByAgent(agentId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/agent/${agentId}`, {
      headers: this.getHeaders()
    });
  }

  getTicketsByStatus(status: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/filter/status/${status}`, {
      headers: this.getHeaders()
    });
  }

  getTicketsByDateRange(startDate: string, endDate: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets/filter/date?start=${startDate}&end=${endDate}`, {
      headers: this.getHeaders()
    });
  }

  updateTicketStatus(ticketId: string, status: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/tickets/${ticketId}/status`, { status }, {
      headers: this.getHeaders()
    });
  }

  updateTicketDescription(ticketId: string, description: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/tickets/${ticketId}/description`, { description }, {
      headers: this.getHeaders()
    });
  }

  // Notes operations
  addNote(noteData: { ticketId: number; authorId: number; note: string }): Observable<TicketNote> {
    return this.http.post<TicketNote>(`${this.baseUrl}/notes/add`, noteData, {
      headers: this.getHeaders()
    });
  }

  getTicketNotes(ticketId: number): Observable<TicketNote[]> {
    return this.http.get<TicketNote[]>(`${this.baseUrl}/notes/ticket/${ticketId}`, {
      headers: this.getHeaders()
    });
  }

  // History operations
  getTicketHistory(ticketId: number): Observable<TicketHistory[]> {
    return this.http.get<TicketHistory[]>(`${this.baseUrl}/ticket-history/ticket/${ticketId}`, {
      headers: this.getHeaders()
    });
  }

  // Rating operations
  addRating(ratingData: { ticketId: number; agentId: number; score: number; comments?: string }): Observable<Rating> {
    return this.http.post<Rating>(`${this.baseUrl}/ratings/add`, ratingData, {
      headers: this.getHeaders()
    });
  }

  getAgentRatings(agentId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.baseUrl}/ratings/agent/${agentId}`, {
      headers: this.getHeaders()
    });
  }
}
