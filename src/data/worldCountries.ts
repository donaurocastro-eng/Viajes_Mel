import { VisitedCountry, TravelPhoto } from '../types';

export const WORLD_COUNTRIES_CATALOG: VisitedCountry[] = [
  // =========================================================================
  // AMÉRICA DEL NORTE Y CENTRAL (Rosa en el mapa)
  // =========================================================================
  {
    code: 'HN',
    name: 'Honduras',
    continent: 'North America',
    flagEmoji: '🇭🇳',
    capital: 'Tegucigalpa',
    coordinates: [14.0818, -87.2068],
    svgCoords: { x: 25.8, y: 46.5 },
    visited: true,
    visitedDate: '2026-08-18',
    tripName: 'Gran Tour Asia 2026 (Origen)',
    notes: 'Punto de partida desde Tegucigalpa y Palmerola (XPL).',
    aliases: ['Honduras', 'Tegucigalpa', 'Palmerola', 'Roatán', 'San Pedro Sula']
  },
  {
    code: 'PA',
    name: 'Panamá',
    continent: 'North America',
    flagEmoji: '🇵🇦',
    capital: 'Ciudad de Panamá',
    coordinates: [8.5379, -80.7821],
    svgCoords: { x: 27.6, y: 49.5 },
    visited: true,
    visitedDate: '2026-08-18',
    tripName: 'América Central y Canal de Panamá',
    notes: 'Visita a la Ciudad de Panamá y el Canal.',
    aliases: ['Panamá', 'Panama', 'PTY', 'Ciudad de Panama', 'Canal de Panama', 'Bocas del Toro']
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    continent: 'North America',
    flagEmoji: '🇺🇸',
    capital: 'Washington D.C.',
    coordinates: [37.0902, -95.7129],
    svgCoords: { x: 23.2, y: 31.0 },
    visited: true,
    visitedDate: '2026-08-18',
    tripName: 'Gran Tour Asia 2026',
    notes: 'Escala y conexión en Houston (IAH) y San Francisco (SFO).',
    aliases: ['USA', 'United States', 'EEUU', 'San Francisco', 'Houston', 'Miami', 'Nueva York', 'New York']
  },
  {
    code: 'MX',
    name: 'México',
    continent: 'North America',
    flagEmoji: '🇲🇽',
    capital: 'Ciudad de México',
    coordinates: [23.6345, -102.5528],
    svgCoords: { x: 21.5, y: 40.5 },
    visited: false,
    aliases: ['Mexico', 'CDMX', 'Cancun', 'Cancún', 'Guadalajara']
  },
  {
    code: 'CA',
    name: 'Canadá',
    continent: 'North America',
    flagEmoji: '🇨🇦',
    capital: 'Ottawa',
    coordinates: [56.1304, -106.3468],
    svgCoords: { x: 23.5, y: 19.0 },
    visited: false,
    aliases: ['Canada', 'Toronto', 'Vancouver', 'Montreal']
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    continent: 'North America',
    flagEmoji: '🇨🇷',
    capital: 'San José',
    coordinates: [9.7489, -83.7534],
    svgCoords: { x: 26.6, y: 48.5 },
    visited: false,
    aliases: ['Costa Rica', 'San Jose', 'San José']
  },
  {
    code: 'GT',
    name: 'Guatemala',
    continent: 'North America',
    flagEmoji: '🇬🇹',
    capital: 'Ciudad de Guatemala',
    coordinates: [15.7835, -90.2308],
    svgCoords: { x: 24.2, y: 45.0 },
    visited: false,
    aliases: ['Guatemala', 'Antigua Guatemala', 'Tikal']
  },
  {
    code: 'SV',
    name: 'El Salvador',
    continent: 'North America',
    flagEmoji: '🇸🇻',
    capital: 'San Salvador',
    coordinates: [13.7942, -88.8965],
    svgCoords: { x: 24.9, y: 46.5 },
    visited: false,
    aliases: ['El Salvador', 'San Salvador']
  },
  {
    code: 'NI',
    name: 'Nicaragua',
    continent: 'North America',
    flagEmoji: '🇳🇮',
    capital: 'Managua',
    coordinates: [12.8654, -85.2072],
    svgCoords: { x: 25.8, y: 47.3 },
    visited: false,
    aliases: ['Nicaragua', 'Managua', 'Granada']
  },
  {
    code: 'BZ',
    name: 'Belice',
    continent: 'North America',
    flagEmoji: '🇧🇿',
    capital: 'Belmopán',
    coordinates: [17.1899, -88.4976],
    svgCoords: { x: 24.8, y: 43.8 },
    visited: false,
    aliases: ['Belice', 'Belize']
  },
  {
    code: 'DO',
    name: 'República Dominicana',
    continent: 'North America',
    flagEmoji: '🇩🇴',
    capital: 'Santo Domingo',
    coordinates: [18.7357, -70.1627],
    svgCoords: { x: 29.5, y: 41.5 },
    visited: false,
    aliases: ['Republica Dominicana', 'Santo Domingo', 'Punta Cana']
  },
  {
    code: 'CU',
    name: 'Cuba',
    continent: 'North America',
    flagEmoji: '🇨🇺',
    capital: 'La Habana',
    coordinates: [21.5218, -77.7812],
    svgCoords: { x: 26.5, y: 38.8 },
    visited: false,
    aliases: ['Cuba', 'La Habana', 'Habana', 'Varadero']
  },
  {
    code: 'PR',
    name: 'Puerto Rico',
    continent: 'North America',
    flagEmoji: '🇵🇷',
    capital: 'San Juan',
    coordinates: [18.2208, -66.5901],
    svgCoords: { x: 31.0, y: 42.0 },
    visited: false,
    aliases: ['Puerto Rico', 'San Juan']
  },

  // =========================================================================
  // AMÉRICA DEL SUR (Verde en el mapa)
  // =========================================================================
  {
    code: 'CO',
    name: 'Colombia',
    continent: 'South America',
    flagEmoji: '🇨🇴',
    capital: 'Bogotá',
    coordinates: [4.5709, -74.2973],
    svgCoords: { x: 29.8, y: 53.0 },
    visited: true,
    visitedDate: '2025-11-20',
    tripName: 'Aventura Colombia: Medellín, Cartagena y Guatapé',
    notes: 'Recorrido por la vibrante Medellín (Comuna 13 y Metrocable), la impresionante Piedra del Peñol en Guatapé y la histórica Ciudad Amurallada de Cartagena.',
    visitedCities: ['Medellín', 'Cartagena', 'Guatapé', 'Bogotá'],
    aliases: ['Colombia', 'Medellin', 'Medellín', 'Cartagena', 'Cartagenta', 'Guatape', 'Guatapé', 'Bogota', 'Bogotá', 'Piedra del Peñol', 'El Poblado', 'Comuna 13']
  },
  {
    code: 'BR',
    name: 'Brasil',
    continent: 'South America',
    flagEmoji: '🇧🇷',
    capital: 'Brasilia',
    coordinates: [-14.235, -51.9253],
    svgCoords: { x: 35.5, y: 64.0 },
    visited: false,
    aliases: ['Brasil', 'Brazil', 'Rio de Janeiro', 'Sao Paulo']
  },
  {
    code: 'AR',
    name: 'Argentina',
    continent: 'South America',
    flagEmoji: '🇦🇷',
    capital: 'Buenos Aires',
    coordinates: [-38.4161, -63.6167],
    svgCoords: { x: 32.8, y: 79.0 },
    visited: true,
    visitedDate: '2026-08-15',
    tripName: 'Cono Sur: Argentina y Chile',
    notes: 'Buenos Aires, Obelisco, San Telmo, Mendoza, Bariloche y Patagonia.',
    aliases: ['Argentina', 'Buenos Aires', 'Bariloche', 'Mendoza', 'Patagonia', 'Cordoba', 'Córdoba', 'Rosario', 'Ushuaia', 'Iguazu', 'Iguazú']
  },
  {
    code: 'CL',
    name: 'Chile',
    continent: 'South America',
    flagEmoji: '🇨🇱',
    capital: 'Santiago',
    coordinates: [-35.6751, -71.543],
    svgCoords: { x: 30.5, y: 78.0 },
    visited: true,
    visitedDate: '2026-08-16',
    tripName: 'Cono Sur: Argentina y Chile',
    notes: 'Santiago de Chile, Valparaíso, Viña del Mar y Cordillera de los Andes.',
    aliases: ['Chile', 'Santiago', 'Santiago de Chile', 'Valparaiso', 'Valparaíso', 'Viña del Mar', 'Vina del Mar', 'Atacama', 'Punta Arenas']
  },
  {
    code: 'PE',
    name: 'Perú',
    continent: 'South America',
    flagEmoji: '🇵🇪',
    capital: 'Lima',
    coordinates: [-9.19, -75.0152],
    svgCoords: { x: 28.5, y: 60.5 },
    visited: false,
    aliases: ['Peru', 'Perú', 'Lima', 'Cusco', 'Machu Picchu']
  },
  {
    code: 'EC',
    name: 'Ecuador',
    continent: 'South America',
    flagEmoji: '🇪🇨',
    capital: 'Quito',
    coordinates: [-1.8312, -78.1834],
    svgCoords: { x: 27.5, y: 56.5 },
    visited: false,
    aliases: ['Ecuador', 'Quito', 'Guayaquil', 'Galápagos']
  },
  {
    code: 'BO',
    name: 'Bolivia',
    continent: 'South America',
    flagEmoji: '🇧🇴',
    capital: 'La Paz',
    coordinates: [-16.2902, -63.5887],
    svgCoords: { x: 32.2, y: 65.0 },
    visited: false,
    aliases: ['Bolivia', 'La Paz', 'Uyuni']
  },
  {
    code: 'UY',
    name: 'Uruguay',
    continent: 'South America',
    flagEmoji: '🇺🇾',
    capital: 'Montevideo',
    coordinates: [-32.5228, -55.7658],
    svgCoords: { x: 35.0, y: 74.5 },
    visited: false,
    aliases: ['Uruguay', 'Montevideo', 'Punta del Este']
  },
  {
    code: 'PY',
    name: 'Paraguay',
    continent: 'South America',
    flagEmoji: '🇵🇾',
    capital: 'Asunción',
    coordinates: [-23.4425, -58.4438],
    svgCoords: { x: 33.8, y: 69.0 },
    visited: false,
    aliases: ['Paraguay', 'Asuncion', 'Asunción']
  },
  {
    code: 'VE',
    name: 'Venezuela',
    continent: 'South America',
    flagEmoji: '🇻🇪',
    capital: 'Caracas',
    coordinates: [6.4238, -66.5897],
    svgCoords: { x: 31.0, y: 49.5 },
    visited: false,
    aliases: ['Venezuela', 'Caracas']
  },

  // =========================================================================
  // EUROPA (Amarillo en el mapa)
  // Incluye Hungría y Checoslovaquia (República Checa / Praga) expresamente
  // =========================================================================
  {
    code: 'CZ',
    name: 'República Checa (Checoslovaquia)',
    continent: 'Europe',
    flagEmoji: '🇨🇿',
    capital: 'Praga',
    coordinates: [50.0755, 14.4378],
    svgCoords: { x: 53.0, y: 21.0 },
    visited: false,
    notes: 'Capital: Ciudad de Praga. Históricamente conocida como Checoslovaquia.',
    aliases: [
      'Checoslovaquia',
      'Chequia',
      'Republica Checa',
      'República Checa',
      'Praga',
      'Prague',
      'Ciudad de Praga',
      'Czech Republic',
      'Czechia',
      'Praha'
    ]
  },
  {
    code: 'HU',
    name: 'Hungría',
    continent: 'Europe',
    flagEmoji: '🇭🇺',
    capital: 'Budapest',
    coordinates: [47.4979, 19.0402],
    svgCoords: { x: 54.5, y: 23.2 },
    visited: false,
    notes: 'Capital: Budapest (a orillas del Danubio).',
    aliases: [
      'Hungria',
      'Hungría',
      'Hungary',
      'Budapest',
      'Magyarország',
      'Magyar',
      'Ciudad de Budapest'
    ]
  },
  {
    code: 'SK',
    name: 'Eslovaquia',
    continent: 'Europe',
    flagEmoji: '🇸🇰',
    capital: 'Bratislava',
    coordinates: [48.1486, 17.1077],
    svgCoords: { x: 54.8, y: 22.0 },
    visited: false,
    aliases: ['Eslovaquia', 'Slovakia', 'Bratislava', 'Checoslovaquia']
  },
  {
    code: 'AT',
    name: 'Austria',
    continent: 'Europe',
    flagEmoji: '🇦🇹',
    capital: 'Viena',
    coordinates: [48.2082, 16.3738],
    svgCoords: { x: 52.6, y: 22.8 },
    visited: false,
    aliases: ['Austria', 'Viena', 'Vienna', 'Salzburgo']
  },
  {
    code: 'ES',
    name: 'España',
    continent: 'Europe',
    flagEmoji: '🇪🇸',
    capital: 'Madrid',
    coordinates: [40.4637, -3.7492],
    svgCoords: { x: 47.7, y: 24.8 },
    visited: false,
    aliases: ['España', 'Espana', 'Spain', 'Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Granada', 'Toledo', 'Ibiza', 'Mallorca']
  },
  {
    code: 'FR',
    name: 'Francia',
    continent: 'Europe',
    flagEmoji: '🇫🇷',
    capital: 'París',
    coordinates: [46.2276, 2.2137],
    svgCoords: { x: 49.8, y: 21.8 },
    visited: false,
    aliases: ['Francia', 'France', 'Paris', 'París', 'Niza']
  },
  {
    code: 'IT',
    name: 'Italia',
    continent: 'Europe',
    flagEmoji: '🇮🇹',
    capital: 'Roma',
    coordinates: [41.8719, 12.5674],
    svgCoords: { x: 52.8, y: 25.5 },
    visited: true,
    visitedDate: '2025-06-15',
    tripName: 'Recorrido Italia: Nápoles y Bahía Napolitana',
    notes: 'Visita a Nápoles: centro histórico Spaccanapoli, la cuna de la pizza tradicional napolitana, el paseo marítimo con vistas al Monte Vesubio y Pompeya.',
    visitedCities: ['Nápoles', 'Roma', 'Pompeya', 'Costa Amalfitana'],
    aliases: ['Italia', 'Italy', 'Napoles', 'Nápoles', 'Napoli', 'Roma', 'Milan', 'Milán', 'Venecia', 'Florencia', 'Capri', 'Pompeya', 'Costa Amalfitana']
  },
  {
    code: 'DE',
    name: 'Alemania',
    continent: 'Europe',
    flagEmoji: '🇩🇪',
    capital: 'Berlín',
    coordinates: [51.1657, 10.4515],
    svgCoords: { x: 52.0, y: 19.8 },
    visited: false,
    aliases: ['Alemania', 'Germany', 'Berlin', 'Berlín', 'Munich', 'Múnich', 'Frankfurt']
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    continent: 'Europe',
    flagEmoji: '🇬🇧',
    capital: 'Londres',
    coordinates: [55.3781, -3.436],
    svgCoords: { x: 48.0, y: 18.0 },
    visited: false,
    aliases: ['Reino Unido', 'UK', 'Inglaterra', 'Londres', 'London', 'Escocia']
  },
  {
    code: 'CH',
    name: 'Suiza',
    continent: 'Europe',
    flagEmoji: '🇨🇭',
    capital: 'Berna',
    coordinates: [46.8182, 8.2275],
    svgCoords: { x: 51.2, y: 22.2 },
    visited: false,
    aliases: ['Suiza', 'Switzerland', 'Zurich', 'Zúrich', 'Ginebra']
  },
  {
    code: 'NL',
    name: 'Países Bajos (Holanda)',
    continent: 'Europe',
    flagEmoji: '🇳🇱',
    capital: 'Ámsterdam',
    coordinates: [52.3676, 4.9041],
    svgCoords: { x: 50.2, y: 18.8 },
    visited: false,
    aliases: ['Holanda', 'Paises Bajos', 'Países Bajos', 'Netherlands', 'Amsterdam', 'Ámsterdam']
  },
  {
    code: 'BE',
    name: 'Bélgica',
    continent: 'Europe',
    flagEmoji: '🇧🇪',
    capital: 'Bruselas',
    coordinates: [50.8503, 4.3517],
    svgCoords: { x: 49.8, y: 19.6 },
    visited: false,
    aliases: ['Belgica', 'Bélgica', 'Belgium', 'Bruselas', 'Brussels', 'Brujas']
  },
  {
    code: 'PT',
    name: 'Portugal',
    continent: 'Europe',
    flagEmoji: '🇵🇹',
    capital: 'Lisboa',
    coordinates: [38.7223, -9.1393],
    svgCoords: { x: 46.1, y: 25.2 },
    visited: false,
    aliases: ['Portugal', 'Lisboa', 'Lisbon', 'Oporto', 'Porto', 'Sintra', 'Algarve', 'Faro', 'Madeira']
  },
  {
    code: 'PL',
    name: 'Polonia',
    continent: 'Europe',
    flagEmoji: '🇵🇱',
    capital: 'Varsovia',
    coordinates: [52.2297, 21.0122],
    svgCoords: { x: 54.8, y: 18.8 },
    visited: false,
    aliases: ['Polonia', 'Poland', 'Varsovia', 'Warsaw', 'Cracovia', 'Krakow']
  },
  {
    code: 'GR',
    name: 'Grecia',
    continent: 'Europe',
    flagEmoji: '🇬🇷',
    capital: 'Atenas',
    coordinates: [39.0742, 21.8243],
    svgCoords: { x: 55.0, y: 28.5 },
    visited: false,
    aliases: ['Grecia', 'Greece', 'Atenas', 'Santorini', 'Mykonos']
  },
  {
    code: 'IE',
    name: 'Irlanda',
    continent: 'Europe',
    flagEmoji: '🇮🇪',
    capital: 'Dublín',
    coordinates: [53.3498, -6.2603],
    svgCoords: { x: 46.5, y: 17.5 },
    visited: false,
    aliases: ['Irlanda', 'Ireland', 'Dublin', 'Dublín']
  },
  {
    code: 'SE',
    name: 'Suecia',
    continent: 'Europe',
    flagEmoji: '🇸🇪',
    capital: 'Estocolmo',
    coordinates: [59.3293, 18.0686],
    svgCoords: { x: 53.5, y: 14.5 },
    visited: false,
    aliases: ['Suecia', 'Sweden', 'Estocolmo', 'Stockholm']
  },
  {
    code: 'NO',
    name: 'Noruega',
    continent: 'Europe',
    flagEmoji: '🇳🇴',
    capital: 'Oslo',
    coordinates: [59.9139, 10.7522],
    svgCoords: { x: 51.5, y: 13.5 },
    visited: false,
    aliases: ['Noruega', 'Norway', 'Oslo']
  },
  {
    code: 'DK',
    name: 'Dinamarca',
    continent: 'Europe',
    flagEmoji: '🇩🇰',
    capital: 'Copenhague',
    coordinates: [55.6761, 12.5683],
    svgCoords: { x: 51.5, y: 17.2 },
    visited: false,
    aliases: ['Dinamarca', 'Denmark', 'Copenhague', 'Copenhagen']
  },
  {
    code: 'HR',
    name: 'Croacia',
    continent: 'Europe',
    flagEmoji: '🇭🇷',
    capital: 'Zagreb',
    coordinates: [45.8150, 15.9819],
    svgCoords: { x: 53.8, y: 25.0 },
    visited: false,
    aliases: ['Croacia', 'Croatia', 'Dubrovnik', 'Zagreb', 'Split']
  },
  {
    code: 'TR',
    name: 'Turquía',
    continent: 'Europe',
    flagEmoji: '🇹🇷',
    capital: 'Ankara',
    coordinates: [39.9334, 32.8597],
    svgCoords: { x: 58.8, y: 30.5 },
    visited: false,
    aliases: ['Turquía', 'Turquia', 'Turkey', 'Estambul', 'Istanbul', 'Capadocia']
  },
  {
    code: 'VA',
    name: 'Ciudad del Vaticano',
    continent: 'Europe',
    flagEmoji: '🇻🇦',
    capital: 'Vaticano',
    coordinates: [41.9029, 12.4534],
    svgCoords: { x: 52.8, y: 27.0 },
    visited: false,
    aliases: ['Vaticano', 'Vatican', 'Santa Sede']
  },

  // =========================================================================
  // ASIA (Púrpura en el mapa)
  // =========================================================================
  {
    code: 'JP',
    name: 'Japón',
    continent: 'Asia',
    flagEmoji: '🇯🇵',
    capital: 'Tokio',
    coordinates: [36.2048, 138.2529],
    svgCoords: { x: 83.2, y: 32.5 },
    visited: true,
    visitedDate: '2026-08-23',
    tripName: 'Gran Tour Asia 2026',
    notes: 'Recorrido por Osaka (Castillo, Dotonbori) y Tokio (Ginza, Akihabara, Shibuya).',
    aliases: ['Japon', 'Japón', 'Japan', 'Tokyo', 'Tokio', 'Osaka', 'Kyoto']
  },
  {
    code: 'KR',
    name: 'Corea del Sur',
    continent: 'Asia',
    flagEmoji: '🇰🇷',
    capital: 'Seúl',
    coordinates: [35.9078, 127.7669],
    svgCoords: { x: 79.5, y: 33.5 },
    visited: true,
    visitedDate: '2026-08-31',
    tripName: 'Gran Tour Asia 2026',
    notes: 'Estancia en Seúl (Palacio Gyeongbokgung, Myeongdong, Insadong).',
    aliases: ['Corea', 'Corea del Sur', 'Korea', 'South Korea', 'Seul', 'Seúl']
  },
  {
    code: 'TH',
    name: 'Tailandia',
    continent: 'Asia',
    flagEmoji: '🇹🇭',
    capital: 'Bangkok',
    coordinates: [15.87, 100.9925],
    svgCoords: { x: 74.8, y: 48.5 },
    visited: true,
    visitedDate: '2026-09-04',
    tripName: 'Gran Tour Asia 2026',
    notes: 'Bangkok, Gran Palacio, Wat Arun y mercados tradicionales.',
    aliases: ['Tailandia', 'Thailand', 'Bangkok', 'Phuket', 'Chiang Mai']
  },
  {
    code: 'CN',
    name: 'China',
    continent: 'Asia',
    flagEmoji: '🇨🇳',
    capital: 'Pekín',
    coordinates: [35.8617, 104.1954],
    svgCoords: { x: 73.0, y: 32.0 },
    visited: false,
    aliases: ['China', 'Beijing', 'Pekin', 'Pekín', 'Shanghai', 'Hong Kong']
  },
  {
    code: 'IN',
    name: 'India',
    continent: 'Asia',
    flagEmoji: '🇮🇳',
    capital: 'Nueva Delhi',
    coordinates: [20.5937, 78.9629],
    svgCoords: { x: 67.5, y: 42.5 },
    visited: false,
    aliases: ['India', 'Nueva Delhi', 'Delhi', 'Mumbai', 'Taj Mahal']
  },
  {
    code: 'AE',
    name: 'Emiratos Árabes Unidos',
    continent: 'Asia',
    flagEmoji: '🇦🇪',
    capital: 'Abu Dabi',
    coordinates: [23.4241, 53.8478],
    svgCoords: { x: 62.0, y: 37.5 },
    visited: false,
    aliases: ['Emiratos Arabes', 'Emiratos', 'Dubai', 'Dubái', 'Abu Dhabi', 'Abu Dabi']
  },
  {
    code: 'SG',
    name: 'Singapur',
    continent: 'Asia',
    flagEmoji: '🇸🇬',
    capital: 'Singapur',
    coordinates: [1.3521, 103.8198],
    svgCoords: { x: 75.6, y: 54.5 },
    visited: false,
    aliases: ['Singapur', 'Singapore']
  },
  {
    code: 'VN',
    name: 'Vietnam',
    continent: 'Asia',
    flagEmoji: '🇻🇳',
    capital: 'Hanói',
    coordinates: [14.0583, 108.2772],
    svgCoords: { x: 76.5, y: 46.5 },
    visited: false,
    aliases: ['Vietnam', 'Hanoi', 'Hanói', 'Ho Chi Minh', 'Saigon']
  },
  {
    code: 'ID',
    name: 'Indonesia',
    continent: 'Asia',
    flagEmoji: '🇮🇩',
    capital: 'Yakarta',
    coordinates: [-0.7893, 113.9213],
    svgCoords: { x: 78.0, y: 56.0 },
    visited: false,
    aliases: ['Indonesia', 'Bali', 'Yakarta', 'Jakarta']
  },

  // =========================================================================
  // ÁFRICA (Naranja en el mapa)
  // =========================================================================
  {
    code: 'EG',
    name: 'Egipto',
    continent: 'Africa',
    flagEmoji: '🇪🇬',
    capital: 'El Cairo',
    coordinates: [26.8206, 30.8025],
    svgCoords: { x: 56.5, y: 35.0 },
    visited: false,
    aliases: ['Egipto', 'Egypt', 'El Cairo', 'Cairo', 'Piramides']
  },
  {
    code: 'MA',
    name: 'Marruecos',
    continent: 'Africa',
    flagEmoji: '🇲🇦',
    capital: 'Rabat',
    coordinates: [31.7917, -7.0926],
    svgCoords: { x: 46.5, y: 33.5 },
    visited: false,
    aliases: ['Marruecos', 'Morocco', 'Marrakech', 'Casablanca']
  },
  {
    code: 'ZA',
    name: 'Sudáfrica',
    continent: 'Africa',
    flagEmoji: '🇿🇦',
    capital: 'Pretoria',
    coordinates: [-30.5595, 22.9375],
    svgCoords: { x: 55.0, y: 75.0 },
    visited: false,
    aliases: ['Sudafrica', 'Sudáfrica', 'South Africa', 'Ciudad del Cabo', 'Cape Town']
  },
  {
    code: 'KE',
    name: 'Kenia',
    continent: 'Africa',
    flagEmoji: '🇰🇪',
    capital: 'Nairobi',
    coordinates: [-0.0236, 37.9062],
    svgCoords: { x: 59.0, y: 54.0 },
    visited: false,
    aliases: ['Kenia', 'Kenya', 'Nairobi']
  },

  // =========================================================================
  // OCEANÍA (Melocotón en el mapa)
  // =========================================================================
  {
    code: 'AU',
    name: 'Australia',
    continent: 'Oceania',
    flagEmoji: '🇦🇺',
    capital: 'Canberra',
    coordinates: [-25.2744, 133.7751],
    svgCoords: { x: 84.5, y: 68.5 },
    visited: false,
    aliases: ['Australia', 'Sydney', 'Melbourne', 'Brisbane']
  },
  {
    code: 'NZ',
    name: 'Nueva Zelanda',
    continent: 'Oceania',
    flagEmoji: '🇳🇿',
    capital: 'Wellington',
    coordinates: [-40.9006, 174.886],
    svgCoords: { x: 92.5, y: 79.5 },
    visited: false,
    aliases: ['Nueva Zelanda', 'New Zealand', 'Auckland', 'Wellington']
  }
];

