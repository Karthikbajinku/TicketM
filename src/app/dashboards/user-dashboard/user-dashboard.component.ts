import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket, CreateTicketRequest, TicketNote } from '../../models/ticket.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  ticketNotes: TicketNote[] = [];
  
  // Forms
  createTicketForm: FormGroup;
  ratingForm: FormGroup;
  
  // UI State
  activeTab = 'tickets';
  showCreateForm = false;
  showRatingModal = false;
  ticketToRate: Ticket | null = null;
  
  // Stats
  totalTickets = 0;
  openTickets = 0;
  resolvedTickets = 0;
  
  loading = false;
  submittingTicket = false;
  submittingRating = false;

  categories = [
    { name: 'Hardware', subcategories: ['Computer Issues', 'Printer Problems', 'Network Equipment', 'Mobile Devices'] },
    { name: 'Software', subcategories: ['Application Errors', 'Operating System', 'License Issues', 'Installation'] },
    { name: 'Network', subcategories: ['Internet Connectivity', 'VPN Issues', 'Email Problems', 'File Sharing'] },
    { name: 'Security', subcategories: ['Password Reset', 'Account Access', 'Virus/Malware', 'Data Protection'] },
    { name: 'Other', subcategories: ['General Inquiry', 'Training Request', 'Equipment Request', 'Policy Question'] }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.createTicketForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required]
    });

    this.ratingForm = this.formBuilder.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      feedback: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserTickets();
    }
  }

  loadUserTickets(): void {
    if (!this.currentUser) return;
    
    this.loading = true;
    this.ticketService.getTicketsByUser(this.currentUser.id).subscribe({
      next: (tickets) => {
        this.tickets = tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user tickets:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'AWAITING_RESPONSE').length;
    this.resolvedTickets = this.tickets.filter(t => t.status === 'RESOLVED').length;
  }

  onCategoryChange(): void {
    this.createTicketForm.patchValue({ subCategory: '' });
  }

  getSubcategories(): string[] {
    const selectedCategory = this.createTicketForm.get('category')?.value;
    const category = this.categories.find(c => c.name === selectedCategory);
    return category ? category.subcategories : [];
  }

  createTicket(): void {
    if (this.createTicketForm.invalid) return;
    
    this.submittingTicket = true;
    const ticketData: CreateTicketRequest = this.createTicketForm.value;
    
    this.ticketService.createTicket(ticketData).subscribe({
      next: (ticket) => {
        this.tickets.unshift(ticket);
        this.calculateStats();
        this.createTicketForm.reset();
        this.showCreateForm = false;
        this.submittingTicket = false;
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        this.submittingTicket = false;
      }
    });
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.loadTicketNotes(ticket.id);
  }

  loadTicketNotes(ticketId: number): void {
    this.ticketService.getTicketNotes(ticketId).subscribe({
      next: (notes) => {
        this.ticketNotes = notes.filter(note => !note.isInternal);
      },
      error: (error) => {
        console.error('Error loading ticket notes:', error);
      }
    });
  }

  openRatingModal(ticket: Ticket): void {
    this.ticketToRate = ticket;
    this.showRatingModal = true;
    this.ratingForm.reset();
    this.ratingForm.patchValue({ rating: 5 });
  }

  submitRating(): void {
    if (this.ratingForm.invalid || !this.ticketToRate) return;
    
    this.submittingRating = true;
    const ratingData = {
      ticketId: this.ticketToRate.id,
      agentId: this.ticketToRate.assignedTo!.id,
      score: this.ratingForm.value.rating,
      comments: this.ratingForm.value.feedback || undefined
    };

    this.ticketService.addRating(ratingData).subscribe({
      next: (rating) => {
        this.showRatingModal = false;
        this.ticketToRate = null;
        this.submittingRating = false;
        // Optionally show success message
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
        this.submittingRating = false;
      }
    });
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.ticketToRate = null;
  }

  closeTicketDetails(): void {
    this.selectedTicket = null;
    this.ticketNotes = [];
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

  canRate(ticket: Ticket): boolean {
    return ticket.status === 'RESOLVED' && ticket.assignedTo != null;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'create') {
      this.showCreateForm = true;
    } else {
      this.showCreateForm = false;
    }
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
