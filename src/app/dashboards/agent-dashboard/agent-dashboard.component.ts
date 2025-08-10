import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket, TicketNote, Rating } from '../../models/ticket.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  ticketNotes: TicketNote[] = [];
  myRatings: Rating[] = [];
  
  // Form data
  newNote = '';
  selectedStatus = '';
  
  // Stats
  totalAssigned = 0;
  inProgress = 0;
  resolved = 0;
  averageRating = 0;
  
  loading = false;
  addingNote = false;
  updatingStatus = false;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadAgentTickets();
      this.loadAgentRatings();
    }
  }

  loadAgentTickets(): void {
    if (!this.currentUser) return;
    
    this.loading = true;
    this.ticketService.getTicketsByAgent(this.currentUser.id).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading agent tickets:', error);
        this.loading = false;
      }
    });
  }

  loadAgentRatings(): void {
    if (!this.currentUser) return;
    
    this.ticketService.getAgentRatings(this.currentUser.id).subscribe({
      next: (ratings) => {
        this.myRatings = ratings;
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error loading agent ratings:', error);
      }
    });
  }

  calculateStats(): void {
    this.totalAssigned = this.tickets.length;
    this.inProgress = this.tickets.filter(t => t.status === 'IN_PROGRESS').length;
    this.resolved = this.tickets.filter(t => t.status === 'RESOLVED').length;
  }

  calculateAverageRating(): void {
    if (this.myRatings.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.myRatings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = Math.round((sum / this.myRatings.length) * 10) / 10;
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.selectedStatus = ticket.status;
    this.loadTicketNotes(ticket.id);
  }

  loadTicketNotes(ticketId: number): void {
    this.ticketService.getTicketNotes(ticketId).subscribe({
      next: (notes) => {
        this.ticketNotes = notes;
      },
      error: (error) => {
        console.error('Error loading ticket notes:', error);
      }
    });
  }

  updateTicketStatus(): void {
    if (!this.selectedTicket || !this.selectedStatus) return;
    
    this.updatingStatus = true;
    this.ticketService.updateTicketStatus(this.selectedTicket.id, this.selectedStatus).subscribe({
      next: (updatedTicket) => {
        // Update the ticket in the list
        const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
        if (index !== -1) {
          this.tickets[index] = updatedTicket;
        }
        this.selectedTicket = updatedTicket;
        this.calculateStats();
        this.updatingStatus = false;
      },
      error: (error) => {
        console.error('Error updating ticket status:', error);
        this.updatingStatus = false;
      }
    });
  }

  addNote(): void {
    if (!this.selectedTicket || !this.newNote.trim()) return;
    
    this.addingNote = true;
    const noteData = {
      ticketId: this.selectedTicket.id,
      content: this.newNote.trim(),
      isInternal: false
    };

    this.ticketService.addNote(noteData).subscribe({
      next: (note) => {
        this.ticketNotes.push(note);
        this.newNote = '';
        this.addingNote = false;
      },
      error: (error) => {
        console.error('Error adding note:', error);
        this.addingNote = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'URGENT': return 'priority-urgent';
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  }

  closeTicketDetails(): void {
    this.selectedTicket = null;
    this.ticketNotes = [];
    this.newNote = '';
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getStatusOptions(): string[] {
    return ['IN_PROGRESS', 'AWAITING_RESPONSE', 'RESOLVED'];
  }

  canUpdateStatus(): boolean {
    return this.selectedTicket?.status !== 'RESOLVED' && this.selectedTicket?.status !== 'REOPENED';
  }
}