export const INITIAL_TRAVEL_PHOTOS: TravelPhoto[] = [
  {
    id: 'photo-jp-1',
    countryCode: 'JP',
    countryName: 'Japón',
    city: 'Osaka',
    title: 'Castillo de Osaka al amanecer',
    dataUrl: 'https://images.unsplash.com/photo-1590559899731-a37289824751?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-24',
    notes: 'Impresionante arquitectura feudal japonesa rodeada de hermosos jardines y foso de agua.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'photo-jp-2',
    countryCode: 'JP',
    countryName: 'Japón',
    city: 'Tokio',
    title: 'Cruce de Shibuya y luces de Neón',
    dataUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-28',
    notes: 'La energía futurista de Tokio en Shibuya y Akihabara con toda la familia.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-08-28T20:30:00Z'
  },
  {
    id: 'photo-kr-1',
    countryCode: 'KR',
    countryName: 'Corea del Sur',
    city: 'Seúl',
    title: 'Palacio Real Gyeongbokgung',
    dataUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1000&q=80',
    date: '2026-09-01',
    notes: 'Ceremonia de cambio de guardia real y trajes Hanbok tradicionales en Seúl.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-09-01T14:15:00Z'
  },
  {
    id: 'photo-th-1',
    countryCode: 'TH',
    countryName: 'Tailandia',
    city: 'Bangkok',
    title: 'Templo del Amanecer Wat Arun',
    dataUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=80',
    date: '2026-09-05',
    notes: 'A orillas del río Chao Phraya en Bangkok, torres decoradas con porcelana colorida.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-09-05T17:45:00Z'
  },
  {
    id: 'photo-us-1',
    countryCode: 'US',
    countryName: 'Estados Unidos',
    city: 'San Francisco',
    title: 'Puente Golden Gate y Bahía',
    dataUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-20',
    notes: 'Parada y escala en California antes del vuelo transpacífico hacia Asia.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-08-20T12:00:00Z'
  },
  {
    id: 'photo-hn-1',
    countryCode: 'HN',
    countryName: 'Honduras',
    city: 'Tegucigalpa / Palmerola',
    title: 'Despegue en Palmerola hacia el Gran Tour',
    dataUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-18',
    notes: 'Inicio de la gran aventura familiar desde el Aeropuerto Internacional de Palmerola (XPL).',
    tripId: 'trip-asia-2026',
    createdAt: '2026-08-18T09:30:00Z'
  },
  {
    id: 'photo-ar-1',
    countryCode: 'AR',
    countryName: 'Argentina',
    city: 'Buenos Aires',
    title: 'Obelisco y Avenida 9 de Julio',
    dataUrl: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-15',
    notes: 'Recorrido por la capital argentina, Plaza de Mayo, San Telmo y el icónico Obelisco.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-08-15T14:00:00Z'
  },
  {
    id: 'photo-cl-1',
    countryCode: 'CL',
    countryName: 'Chile',
    city: 'Santiago de Chile',
    title: 'Santiago y Cordillera de los Andes',
    dataUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-16',
    notes: 'Vista panorámica de la ciudad de Santiago de Chile con la imponente Cordillera de los Andes de fondo.',
    tripId: 'trip-asia-2026',
    createdAt: '2026-08-16T16:30:00Z'
  },
  {
    id: 'photo-co-medellin',
    countryCode: 'CO',
    countryName: 'Colombia',
    city: 'Medellín',
    title: 'Medellín: Comuna 13 y Metrocable',
    dataUrl: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1000&q=80',
    date: '2025-11-12',
    notes: 'Murales y arte urbano de la Comuna 13, vista panorámica de Medellín y el viaje en Metrocable sobre las montañas.',
    tripId: 'trip-colombia-2025',
    createdAt: '2025-11-12T14:00:00Z'
  },
  {
    id: 'photo-co-cartagena',
    countryCode: 'CO',
    countryName: 'Colombia',
    city: 'Cartagena',
    title: 'Cartagena: Ciudad Amurallada y Balcones Floridos',
    dataUrl: 'https://images.unsplash.com/photo-1583997052103-b4a1fad8e53a?auto=format&fit=crop&w=1000&q=80',
    date: '2025-11-16',
    notes: 'Recorrido por la Ciudad Amurallada colonial, calles empedradas, balcones con flores y atardecer en las murallas de Cartagena.',
    tripId: 'trip-colombia-2025',
    createdAt: '2025-11-16T17:30:00Z'
  },
  {
    id: 'photo-co-guatape',
    countryCode: 'CO',
    countryName: 'Colombia',
    city: 'Guatapé',
    title: 'Guatapé: Piedra del Peñol y Calles de los Zócalos',
    dataUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    date: '2025-11-14',
    notes: 'Ascenso a la cima de la Piedra del Peñol con vista panorámica de 360° al embalse y caminata por el pueblo de zócalos de Guatapé.',
    tripId: 'trip-colombia-2025',
    createdAt: '2025-11-14T11:00:00Z'
  },
  {
    id: 'photo-it-napoles',
    countryCode: 'IT',
    countryName: 'Italia',
    city: 'Nápoles',
    title: 'Nápoles: Bahía Napolitana y Monte Vesubio',
    dataUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    date: '2025-06-08',
    notes: 'Paseo por Spaccanapoli, degustación de la auténtica pizza napolitana y vistas al mar frente al imponente Monte Vesubio.',
    tripId: 'trip-italia-2025',
    createdAt: '2025-06-08T15:00:00Z'
  }
];
