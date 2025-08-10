import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AdminService } from '../../services/admin.service';
import { Ticket, TicketHistory, TicketNote, Rating } from '../../models/ticket.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  agents: User[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  ticketHistory: TicketHistory[] = [];
  ticketNotes: TicketNote[] = [];
  agentRatings: Rating[] = [];
  
  // Filters
  statusFilter = '';
  startDate = '';
  endDate = '';
  
  // Stats
  totalTickets = 0;
  openTickets = 0;
  inProgressTickets = 0;
  resolvedTickets = 0;
  
  // View modes
  activeTab = 'dashboard';
  
  loading = false;

  constructor(
    private ticketService: TicketService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load all tickets
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loading = false;
      }
    });
    
    // Load all agents
    this.adminService.getAllAgents().subscribe({
      next: (agents) => {
        this.agents = agents;
      },
      error: (error) => {
        console.error('Error loading agents:', error);
      }
    });
  }

  calculateStats(): void {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(t => t.status === 'OPEN').length;
    this.inProgressTickets = this.tickets.filter(t => t.status === 'IN_PROGRESS').length;
    this.resolvedTickets = this.tickets.filter(t => t.status === 'RESOLVED').length;
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      let matches = true;
      
      if (this.statusFilter && ticket.status !== this.statusFilter) {
        matches = false;
      }
      
      if (this.startDate && new Date(ticket.createdAt) < new Date(this.startDate)) {
        matches = false;
      }
      
      if (this.endDate && new Date(ticket.createdAt) > new Date(this.endDate)) {
        matches = false;
      }
      
      return matches;
    });
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.startDate = '';
    this.endDate = '';
    this.filteredTickets = this.tickets;
  }

  viewTicketDetails(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.loadTicketHistory(ticket.id);
    this.loadTicketNotes(ticket.id);
  }

  loadTicketHistory(ticketId: number): void {
    this.ticketService.getTicketHistory(ticketId).subscribe({
      next: (history) => {
        this.ticketHistory = history;
      },
      error: (error) => {
        console.error('Error loading ticket history:', error);
      }
    });
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

  loadAgentRatings(agentId: number): void {
    this.ticketService.getAgentRatings(agentId).subscribe({
      next: (ratings) => {
        this.agentRatings = ratings;
      },
      error: (error) => {
        console.error('Error loading agent ratings:', error);
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

  getAgentName(agentId: number): string {
    const agent = this.agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unassigned';
  }

  getAverageRating(agentId: number): number {
    const ratings = this.agentRatings.filter(r => r.agent.id === agentId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  closeTicketDetails(): void {
    this.selectedTicket = null;
    this.ticketHistory = [];
    this.ticketNotes = [];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'agents') {
      this.agents.forEach(agent => {
        this.loadAgentRatings(agent.id);
      });
    }
  }
}
