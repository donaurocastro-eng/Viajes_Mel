import { Trip, Flight, Reservation, Activity, WhatsAppLog } from '../types';

export const initialTrips: Trip[] = [
  {
    id: 'trip-1',
    title: 'Aventura Europea: Madrid y París',
    destination: 'Madrid, España y París, Francia',
    startDate: '2026-09-15',
    endDate: '2026-09-25',
    coverImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    budgetTotal: 3500,
    currency: 'EUR',
    description: 'Viaje cultural y gastronómico por España y Francia. Visita a museos, vuelos entre ciudades y reservas especiales.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'trip-2',
    title: 'Escape Tropical a Cancún',
    destination: 'Cancún y Rivera Maya, México',
    startDate: '2026-11-01',
    endDate: '2026-11-07',
    coverImage: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1200&q=80',
    status: 'planning',
    budgetTotal: 2200,
    currency: 'USD',
    description: 'Vacaciones de descanso en playa, cenotes y parque Xcaret con familia.',
    createdAt: new Date().toISOString()
  }
];

export const initialFlights: Flight[] = [
  {
    id: 'flight-1',
    tripId: 'trip-1',
    flightNumber: 'IB 6801',
    airline: 'Iberia',
    departureAirport: 'MEX (Ciudad de México)',
    arrivalAirport: 'MAD (Madrid Barajas)',
    departureCity: 'Ciudad de México',
    arrivalCity: 'Madrid',
    departureTime: '2026-09-15T18:45',
    arrivalTime: '2026-09-16T12:30',
    terminal: 'T4',
    gate: 'H22',
    seat: '14A',
    status: 'programado',
    confirmationCode: 'IB9872X',
    price: 850,
    notes: 'Incluye 2 maletas documentadas. Asiento de ventana.'
  },
  {
    id: 'flight-2',
    tripId: 'trip-1',
    flightNumber: 'AF 1401',
    airline: 'Air France',
    departureAirport: 'MAD (Madrid Barajas)',
    arrivalAirport: 'CDG (París Charles de Gaulle)',
    departureCity: 'Madrid',
    arrivalCity: 'París',
    departureTime: '2026-09-20T09:15',
    arrivalTime: '2026-09-20T11:25',
    terminal: 'T2F',
    gate: 'K12',
    seat: '08C',
    status: 'programado',
    confirmationCode: 'AF4421Z',
    price: 180,
    notes: 'Vuelo corto entre capitales.'
  }
];

export const initialReservations: Reservation[] = [
  {
    id: 'res-1',
    tripId: 'trip-1',
    type: 'hotel',
    title: 'Hotel Gran Vía Boutique',
    provider: 'Booking.com',
    address: 'Calle Gran Vía 32, Centro, Madrid, España',
    checkIn: '2026-09-16T15:00',
    checkOut: '2026-09-20T11:00',
    confirmationCode: 'BK-992140',
    status: 'confirmed',
    price: 640,
    phone: '+34 91 555 1234',
    notes: 'Incluye desayuno continental. Habitación con balcón.'
  },
  {
    id: 'res-2',
    tripId: 'trip-1',
    type: 'hotel',
    title: 'Hotel Le Marais Charm',
    provider: 'Expedia',
    address: 'Rue de Turenne 45, 3rd Arr., París, Francia',
    checkIn: '2026-09-20T14:00',
    checkOut: '2026-09-25T10:00',
    confirmationCode: 'EXP-88319',
    status: 'confirmed',
    price: 920,
    phone: '+33 1 42 77 88 99',
    notes: 'Cerca del Museo Picasso.Check-in automático disponible.'
  },
  {
    id: 'res-3',
    tripId: 'trip-1',
    type: 'restaurant',
    title: 'Cena en Botín (Restaurante más antiguo del mundo)',
    provider: 'Restaurante Botín',
    address: 'Calle Cuchilleros 17, Madrid',
    checkIn: '2026-09-17T21:00',
    confirmationCode: 'BOT-102',
    status: 'confirmed',
    price: 120,
    notes: 'Especialidad: Cochinillo asado en horno de leña.'
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    tripId: 'trip-1',
    date: '2026-09-16',
    title: 'Paseo por la Puerta del Sol y Plaza Mayor',
    description: 'Caminata inicial para conocer el centro histórico y probar churros con chocolate en San Ginés.',
    category: 'sightseeing',
    startTime: '16:30',
    endTime: '19:00',
    location: 'Plaza Mayor, Madrid',
    cost: 15,
    completed: true,
    priority: 'high'
  },
  {
    id: 'act-2',
    tripId: 'trip-1',
    date: '2026-09-17',
    title: 'Visita Guiada al Museo del Prado',
    description: 'Ver Las Meninas de Velázquez y obras de Goya. Entrada prioritaria comprada.',
    category: 'culture',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Museo del Prado, Madrid',
    cost: 25,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-3',
    tripId: 'trip-1',
    date: '2026-09-18',
    title: 'Excursión de un día a Toledo en tren de alta velocidad',
    description: 'Recorrido por la ciudad imperial de las tres culturas. Comprar souvenir de acero damasquinado.',
    category: 'adventure',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Toledo, España',
    cost: 65,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-4',
    tripId: 'trip-1',
    date: '2026-09-21',
    title: 'Subida a la Torre Eiffel y Paseo por el Sena',
    description: 'Ticket para el 2º piso y crucero nocturno Bateaux Mouches.',
    category: 'sightseeing',
    startTime: '17:00',
    endTime: '21:30',
    location: 'Champ de Mars, París',
    cost: 75,
    completed: false,
    priority: 'high'
  }
];

export const initialWhatsAppLogs: WhatsAppLog[] = [
  {
    id: 'wa-1',
    tripId: 'trip-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    recipient: '+5215551234567',
    messageType: 'booking_confirmation',
    content: '✈️ *Vuelo Confirmado*: Iberia IB 6801 (MEX -> MAD)\n📅 Salida: 15 Sep 18:45\nSeat: 14A | Gate: H22\nCod. Reserva: IB9872X',
    status: 'delivered',
    isRealApi: false
  },
  {
    id: 'wa-2',
    tripId: 'trip-1',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    recipient: '+5215551234567',
    messageType: 'gate_change',
    content: '🚨 *Actualización de Puerta*: Tu vuelo IB 6801 ha actualizado la puerta de abordaje a *H22* en la Terminal 4.',
    status: 'delivered',
    isRealApi: false
  }
];
