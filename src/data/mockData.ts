import { Trip, Flight, Reservation, Activity, WhatsAppLog, GroundTransfer, Expense } from '../types';

export const initialTrips: Trip[] = [
  {
    id: 'trip-asia-2026',
    code: 'VAC-001',
    title: 'Gran Tour Asia 2026: Honduras, EE.UU., Japón, Seúl y Tailandia',
    destination: 'Japón (Osaka, Tokio), Seúl (Corea del Sur) y Tailandia',
    startDate: '2026-08-18',
    endDate: '2026-09-10',
    travelersCount: 4,
    travelersNames: [
      'Donauro Emmanuel Castro',
      'Robinson Josué Castro',
      'Domingo Robinson Castro',
      'Nohemy María Israel'
    ],
    countries: ['Honduras 🇭🇳', 'EE.UU. 🇺🇸', 'Japón 🇯🇵', 'Corea del Sur 🇰🇷', 'Tailandia 🇹🇭'],
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    budgetTotal: 6500,
    currency: 'USD',
    description: 'Viaje transcontinental con salida de Honduras hacia EE.UU. (18-Ago), ruta Japón Osaka y Tokio (23-31 Ago), Seúl y Tailandia, con regreso a Honduras el 10 de Septiembre.',
    createdAt: new Date().toISOString()
  }
];

