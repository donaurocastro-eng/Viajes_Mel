import React, { useState } from 'react';
import { Flight, Activity, Reservation } from '../types';
import { Plane, MapPin, ExternalLink, Compass, Navigation, Calendar, Hotel, CheckCircle2, Clock } from 'lucide-react';

interface VisualMapViewProps {
  flights: Flight[];
  activities: Activity[];
  reservations: Reservation[];
  selectedCity?: string | null;
  onSelectCity?: (city: string) => void;
}

interface DestinationNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  code: string;
  role: 'origin' | 'transit' | 'asia_hub';
  lat: number;
  lng: number;
  xPercent: number; // 0 to 100 on visual globe map
  yPercent: number; // 0 to 100 on visual globe map
}

const DESTINATION_NODES: DestinationNode[] = [
  { id: 'comayagua', name: 'Comayagua / Tegucigalpa', country: 'Honduras', flag: '🇭🇳', code: 'XPL / TGU', role: 'origin', lat: 14.38, lng: -87.62, xPercent: 24, yPercent: 62 },
  { id: 'houston', name: 'Houston, Texas', country: 'EE.UU.', flag: '🇺🇸', code: 'IAH', role: 'transit', lat: 29.99, lng: -95.34, xPercent: 22, yPercent: 44 },
  { id: 'san_antonio', name: 'San Antonio, Texas', country: 'EE.UU.', flag: '🇺🇸', code: 'SAT', role: 'transit', lat: 29.53, lng: -98.47, xPercent: 20, yPercent: 46 },
  { id: 'san_francisco', name: 'San Francisco, California', country: 'EE.UU.', flag: '🇺🇸', code: 'SFO', role: 'transit', lat: 37.62, lng: -122.38, xPercent: 14, yPercent: 36 },
  { id: 'osaka', name: 'Osaka / Kioto', country: 'Japón', flag: '🇯🇵', code: 'KIX', role: 'asia_hub', lat: 34.43, lng: 135.23, xPercent: 82, yPercent: 40 },
  { id: 'tokyo', name: 'Tokio', country: 'Japón', flag: '🇯🇵', code: 'HND / NRT', role: 'asia_hub', lat: 35.55, lng: 139.78, xPercent: 86, yPercent: 38 },
  { id: 'seoul', name: 'Seúl', country: 'Corea del Sur', flag: '🇰🇷', code: 'ICN', role: 'asia_hub', lat: 37.46, lng: 126.44, xPercent: 78, yPercent: 36 },
  { id: 'bangkok', name: 'Bangkok', country: 'Tailandia', flag: '🇹🇭', code: 'BKK', role: 'asia_hub', lat: 13.69, lng: 100.75, xPercent: 74, yPercent: 64 },
];

