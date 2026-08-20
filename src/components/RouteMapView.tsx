import React, { useState } from 'react';
import { Trip, Flight, Activity, Reservation, FlightStatus } from '../types';
import { VisualMapView } from './VisualMapView';
import { OfflineRouteMapView } from './OfflineRouteMapView';
import {
  Map,
  Plane,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  MessageSquare,
  Navigation,
  Globe,
  Building,
  Check,
  RotateCcw,
  Info,
  Calendar,
  Layers,
  Zap,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Compass
} from 'lucide-react';

interface RouteMapViewProps {
  trip: Trip;
  flights: Flight[];
  activities: Activity[];
  reservations: Reservation[];
  onUpdateFlightStatus: (flightId: string, status: FlightStatus) => void;
  onToggleActivity: (id: string) => void;
  onNotifyWhatsAppMessage?: (message: string) => void;
}

interface CityLocation {
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
}

// Known coordinates dictionary for travel hubs
const CITY_COORDINATES: Record<string, CityLocation> = {
  comayagua: { city: 'Comayagua', country: 'Honduras', flag: '🇭🇳', lat: 14.38, lng: -87.62 },
  tegucigalpa: { city: 'Tegucigalpa', country: 'Honduras', flag: '🇭🇳', lat: 14.08, lng: -87.20 },
  'san pedro sula': { city: 'San Pedro Sula', country: 'Honduras', flag: '🇭🇳', lat: 15.45, lng: -87.92 },
  honduras: { city: 'Honduras', country: 'Honduras', flag: '🇭🇳', lat: 14.38, lng: -87.62 },
  houston: { city: 'Houston', country: 'EE.UU.', flag: '🇺🇸', lat: 29.99, lng: -95.34 },
  'san antonio': { city: 'San Antonio', country: 'EE.UU.', flag: '🇺🇸', lat: 29.53, lng: -98.47 },
  'san francisco': { city: 'San Francisco', country: 'EE.UU.', flag: '🇺🇸', lat: 37.62, lng: -122.38 },
  miami: { city: 'Miami', country: 'EE.UU.', flag: '🇺🇸', lat: 25.79, lng: -80.28 },
  'new york': { city: 'Nueva York', country: 'EE.UU.', flag: '🇺🇸', lat: 40.64, lng: -73.78 },
  'los angeles': { city: 'Los Ángeles', country: 'EE.UU.', flag: '🇺🇸', lat: 33.94, lng: -118.41 },
  osaka: { city: 'Osaka', country: 'Japón', flag: '🇯🇵', lat: 34.43, lng: 135.23 },
  tokio: { city: 'Tokio', country: 'Japón', flag: '🇯🇵', lat: 35.55, lng: 139.78 },
  tokyo: { city: 'Tokio', country: 'Japón', flag: '🇯🇵', lat: 35.55, lng: 139.78 },
  seoul: { city: 'Seúl', country: 'Corea del Sur', flag: '🇰🇷', lat: 37.46, lng: 126.44 },
  seul: { city: 'Seúl', country: 'Corea del Sur', flag: '🇰🇷', lat: 37.46, lng: 126.44 },
  bangkok: { city: 'Bangkok', country: 'Tailandia', flag: '🇹🇭', lat: 13.69, lng: 100.75 },
  madrid: { city: 'Madrid', country: 'España', flag: '🇪🇸', lat: 40.48, lng: -3.56 },
  barcelona: { city: 'Barcelona', country: 'España', flag: '🇪🇸', lat: 41.38, lng: 2.17 },
  cancun: { city: 'Cancún', country: 'México', flag: '🇲🇽', lat: 21.04, lng: -86.87 },
  'ciudad de mexico': { city: 'Ciudad de México', country: 'México', flag: '🇲🇽', lat: 19.43, lng: -99.07 },
  'san jose': { city: 'San José', country: 'Costa Rica', flag: '🇨🇷', lat: 9.99, lng: -84.21 },
  panama: { city: 'Panamá', country: 'Panamá', flag: '🇵🇦', lat: 9.07, lng: -79.38 },
  bogota: { city: 'Bogotá', country: 'Colombia', flag: '🇨🇴', lat: 4.70, lng: -74.14 },
  lima: { city: 'Lima', country: 'Perú', flag: '🇵🇪', lat: -12.02, lng: -77.11 },
};