export const initialFlights: Flight[] = [
  {
    id: 'flight-hn-1',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 527',
    airline: 'United Airlines',
    departureAirport: 'XPL (Comayagua, Honduras)',
    arrivalAirport: 'IAH (Houston, EE.UU.)',
    departureCity: 'Comayagua',
    arrivalCity: 'Houston',
    departureTime: '2026-08-18T12:30',
    arrivalTime: '2026-08-18T16:35',
    terminal: 'T1',
    gate: 'A4',
    seat: '15C',
    status: 'programado',
    confirmationCode: 'BQDIQK',
    price: 552,
    notes: 'Reserva BQDIQK (Cod. O7TX21). Salida de Honduras. Escala de 2h 15m en Houston.',
    boardingPasses: [
      {
        id: 'bp-hn-1-a',
        fileName: 'Pase_Abordaje_United_UA527_Donauro.pdf',
        fileType: 'pdf',
        fileDataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        passengerName: 'Donauro Emmanuel Castro',
        seat: '15C',
        uploadedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'flight-hn-2',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 1477',
    airline: 'United Airlines',
    departureAirport: 'IAH (Houston, EE.UU.)',
    arrivalAirport: 'SAT (San Antonio, EE.UU.)',
    departureCity: 'Houston',
    arrivalCity: 'San Antonio',
    departureTime: '2026-08-18T18:50',
    arrivalTime: '2026-08-18T19:58',
    terminal: 'TC',
    gate: 'C18',
    seat: '15C',
    status: 'programado',
    confirmationCode: 'BQDIQK',
    price: 553,
    notes: 'Llegada a San Antonio (SAT). Estancia en San Antonio antes del vuelo transpacífico a Japón el 23-Ago.'
  },
  {
    id: 'flight-jp-1',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 0790',
    airline: 'United Airlines',
    departureAirport: 'SAT (San Antonio, EE.UU.)',
    arrivalAirport: 'SFO (San Francisco, EE.UU.)',
    departureCity: 'San Antonio',
    arrivalCity: 'San Francisco',
    departureTime: '2026-08-23T07:14',
    arrivalTime: '2026-08-23T08:59',
    terminal: 'Terminal B',
    gate: 'F12',
    seat: '18A, 18B, 18C, 18D',
    status: 'programado',
    confirmationCode: 'OZL5K3',
    price: 320,
    transportType: 'flight',
    notes: 'Voucher TripMasters #9008993. Escala en San Francisco (SFO).',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '18A', car: 'Economy', qrCodeData: 'UA0790-SAT-SFO-0167443186390' },
      { passengerName: 'Robinson Josué Castro', seat: '18B', car: 'Economy', qrCodeData: 'UA0790-SAT-SFO-0167443186386' },
      { passengerName: 'Domingo Robinson Castro', seat: '18C', car: 'Economy', qrCodeData: 'UA0790-SAT-SFO-0167443186388' },
      { passengerName: 'Nohemy María Israel', seat: '18D', car: 'Economy', qrCodeData: 'UA0790-SAT-SFO-0167443186392' }
    ]
  },
  {
    id: 'flight-jp-2',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 0035',
    airline: 'United Airlines',
    departureAirport: 'SFO (San Francisco, EE.UU.)',
    arrivalAirport: 'KIX (Osaka Kansai, Japón)',
    departureCity: 'San Francisco',
    arrivalCity: 'Osaka',
    departureTime: '2026-08-23T11:10',
    arrivalTime: '2026-08-24T14:50',
    terminal: 'Terminal I',
    gate: 'G92',
    seat: '35A, 35B, 35C, 35D',
    status: 'programado',
    confirmationCode: 'OZL5K3',
    price: 980,
    transportType: 'flight',
    notes: 'Vuelo transpacífico a Osaka (KIX). Llega lunes 24 de agosto a las 2:50 p.m.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '35A', car: 'Economy', qrCodeData: 'UA0035-SFO-KIX-0167443186390' },
      { passengerName: 'Robinson Josué Castro', seat: '35B', car: 'Economy', qrCodeData: 'UA0035-SFO-KIX-0167443186386' },
      { passengerName: 'Domingo Robinson Castro', seat: '35C', car: 'Economy', qrCodeData: 'UA0035-SFO-KIX-0167443186388' },
      { passengerName: 'Nohemy María Israel', seat: '35D', car: 'Economy', qrCodeData: 'UA0035-SFO-KIX-0167443186392' }
    ]
  },
  {
    id: 'flight-jp-3',
    tripId: 'trip-asia-2026',
    flightNumber: 'Shinkansen Nozomi 86',
    airline: 'JR West / JR Central',
    departureAirport: 'Estación Shin-Osaka',
    arrivalAirport: 'Estación de Tokio',
    departureCity: 'Osaka',
    arrivalCity: 'Tokio',
    departureTime: '2026-08-28T09:33',
    arrivalTime: '2026-08-28T12:03',
    terminal: 'Vía 22',
    gate: 'Coche 5',
    seat: '10-A, 10-B, 10-C, 9-A',
    status: 'programado',
    confirmationCode: 'Reserva #2000',
    price: 130,
    transportType: 'train',
    notes: 'Tren Bala Nozomi 86. Muestra el código QR individual de cada pasajero en los torniquetes de entrada/salida y recoge la "Información de Asiento" (EXご利用票).',
    qrTickets: [
      {
        passengerName: 'Donauro Emmanuel Castro',
        seat: '9-A',
        car: 'Coche 5',
        qrCodeData: 'E919 CCC7 C019 0B17 4ECF 73EE B013 4887'
      },
      {
        passengerName: 'Robinson Josué Castro',
        seat: '10-B',
        car: 'Coche 5',
        qrCodeData: 'E404 D1DA E104 D014 8E4D 7090 B259 6AEA'
      },
      {
        passengerName: 'Domingo Robinson Castro',
        seat: '10-A',
        car: 'Coche 5',
        qrCodeData: 'EE0E DBD0 D10E FD01 3E98 778F 5FF8 D5A8'
      },
      {
        passengerName: 'Nohemy María Israel',
        seat: '10-C',
        car: 'Coche 5',
        qrCodeData: 'EAFA 2F24 10FA 4FEB B648 9741 4E52 BAE1'
      }
    ]
  },
  {
    id: 'flight-kr-1',
    tripId: 'trip-asia-2026',
    flightNumber: 'H1 9806 (Jeju Air)',
    airline: 'Hahn Air / Jeju Air',
    departureAirport: 'NRT (Tokio Narita, Japón)',
    arrivalAirport: 'ICN (Seúl Incheon, Corea)',
    departureCity: 'Tokio',
    arrivalCity: 'Seúl',
    departureTime: '2026-09-01T18:30',
    arrivalTime: '2026-09-01T21:20',
    terminal: 'Terminal 3',
    gate: 'T3-12',
    seat: '14A, 14B, 14C, 14D',
    status: 'programado',
    confirmationCode: 'BB11PU',
    price: 210,
    transportType: 'flight',
    notes: 'Voucher TripMasters #9008999. Vuelo de Japón a Corea del Sur.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '14A', car: 'Economy', qrCodeData: 'JEJU-BB11PU-DONAURO-14A' },
      { passengerName: 'Robinson Josué Castro', seat: '14B', car: 'Economy', qrCodeData: 'JEJU-BB11PU-ROBINSON-14B' },
      { passengerName: 'Domingo Robinson Castro', seat: '14C', car: 'Economy', qrCodeData: 'JEJU-BB11PU-DOMINGO-14C' },
      { passengerName: 'Nohemy María Israel', seat: '14D', car: 'Economy', qrCodeData: 'JEJU-BB11PU-NOHEMY-14D' }
    ]
  },
  {
    id: 'train-arex-1',
    tripId: 'trip-asia-2026',
    flightNumber: 'AREX Express Direct',
    airline: 'Airport Railroad Express Korea',
    departureAirport: 'Aeropuerto ICN T1/T2',
    arrivalAirport: 'Estación de Seúl',
    departureCity: 'Seúl Incheon',
    arrivalCity: 'Seúl Centro',
    departureTime: '2026-09-01T21:45',
    arrivalTime: '2026-09-01T22:28',
    terminal: 'Terminal ICN',
    gate: 'Andén AREX',
    seat: 'Coche 3 (4A, 4B, 4C, 4D)',
    status: 'programado',
    confirmationCode: 'AREX-SEOUL-901',
    price: 10,
    transportType: 'train',
    notes: 'Tren Expreso directo (43 minutos sin paradas) hasta la Estación de Seúl. Escanear código QR en el torniquete de acceso.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '4A', car: 'Coche 3', qrCodeData: 'AREX-EXPRESS-ICN-SEOUL-DONAURO-4A' },
      { passengerName: 'Robinson Josué Castro', seat: '4B', car: 'Coche 3', qrCodeData: 'AREX-EXPRESS-ICN-SEOUL-ROBINSON-4B' },
      { passengerName: 'Domingo Robinson Castro', seat: '4C', car: 'Coche 3', qrCodeData: 'AREX-EXPRESS-ICN-SEOUL-DOMINGO-4C' },
      { passengerName: 'Nohemy María Israel', seat: '4D', car: 'Coche 3', qrCodeData: 'AREX-EXPRESS-ICN-SEOUL-NOHEMY-4D' }
    ]
  },
  {
    id: 'flight-th-1',
    tripId: 'trip-asia-2026',
    flightNumber: 'VZ 0851',
    airline: 'Thai Vietjet Air',
    departureAirport: 'ICN (Seúl Incheon, Corea)',
    arrivalAirport: 'BKK (Bangkok, Tailandia)',
    departureCity: 'Seúl',
    arrivalCity: 'Bangkok',
    departureTime: '2026-09-04T12:10',
    arrivalTime: '2026-09-04T16:00',
    terminal: 'Terminal 1',
    gate: '115',
    seat: '12A, 12B, 12C, 12D',
    status: 'programado',
    confirmationCode: 'B5UUP3',
    price: 260,
    transportType: 'flight',
    notes: 'Voucher TripMasters #9009002. Vuelo de Corea a Tailandia. Equipaje: 20kg.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '12A', car: 'Economy', qrCodeData: 'VIETJET-B5UUP3-DONAURO-12A' },
      { passengerName: 'Robinson Josué Castro', seat: '12B', car: 'Economy', qrCodeData: 'VIETJET-B5UUP3-ROBINSON-12B' },
      { passengerName: 'Domingo Robinson Castro', seat: '12C', car: 'Economy', qrCodeData: 'VIETJET-B5UUP3-DOMINGO-12C' },
      { passengerName: 'Nohemy María Israel', seat: '12D', car: 'Economy', qrCodeData: 'VIETJET-B5UUP3-NOHEMY-12D' }
    ]
  },
  {
    id: 'flight-ret-1',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 7968 (Operado por ANA)',
    airline: 'United Airlines / ANA',
    departureAirport: 'BKK (Bangkok, Tailandia)',
    arrivalAirport: 'NRT (Tokio Narita, Japón)',
    departureCity: 'Bangkok',
    arrivalCity: 'Tokio',
    departureTime: '2026-09-08T07:00',
    arrivalTime: '2026-09-08T15:20',
    terminal: 'Terminal 1',
    gate: 'E4',
    seat: '41F, 41D, 41G, 42D',
    status: 'programado',
    confirmationCode: 'OZL5K3',
    price: 450,
    transportType: 'flight',
    notes: 'Vuelo de regreso Tramo 1: Bangkok a Tokio Narita.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '41F', car: 'Economy', qrCodeData: 'ANA-OZL5K3-DONAURO-41F' },
      { passengerName: 'Robinson Josué Castro', seat: '41D', car: 'Economy', qrCodeData: 'ANA-OZL5K3-ROBINSON-41D' },
      { passengerName: 'Domingo Robinson Castro', seat: '41G', car: 'Economy', qrCodeData: 'ANA-OZL5K3-DOMINGO-41G' },
      { passengerName: 'Nohemy María Israel', seat: '42D', car: 'Economy', qrCodeData: 'ANA-OZL5K3-NOHEMY-42D' }
    ]
  },
  {
    id: 'flight-ret-2',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 0838',
    airline: 'United Airlines',
    departureAirport: 'NRT (Tokio Narita, Japón)',
    arrivalAirport: 'SFO (San Francisco, EE.UU.)',
    departureCity: 'Tokio',
    arrivalCity: 'San Francisco',
    departureTime: '2026-09-08T17:05',
    arrivalTime: '2026-09-08T10:35',
    terminal: 'Terminal 1',
    gate: 'G22',
    seat: '36A, 36B, 36C, 36D',
    status: 'programado',
    confirmationCode: 'OZL5K3',
    price: 750,
    transportType: 'flight',
    notes: 'Vuelo transpacífico de regreso Tokio a San Francisco. Llega el mismo martes 8 de sep a las 10:35 a.m.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '36A', car: 'Economy', qrCodeData: 'UA0838-OZL5K3-DONAURO-36A' },
      { passengerName: 'Robinson Josué Castro', seat: '36B', car: 'Economy', qrCodeData: 'UA0838-OZL5K3-ROBINSON-36B' },
      { passengerName: 'Domingo Robinson Castro', seat: '36C', car: 'Economy', qrCodeData: 'UA0838-OZL5K3-DOMINGO-36C' },
      { passengerName: 'Nohemy María Israel', seat: '36D', car: 'Economy', qrCodeData: 'UA0838-OZL5K3-NOHEMY-36D' }
    ]
  },
  {
    id: 'flight-ret-3',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 2281',
    airline: 'United Airlines',
    departureAirport: 'SFO (San Francisco, EE.UU.)',
    arrivalAirport: 'SAT (San Antonio, EE.UU.)',
    departureCity: 'San Francisco',
    arrivalCity: 'San Antonio',
    departureTime: '2026-09-08T16:23',
    arrivalTime: '2026-09-08T21:59',
    terminal: 'Terminal 3',
    gate: '72',
    seat: '20A, 20B, 20C, 20D',
    status: 'programado',
    confirmationCode: 'OZL5K3',
    price: 220,
    transportType: 'flight',
    notes: 'Conexión SFO a San Antonio SAT. Llega a las 9:59 p.m.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '20A', car: 'Economy', qrCodeData: 'UA2281-OZL5K3-DONAURO-20A' },
      { passengerName: 'Robinson Josué Castro', seat: '20B', car: 'Economy', qrCodeData: 'UA2281-OZL5K3-ROBINSON-20B' },
      { passengerName: 'Domingo Robinson Castro', seat: '20C', car: 'Economy', qrCodeData: 'UA2281-OZL5K3-DOMINGO-20C' },
      { passengerName: 'Nohemy María Israel', seat: '20D', car: 'Economy', qrCodeData: 'UA2281-OZL5K3-NOHEMY-20D' }
    ]
  },
  {
    id: 'flight-hn-3',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 1322',
    airline: 'United Airlines',
    departureAirport: 'SAT (San Antonio, EE.UU.)',
    arrivalAirport: 'IAH (Houston, EE.UU.)',
    departureCity: 'San Antonio',
    arrivalCity: 'Houston',
    departureTime: '2026-09-10T05:30',
    arrivalTime: '2026-09-10T06:33',
    terminal: 'TB',
    gate: 'B12',
    seat: '12A, 12B, 12C, 12D',
    status: 'programado',
    confirmationCode: 'BQDIQK',
    price: 300,
    transportType: 'flight',
    notes: 'Reserva BQDIQK (Cod. 072622). Tramo 1 de regreso a Honduras desde San Antonio.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '12A', car: 'Economy', qrCodeData: 'UA1322-BQDIQK-DONAURO-12A' },
      { passengerName: 'Robinson Josué Castro', seat: '12B', car: 'Economy', qrCodeData: 'UA1322-BQDIQK-ROBINSON-12B' },
      { passengerName: 'Domingo Robinson Castro', seat: '12C', car: 'Economy', qrCodeData: 'UA1322-BQDIQK-DOMINGO-12C' },
      { passengerName: 'Nohemy María Israel', seat: '12D', car: 'Economy', qrCodeData: 'UA1322-BQDIQK-NOHEMY-12D' }
    ]
  },
  {
    id: 'flight-hn-4',
    tripId: 'trip-asia-2026',
    flightNumber: 'UA 518',
    airline: 'United Airlines',
    departureAirport: 'IAH (Houston, EE.UU.)',
    arrivalAirport: 'XPL (Comayagua, Honduras)',
    departureCity: 'Houston',
    arrivalCity: 'Comayagua',
    departureTime: '2026-09-10T09:30',
    arrivalTime: '2026-09-10T11:28',
    terminal: 'TE',
    gate: 'E5',
    seat: '12A, 12B, 12C, 12D',
    status: 'programado',
    confirmationCode: 'BQDIQK',
    price: 300,
    transportType: 'flight',
    notes: 'Llegada a Comayagua, Honduras a las 11:28 a.m. Final del Gran Tour.',
    qrTickets: [
      { passengerName: 'Donauro Emmanuel Castro', seat: '12A', car: 'Economy', qrCodeData: 'UA518-BQDIQK-DONAURO-12A' },
      { passengerName: 'Robinson Josué Castro', seat: '12B', car: 'Economy', qrCodeData: 'UA518-BQDIQK-ROBINSON-12B' },
      { passengerName: 'Domingo Robinson Castro', seat: '12C', car: 'Economy', qrCodeData: 'UA518-BQDIQK-DOMINGO-12C' },
      { passengerName: 'Nohemy María Israel', seat: '12D', car: 'Economy', qrCodeData: 'UA518-BQDIQK-NOHEMY-12D' }
    ]
  }
];

