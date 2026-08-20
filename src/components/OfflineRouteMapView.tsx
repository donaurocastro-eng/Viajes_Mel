import React, { useState } from 'react';
import { Flight, Activity, Reservation } from '../types';
import {
  Plane,
  Train,
  Car,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Navigation,
  ChevronRight,
  CheckCircle2,
  Hotel,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Map as MapIcon,
  Tag,
  DollarSign
} from 'lucide-react';

interface OfflineRouteMapViewProps {
  flights: Flight[];
  activities: Activity[];
  reservations: Reservation[];
  selectedCity?: string | null;
  onSelectCity?: (city: string) => void;
}

export interface LegNode {
  step: number;
  id: string;
  from: string;
  fromCode: string;
  fromFlag: string;
  to: string;
  toCode: string;
  toFlag: string;
  type: 'flight' | 'train' | 'ground' | 'transpacific';
  transportName: string;
  transportCode: string;
  duration?: string;
  departureDate: string;
  arrivalDate?: string;
  status: 'completado' | 'en_curso' | 'programado';
  notes: string;
  region: 'Centroamérica' | 'Norteamérica' | 'Asia' | 'Intercontinental';
  // Offline Visual Coordinates in schematic map (0-100%)
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

const ITINERARY_LEGS: LegNode[] = [
  {
    step: 1,
    id: 'leg-1',
    from: 'Comayagua (Palmerola)',
    fromCode: 'XPL',
    fromFlag: '🇭🇳',
    to: 'Houston, Texas',
    toCode: 'IAH',
    toFlag: '🇺🇸',
    type: 'flight',
    transportName: 'United Airlines / Spirit',
    transportCode: 'UA 1450',
    duration: '3h 15m',
    departureDate: '2026-09-01',
    status: 'completado',
    notes: 'Salida desde Honduras hacia Hub de conexión en Texas.',
    region: 'Centroamérica',
    fromPos: { x: 18, y: 76 },
    toPos: { x: 26, y: 52 },
  },
  {
    step: 2,
    id: 'leg-2',
    from: 'Houston, Texas',
    fromCode: 'IAH',
    fromFlag: '🇺🇸',
    to: 'San Antonio, Texas',
    toCode: 'SAT',
    toFlag: '🇺🇸',
    type: 'ground',
    transportName: 'Traslado Terrestre / Auto',
    transportCode: 'I-10 W',
    duration: '3h 00m',
    departureDate: '2026-09-02',
    status: 'completado',
    notes: 'Traslado local por autopista interestatal y estancia en Texas.',
    region: 'Norteamérica',
    fromPos: { x: 26, y: 52 },
    toPos: { x: 24, y: 56 },
  },
  {
    step: 3,
    id: 'leg-3',
    from: 'San Antonio / Houston',
    fromCode: 'SAT / IAH',
    fromFlag: '🇺🇸',
    to: 'San Francisco, California',
    toCode: 'SFO',
    toFlag: '🇺🇸',
    type: 'flight',
    transportName: 'United Airlines',
    transportCode: 'UA 388',
    duration: '4h 10m',
    departureDate: '2026-09-04',
    status: 'completado',
    notes: 'Vuelo de costa a costa hacia la puerta de salida al Pacífico.',
    region: 'Norteamérica',
    fromPos: { x: 24, y: 56 },
    toPos: { x: 14, y: 38 },
  },
  {
    step: 4,
    id: 'leg-4',
    from: 'San Francisco (SFO)',
    fromCode: 'SFO',
    fromFlag: '🇺🇸',
    to: 'Osaka (Kansai)',
    toCode: 'KIX',
    toFlag: '🇯🇵',
    type: 'transpacific',
    transportName: 'All Nippon Airways / United',
    transportCode: 'NH 007 / UA 885',
    duration: '11h 45m',
    departureDate: '2026-09-05',
    status: 'en_curso',
    notes: 'Cruce del Océano Pacífico (Línea Internacional de Cambio de Fecha).',
    region: 'Intercontinental',
    fromPos: { x: 14, y: 38 },
    toPos: { x: 74, y: 44 },
  },
  {
    step: 5,
    id: 'leg-5',
    from: 'Osaka / Kioto',
    fromCode: 'KIX / Shin-Osaka',
    fromFlag: '🇯🇵',
    to: 'Tokio (Estación Central)',
    toCode: 'HND / Tokyo St.',
    toFlag: '🇯🇵',
    type: 'train',
    transportName: 'Shinkansen Nozomi (Tren Bala)',
    transportCode: 'JR Tokaido',
    duration: '2h 25m',
    departureDate: '2026-09-10',
    status: 'programado',
    notes: 'Trayecto de alta velocidad pasando por el Monte Fuji (320 km/h).',
    region: 'Asia',
    fromPos: { x: 74, y: 44 },
    toPos: { x: 80, y: 40 },
  },
  {
    step: 6,
    id: 'leg-6',
    from: 'Tokio (Haneda / Narita)',
    fromCode: 'HND / NRT',
    fromFlag: '🇯🇵',
    to: 'Seúl (Incheon)',
    toCode: 'ICN',
    toFlag: '🇰🇷',
    type: 'flight',
    transportName: 'Korean Air / Asiana',
    transportCode: 'KE 704',
    duration: '2h 35m',
    departureDate: '2026-09-15',
    status: 'programado',
    notes: 'Salto internacional a Corea del Sur.',
    region: 'Asia',
    fromPos: { x: 80, y: 40 },
    toPos: { x: 70, y: 36 },
  },
  {
    step: 7,
    id: 'leg-7',
    from: 'Seúl (Incheon)',
    fromCode: 'ICN',
    fromFlag: '🇰🇷',
    to: 'Bangkok (Suvarnabhumi)',
    toCode: 'BKK',
    toFlag: '🇹🇭',
    type: 'flight',
    transportName: 'Thai Airways / Korean Air',
    transportCode: 'TG 659',
    duration: '5h 40m',
    departureDate: '2026-09-20',
    status: 'programado',
    notes: 'Vuelo hacia el Sudeste Asiático (Tailandia).',
    region: 'Asia',
    fromPos: { x: 70, y: 36 },
    toPos: { x: 62, y: 72 },
  },
];

const DESTINATIONS_CATALOG = [
  { id: 'comayagua', name: 'Comayagua', flag: '🇭🇳', country: 'Honduras', tag: 'Origen' },
  { id: 'houston', name: 'Houston', flag: '🇺🇸', country: 'EE.UU.', tag: 'Conexión' },
  { id: 'san_antonio', name: 'San Antonio', flag: '🇺🇸', country: 'EE.UU.', tag: 'Escala' },
  { id: 'san_francisco', name: 'San Francisco', flag: '🇺🇸', country: 'EE.UU.', tag: 'Salida Pacífico' },
  { id: 'osaka', name: 'Osaka / Kioto', flag: '🇯🇵', country: 'Japón', tag: 'Llegada Asia' },
  { id: 'tokyo', name: 'Tokio', flag: '🇯🇵', country: 'Japón', tag: 'Metrópolis' },
  { id: 'seoul', name: 'Seúl', flag: '🇰🇷', country: 'Corea del Sur', tag: 'Destino' },
  { id: 'bangkok', name: 'Bangkok', flag: '🇹🇭', country: 'Tailandia', tag: 'Sudeste Asiático' },
];

export const OfflineRouteMapView: React.FC<OfflineRouteMapViewProps> = ({
  flights,
  activities,
  reservations,
  selectedCity,
  onSelectCity,
}) => {
  const [selectedLegIndex, setSelectedLegIndex] = useState<number>(3); // Pacific flight selected by default
  const [filterRegion, setFilterRegion] = useState<string>('todos');

  const currentLeg = ITINERARY_LEGS[selectedLegIndex] || ITINERARY_LEGS[0];

  const filteredLegs =
    filterRegion === 'todos'
      ? ITINERARY_LEGS
      : ITINERARY_LEGS.filter((l) => l.region.toLowerCase() === filterRegion.toLowerCase());

  const getCityActivities = (cityName: string) => {
    return activities.filter((a) => (a.location || '').toLowerCase().includes(cityName.toLowerCase()) || (a.title || '').toLowerCase().includes(cityName.toLowerCase()));
  };

  const getCityReservations = (cityName: string) => {
    return reservations.filter((r) => (r.address || '').toLowerCase().includes(cityName.toLowerCase()) || (r.title || '').toLowerCase().includes(cityName.toLowerCase()));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl border border-cyan-500/30 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-500 rounded-2xl text-slate-950 font-black shadow-lg shadow-cyan-500/20">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-white">Mapa de Ruta & Trayectos por Etapas</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  7 TRAMOS DEFINIDOS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualización garantizada de todos los destinos y tramos (Honduras ➔ EE.UU. ➔ Japón ➔ Corea ➔ Tailandia)
              </p>
            </div>
          </div>

          {/* Region Filters */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['todos', 'Centroamérica', 'Norteamérica', 'Intercontinental', 'Asia'].map((reg) => (
              <button
                key={reg}
                onClick={() => setFilterRegion(reg)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                  filterRegion === reg
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {reg === 'todos' ? '🌐 Todos los Tramos' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Quick Chips Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Escalas & Destinos:</span>
          {DESTINATIONS_CATALOG.map((dest, i) => (
            <div
              key={dest.id}
              className="flex items-center space-x-1.5 px-3 py-1 bg-slate-950/80 border border-slate-800 rounded-full text-xs font-bold text-slate-200 shrink-0"
            >
              <span>{dest.flag}</span>
              <span>{dest.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono">#{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Main View: Interactive Graphical Schematic Map + Selected Leg Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Schematic Map Canvas (100% Reliable Offline/Vector) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-4 flex flex-col justify-between min-h-[460px]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>DIAGRAMA CARTOGRÁFICO DE TRAYECTOS</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Toca un tramo o nodo para inspeccionar</span>
          </div>

          {/* Schematic SVG Stage */}
          <div className="relative w-full h-[360px] bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden">
            {/* Background Grid Pattern */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 500" preserveAspectRatio="none">
              <defs>
                <pattern id="grid-pattern-offline" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="1000" height="500" fill="url(#grid-pattern-offline)" />

              {/* Continents Silhouettes */}
              <g fill="#1e293b" opacity="0.35" stroke="#334155" strokeWidth="1">
                {/* Americas */}
                <path d="M 120 80 L 180 70 L 260 110 L 290 180 L 240 290 L 180 220 L 110 130 Z" />
                <path d="M 180 290 L 210 320 L 220 370 L 190 380 Z" fill="#0284c7" opacity="0.6" />
                {/* Asia */}
                <path d="M 600 90 L 850 70 L 920 180 L 800 320 L 640 270 Z" />
                <path d="M 800 180 Q 840 190 820 240" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Render Flight Route Connections */}
              {ITINERARY_LEGS.map((leg, idx) => {
                const isSelected = selectedLegIndex === idx;
                const x1 = leg.fromPos.x * 10;
                const y1 = leg.fromPos.y * 5;
                const x2 = leg.toPos.x * 10;
                const y2 = leg.toPos.y * 5;

                // Great curve calculation
                const midX = (x1 + x2) / 2;
                const isTranspacific = leg.type === 'transpacific';
                const midY = isTranspacific ? 60 : Math.min(y1, y2) - 30;

                const pathD = `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;

                const strokeColor =
                  leg.status === 'completado'
                    ? '#10b981'
                    : leg.status === 'en_curso'
                    ? '#f59e0b'
                    : '#0284c7';

                return (
                  <g key={leg.id} className="cursor-pointer" onClick={() => setSelectedLegIndex(idx)}>
                    {/* Glow outline on selection */}
                    {isSelected && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="8"
                        opacity="0.5"
                        strokeLinecap="round"
                      />
                    )}
                    {/* Main Line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3.5 : 2}
                      strokeDasharray={leg.type === 'ground' ? '4 4' : isSelected ? 'none' : '6 4'}
                    />
                    {/* Midpoint Step Number Pill */}
                    <circle cx={midX} cy={midY} r={10} fill="#0f172a" stroke={strokeColor} strokeWidth="2" />
                    <text x={midX} y={midY + 3.5} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      {leg.step}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* City Pin Overlays on the Schematic Map */}
            {DESTINATIONS_CATALOG.map((city, idx) => {
              // Find matching coordinates
              const matchingLeg = ITINERARY_LEGS.find(
                (l) =>
                  l.from.toLowerCase().includes(city.id) ||
                  l.to.toLowerCase().includes(city.id) ||
                  l.from.toLowerCase().includes(city.name.toLowerCase()) ||
                  l.to.toLowerCase().includes(city.name.toLowerCase())
              );

              const pos = matchingLeg
                ? matchingLeg.from.toLowerCase().includes(city.name.toLowerCase())
                  ? matchingLeg.fromPos
                  : matchingLeg.toPos
                : { x: 50, y: 50 };

              const acts = getCityActivities(city.name);

              return (
                <div
                  key={city.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-bold text-white shadow-xl whitespace-nowrap">
                    <span>{city.flag}</span>
                    <span>{city.name.split('/')[0]}</span>
                    {acts.length > 0 && (
                      <span className="bg-emerald-500 text-slate-950 px-1 rounded-full text-[8px] font-black">
                        {acts.length}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Realizado</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                <span>En Tránsito</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                <span>Programado</span>
              </span>
            </div>
            <span className="text-slate-500">100% Funcional y sin depender de conexión a internet</span>
          </div>
        </div>

        {/* Right Column: Interactive Details of the Selected Leg */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs">
                  TRAMO #{currentLeg.step}
                </span>
                <span className="text-xs font-bold text-slate-400 capitalize">{currentLeg.region}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  currentLeg.status === 'completado'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentLeg.status === 'en_curso'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {currentLeg.status.toUpperCase()}
              </span>
            </div>

            {/* Route Departure -> Arrival Display */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-white flex items-center space-x-1.5">
                    <span>{currentLeg.fromFlag}</span>
                    <span>{currentLeg.fromCode}</span>
                  </div>
                  <div className="text-xs text-slate-400">{currentLeg.from}</div>
                </div>

                <div className="flex flex-col items-center px-3">
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">{currentLeg.duration}</span>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 my-1 relative">
                    {currentLeg.type === 'train' ? (
                      <Train className="w-3.5 h-3.5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    ) : currentLeg.type === 'ground' ? (
                      <Car className="w-3.5 h-3.5 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    ) : (
                      <Plane className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono">{currentLeg.type}</span>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-white flex items-center justify-end space-x-1.5">
                    <span>{currentLeg.toCode}</span>
                    <span>{currentLeg.toFlag}</span>
                  </div>
                  <div className="text-xs text-slate-400">{currentLeg.to}</div>
                </div>
              </div>

              {/* Transport info */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold text-white">{currentLeg.transportName}</span>
                <span className="font-mono text-cyan-300 font-bold">{currentLeg.transportCode}</span>
              </div>
            </div>

            {/* Notes & Itinerary Info */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fecha: {currentLeg.departureDate}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{currentLeg.notes}</p>
            </div>

            {/* Google Maps External Direct Link */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                currentLeg.from
              )}&destination=${encodeURIComponent(currentLeg.to)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Navegación en Google Maps</span>
            </a>
          </div>

          {/* Sequential Leg Carousel Selector */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Seleccionar otro tramo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredLegs.map((l, i) => {
                const originalIndex = ITINERARY_LEGS.findIndex((leg) => leg.id === l.id);
                const isSelected = selectedLegIndex === originalIndex;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLegIndex(originalIndex)}
                    className={`p-2 rounded-xl text-left text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>#{l.step}</span>
                      <span>{l.fromFlag}➔{l.toFlag}</span>
                    </div>
                    <div className="text-[10px] truncate opacity-90">{l.to.split(',')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