function getCityCoords(rawCityName: string, airportCode?: string): CityLocation {
  const clean = rawCityName.toLowerCase().trim();
  for (const key of Object.keys(CITY_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return CITY_COORDINATES[key];
    }
  }

  // Fallback by checking airport code inside raw string
  if (airportCode || rawCityName) {
    const str = (airportCode + ' ' + rawCityName).toUpperCase();
    if (str.includes('XPL') || str.includes('TGU') || str.includes('SAP') || str.includes('HONDURAS')) {
      return CITY_COORDINATES['comayagua'];
    }
    if (str.includes('IAH') || str.includes('HOUSTON')) return CITY_COORDINATES['houston'];
    if (str.includes('SAT') || str.includes('SAN ANTONIO')) return CITY_COORDINATES['san antonio'];
    if (str.includes('SFO') || str.includes('SAN FRANCISCO')) return CITY_COORDINATES['san francisco'];
    if (str.includes('KIX') || str.includes('OSAKA')) return CITY_COORDINATES['osaka'];
    if (str.includes('HND') || str.includes('NRT') || str.includes('TOKYO')) return CITY_COORDINATES['tokyo'];
    if (str.includes('ICN') || str.includes('SEOUL')) return CITY_COORDINATES['seoul'];
    if (str.includes('BKK') || str.includes('BANGKOK')) return CITY_COORDINATES['bangkok'];
    if (str.includes('MAD') || str.includes('MADRID')) return CITY_COORDINATES['madrid'];
  }

  // Generic hash fallback for unknown locations
  let hash = 0;
  for (let i = 0; i < rawCityName.length; i++) {
    hash = rawCityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pseudoLat = 10 + (Math.abs(hash) % 40);
  const pseudoLng = -100 + (Math.abs(hash >> 2) % 180);

  return {
    city: rawCityName,
    country: 'Destino',
    flag: '📍',
    lat: pseudoLat,
    lng: pseudoLng,
  };
}

export const RouteMapView: React.FC<RouteMapViewProps> = ({
  trip,
  flights,
  activities,
  reservations,
  onUpdateFlightStatus,
  onToggleActivity,
  onNotifyWhatsAppMessage,
}) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [zoomPreset, setZoomPreset] = useState<'global' | 'americas' | 'asia'>('global');
  const [focusedFlightId, setFocusedFlightId] = useState<string | null>(null);
  const [mapEngine, setMapEngine] = useState<'etapas' | 'real_map' | 'interactive' | 'google_maps'>('etapas');
  const [activeGoogleMapCity, setActiveGoogleMapCity] = useState<string>('Osaka, Japan');

  // Filter flights and activities for current trip
  const tripFlights = flights.filter((f) => f.tripId === trip.id);
  const tripActivities = activities.filter((a) => a.tripId === trip.id);
  const tripReservations = reservations.filter((r) => r.tripId === trip.id);

  // Map viewport settings
  const viewBoxMap = {
    global: '0 0 1000 500',
    americas: '100 80 400 320', // Focused on Honduras & North America
    asia: '460 60 520 340',     // Focused on East Asia (Japan, Korea, Thailand)
  };

  // Convert (lat, lng) to SVG Canvas (1000 x 500)
  const projectCoords = (lat: number, lng: number) => {
    const x = (lng + 180) * (1000 / 360);
    const y = (85 - lat) * (500 / 170);
    return { x, y };
  };

  // Build unique cities list with coordinates
  const cityMap = new Map<string, { location: CityLocation; activities: Activity[]; reservations: Reservation[]; flightsCount: number }>();

  tripFlights.forEach((f) => {
    const depLoc = getCityCoords(f.departureCity, f.departureAirport);
    const arrLoc = getCityCoords(f.arrivalCity, f.arrivalAirport);

    [depLoc, arrLoc].forEach((loc) => {
      if (!cityMap.has(loc.city.toLowerCase())) {
        cityMap.set(loc.city.toLowerCase(), {
          location: loc,
          activities: [],
          reservations: [],
          flightsCount: 0,
        });
      }
      const entry = cityMap.get(loc.city.toLowerCase())!;
      entry.flightsCount += 1;
    });
  });

  // Assign activities to corresponding cities by matching location string or city name
  tripActivities.forEach((act) => {
    let assigned = false;
    cityMap.forEach((entry) => {
      const cityLower = entry.location.city.toLowerCase();
      const locLower = (act.location || '').toLowerCase();
      const titleLower = act.title.toLowerCase();
      if (locLower.includes(cityLower) || titleLower.includes(cityLower)) {
        entry.activities.push(act);
        assigned = true;
      }
    });
    // Fallback assignment to first city if none matched
    if (!assigned && cityMap.size > 0) {
      const firstEntry = cityMap.values().next().value;
      if (firstEntry) firstEntry.activities.push(act);
    }
  });

  // Assign reservations to corresponding cities
  tripReservations.forEach((res) => {
    cityMap.forEach((entry) => {
      const cityLower = entry.location.city.toLowerCase();
      const addrLower = (res.address || '').toLowerCase();
      const titleLower = res.title.toLowerCase();
      if (addrLower.includes(cityLower) || titleLower.includes(cityLower)) {
        entry.reservations.push(res);
      }
    });
  });

  const completedLegsCount = tripFlights.filter(
    (f) => f.status === 'aterrizado'
  ).length;

  const inFlightLegsCount = tripFlights.filter(
    (f) => f.status === 'en_vuelo' || f.status === 'embarcando'
  ).length;

  const totalLegs = tripFlights.length;
  const progressPercent = totalLegs > 0 ? Math.round((completedLegsCount / totalLegs) * 100) : 0;

  // Generate WhatsApp summary report
  const handleShareMapReportWhatsApp = () => {
    let summary = `✈️ *MAPA DE RUTA Y PROGRESO DE VIAJE* 🗺️
📌 *${trip.title}* [Código: ${trip.code || 'VAC'}]
👥 *Viajeros:* ${trip.travelersNames?.join(', ') || 'Grupo de Viaje'}
🎯 *Progreso de Ruta:* ${completedLegsCount} de ${totalLegs} tramos realizados (${progressPercent}%)

📊 *ESTADO DE LOS TRAMOS:*
`;

    tripFlights.forEach((f, idx) => {
      const isCompleted = f.status === 'aterrizado';
      const isInFlight = f.status === 'en_vuelo';
      const icon = isCompleted ? '🟢 REALIZADO' : isInFlight ? '🛫 EN VUELO' : '🕒 PROGRAMADO';

      summary += `*#${idx + 1} ${f.airline} ${f.flightNumber}*
• Ruta: ${f.departureCity} ➡️ ${f.arrivalCity}
• Estado: ${icon}
• Fecha: ${f.departureTime.split('T')[0]} (${f.departureTime.split('T')[1]?.substring(0, 5) || ''})
\n`;
    });

    const activeActivitiesCount = tripActivities.filter((a) => a.completed).length;
    summary += `✅ *Actividades Completadas:* ${activeActivitiesCount} de ${tripActivities.length}
📲 *Seguimiento interactivo en ViajeFlow*`;

    if (onNotifyWhatsAppMessage) {
      onNotifyWhatsAppMessage(summary);
    } else {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-xl text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Globe className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white">Mapa de Ruta e Itinerario Live</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {progressPercent}% RUTAS COMPLETADAS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Seguimiento visual de vuelos realizados, en tránsito y actividades por destino
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Engine Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-cyan-500/40 text-xs">
            <button
              onClick={() => setMapEngine('etapas')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                mapEngine === 'etapas'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🗺️ Mapa & Trayectos por Etapas</span>
            </button>
            <button
              onClick={() => setMapEngine('real_map')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                mapEngine === 'real_map'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorador Callejero</span>
            </button>
            <button
              onClick={() => setMapEngine('interactive')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                mapEngine === 'interactive'
                  ? 'bg-cyan-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Diagrama SVG</span>
            </button>
            <button
              onClick={() => setMapEngine('google_maps')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                mapEngine === 'google_maps'
                  ? 'bg-emerald-600 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Maps 🗺️</span>
            </button>
          </div>

          {/* View Zoom Presets (Interactive mode) */}
          {mapEngine === 'interactive' && (
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setZoomPreset('americas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  zoomPreset === 'americas'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌎 América
              </button>
              <button
                onClick={() => setZoomPreset('asia')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  zoomPreset === 'asia'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌏 Asia
              </button>
              <button
                onClick={() => setZoomPreset('global')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  zoomPreset === 'global'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌍 Global
              </button>
            </div>
          )}

          <button
            onClick={handleShareMapReportWhatsApp}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp 📲</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300 flex items-center space-x-1.5">
            <Plane className="w-4 h-4 text-cyan-400 transform -rotate-45" />
            <span>Progreso del Itinerario de Vuelos:</span>
            <strong className="text-white ml-1">
              {completedLegsCount} de {totalLegs} tramos realizados
            </strong>
          </span>
          <span className="text-emerald-400 font-mono font-black">{progressPercent}%</span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/30"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm" />
              <span>Realizado (Aterrizado)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse" />
              <span>En Vuelo / En Tránsito</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/50 inline-block" />
              <span>Programado</span>
            </span>
          </div>

          <span className="text-slate-500 italic">
            Haz clic en los nodos de ciudad o líneas de vuelo para cambiar el estado o ver actividades
          </span>
        </div>
      </div>

      {/* Main Map Display (Offline Stage Map, Visual Interactive Map, Google Maps Live, or Vector View) */}
      {mapEngine === 'etapas' ? (
        <OfflineRouteMapView
          flights={tripFlights}
          activities={tripActivities}
          reservations={tripReservations}
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city.toLowerCase())}
        />
      ) : mapEngine === 'real_map' ? (
        <div className="space-y-3">
          <VisualMapView
            flights={tripFlights}
            activities={tripActivities}
            reservations={tripReservations}
            selectedCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city.toLowerCase())}
          />
        </div>
      ) : mapEngine === 'google_maps' ? (
        <div className="bg-slate-950 rounded-3xl border border-emerald-500/40 overflow-hidden shadow-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Explorador de Destinos y Callejero con Google Maps</span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualiza los destinos, hoteles, aeropuertos y atracciones directamente en el mapa real
              </p>
            </div>

            {/* Google Maps City Destination Quick Selector */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { name: 'Osaka, Japón 🇯🇵', query: 'Osaka, Japan' },
                { name: 'Tokio, Japón 🇯🇵', query: 'Tokyo, Japan' },
                { name: 'Seúl, Corea 🇰🇷', query: 'Seoul, South Korea' },
                { name: 'Bangkok, Tailandia 🇹🇭', query: 'Bangkok, Thailand' },
                { name: 'San Antonio, Texas 🇺🇸', query: 'San Antonio International Airport, TX' },
                { name: 'Palmerola (XPL), Honduras 🇭🇳', query: 'Palmerola International Airport, Comayagua' }
              ].map((c) => (
                <button
                  key={c.query}
                  onClick={() => setActiveGoogleMapCity(c.query)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeGoogleMapCity === c.query
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Embedded Google Map IFrame */}
          <div className="w-full h-[460px] rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-900">
            <iframe
              title="Google Map Live View"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(activeGoogleMapCity)}&t=m&z=12&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Destino actual: <strong className="text-white">{activeGoogleMapCity}</strong></span>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeGoogleMapCity)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir en App de Google Maps 🗺️</span>
            </a>
          </div>
        </div>
      ) : (
        /* Main Interactive Map Canvas */
        <div className="relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl min-h-[420px] flex items-center justify-center">
          {/* SVG World Map Vector Backdrop */}
          <svg
            viewBox={viewBoxMap[zoomPreset]}
            className="w-full h-full min-h-[420px] transition-all duration-500 select-none"
            style={{ background: '#020617' }}
          >
            {/* Subtle Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
              </pattern>

              {/* Glowing Gradient Filters */}
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect width="1000" height="500" fill="url(#grid)" />

            {/* Continents Outline Stylized Vector Shapes */}
            <g opacity="0.22" fill="#334155" stroke="#475569" strokeWidth="0.8">
              {/* North America */}
              <path d="M 120 70 L 160 60 L 220 80 L 280 120 L 260 200 L 210 220 L 170 190 L 120 120 Z" />
              {/* Central America & Honduras */}
              <path d="M 210 220 L 245 235 L 260 250 L 240 260 L 225 240 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.2" opacity="0.6" />
              {/* South America */}
              <path d="M 250 260 L 310 280 L 330 380 L 280 450 L 240 380 Z" />
              {/* Europe */}
              <path d="M 470 80 L 530 70 L 560 120 L 510 160 L 460 130 Z" />
              {/* Asia & Japan */}
              <path d="M 580 80 L 850 70 L 920 180 L 800 280 L 650 240 Z" />
              <path d="M 870 130 Q 885 145 880 165 T 865 185" fill="none" stroke="#64748b" strokeWidth="3" />
            </g>

            {/* Render Flight Route Lines & Curved Arcs */}
            {tripFlights.map((f, idx) => {
              const dep = getCityCoords(f.departureCity, f.departureAirport);
              const arr = getCityCoords(f.arrivalCity, f.arrivalAirport);

              const p1 = projectCoords(dep.lat, dep.lng);
              const p2 = projectCoords(arr.lat, arr.lng);

              // Handle Pacific crossing (e.g. SFO at x~156 to Osaka at x~875)
              const isPacificCrossing = Math.abs(p2.x - p1.x) > 400;
              let pathD: string;
              let midX: number;
              let midY: number;

              if (isPacificCrossing) {
                // Great circle transpacific arc via northern Pacific / Alaska
                midX = p1.x < p2.x ? ((p1.x + p2.x) / 2) : ((p2.x + p1.x) / 2);
                midY = Math.min(p1.y, p2.y) - 70;
                pathD = `M ${p1.x},${p1.y} Q ${midX},${midY} ${p2.x},${p2.y}`;
              } else {
                midX = (p1.x + p2.x) / 2;
                const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                const curveOffset = Math.min(50, Math.max(15, dist * 0.2));
                midY = Math.min(p1.y, p2.y) - curveOffset;
                pathD = `M ${p1.x},${p1.y} Q ${midX},${midY} ${p2.x},${p2.y}`;
              }

              const isCompleted = f.status === 'aterrizado';
              const isInFlight = f.status === 'en_vuelo' || f.status === 'embarcando';
              const isFocused = focusedFlightId === f.id;

              // Compute plane position along quadratic bezier curve
              const t = isCompleted ? 1.0 : isInFlight ? 0.6 : 0.05;
              const planeX = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
              const planeY = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;

              return (
                <g key={f.id} className="cursor-pointer group" onClick={() => setFocusedFlightId(f.id)}>
                  {/* Background Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isCompleted ? '#10b981' : isInFlight ? '#f59e0b' : '#38bdf8'}
                    strokeWidth={isFocused ? 3.5 : 2}
                    strokeDasharray={isCompleted ? 'none' : '6 4'}
                    opacity={isCompleted ? 0.9 : isInFlight ? 1 : 0.5}
                    filter={isCompleted ? 'url(#glow-emerald)' : isInFlight ? 'url(#glow-amber)' : undefined}
                  />

                  {/* Animated Flying Pulse Effect when En Vuelo */}
                  {isInFlight && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3.5"
                      strokeDasharray="12 12"
                      className="animate-pulse"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="24"
                        to="0"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  )}

                  {/* Airplane Marker Icon on the Arc */}
                  <g transform={`translate(${planeX}, ${planeY})`}>
                    <circle
                      r={isCompleted ? 10 : 12}
                      fill={isCompleted ? '#059669' : isInFlight ? '#d97706' : '#0284c7'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className={isInFlight ? 'animate-bounce' : ''}
                    />
                    {isCompleted ? (
                      <text x="-4" y="3" fill="#ffffff" fontSize="9" fontWeight="bold">
                        ✓
                      </text>
                    ) : (
                      <text x="-5" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">
                        ✈
                      </text>
                    )}
                  </g>

                  {/* Route Segment Badge Label */}
                  <g transform={`translate(${midX}, ${midY - 8})`}>
                    <rect
                      x="-45"
                      y="-11"
                      width="90"
                      height="18"
                      rx="9"
                      fill="#0f172a"
                      stroke={isCompleted ? '#10b981' : isInFlight ? '#f59e0b' : '#334155'}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill={isCompleted ? '#34d399' : isInFlight ? '#fbbf24' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {dep.flag} ✈ {arr.flag} {isCompleted ? '✓ OK' : ''}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Render City Pins and Destination Hubs */}
            {Array.from(cityMap.values()).map(({ location, activities: cityActs, reservations: cityRes }) => {
              const pos = projectCoords(location.lat, location.lng);
              const isSelected = selectedCity === location.city.toLowerCase();
              const completedActs = cityActs.filter((a) => a.completed).length;

              return (
                <g
                  key={location.city}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedCity(location.city.toLowerCase())}
                >
                  {/* Outer Pulsing Radar Ring */}
                  <circle
                    r={isSelected ? 16 : 10}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />

                  {/* Node Center Circle */}
                  <circle
                    r={isSelected ? 8 : 6}
                    fill={isSelected ? '#38bdf8' : '#0ea5e9'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="group-hover:scale-125 transition-transform"
                  />

                  {/* City Label Badge */}
                  <g transform="translate(0, 18)">
                    <rect
                      x="-40"
                      y="-10"
                      width="80"
                      height="16"
                      rx="8"
                      fill="#020617"
                      stroke="#334155"
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {location.flag} {location.city}
                    </text>
                  </g>

                  {/* Activity Counter Pill if present */}
                  {cityActs.length > 0 && (
                    <g transform="translate(12, -8)">
                      <circle r="7" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />
                      <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        {completedActs}/{cityActs.length}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Quick Legend Overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5 shadow-xl">
            <p className="font-bold text-white flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Leyenda del Mapa</span>
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Tramo Completado / Aterrizado</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Tramo En Vuelo (En Tránsito)</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
              <span>Tramo Programado Futuro</span>
            </div>
          </div>
        </div>
      )}

      {/* Sequential Flight Legs Timeline & Controls */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Tramos del Itinerario y Control de Estado</h3>
          </div>
          <span className="text-xs text-slate-400">
            Marca cada vuelo como <strong>"Realizado"</strong> a medida que avances en tu viaje
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripFlights.map((item, idx) => {
            const isCompleted = item.status === 'aterrizado';
            const isInFlight = item.status === 'en_vuelo' || item.status === 'embarcando';
            const isTrain = item.transportType === 'train';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md'
                    : isInFlight
                    ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Tramo Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-200 text-xs font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {isTrain ? '🚅 Tren' : '✈️ Vuelo'} {item.airline} {item.flightNumber}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isInFlight
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {isCompleted ? '🟢 Realizado' : isInFlight ? '🛫 En Vuelo' : '🕒 Programado'}
                  </span>
                </div>

                {/* Route Cities */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.departureCity} ({item.departureAirport.split(' ')[0]})</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500" />

                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.arrivalCity} ({item.arrivalAirport.split(' ')[0]})</span>
                  </div>
                </div>

                {/* Details line */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.departureTime.split('T')[0]} ({item.departureTime.split('T')[1]?.substring(0, 5)})</span>
                  </span>

                  {item.confirmationCode && (
                    <span className="font-mono text-slate-300">PNR: {item.confirmationCode}</span>
                  )}
                </div>

                {/* Toggle Status Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Cambiar Estado:</span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdateFlightStatus(item.id, 'aterrizado')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                        isCompleted
                          ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 hover:bg-emerald-950 text-emerald-400 border border-slate-700'
                      }`}
                      title="Marcar este tramo como completado/realizado"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Realizado 🛬</span>
                    </button>

                    <button
                      onClick={() => onUpdateFlightStatus(item.id, 'en_vuelo')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                        isInFlight
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 hover:bg-amber-950 text-amber-400 border border-slate-700'
                      }`}
                      title="Marcar como en vuelo / en tránsito"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>En Vuelo 🛫</span>
                    </button>

                    <button
                      onClick={() => onUpdateFlightStatus(item.id, 'programado')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        !isCompleted && !isInFlight
                          ? 'bg-cyan-600 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                      }`}
                      title="Marcar como programado futuro"
                    >
                      <span>Programado</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected City Activities & Details Sheet Modal */}
      {selectedCity && (() => {
        const cityData = cityMap.get(selectedCity);
        if (!cityData) return null;

        const { location, activities: cityActs, reservations: cityRes } = cityData;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{location.flag}</div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Destino: {location.city}, {location.country}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Actividades, hoteles y reservas asociadas a esta ubicación
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Activities Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Actividades en {location.city} ({cityActs.length})</span>
                </h4>

                {cityActs.length > 0 ? (
                  <div className="space-y-2">
                    {cityActs.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => onToggleActivity(act.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          act.completed
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={act.completed}
                            onChange={() => onToggleActivity(act.id)}
                            className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                          />
                          <div>
                            <p className={`text-xs font-bold ${act.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                              {act.title}
                            </p>
                            {act.startTime && (
                              <p className="text-[10px] text-slate-400">
                                🕒 {act.startTime} {act.location ? `• 📍 ${act.location}` : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            act.completed
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {act.completed ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800/60">
                    No hay actividades registradas específicamente para {location.city}.
                  </p>
                )}
              </div>

              {/* Reservations Section */}
              {cityRes.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>Hoteles y Reservas ({cityRes.length})</span>
                  </h4>

                  <div className="space-y-2">
                    {cityRes.map((res) => (
                      <div
                        key={res.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white">{res.title}</p>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {res.confirmationCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {res.provider} • Entrada: {res.checkIn} {res.checkOut ? `| Salida: ${res.checkOut}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedCity(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
