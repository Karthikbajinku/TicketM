export interface Ticket {
  id: number;
  ticketId: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'AWAITING_RESPONSE' | 'RESOLVED' | 'REOPENED' | 'CLOSED';
  category: string;
  subCategory: string;
  createdAt: string;
  createdBy: User;
  assignedTo?: User;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: string;
  subCategory: string;
}

export interface TicketNote {
  id: number;
  ticket: Ticket;
  author: User;
  note: string;
  createdAt: string;
}

export interface TicketHistory {
  id: number;
  ticket: Ticket;
  action: string;
  description: string;
  performedBy: User;
  performedAt: string;
}

export interface Rating {
  id: number;
  ticket: Ticket;
  givenBy: User;
  agent: User;
  score: number;
  comments?: string;
  createdAt: string;
}