export const VisualMapView: React.FC<VisualMapViewProps> = ({
  flights,
  activities,
  reservations,
  selectedCity: controlledCity,
  onSelectCity,
}) => {
  const [internalSelectedCity, setInternalSelectedCity] = useState<string>('osaka');
  const [activeTab, setActiveTab] = useState<'map' | 'osm_embed' | 'satellite'>('map');

  const currentSelectedId = controlledCity?.toLowerCase() || internalSelectedCity;
  const activeNode = DESTINATION_NODES.find((d) => d.id === currentSelectedId || d.name.toLowerCase().includes(currentSelectedId)) || DESTINATION_NODES[4]; // Osaka default

  const handleSelect = (nodeId: string) => {
    setInternalSelectedCity(nodeId);
    if (onSelectCity) onSelectCity(nodeId);
  };

  const getCityActivities = (node: DestinationNode) => {
    return activities.filter(
      (a) =>
        (a.location || '').toLowerCase().includes(node.name.toLowerCase()) ||
        (a.title || '').toLowerCase().includes(node.name.toLowerCase()) ||
        (a.location || '').toLowerCase().includes(node.id) ||
        (a.title || '').toLowerCase().includes(node.id)
    );
  };

  const getCityReservations = (node: DestinationNode) => {
    return reservations.filter(
      (r) =>
        (r.address || '').toLowerCase().includes(node.name.toLowerCase()) ||
        (r.title || '').toLowerCase().includes(node.name.toLowerCase()) ||
        (r.address || '').toLowerCase().includes(node.id) ||
        (r.title || '').toLowerCase().includes(node.id)
    );
  };

  return (
    <div className="space-y-4">
      {/* Map Header Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-xl text-slate-950 font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Visualizador Cartográfico de Rutas</h3>
            <p className="text-[11px] text-slate-400">Ruta Intercontinental Honduras ➔ EE.UU. ➔ Asia</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'map'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🗺️ Mapa Visual de Ruta</span>
          </button>
          <button
            onClick={() => setActiveTab('osm_embed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'osm_embed'
                ? 'bg-emerald-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌍 Vista Callejera OpenStreetMap</span>
          </button>
          <button
            onClick={() => setActiveTab('satellite')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'satellite'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🛰️ Satélite / Google Maps</span>
          </button>
        </div>
      </div>

      {/* Main Container by Active Tab */}
      {activeTab === 'map' && (
        <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl p-4 sm:p-6 space-y-6">
          {/* Top Quick Cities Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0">Destinos:</span>
            {DESTINATION_NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              const acts = getCityActivities(node);
              return (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25 font-black scale-105'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span>{node.flag}</span>
                  <span>{node.name.split('/')[0]}</span>
                  {acts.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {acts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive World Vector Grid Stage */}
          <div className="relative w-full h-[420px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden select-none">
            {/* World Grid & Continents SVG Layer */}
            <svg className="w-full h-full absolute inset-0 opacity-85" viewBox="0 0 1000 500" preserveAspectRatio="none">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" opacity="0.6" />
                </pattern>
                <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              <rect width="1000" height="500" fill="url(#grid-pattern)" />

              {/* Simplified Continents Silhouette Backdrops */}
              <g fill="#1e293b" opacity="0.45" stroke="#334155" strokeWidth="1">
                {/* North America */}
                <path d="M 100 80 L 160 60 L 250 90 L 300 160 L 260 250 L 210 240 L 160 180 L 90 120 Z" />
                {/* Central America & Honduras */}
                <path d="M 210 240 L 250 255 L 265 280 L 235 295 L 215 260 Z" fill="#0284c7" opacity="0.7" />
                {/* Asia & Japan */}
                <path d="M 620 90 L 850 70 L 930 190 L 820 310 L 670 260 Z" />
                {/* Japan Archipelagos */}
                <path d="M 830 180 Q 860 190 850 230" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Flight Arcs Connected between Real Points */}
              {/* Honduras ➔ Houston */}
              <path d="M 240 310 Q 230 250 220 220" fill="none" stroke="url(#route-gradient)" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.8" />
              {/* Houston ➔ San Francisco */}
              <path d="M 220 220 Q 180 200 140 180" fill="none" stroke="url(#route-gradient)" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.8" />
              {/* San Francisco ➔ Osaka (Transpacific Great Circle Arc) */}
              <path d="M 140 180 Q 480 60 820 200" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.9" />
              {/* Osaka ➔ Tokyo (Shinkansen Bullet Train Route) */}
              <path d="M 820 200 L 860 190" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
              {/* Tokyo ➔ Seoul */}
              <path d="M 860 190 Q 820 170 780 180" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" />
              {/* Seoul ➔ Bangkok */}
              <path d="M 780 180 Q 760 250 740 320" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>

            {/* Interactive City Pin Overlays */}
            {DESTINATION_NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              const acts = getCityActivities(node);

              return (
                <div
                  key={node.id}
                  onClick={() => handleSelect(node.id)}
                  style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Ping Animation on Active Selection */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-cyan-400 animate-ping opacity-60 pointer-events-none" />
                  )}

                  <div
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-2xl transition-all transform ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 scale-110'
                        : 'bg-slate-950/90 text-white border border-slate-700 group-hover:scale-105 group-hover:border-cyan-400'
                    }`}
                  >
                    <span className="text-sm">{node.flag}</span>
                    <span className="font-sans whitespace-nowrap">{node.name.split('/')[0]}</span>
                    {acts.length > 0 && (
                      <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[9px] font-black">
                        {acts.length}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Flight HUD Legend in Corner */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[11px] space-y-1 shadow-2xl z-30">
              <div className="font-bold text-white flex items-center space-x-1.5 mb-1">
                <Plane className="w-3.5 h-3.5 text-cyan-400 transform -rotate-45" />
                <span>Rutas del Itinerario Asia 2026</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                <span>Transpacífico: SFO ✈️ KIX (Osaka)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="w-3 h-1 bg-amber-400 rounded-full" />
                <span>Shinkansen Tren Bala: Osaka 🚅 Tokio</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                <span>Vuelos Internacionales y Conexiones</span>
              </div>
            </div>
          </div>

          {/* Active Node Detail Card */}
          <div className="bg-slate-900 rounded-2xl border border-cyan-500/30 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{activeNode.flag}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-black text-white">{activeNode.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {activeNode.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">País: {activeNode.country} • Coordenadas: {activeNode.lat}°N, {activeNode.lng}°E</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('osm_embed')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1 shadow-md transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ver en Mapa Callejero</span>
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeNode.name + ' ' + activeNode.country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Maps GPS</span>
                </a>
              </div>
            </div>

            {/* Details Grid: Activities & Reservations for selected city */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Activities */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Actividades en {activeNode.name.split('/')[0]} ({getCityActivities(activeNode).length})</span>
                </h5>
                {getCityActivities(activeNode).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No hay actividades registradas en esta ciudad aún.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {getCityActivities(activeNode).map((act) => (
                      <div key={act.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-start justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{act.title}</div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{act.date} • {act.startTime}</span>
                            {act.cost ? <span className="text-emerald-400 font-bold">${act.cost}</span> : null}
                          </div>
                        </div>
                        {act.completed ? (
                          <span className="text-emerald-400 text-xs">✓ Hecho</span>
                        ) : (
                          <span className="text-amber-400 text-xs">⏳ Pendiente</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reservations */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-purple-400 flex items-center space-x-1.5 uppercase">
                  <Hotel className="w-3.5 h-3.5" />
                  <span>Hospedajes / Hoteles ({getCityReservations(activeNode).length})</span>
                </h5>
                {getCityReservations(activeNode).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No hay hoteles o reservas registradas en este destino.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {getCityReservations(activeNode).map((res) => (
                      <div key={res.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{res.title}</span>
                          <span className="font-mono text-purple-300 font-bold">{res.confirmationCode}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{res.address}</p>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                          <span>Check-in: <strong>{res.checkIn}</strong></span>
                          <span>Check-out: <strong>{res.checkOut}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Street Map View (OpenStreetMap IFrame) */}
      {activeTab === 'osm_embed' && (
        <div className="bg-slate-950 rounded-3xl border border-emerald-500/40 p-5 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Explorador Callejero: {activeNode.name} ({activeNode.country})</span>
              </h4>
              <p className="text-xs text-slate-400">
                Visualización instantánea con OpenStreetMap (sin bloqueos de API ni claves)
              </p>
            </div>

            {/* Quick selector inside OpenStreetMap */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {DESTINATION_NODES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelect(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeNode.id === d.id
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.flag} {d.name.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* OpenStreetMap Direct Embed Box */}
          <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-900">
            <iframe
              title={`Mapa de ${activeNode.name}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeNode.lng - 0.08}%2C${activeNode.lat - 0.06}%2C${activeNode.lng + 0.08}%2C${activeNode.lat + 0.06}&layer=mapnik&marker=${activeNode.lat}%2C${activeNode.lng}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>📍 Coordenadas activas: <strong>{activeNode.lat}, {activeNode.lng}</strong></span>
            <a
              href={`https://www.openstreetmap.org/?mlat=${activeNode.lat}&mlon=${activeNode.lng}#map=14/${activeNode.lat}/${activeNode.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-bold flex items-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver pantalla completa en OSM ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Satellite / Google Maps Tab */}
      {activeTab === 'satellite' && (
        <div className="bg-slate-950 rounded-3xl border border-purple-500/40 p-5 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Explorador Satelital y Google Maps: {activeNode.name}</span>
              </h4>
              <p className="text-xs text-slate-400">
                Atracciones turísticas, estaciones de metro y navegación paso a paso
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {DESTINATION_NODES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelect(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeNode.id === d.id
                      ? 'bg-purple-500 text-white font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.flag} {d.name.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-900">
            <iframe
              title={`Google Map Satelite ${activeNode.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(activeNode.name + ', ' + activeNode.country)}&t=m&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400">
              ¿Quieres indicaciones en tiempo real con transporte público y trenes?
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeNode.name + ', ' + activeNode.country)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/25 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir App de Google Maps 📲</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