export const initialReservations: Reservation[] = [
  {
    id: 'res-jp-1',
    tripId: 'trip-asia-2026',
    type: 'hotel',
    title: 'voco Osaka Central',
    provider: 'TripMasters (Voucher #9008994 / 9008995)',
    address: '1-7-1 Kyomachibori, Nishi-ku, Osaka, Japón',
    checkIn: '2026-08-24T15:00',
    checkOut: '2026-08-28T11:00',
    confirmationCode: '284-6876330',
    status: 'confirmed',
    price: 520,
    phone: '+81 6 6445 1100',
    notes: 'Habitación: 2 Twin Premium. Impuesto de ciudad JPY 100-10,000 por noche directo en recepción.'
  },
  {
    id: 'res-jp-2',
    tripId: 'trip-asia-2026',
    type: 'hotel',
    title: 'The Royal Park Canvas Ginza Corridor Hotel',
    provider: 'TripMasters (Voucher #9008997 / 9008998)',
    address: 'Chuo City Ginza 6chome 2-11, Tokio, Japón',
    checkIn: '2026-08-28T15:00',
    checkOut: '2026-09-01T11:00',
    confirmationCode: '9092829717666',
    status: 'confirmed',
    price: 880,
    phone: '+81 3 6253 11',
    notes: 'Habitación: Standard Twin Room Non-Smoking (Prosecco, Beds in L-Shape). WiFi gratis.'
  },
  {
    id: 'res-kr-1',
    tripId: 'trip-asia-2026',
    type: 'hotel',
    title: 'Nine Tree Premier Hotel Insadong',
    provider: 'TripMasters (Voucher #9009000 / 9009001)',
    address: '49, Insadong-gil, Jongno-gu, Seúl, Corea del Sur',
    checkIn: '2026-09-01T15:00',
    checkOut: '2026-09-04T11:00',
    confirmationCode: '9092829717436',
    status: 'confirmed',
    price: 420,
    phone: '+82 2 6917 3100',
    notes: 'Habitación Standard Twin Room. Depósito reembolsable de KRW 100,000 a la llegada.'
  },
  {
    id: 'res-th-1',
    tripId: 'trip-asia-2026',
    type: 'hotel',
    title: 'INNSiDE Bangkok Sukhumvit',
    provider: 'TripMasters (Voucher #9009003 / 9009004)',
    address: '1472 Sukhumvit Road, Phrakanong Klongtoey, Bangkok, Tailandia',
    checkIn: '2026-09-04T15:00',
    checkOut: '2026-09-08T11:00',
    confirmationCode: '9101153796495',
    status: 'confirmed',
    price: 390,
    phone: '+66 2 340 5499',
    notes: 'The Innside Twin Room Non-Refundable. Estacionamiento propio y WiFi gratis.'
  }
];

