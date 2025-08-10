export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'AWAITING' | 'RESOLVED' | 'REOPENED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  subcategory: string;
  userId: number;
  agentId?: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface TicketNote {
  id: number;
  ticketId: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  isInternal: boolean;
}

export interface TicketHistory {
  id: number;
  ticketId: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  userId: number;
  userName: string;
  timestamp: string;
}

export interface Rating {
  id: number;
  ticketId: number;
  agentId: number;
  userId: number;
  rating: number;
  feedback?: string;
  createdAt: string;
}
