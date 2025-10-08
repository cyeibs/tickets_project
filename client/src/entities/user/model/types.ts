export interface User {
  id: string;
  phone: string;
  name?: string;
  avatar?: string;
  isOrganizer: boolean;
  organizationId?: string | null;
  organizerApplicationStatus?: "pending" | "approved" | "rejected" | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