export const initialActivities: Activity[] = [
  // DIA 2 - OSAKA (24-AGO)
  {
    id: 'act-jp-d2-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-24',
    title: 'Migración y Equipaje en KIX',
    description: 'Llegada 1:10 p.m. Retiro de equipaje y paso por aduanas en el Aeropuerto de Kansai (KIX). Cambiar efectivo mínimo en ATM.',
    category: 'relaxation',
    startTime: '14:50',
    endTime: '15:45',
    location: 'Aeropuerto de Kansai (KIX)',
    cost: 0,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d2-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-24',
    title: 'Traslado Aeropuerto KIX → Namba Centro',
    description: 'Tren Nankai Rapi:t (El más eficiente). Comprar ticket rápido en taquilla.',
    category: 'sightseeing',
    startTime: '15:45',
    endTime: '16:40',
    location: 'Estación Namba, Osaka',
    cost: 12,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d2-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-24',
    title: 'Conexión Metro y Check-in Hotel',
    description: 'Metro Línea Yotsubashi (Azul) hacia Nishi-Umeda. Bajar en Estación Higobashi (Salida 7).',
    category: 'relaxation',
    startTime: '16:45',
    endTime: '17:05',
    location: 'Estación Higobashi, Osaka',
    cost: 2,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d2-4',
    tripId: 'trip-asia-2026',
    date: '2026-08-24',
    title: 'Candlelight Ghibli Concert',
    description: 'Concierto a la luz de las velas con música de Studio Ghibli. Traslado en metro regular usando tarjeta Suica/Pasmo digital en el celular.',
    category: 'culture',
    startTime: '18:15',
    endTime: '19:20',
    location: 'Zona Cultural Namba / Minami',
    cost: 45,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d2-5',
    tripId: 'trip-asia-2026',
    date: '2026-08-24',
    title: 'Cena ligera nocturna en Nippombashi',
    description: 'Caminar por la zona gastronómica nocturna. Pago con tarjeta o efectivo.',
    category: 'food',
    startTime: '21:45',
    endTime: '22:45',
    location: 'Barrio Nippombashi, Osaka',
    cost: 20,
    completed: false,
    priority: 'medium'
  },

  // DIA 3 - OSAKA (25-AGO)
  {
    id: 'act-jp-d3-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-25',
    title: 'Visita Histórica al Castillo de Osaka',
    description: 'Metro desde Higobashi a Yodoyabashi, conectar con Keihan Main Line hasta Estación Temmabashi.',
    category: 'culture',
    startTime: '09:30',
    endTime: '13:00',
    location: 'Castillo de Osaka',
    cost: 10,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d3-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-25',
    title: 'Almuerzo en Mercado Kuromon Market',
    description: 'Traslado en metro a Estación Nippombashi. Esencial llevar efectivo para los puestos de comida callejera y mariscos frescos.',
    category: 'food',
    startTime: '13:15',
    endTime: '15:30',
    location: 'Kuromon Market, Osaka',
    cost: 30,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d3-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-25',
    title: 'Visita al Santuario Sumiyoshi Taisha',
    description: 'Desde Estación Nankai Namba, tomar Nankai Main Line directo a Estación Sumiyoshetaisha.',
    category: 'culture',
    startTime: '15:45',
    endTime: '17:30',
    location: 'Santuario Sumiyoshi Taisha',
    cost: 0,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d3-4',
    tripId: 'trip-asia-2026',
    date: '2026-08-25',
    title: 'Compras y Vida Nocturna: Shinsaibashi, Dotonbori y Shinsekai',
    description: 'Retorno al centro vía Nankai Line. Recorrido a pie entre distritos. Cena de brochetas Kushikatsu icónicas.',
    category: 'shopping',
    startTime: '17:45',
    endTime: '22:30',
    location: 'Dotonbori & Shinsekai, Osaka',
    cost: 40,
    completed: false,
    priority: 'high'
  },

  // DIA 4 - OSAKA (26-AGO)
  {
    id: 'act-jp-d4-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-26',
    title: 'Naturaleza y Senderismo en Parque Minoh (Cascada)',
    description: 'Metro a Umeda. Cambiar a Hankyu Takarazuka Line hasta Ishibashi, transbordo a Hankyu Minoh Line hasta estación final.',
    category: 'adventure',
    startTime: '09:00',
    endTime: '13:30',
    location: 'Minoh Park, Osaka',
    cost: 5,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d4-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-26',
    title: 'Paseo Tradicional por Hozenji Yokocho',
    description: 'Callejón empedrado histórico en pleno centro con linternas tradicionales y ambiente antiguo.',
    category: 'sightseeing',
    startTime: '15:00',
    endTime: '18:00',
    location: 'Hozenji Yokocho, Osaka',
    cost: 0,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d4-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-26',
    title: 'Cena Especial Yakiniku en Restaurante Moritaya',
    description: 'Ubicado en Tennoji. Se recomienda reservar con antelación para asegurar mesa de Wagyu de alta calidad.',
    category: 'food',
    startTime: '18:30',
    endTime: '20:00',
    location: 'Restaurante Moritaya, Tennoji',
    cost: 70,
    completed: false,
    priority: 'high'
  },

  // DIA 5 - OSAKA (27-AGO)
  {
    id: 'act-jp-d5-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-27',
    title: 'Inmersión Cultural en Museo de Historia de Osaka',
    description: 'Metro Línea Tanimachi hasta la Estación Tanimachi 4-chome.',
    category: 'culture',
    startTime: '09:00',
    endTime: '13:00',
    location: 'Osaka Museum of History',
    cost: 8,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d5-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-27',
    title: 'Almuerzo en Harukoma Sushi y Tenjinbashi-suji',
    description: 'Caminar por el corredor comercial techado más largo de todo Japón.',
    category: 'food',
    startTime: '13:30',
    endTime: '18:30',
    location: 'Tenjinbashi-suji, Osaka',
    cost: 25,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d5-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-27',
    title: 'Cena de Especialidad Tempura Makino',
    description: 'Ubicado dentro del mismo sector de la arcada Tenjinbashi. Pago con tarjeta.',
    category: 'food',
    startTime: '18:45',
    endTime: '20:00',
    location: 'Tempura Makino Tenjinbashi',
    cost: 22,
    completed: false,
    priority: 'medium'
  },

  // DIA 6 - SHINKANSEN Y TOKIO (28-AGO)
  {
    id: 'act-jp-d6-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-28',
    title: 'Traslado en Taxi a Estación Shin-Osaka',
    description: 'Taxi local (Vía App Uber o GO) para evitar transbordos subterráneos pesados con maletas grandes.',
    category: 'sightseeing',
    startTime: '09:00',
    endTime: '09:20',
    location: 'Shin-Osaka Station',
    cost: 20,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d6-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-28',
    title: 'Tren Bala Nozomi hacia Tokio',
    description: 'Shin-Osaka a Estación de Tokio. Asiento lado izquierdo para apreciar la vista al Monte Fuji en ruta.',
    category: 'sightseeing',
    startTime: '09:30',
    endTime: '12:00',
    location: 'Shinkansen Nozomi (Shin-Osaka -> Tokyo)',
    cost: 130,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d6-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-28',
    title: 'Metro y Check-in en Hotel The Royal Park Canvas Ginza',
    description: 'Transbordo interno a Línea Marunouchi (Roja), viajar 1 parada hasta Estación Ginza. Caminar al hotel.',
    category: 'relaxation',
    startTime: '12:45',
    endTime: '13:15',
    location: 'The Royal Park Canvas Ginza, Tokio',
    cost: 2,
    completed: false,
    priority: 'high'
  },

  // DIA 7 - TOKIO (29-AGO)
  {
    id: 'act-jp-d7-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-29',
    title: 'Compras Especializadas en Kappabashi Kitchen Town',
    description: 'Metro Línea Ginza (Naranja) directo hasta Estación Tawaramachi. Distrito de utensilios de cocina chefs y réplicas de comida.',
    category: 'shopping',
    startTime: '09:00',
    endTime: '14:00',
    location: 'Kappabashi Street, Tokio',
    cost: 50,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d7-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-29',
    title: 'Tokio Histórico: Nakamise Street y Templo Senso-ji',
    description: 'Caminando desde Kappabashi hacia el área central del distrito tradicional de Asakusa.',
    category: 'culture',
    startTime: '15:00',
    endTime: '20:00',
    location: 'Templo Senso-ji, Asakusa, Tokio',
    cost: 15,
    completed: false,
    priority: 'high'
  },

  // DIA 8 - TOKIO (30-AGO)
  {
    id: 'act-jp-d8-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-30',
    title: 'Desayuno de Marisco en Tsukiji Outer Market',
    description: 'Movido a la mañana (en la tarde cierra). Metro Línea Hibiya (Gris) hasta Estación Tsukiji.',
    category: 'food',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Tsukiji Outer Market, Tokio',
    cost: 30,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d8-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-30',
    title: 'Mercado Moderno y teamLab Planets',
    description: 'Caminar a Shiodome, tomar Tren Elevado Yurikamome hasta Estación Shijomae. Experiencia inmersiva digital.',
    category: 'culture',
    startTime: '10:30',
    endTime: '12:00',
    location: 'teamLab Planets, Toyosu, Tokio',
    cost: 35,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d8-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-30',
    title: 'Paseo por Jardín Tradicional Hama Rikyu',
    description: 'Retorno en tren Yurikamome hacia la zona costera. Jardines históricos junto a la bahía.',
    category: 'relaxation',
    startTime: '13:30',
    endTime: '15:30',
    location: 'Hama Rikyu Gardens, Tokio',
    cost: 4,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d8-4',
    tripId: 'trip-asia-2026',
    date: '2026-08-30',
    title: 'Cena de Sushi Premium en Sushi no Midori Ginza',
    description: 'Retorno a Ginza a pie o metro. Suele requerir registro digital en fila de espera.',
    category: 'food',
    startTime: '19:30',
    endTime: '21:00',
    location: 'Sushi no Midori, Ginza, Tokio',
    cost: 45,
    completed: false,
    priority: 'high'
  },

  // DIA 9 - TOKIO (31-AGO)
  {
    id: 'act-jp-d9-1',
    tripId: 'trip-asia-2026',
    date: '2026-08-31',
    title: 'Meiji Jingu y Yoyogi Park',
    description: 'Metro Línea Chiyoda (Verde) hasta Estación Meiji-jingumae (Harajuku). Contraste urbano y parque natural.',
    category: 'culture',
    startTime: '09:00',
    endTime: '12:00',
    location: 'Santuario Meiji & Yoyogi Park, Tokio',
    cost: 0,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d9-2',
    tripId: 'trip-asia-2026',
    date: '2026-08-31',
    title: 'Jardín Imperial Shinjuku Gyoen',
    description: 'Tren Línea Yamanote o metro directo hacia el distrito de Shinjuku.',
    category: 'relaxation',
    startTime: '13:30',
    endTime: '15:30',
    location: 'Shinjuku Gyoen National Garden',
    cost: 5,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-jp-d9-3',
    tripId: 'trip-asia-2026',
    date: '2026-08-31',
    title: 'Mirador Panorámico Tokio Metropolitan Govt. Bldg.',
    description: 'Caminar hacia Shinjuku Occidental. Acceso gratuito a las torres del observatorio.',
    category: 'sightseeing',
    startTime: '16:30',
    endTime: '17:30',
    location: 'Tokyo Metropolitan Government Bldg.',
    cost: 0,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-jp-d9-4',
    tripId: 'trip-asia-2026',
    date: '2026-08-31',
    title: 'Tabernas e Izakayas en Shokudo Wata y Omoide Yokocho',
    description: 'Recorrido a pie por los callejones históricos de Shinjuku. Esencial pagar consumos en efectivo.',
    category: 'food',
    startTime: '18:30',
    endTime: '22:00',
    location: 'Omoide Yokocho, Shinjuku, Tokio',
    cost: 35,
    completed: false,
    priority: 'high'
  },

  // DIA 10 - SEÚL (01-SEP)
  {
    id: 'act-kr-d10-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-01',
    title: 'Vuelo Internacional: Tokio Narita (NRT) a Seúl Incheon (ICN)',
    description: 'Vuelo Jeju Air / Hahn Air (H1 9806). Al aterrizar, comprar la tarjeta física T-Money en tiendas de conveniencia del aeropuerto.',
    category: 'sightseeing',
    startTime: '18:30',
    endTime: '21:30',
    location: 'Tokio Narita (NRT) a Seúl Incheon (ICN)',
    cost: 0,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-kr-d10-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-01',
    title: 'Traslado Nocturno al Hotel Nine Tree Insadong',
    description: 'Tren Express AREX (El más eficiente) directo hasta la Estación de Seúl (43 min), luego conectar en Taxi vía Kakao T hacia Insadong.',
    category: 'relaxation',
    startTime: '21:30',
    endTime: '23:30',
    location: 'Aeropuerto ICN a Hotel Nine Tree Insadong',
    cost: 15,
    completed: false,
    priority: 'high'
  },

  // DIA 11 - SEÚL (02-SEP)
  {
    id: 'act-kr-d11-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-02',
    title: 'Palacio Real y Plaza: Gyeongbokgung y Gwanghwamun',
    description: 'Ruta a pie (La más eficiente): Caminata directa de 10 min hacia el oeste por Yulgok-ro. Evita el metro para este tramo corto.',
    category: 'culture',
    startTime: '09:00',
    endTime: '12:30',
    location: 'Gyeongbokgung Palace y Gwanghwamun',
    cost: 10,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-kr-d11-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-02',
    title: 'Cultura K-Pop y Almuerzo en HiKR GROUND',
    description: 'Ubicado frente al canal. Espacio interactivo de turismo y cultura coreana moderna.',
    category: 'culture',
    startTime: '12:30',
    endTime: '15:00',
    location: 'HiKR GROUND',
    cost: 20,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-kr-d11-3',
    tripId: 'trip-asia-2026',
    date: '2026-09-02',
    title: 'Caminata Urbana por Canal Cheonggyecheon',
    description: 'Recorrido lineal a pie siguiendo el sendero inferior del canal peatonal (alejado del tráfico vehicular).',
    category: 'sightseeing',
    startTime: '15:00',
    endTime: '17:30',
    location: 'Canal Cheonggyecheon',
    cost: 0,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-kr-d11-4',
    tripId: 'trip-asia-2026',
    date: '2026-09-02',
    title: 'Cena Callejera Tradicional en Gwangjang Market',
    description: 'Subir a nivel de calle a la altura del puente Baeogae-dari. Mercado tradicional. Llevar efectivo obligado para los puestos de comida.',
    category: 'food',
    startTime: '17:30',
    endTime: '20:30',
    location: 'Gwangjang Market',
    cost: 25,
    completed: false,
    priority: 'high'
  },

  // DIA 12 - SEÚL (03-SEP)
  {
    id: 'act-kr-d12-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-03',
    title: 'Paseo Cultural por Insadong-gil Street',
    description: 'Recorrido a pie saliendo del hotel por la avenida peatonal tradicional de galerías y artesanías.',
    category: 'shopping',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Insadong-gil Street',
    cost: 0,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-kr-d12-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-03',
    title: 'Arquitectura Futurista en Dongdaemun Design Plaza (DDP)',
    description: 'Metro Línea 1 desde Jongno 3-ga hasta Dongdaemun, o Taxi Kakao T (10 min) si se prefiere evitar escaleras subterráneas.',
    category: 'culture',
    startTime: '10:30',
    endTime: '12:30',
    location: 'Dongdaemun Design Plaza (DDP)',
    cost: 5,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-kr-d12-3',
    tripId: 'trip-asia-2026',
    date: '2026-09-03',
    title: 'Distrito Gangnam e Ícono: Starfield Coex Mall y Library',
    description: 'Metro Línea 2 (Línea verde circular - La más eficiente) directo desde Dongdaemun History Park hasta la Estación Samseong.',
    category: 'shopping',
    startTime: '12:30',
    endTime: '15:30',
    location: 'Starfield Coex Mall y Starfield Library',
    cost: 20,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-kr-d12-4',
    tripId: 'trip-asia-2026',
    date: '2026-09-03',
    title: 'Rascacielos y Vistas en Lotte World Tower & Mall',
    description: 'Metro Línea 2 desde Samseong hasta Estación Jamsil. Acceso directo al centro comercial y mirador.',
    category: 'sightseeing',
    startTime: '15:30',
    endTime: '17:40',
    location: 'Lotte World Tower & Mall',
    cost: 25,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-kr-d12-5',
    tripId: 'trip-asia-2026',
    date: '2026-09-03',
    title: 'Compras y Street Food en Myeongdong Night Market',
    description: 'Metro Línea 2 de Jamsil a Euljiro 1-ga o Línea 4 directo a Estación Myeongdong. Zona cosmopolita.',
    category: 'food',
    startTime: '17:40',
    endTime: '19:30',
    location: 'Myeongdong Night Market',
    cost: 30,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-kr-d12-6',
    tripId: 'trip-asia-2026',
    date: '2026-09-03',
    title: 'Iluminación e Íconos Nocturnos: N Seoul Tower y Puente Banpo',
    description: 'Taxi hacia el teleférico de Namsan. Posteriormente, taxi al parque Banpo para ver el espectáculo de la fuente del puente.',
    category: 'sightseeing',
    startTime: '19:30',
    endTime: '21:40',
    location: 'N Seoul Tower y Puente Banpo',
    cost: 20,
    completed: false,
    priority: 'high'
  },

  // DIA 13 - BANGKOK (04-SEP)
  {
    id: 'act-th-d13-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-04',
    title: 'Traslado al Aeropuerto ICN',
    description: 'Tomar el tren AREX Express desde la Estación de Seúl. Llegar con 2.5 horas de antelación.',
    category: 'sightseeing',
    startTime: '08:00',
    endTime: '09:15',
    location: 'Hotel Insadong a Aeropuerto ICN',
    cost: 10,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-th-d13-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-04',
    title: 'Vuelo Internacional Seúl (ICN) a Bangkok Suvarnabhumi (BKK)',
    description: 'Vuelo directo Thai Vietjet VZ 0851. Preparar formato digital de migración si aplica.',
    category: 'sightseeing',
    startTime: '12:10',
    endTime: '16:00',
    location: 'Seúl (ICN) a Bangkok (BKK)',
    cost: 0,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-th-d13-3',
    tripId: 'trip-asia-2026',
    date: '2026-09-04',
    title: 'Enlace al Centro en Hora Pico (INNSiDE Bangkok Sukhumvit)',
    description: 'Tren Airport Rail Link (El más eficiente) hasta Makkasan, conectar con MRT a Sukhumvit y BTS a Phrom Phong para evitar el colapso del tráfico.',
    category: 'relaxation',
    startTime: '16:00',
    endTime: '18:00',
    location: 'Aeropuerto BKK a Quartier by Montraj Sukhumvit',
    cost: 5,
    completed: false,
    priority: 'high'
  },

  // DIA 14 - BANGKOK (05-SEP)
  {
    id: 'act-th-d14-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-05',
    title: 'Naturaleza Urbana en Lumphini Park',
    description: 'BTS Phrom Phong a Asok -> Transbordo interno a MRT Sukhumvit hasta Estación Si Lom (El más eficiente).',
    category: 'adventure',
    startTime: '09:00',
    endTime: '14:00',
    location: 'Lumphini Park',
    cost: 0,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-th-d14-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-05',
    title: 'Mirador Vértigo en las Alturas en King Power Mahanakhon',
    description: 'Desde Lumphini, tomar BTS Sala Daeng directo hasta Estación Chong Nonsi. Conexión peatonal elevada directa al edificio.',
    category: 'sightseeing',
    startTime: '15:00',
    endTime: '20:00',
    location: 'King Power Mahanakhon',
    cost: 30,
    completed: false,
    priority: 'high'
  },

  // DIA 15 - BANGKOK (06-SEP)
  {
    id: 'act-th-d15-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-06',
    title: 'Complejo Histórico Real: Wat Phra Kaew y Gran Palacio',
    description: 'Ruta Fluvial (La más eficiente): BTS a Saphan Taksin -> Muelle Sathorn Pier -> Chao Phraya Express Boat (Bandera Azul/Naranja) hasta Muelle Tha Chang. Código de vestimenta estricto (hombros y rodillas cubiertos).',
    category: 'culture',
    startTime: '09:00',
    endTime: '14:00',
    location: 'Wat Phra Kaew y Gran Palacio',
    cost: 15,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-th-d15-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-06',
    title: 'Templo del Buda Reclinado en Wat Pho',
    description: 'Caminando 10 minutos hacia el sur saliendo del complejo del Gran Palacio. Retorno al muelle para volver en barco.',
    category: 'culture',
    startTime: '15:00',
    endTime: '20:00',
    location: 'Wat Pho',
    cost: 8,
    completed: false,
    priority: 'high'
  },

  // DIA 16 - BANGKOK (07-SEP)
  {
    id: 'act-th-d16-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-07',
    title: 'Excursión de Tradición: Damnoen Saduak Floating Market',
    description: 'Movido del Día 17 aquí para proteger tu vuelo de regreso. Contratar transporte privado o tour desde Sukhumvit saliendo muy temprano (7:00 AM) para ganarle al tráfico.',
    category: 'food',
    startTime: '07:00',
    endTime: '13:30',
    location: 'Damnoen Saduak Floating Market',
    cost: 35,
    completed: false,
    priority: 'high'
  },
  {
    id: 'act-th-d16-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-07',
    title: 'Centro Comercial y Río en ICONSIAM',
    description: 'Tomar el barco lanzadera gratuito desde el muelle Central Sathorn Pier directo a la entrada del mega mall. Almorzar/Cenar en su mercado flotante techado interior (SookSiam).',
    category: 'shopping',
    startTime: '15:00',
    endTime: '20:00',
    location: 'ICONSIAM',
    cost: 25,
    completed: false,
    priority: 'high'
  },

  // DIA 17 - BANGKOK (08-SEP)
  {
    id: 'act-th-d17-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-08',
    title: 'Compras y Mañana Chill en Sukhumvit / Siam',
    description: 'Día libre de estrés. BTS directo a Estación Siam para compras de última hora en Siam Paragon o masajes tradicionales cerca de Phrom Phong.',
    category: 'shopping',
    startTime: '09:00',
    endTime: '13:00',
    location: 'Distritos Comerciales de Sukhumvit / Siam',
    cost: 20,
    completed: false,
    priority: 'medium'
  },
  {
    id: 'act-th-d17-2',
    tripId: 'trip-asia-2026',
    date: '2026-09-08',
    title: 'Traslado Seguro de Salida: Hotel -> BKK -> Vuelo UA-7968',
    description: 'Salida obligada del hotel a la 1:00 PM en taxi privado (vía Grab) o Airport Rail Link para garantizar estar documentado antes de las 2:00 PM. Vuelo sale 4:23 PM con destino a SFO.',
    category: 'sightseeing',
    startTime: '13:00',
    endTime: '16:23',
    location: 'Hotel a Aeropuerto BKK -> Vuelo UA-2281/UA-7968',
    cost: 15,
    completed: false,
    priority: 'high'
  },

  // DIA 18 - VUELO REGRESO SFO / SAN ANTONIO (09-SEP)
  {
    id: 'act-th-d18-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-09',
    title: 'Arribo Final: Conexión SFO a San Antonio (SAT)',
    description: 'Conexión directa en SFO vía United Airlines. Arribo a San Antonio (SAT) a las 9:59 PM. Fin del itinerario en Asia.',
    category: 'sightseeing',
    startTime: '00:00',
    endTime: '21:59',
    location: 'Conexión SFO a San Antonio (SAT)',
    cost: 0,
    completed: false,
    priority: 'high'
  },

  // DIA 18 - REGRESO HONDURAS (10-SEP)
  {
    id: 'act-ret-d18-1',
    tripId: 'trip-asia-2026',
    date: '2026-09-10',
    title: 'Vuelo Final de Regreso a Honduras',
    description: 'UA 1322 SAT (05:30) -> IAH (06:33) y UA 518 IAH (09:30) -> Comayagua XPL (11:28 a.m.). ¡Bienvenido a casa!',
    category: 'sightseeing',
    startTime: '05:30',
    endTime: '11:28',
    location: 'San Antonio -> Houston -> Comayagua (XPL)',
    cost: 0,
    completed: false,
    priority: 'high'
  }
];

