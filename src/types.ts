export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  code: string; // Ej: VAC-001, ASIA-2026
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: number; // Ej: 4
  travelersNames?: string[]; // Ej: ['Robinson Castro', 'Robinson Josue Castro', 'Donauro Emmanuel Castro', 'Maria Nohemy Israel']
  countries?: string[]; // Ej: ['Japón 🇯🇵', 'Corea del Sur 🇰🇷', 'Tailandia 🇹🇭', 'EE.UU. 🇺🇸']
  coverImage?: string;
  status: TripStatus;
  budgetTotal: number;
  currency: string;
  description: string;
  createdAt: string;
}

export type FlightStatus = 'programado' | 'embarcando' | 'en_vuelo' | 'retrasado' | 'aterrizado' | 'cancelado';

export interface QrTicket {
  passengerName: string;
  seat: string;
  car?: string;
  qrCodeData: string;
}

export interface BoardingPassAttachment {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf';
  fileDataUrl: string;
  passengerName?: string;
  seat?: string;
  uploadedAt: string;
}

export interface Flight {
  id: string;
  tripId: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  terminal?: string;
  gate?: string;
  seat?: string;
  status: FlightStatus;
  confirmationCode?: string;
  price?: number;
  notes?: string;
  transportType?: 'flight' | 'train' | 'bus';
  qrTickets?: QrTicket[];
  boardingPasses?: BoardingPassAttachment[];
}

export type ReservationType = 'hotel' | 'car_rental' | 'restaurant' | 'train' | 'activity_pass' | 'other';
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Reservation {
  id: string;
  tripId: string;
  type: ReservationType;
  title: string;
  provider: string;
  address?: string;
  checkIn: string;
  checkOut?: string;
  confirmationCode: string;
  status: ReservationStatus;
  price?: number;
  phone?: string;
  link?: string;
  notes?: string;
}

export type ActivityCategory = 'sightseeing' | 'food' | 'adventure' | 'relaxation' | 'culture' | 'shopping' | 'transit';

export interface Activity {
  id: string;
  tripId: string;
  date: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface GroundTransferStep {
  id: string;
  stepNumber: number;
  instruction: string;
  mode: 'walk' | 'bus' | 'subway' | 'train' | 'shinkansen' | 'taxi' | 'other';
  durationOrDistance?: string;
  lineOrService?: string;
  notes?: string;
}

export interface GroundTransfer {
  id: string;
  tripId: string;
  title: string;
  fromLocation: string;
  toLocation: string;
  estimatedDuration?: string;
  transportModes: ('walk' | 'bus' | 'subway' | 'train' | 'shinkansen' | 'taxi')[];
  steps: GroundTransferStep[];
  qrTickets?: QrTicket[];
  notes?: string;
}

export interface WhatsAppLog {
  id: string;
  tripId: string;
  timestamp: string;
  recipient: string;
  messageType: 'gate_change' | 'delay_alert' | 'itinerary_update' | 'booking_confirmation' | 'custom' | 'daily_reminder';
  content: string;
  status: 'sent' | 'simulated' | 'failed' | 'delivered';
  isRealApi: boolean;
}

export interface WhatsAppConfig {
  apiToken: string;
  phoneNumberId: string;
  defaultRecipient: string;
  enableAutoAlerts: boolean;
  provider: 'cloud_api' | 'simulator';
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
  isConnected: boolean;
}

export type ExpenseCategory = 'flight' | 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'other';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'transfer';

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amountUSD: number;
  originalAmount?: number;
  originalCurrency?: 'USD' | 'JPY' | 'KRW' | 'THB' | 'HNL' | 'EUR';
  category: ExpenseCategory;
  date: string;
  paidBy: string;
  splitWith?: string[];
  paymentMethod?: PaymentMethod;
  notes?: string;
  location?: string;
}

export type ChecklistCategory =
  | 'documentation'
  | 'money'
  | 'electronics'
  | 'clothing'
  | 'hygiene'
  | 'other';

export type ChecklistImportance = 'imprescindible' | 'recomendable';

export interface ChecklistItem {
  id: string;
  tripId: string;
  category: ChecklistCategory;
  importance: ChecklistImportance;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string; // 'Todos' or specific traveler name
  dueDate?: string;
  notes?: string;
  isCustom?: boolean;
}

