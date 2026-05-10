// MotorGlow — Shared TypeScript types

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Customer {
  id: string;
  firebase_uid: string;
  phone: string | null;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  tagline: string | null;
  price: number;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  firebase_uid: string;
  customer_phone: string | null;
  package_id: string | null;
  package_name: string;
  vehicle: string;
  location: string;
  notes: string | null;
  date: string;
  time_slot: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingPayload {
  package_id: string;
  package_name: string;
  vehicle: string;
  location: string;
  notes?: string;
  date: string;
  time_slot: string;
}