export const initialWhatsAppLogs: WhatsAppLog[] = [
  {
    id: 'wa-jp-1',
    tripId: 'trip-asia-2026',
    timestamp: new Date().toISOString(),
    recipient: '+50499998888',
    messageType: 'booking_confirmation',
    content: '✈️ *Vuelo Confirmado*: United UA-35 (SFO -> KIX Osaka)\n📅 Salida: 23 Aug 11:10\nNotas: Descargar eSIM y app SmartEX antes de abordar.',
    status: 'delivered',
    isRealApi: false
  }
];

export const initialGroundTransfers: GroundTransfer[] = [
  {
    id: 'gt-jp-1',
    tripId: 'trip-asia-2026',
    title: 'De Aeropuerto Internacional de Kansai (KIX) a Hotel voco Osaka Central',
    fromLocation: 'Aeropuerto Internacional de Kansai (KIX Terminal 1)',
    toLocation: 'voco Osaka Central, 1 Chome-7-1 Kyomachibori, Nishi Ward, Osaka',
    estimatedDuration: '1h 25 min',
    transportModes: ['bus', 'train', 'subway', 'walk'],
    notes: 'Ruta recomendada con autobús Limousine de aeropuerto y transbordo a líneas Nankai y Yotsubashi.',
    steps: [
      {
        id: 'gt-jp-1-s1',
        stepNumber: 1,
        instruction: 'Toma el autobús "Kansai-Airport Limousine Bus" (Airport Shuttle Bus) en Terminal 1.',
        mode: 'bus',
        durationOrDistance: '24 min (2 paradas)',
        lineOrService: 'Servicio prestado por リムジンバス',
        notes: 'Parada de bajada: Izumisano Eki mae.'
      },
      {
        id: 'gt-jp-1-s2',
        stepNumber: 2,
        instruction: 'Camina desde la parada Izumisano Eki mae hacia la estación Izumisano.',
        mode: 'walk',
        durationOrDistance: '2 min (~110 m)',
        notes: 'Atención con el equipaje al cruzar.'
      },
      {
        id: 'gt-jp-1-s3',
        stepNumber: 3,
        instruction: 'Aborda el tren Nankai Line Local (dirección Nankai-Namba) en Izumisano Station.',
        mode: 'train',
        durationOrDistance: '52 min (27 paradas)',
        lineOrService: 'ID de parada NK30 - Nankai Electric Railway',
        notes: 'Desciende en Namba Station.'
      },
      {
        id: 'gt-jp-1-s4',
        stepNumber: 4,
        instruction: 'Transbordo a pie de Namba Station (Nankai) a Namba Station (Metro de Osaka).',
        mode: 'walk',
        durationOrDistance: '10 min (~500 m)',
        notes: 'Entra por la salida 32, toma las escaleras, pasa por el torniquete.'
      },
      {
        id: 'gt-jp-1-s5',
        stepNumber: 5,
        instruction: 'Aborda el Metro Yotsubashi Line Local (dirección Nishi-Umeda) hasta Higobashi Station.',
        mode: 'subway',
        durationOrDistance: '5 min (3 paradas)',
        lineOrService: 'Metro de Osaka - Andén 2 (ID Y15)',
        notes: 'Desciende en Higobashi Station.'
      },
      {
        id: 'gt-jp-1-s6',
        stepNumber: 6,
        instruction: 'Camina desde Higobashi Station salida South Ticket Gate (Salida 7) hacia voco Osaka Central.',
        mode: 'walk',
        durationOrDistance: '8 min (~450 m)',
        lineOrService: 'Dirígete por 大阪市道南北線 y 京町通',
        notes: '¡El destino está a la izquierda!'
      }
    ]
  },
  {
    id: 'gt-jp-2',
    tripId: 'trip-asia-2026',
    title: 'De voco Osaka Central a Estación Shin-Osaka',
    fromLocation: 'voco Osaka Central, Kyomachibori, Osaka',
    toLocation: 'Shin-Ōsaka Station, Osaka, Japón',
    estimatedDuration: '25 min',
    transportModes: ['walk', 'subway'],
    notes: 'Salida de madrugada (05:05 AM) para abordar el Shinkansen hacia Tokio.',
    steps: [
      {
        id: 'gt-jp-2-s1',
        stepNumber: 1,
        instruction: 'Sal de voco Osaka Central a las 05:05 AM. Dirígete hacia 大阪市道南北線 y gira a la izquierda en 東上橋筋.',
        mode: 'walk',
        durationOrDistance: '10 min (~750 m)',
        notes: 'Entra por la salida 13 de Yodoyabashi Station, pasa por el torniquete.'
      },
      {
        id: 'gt-jp-2-s2',
        stepNumber: 2,
        instruction: 'Llegada a Yodoyabashi Station (05:15 AM). Aborda el Metro Midosuji Line Local (dirección Minoh-kayano).',
        mode: 'subway',
        durationOrDistance: '9 min (4 paradas)',
        lineOrService: 'Metro de Osaka - Andén 2',
        notes: 'Desciende en Shin-Osaka Station a las 05:24 AM.'
      }
    ]
  },
  {
    id: 'gt-jp-3',
    tripId: 'trip-asia-2026',
    title: 'TREN SHINKANSEN: De Shin-Osaka a Estación de Tokio (Con Boletos QR)',
    fromLocation: 'Shin-Ōsaka Station, Osaka',
    toLocation: 'Estación de Tokio, Marunouchi, Chiyoda City, Tokyo',
    estimatedDuration: '2h 55 min',
    transportModes: ['train', 'shinkansen'],
    notes: 'Trayecto de alta velocidad en Shinkansen Nozomi. Incluye boletos QR con asientos asignados en Coche 5 (10-B, 10-A, 9-A).',
    qrTickets: [
      {
        passengerName: 'Pasajero 1',
        seat: '10-B',
        car: 'Car.5',
        qrCodeData: 'E404 D1DA E104 D014 8E4D 7090 B259 6AEA'
      },
      {
        passengerName: 'Pasajero 2',
        seat: '10-A',
        car: 'Car.5',
        qrCodeData: 'EE0E DBD0 D10E FD01 3E98 778F 5FF8 D5A8'
      },
      {
        passengerName: 'Pasajero 3',
        seat: '9-A',
        car: 'Car.5',
        qrCodeData: 'E919 CCC7 C019 0B17 4ECF 73EE B013 4887'
      }
    ],
    steps: [
      {
        id: 'gt-jp-3-s1',
        stepNumber: 1,
        instruction: 'Aborda el tren Tokaido-Sanyo Line Local Kyoto (05:04 AM) en Shin-Osaka Station (Andén 6, JR-A46).',
        mode: 'train',
        durationOrDistance: '42 min (15 paradas)',
        lineOrService: 'West Japan Railway Company',
        notes: 'Arribo a Estación de Kioto a las 05:46 AM.'
      },
      {
        id: 'gt-jp-3-s2',
        stepNumber: 2,
        instruction: 'Transbordo a pie en Estación de Kioto. Toma las escaleras al andén de Shinkansen.',
        mode: 'walk',
        durationOrDistance: '3 min',
        notes: 'Verifica tu vagón (Car. 5).'
      },
      {
        id: 'gt-jp-3-s3',
        stepNumber: 3,
        instruction: 'Aborda el Tokaido Shinkansen Nozomi 548 (Nozomi Tokyo) a las 06:03 AM en Estación de Kioto (Andén 11).',
        mode: 'shinkansen',
        durationOrDistance: '2h 09 min (4 paradas)',
        lineOrService: 'Central Japan Railway - Train Nozomi 548',
        notes: 'Escaneo de código QR en torniquete. Arribo puntual a Estación de Tokio a las 08:12 AM.'
      }
    ]
  },
  {
    id: 'gt-jp-4',
    tripId: 'trip-asia-2026',
    title: 'De Estación de Tokio a Hotel The Royal Park Canvas - Ginza Corridor',
    fromLocation: 'Estación de Tokio, 1 Chome Marunouchi, Chiyoda City, Tokyo',
    toLocation: 'The Royal Park Canvas - Ginza Corridor, 6 Chome-2-11 Ginza, Chuo City, Tokyo',
    estimatedDuration: '14 min (Caminando)',
    transportModes: ['walk'],
    notes: 'Paseo peatonal por la zona comercial de Ginza y la avenida Ginza Corridor.',
    steps: [
      {
        id: 'gt-jp-4-s1',
        stepNumber: 1,
        instruction: 'Dirígete hacia el noroeste desde Estación de Tokio y gira a la izquierda.',
        mode: 'walk',
        durationOrDistance: '4 min'
      },
      {
        id: 'gt-jp-4-s2',
        stepNumber: 2,
        instruction: 'Gira a la derecha hacia 補助97号線 y continúa a la izquierda.',
        mode: 'walk',
        durationOrDistance: '3 min'
      },
      {
        id: 'gt-jp-4-s3',
        stepNumber: 3,
        instruction: 'Pasa por ドトールコーヒーショップ (Doutor Coffee) 有楽町店 a la derecha.',
        mode: 'walk',
        durationOrDistance: '4 min'
      },
      {
        id: 'gt-jp-4-s4',
        stepNumber: 4,
        instruction: 'Gira a la derecha hacia 銀座コリドー通り (Ginza Corridor) y 交詢社通り. El hotel estará a la izquierda.',
        mode: 'walk',
        durationOrDistance: '3 min',
        notes: 'Llegada a The Royal Park Canvas - Ginza Corridor.'
      }
    ]
  },
  {
    id: 'gt-jp-5',
    tripId: 'trip-asia-2026',
    title: 'De Hotel Ginza Corridor a Aeropuerto Internacional de Narita (NRT)',
    fromLocation: 'The Royal Park Canvas - Ginza Corridor, Ginza, Tokyo',
    toLocation: 'Aeropuerto Internacional de Narita (Terminal 3), Chiba',
    estimatedDuration: '1h 25 min',
    transportModes: ['walk', 'train', 'bus'],
    notes: 'Conexión eficiente con la línea Yamanote a Tokyo Station y el autobús directo Airport Bus TYO-NRT.',
    steps: [
      {
        id: 'gt-jp-5-s1',
        stepNumber: 1,
        instruction: 'Sal de Ginza Corridor a las 04:35 AM. Camina hacia Yūrakuchō Station (Entra por Hibiya Exit).',
        mode: 'walk',
        durationOrDistance: '9 min (~550 m)',
        notes: 'Pasa por el torniquete y toma las escaleras.'
      },
      {
        id: 'gt-jp-5-s2',
        stepNumber: 2,
        instruction: 'Aborda la Yamanote Line Local (For Tokyo / Ueno) a las 04:44 AM en Yūrakuchō Station (Andén 2, JY30).',
        mode: 'subway',
        durationOrDistance: '2 min (sin paradas)',
        lineOrService: 'East Japan Railway',
        notes: 'Desciende en Estación de Tokio a las 04:46 AM.'
      },
      {
        id: 'gt-jp-5-s3',
        stepNumber: 3,
        instruction: 'Camina hacia la parada de autobuses "Tokyo Eki JR Kosoku Bus Noriba" (Yaesu South Exit).',
        mode: 'walk',
        durationOrDistance: '4 min (~210 m)',
        notes: 'Sigue las señales de Yaesu South Exit.'
      },
      {
        id: 'gt-jp-5-s4',
        stepNumber: 4,
        instruction: 'Aborda el autobús "Airport Bus Tyo-NRT" (05:00 AM) hacia Narita Airport (T1, T2, T3).',
        mode: 'bus',
        durationOrDistance: '1h 02 min (directo)',
        lineOrService: 'AIRPORT BUS TYO-NRT',
        notes: 'Arribo a Narita Airport Terminal 3 a las 06:02 AM.'
      }
    ]
  },
  {
    id: 'gt-kr-1',
    tripId: 'trip-asia-2026',
    title: 'De Aeropuerto Internacional de Incheon (ICN T2) a Hotel Nine Tree by Parnas Seoul Insadong',
    fromLocation: 'Aeropuerto Internacional de Incheon (ICN Terminal 2)',
    toLocation: 'Nine Tree by Parnas Seoul Insadong, 49 Insadong-gil, Jongno District, Seoul',
    estimatedDuration: '2h 05 min',
    transportModes: ['walk', 'bus'],
    notes: 'Servicio nocturno/madrugada de autobús expreso desde la terminal T2 de Incheon hacia el centro de Seúl.',
    steps: [
      {
        id: 'gt-kr-1-s1',
        stepNumber: 1,
        instruction: 'Al desembarcar en ICN T2 (03:02 AM), camina hacia la parada de autobuses en Incheon International Airport T2-B1FL.',
        mode: 'walk',
        durationOrDistance: '23 min (~1.3 km)'
      },
      {
        id: 'gt-kr-1-s2',
        stepNumber: 2,
        instruction: 'Aborda el autobús nocturno N6701 Dongdaemun Design Plaza (03:25 AM).',
        mode: 'bus',
        durationOrDistance: '1h 16 min (3 paradas)',
        lineOrService: 'Servicio prestado por 서울특별시버스운송사업조합',
        notes: 'Desciende en la parada Sungnyemun Gate a las 04:41 AM.'
      },
      {
        id: 'gt-kr-1-s3',
        stepNumber: 3,
        instruction: 'Camina a la parada conectora de Sungnyemun Gate (04:41 AM -> 04:59 AM).',
        mode: 'walk',
        durationOrDistance: '1 min (~55 m)'
      },
      {
        id: 'gt-kr-1-s4',
        stepNumber: 4,
        instruction: 'Aborda el autobús 704 (Eunpyeong New Town Garage) a las 04:59 AM.',
        mode: 'bus',
        durationOrDistance: '6 min (5 paradas)',
        lineOrService: 'Línea 704 (Parada ID 02122)',
        notes: 'Pasa por Namdaemun Market, Lotte Young Plaza, Woori Bank y Jogyesa Temple. Desciende en Duksung Girls\' Middle & High School (05:05 AM).'
      },
      {
        id: 'gt-kr-1-s5',
        stepNumber: 5,
        instruction: 'Camina desde Duksung Girls\' School hacia Nine Tree by Parnas Seoul Insadong.',
        mode: 'walk',
        durationOrDistance: '3 min (~170 m)',
        notes: '¡Arribo al hotel a las 05:08 AM!'
      }
    ]
  },
  {
    id: 'gt-kr-2',
    tripId: 'trip-asia-2026',
    title: 'De Hotel Nine Tree Insadong a Aeropuerto Internacional de Incheon (ICN T1)',
    fromLocation: 'Nine Tree by Parnas Seoul Insadong, Seoul',
    toLocation: 'Aeropuerto Internacional de Incheon (Terminal 1)',
    estimatedDuration: '1h 58 min',
    transportModes: ['walk', 'bus'],
    notes: 'Transferencia con autobús N51 y transbordo al expreso N6002 directo al aeropuerto.',
    steps: [
      {
        id: 'gt-kr-2-s1',
        stepNumber: 1,
        instruction: 'Sal del hotel (03:26 AM) y camina hacia la parada Duksung Girls\' Middle & High School.',
        mode: 'walk',
        durationOrDistance: '3 min (~170 m)'
      },
      {
        id: 'gt-kr-2-s2',
        stepNumber: 2,
        instruction: 'Aborda el autobús N51 시흥동차고지 (03:29 AM).',
        mode: 'bus',
        durationOrDistance: '23 min (14 paradas)',
        lineOrService: 'Línea N51 (ID 01130)',
        notes: 'Pasa por Sejong Center, Gwanghwamun, City Hall, Yeomcheongyo, Sinchon. Desciende en Hongik Univ. Station (03:52 AM).'
      },
      {
        id: 'gt-kr-2-s3',
        stepNumber: 3,
        instruction: 'Transbordo en Hongik Univ. Station al autobús N6002 (04:00 AM) hacia Incheon Airport.',
        mode: 'bus',
        durationOrDistance: '1h 01 min (sin paradas)',
        lineOrService: 'Línea N6002 (ID 14016)',
        notes: 'Desciende en Incheon Airport Terminal 1 - 3rd Floor (05:01 AM).'
      },
      {
        id: 'gt-kr-2-s4',
        stepNumber: 4,
        instruction: 'Camina a las salas de salida y mostradores de la aerolínea.',
        mode: 'walk',
        durationOrDistance: '23 min (~1.4 km)',
        notes: 'Arribo final a la puerta de embarque a las 05:24 AM.'
      }
    ]
  },
  {
    id: 'gt-th-1',
    tripId: 'trip-asia-2026',
    title: 'De Aeropuerto Bangkok Suvarnabhumi (BKK) a Hotel Sukhumvit 1472, Bangkok',
    fromLocation: 'Aeropuerto Internacional Suvarnabhumi (BKK)',
    toLocation: '1472 Sukhumvit Rd, Khwaeng Phra Khanong, Khet Khlong Toei, Krung Thep Maha Nakhon 10110, Tailandia',
    estimatedDuration: '35 min (Taxi / Aplicación Directa)',
    transportModes: ['taxi'],
    notes: 'Trayecto cómodo por autopista con peajes mediante servicio de Taxi o aplicaciones (Grab / Bolt / InDrive).',
    steps: [
      {
        id: 'gt-th-1-s1',
        stepNumber: 1,
        instruction: 'Aborda el taxi o vehículo en el piso de transportes del Aeropuerto Suvarnabhumi. Dirígete al oeste por ถ. Suvarnabhumi 2.',
        mode: 'taxi',
        durationOrDistance: '1.3 km'
      },
      {
        id: 'gt-th-1-s2',
        stepNumber: 2,
        instruction: 'Incorporación a Carretera 7 (Motorway) dirección Bangkok.',
        mode: 'taxi',
        durationOrDistance: '8.1 km'
      },
      {
        id: 'gt-th-1-s3',
        stepNumber: 3,
        instruction: 'Toma la salida hacia Carretera 3344 / Sri Nagarindra Rd.',
        mode: 'taxi',
        durationOrDistance: '260 m'
      },
      {
        id: 'gt-th-1-s4',
        stepNumber: 4,
        instruction: 'Gira a la derecha en ถ. พัฒนาการ (Phatthanakan Rd) y pasa por 7-Eleven.',
        mode: 'taxi',
        durationOrDistance: '2.0 km'
      },
      {
        id: 'gt-th-1-s5',
        stepNumber: 5,
        instruction: 'Incorporación a ทางพิเศษฉลองรัช (Chalong Rat Expressway / Carretera con peajes).',
        mode: 'taxi',
        durationOrDistance: '2.6 km'
      },
      {
        id: 'gt-th-1-s6',
        stepNumber: 6,
        instruction: 'Utiliza el carril izquierdo para tomar la salida 1 hacia Sukhumvit 50 / Phra Khanong.',
        mode: 'taxi',
        durationOrDistance: '650 m',
        notes: 'Arribo a 1472 Sukhumvit Rd (A la izquierda).'
      }
    ]
  },
  {
    id: 'gt-th-2',
    tripId: 'trip-asia-2026',
    title: 'De Hotel Sukhumvit 1472 a Aeropuerto Bangkok Suvarnabhumi (BKK) (Opción Bus + ARL)',
    fromLocation: '1472 Sukhumvit Rd, Khwaeng Phra Khanong, Bangkok',
    toLocation: 'Aeropuerto Internacional Suvarnabhumi (BKK), Bangkok, Tailandia',
    estimatedDuration: '1h 35 min',
    transportModes: ['walk', 'bus', 'train'],
    notes: 'Opción económica de transporte público combinando autobús de ciudad y el tren expreso Airport Rail Link (ARL).',
    steps: [
      {
        id: 'gt-th-2-s1',
        stepNumber: 1,
        instruction: 'Sal de 1472 Sukhumvit Rd a las 04:19 AM. Camina hacia la parada de autobús Before On Nut Junction.',
        mode: 'walk',
        durationOrDistance: '2 min (~150 m)'
      },
      {
        id: 'gt-th-2-s2',
        stepNumber: 2,
        instruction: 'Aborda el autobús 23 NGV (3-5) Thewet (04:51 AM).',
        mode: 'bus',
        durationOrDistance: '25 min (19 paradas)',
        lineOrService: 'Bangkok Mass Transit Authority (BMTA)',
        notes: 'Desciende en Srinakharinwirot University (Phetchaburi) a las 05:16 AM.'
      },
      {
        id: 'gt-th-2-s3',
        stepNumber: 3,
        instruction: 'Camina hacia la estación de tren Makkasan Station (ARL).',
        mode: 'walk',
        durationOrDistance: '8 min (~300 m)',
        notes: 'Sigue las señales a Ticket Office y toma el ascensor.'
      },
      {
        id: 'gt-th-2-s4',
        stepNumber: 4,
        instruction: 'Aborda el tren ARL (Phaya Thai - Suvarnabhumi) a las 05:33 AM en Makkasan Station (Andén 1).',
        mode: 'train',
        durationOrDistance: '22 min (5 paradas)',
        lineOrService: 'Servicio prestado por SRTET',
        notes: 'Arribo puntual a Suvarnabhumi Airport Station a las 05:55 AM.'
      }
    ]
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-sat-pkg',
    tripId: 'trip-asia-2026',
    title: 'Paquete Principal de Viaje desde San Antonio (SAT) - Vuelos, Hoteles y Traslados',
    amountUSD: 10706.76,
    originalAmount: 10706.76,
    originalCurrency: 'USD',
    category: 'flight',
    date: '2026-03-01',
    paidBy: 'Donauro Emmanuel Castro',
    splitWith: ['Robinson Josué Castro', 'Viajero 3', 'Viajero 4'],
    paymentMethod: 'credit_card',
    notes: 'Paquete todo incluido saliendo y regresando a San Antonio. División exacta entre 4 personas: $2,676.69 USD por persona.',
    location: 'San Antonio (SAT) / Asia'
  },
  {
    id: 'exp-hn-sat-flight',
    tripId: 'trip-asia-2026',
    title: 'Vuelo de Conexión Honduras (SAP) -> San Antonio (SAT)',
    amountUSD: 1105.62,
    originalAmount: 1105.62,
    originalCurrency: 'USD',
    category: 'flight',
    date: '2026-03-11',
    paidBy: 'Donauro Emmanuel Castro',
    splitWith: ['Nohemí'],
    paymentMethod: 'credit_card',
    notes: 'Vuelo de conexión San Pedro Sula a San Antonio ($1,105.62 USD total). Dividido 50/50: $552.81 USD Donauro y $552.81 USD Nohemí.',
    location: 'Honduras / San Antonio (SAT)'
  },
  {
    id: 'exp-asia-3',
    tripId: 'trip-asia-2026',
    title: 'Tren Shinkansen Nozomi (Shin-Osaka -> Tokio - 4 Pasajeros)',
    amountUSD: 384.50,
    originalAmount: 59600,
    originalCurrency: 'JPY',
    category: 'transport',
    date: '2026-03-18',
    paidBy: 'Robinson Josué Castro',
    splitWith: ['Donauro Emmanuel Castro', 'Viajero 3', 'Viajero 4'],
    paymentMethod: 'credit_card',
    notes: 'Boletos QR descargados con asientos asignados para el grupo de 4 ($384.50 USD / 59,600 JPY total = $96.13 USD por persona).',
    location: 'Estación Shin-Osaka'
  },
  {
    id: 'exp-asia-5',
    tripId: 'trip-asia-2026',
    title: 'Entradas Shibuya Sky & teamLab Planets Tokio (4 Personas)',
    amountUSD: 103.22,
    originalAmount: 16000,
    originalCurrency: 'JPY',
    category: 'activities',
    date: '2026-03-19',
    paidBy: 'Robinson Josué Castro',
    splitWith: ['Donauro Emmanuel Castro', 'Viajero 3', 'Viajero 4'],
    paymentMethod: 'credit_card',
    notes: 'Pases de acceso reservados para el grupo de 4.',
    location: 'Shibuya & Toyosu, Tokio'
  },
  {
    id: 'exp-asia-6',
    tripId: 'trip-asia-2026',
    title: 'Recarga Tarjetas IC Suica / Pasmo (Metro y Conveniencia)',
    amountUSD: 129.03,
    originalAmount: 20000,
    originalCurrency: 'JPY',
    category: 'transport',
    date: '2026-03-16',
    paidBy: 'Donauro Emmanuel Castro',
    splitWith: ['Robinson Josué Castro', 'Viajero 3', 'Viajero 4'],
    paymentMethod: 'cash',
    notes: 'Cargado en efectivo Yenes para desplazamientos locales.',
    location: 'Tokio, Japón'
  },
  {
    id: 'exp-asia-8',
    tripId: 'trip-asia-2026',
    title: 'Cena BBQ Coreana Tradicional & Comida de Calle Myeongdong',
    amountUSD: 118.51,
    originalAmount: 160000,
    originalCurrency: 'KRW',
    category: 'food',
    date: '2026-03-23',
    paidBy: 'Donauro Emmanuel Castro',
    splitWith: ['Robinson Josué Castro', 'Viajero 3', 'Viajero 4'],
    paymentMethod: 'cash',
    notes: 'Cena para el grupo de 4 en Seúl.',
    location: 'Myeongdong, Seúl'
  }
];

