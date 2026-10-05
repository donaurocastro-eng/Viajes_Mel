import React, { useState } from 'react';
import { Trip, Activity, Flight, FlightStatus } from '../types';
import pacificMapImage from '../assets/images/pacific_route_map_illustrated_1787185092847.jpg';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle2, Circle, MessageSquare, Plus, Trash2, Tag, ArrowRight, Compass, Plane, Train, Car, Layers, ChevronDown, ChevronUp, ExternalLink, Globe } from 'lucide-react';

interface ItineraryViewProps {
  trip: Trip;
  activities: Activity[];
  flights?: Flight[];
  onToggleActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
  onAddActivity: () => void;
  onNotifyWhatsApp: (activity: Activity) => void;
  onUpdateFlightStatus?: (flightId: string, newStatus: FlightStatus) => void;
}

const ITINERARY_STAGES_QUICK = [
  { step: 1, flightId: 'flight-hn-1', from: 'Comayagua 🇭🇳', to: 'Houston 🇺🇸', type: 'flight', code: 'UA 527', date: '18-Ago', defaultStatus: 'Listo ✅' },
  { step: 2, flightId: 'flight-hn-2', from: 'Houston 🇺🇸', to: 'San Antonio 🇺🇸', type: 'flight', code: 'UA 1477', date: '18-Ago', defaultStatus: 'Listo ✅' },
  { step: 3, flightId: 'flight-jp-1', from: 'San Antonio 🇺🇸', to: 'San Francisco 🇺🇸', type: 'flight', code: 'UA 0790', date: '23-Ago', defaultStatus: 'Listo ✅' },
  { step: 4, flightId: 'flight-jp-2', from: 'San Francisco 🇺🇸', to: 'Osaka 🇯🇵', type: 'flight', code: 'UA 0035', date: '23-24 Ago', defaultStatus: '¡Llegada a Osaka / Hotel voco! 🛬' },
  { step: 5, flightId: 'flight-jp-3', from: 'Osaka 🇯🇵', to: 'Tokio 🇯🇵', type: 'train', code: 'Shinkansen', date: '28-Ago', defaultStatus: 'Programado 🚄' },
  { step: 6, flightId: 'flight-kr-1', from: 'Tokio 🇯🇵', to: 'Seúl 🇰🇷', type: 'flight', code: 'H1 9806', date: '01-Sep', defaultStatus: 'Programado ✈️' },
  { step: 7, flightId: 'flight-th-1', from: 'Seúl 🇰🇷', to: 'Bangkok 🇹🇭', type: 'flight', code: 'VZ 0851', date: '04-Sep', defaultStatus: 'Programado ✈️' },
];

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  activities,
  flights = [],
  onToggleActivity,
  onDeleteActivity,
  onAddActivity,
  onNotifyWhatsApp,
  onUpdateFlightStatus,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [showRouteStrip, setShowRouteStrip] = useState<boolean>(true);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(3); // Pacific crossing by default

  // Filter activities by tripId
  const tripActivities = activities.filter((a) => a.tripId === trip.id);

  // Filter by category if selected
  const filteredActivities = tripActivities.filter((a) => {
    if (selectedCategoryFilter === 'all') return true;
    return a.category === selectedCategoryFilter;
  });

  // Group activities by date
  const groupedByDate: Record<string, Activity[]> = {};
  filteredActivities.forEach((act) => {
    if (!groupedByDate[act.date]) {
      groupedByDate[act.date] = [];
    }
    groupedByDate[act.date].push(act);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedByDate).sort();

  const getCategoryBadge = (category: Activity['category']) => {
    switch (category) {
      case 'food':
        return { label: 'Gastronomía', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'sightseeing':
        return { label: 'Turismo', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'adventure':
        return { label: 'Aventura', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'culture':
        return { label: 'Cultura', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'relaxation':
        return { label: 'Relax', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'shopping':
        return { label: 'Compras', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      default:
        return { label: 'Tránsito', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Route & Stages Visual Map Banner (Always Visible) */}
      <div className="bg-slate-900 rounded-2xl border border-cyan-500/40 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-xl text-slate-950 font-black shadow-md shadow-cyan-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                <span>Ruta y Trayectos de la Travesía</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  7 ETAPAS
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Honduras 🇭🇳 ➔ EE.UU. 🇺🇸 ➔ Japón 🇯🇵 (Osaka/Tokio) ➔ Seúl 🇰🇷 ➔ Bangkok 🇹🇭
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRouteStrip(!showRouteStrip)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <span>{showRouteStrip ? 'Ocultar Mapa' : 'Ver Mapa'}</span>
            {showRouteStrip ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showRouteStrip && (
          <div className="pt-2 border-t border-slate-800 space-y-3">
            {/* Stages Step Timeline Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {ITINERARY_STAGES_QUICK.map((stg, i) => {
                const isSelected = selectedStageIdx === i;
                const matchFlight = flights.find(f => f.id === stg.flightId);
                const isCompleted = matchFlight?.status === 'aterrizado' || (!matchFlight && (stg.step <= 4));
                const isInFlight = matchFlight?.status === 'en_vuelo' || matchFlight?.status === 'embarcando';
                
                const statusLabel = isCompleted 
                  ? 'Realizado ✅' 
                  : isInFlight 
                  ? 'En Vuelo 🛫' 
                  : matchFlight?.status === 'retrasado' 
                  ? 'Retrasado ⏱️' 
                  : 'Programado';

                return (
                  <button
                    key={stg.step}
                    onClick={() => setSelectedStageIdx(i)}
                    className={`p-2 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md scale-102'
                        : isCompleted
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-80 mb-0.5">
                      <span>Tramo #{stg.step}</span>
                      <span>{stg.date}</span>
                    </div>
                    <div className="text-xs font-bold truncate">
                      {stg.from.split(' ')[0]} ➔ {stg.to.split(' ')[0]}
                    </div>
                    <div className="text-[10px] mt-1 flex items-center justify-between opacity-90 font-mono">
                      <span>{stg.code}</span>
                      <span className={isSelected ? 'text-slate-950 font-black' : isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-400 font-semibold'}>
                        {statusLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visual Cartographic Map of Pacific Route with Trajectories */}
            <div className="relative w-full h-56 sm:h-72 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src={pacificMapImage}
                alt="Mapa de Rutas del Pacífico (Honduras - EE.UU. - Japón - Corea - Tailandia)"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />
              
              {/* Map Floating Badges & Legend */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">Trayectoria Transpacífica: En Osaka / Hotel voco 🏨🇯🇵</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] text-slate-300 font-mono">
                  <span>🇭🇳 Comayagua ➔ 🇺🇸 Houston ➔ 🇺🇸 SFO ➔ 🇯🇵 Osaka (Llegada) ➔ Tokio ➔ Seúl ➔ Bangkok</span>
                </div>
              </div>
            </div>

            {/* Quick Detail Pill of Selected Stage */}
            {ITINERARY_STAGES_QUICK[selectedStageIdx] && (() => {
              const currentStg = ITINERARY_STAGES_QUICK[selectedStageIdx];
              const matchFlight = flights.find(f => f.id === currentStg.flightId);
              const isDone = matchFlight?.status === 'aterrizado';

              return (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-cyan-400 border border-slate-800">
                      {currentStg.type === 'train' ? (
                        <Train className="w-4 h-4 text-amber-400" />
                      ) : currentStg.type === 'ground' ? (
                        <Car className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Plane className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center space-x-2">
                        <span>{currentStg.from}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span>{currentStg.to}</span>
                        <span className="text-cyan-400 font-mono text-[11px]">[{currentStg.code}]</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span>Fecha: {currentStg.date} 2026</span>
                        <span>•</span>
                        <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                          Estado: {isDone ? 'Realizado / Llegada Exitosa 🛬' : (matchFlight?.status || currentStg.defaultStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {onUpdateFlightStatus && currentStg.flightId && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus: FlightStatus = isDone ? 'programado' : 'aterrizado';
                          onUpdateFlightStatus(currentStg.flightId, nextStatus);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-900 hover:bg-emerald-950 text-emerald-300 border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Tramo Realizado ✅' : 'Marcar como Realizado'}</span>
                      </button>
                    )}

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                        currentStg.from
                      )}&destination=${encodeURIComponent(currentStg.to)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Category Filter & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Itinerario Día a Día</span>
          </h2>
          <p className="text-xs text-slate-400">
            Cronograma organizado por fecha para {trip.destination}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium">Filtrar:</span>
          {['all', 'sightseeing', 'food', 'culture', 'adventure', 'relaxation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border transition-colors whitespace-nowrap ${
                selectedCategoryFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
          <button
            onClick={onAddActivity}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {sortedDates.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No hay actividades en el itinerario</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Comienza a construir tu cronograma agregando actividades manualmente o generando el plan automáticamente con IA.
          </p>
          <button
            onClick={onAddActivity}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Primera Actividad</span>
          </button>
        </div>
      )}

      {/* Days Timeline */}
      <div className="space-y-8">
        {sortedDates.map((dateStr, dateIdx) => {
          const dayActivities = groupedByDate[dateStr];
          return (
            <div key={dateStr} className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-4">
              
              {/* Day Marker */}
              <div className="absolute -left-3.5 sm:-left-4 top-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-extrabold text-xs shadow-md">
                {dateIdx + 1}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <span>Día {dateIdx + 1}:</span>
                  <span className="text-emerald-400">{dateStr}</span>
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                  {dayActivities.length} Actividades
                </span>
              </div>

              {/* Day Activities List */}
              <div className="grid gap-3">
                {dayActivities.map((act) => {
                  const badge = getCategoryBadge(act.category);
                  return (
                    <div
                      key={act.id}
                      className={`p-4 rounded-xl border transition-all ${
                        act.completed
                          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        
                        {/* Checkbox & Details */}
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => onToggleActivity(act.id)}
                            className="mt-1 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
                            title={act.completed ? 'Marcar incompleta' : 'Marcar completada'}
                          >
                            {act.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.bg}`}>
                                {badge.label}
                              </span>
                              {act.startTime && (
                                <span className="flex items-center space-x-1 text-xs text-slate-400 font-medium bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  <span>{act.startTime} {act.endTime ? `- ${act.endTime}` : ''}</span>
                                </span>
                              )}
                              {act.cost ? (
                                <span className="flex items-center space-x-0.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  <span>{act.cost} {trip.currency}</span>
                                </span>
                              ) : null}
                            </div>

                            <h4 className={`text-sm sm:text-base font-semibold ${act.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {act.title}
                            </h4>

                            {act.description && (
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {act.description}
                              </p>
                            )}

                            {act.location && (
                              <div className="flex items-center space-x-1 text-xs text-slate-400 pt-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                <span>{act.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => onNotifyWhatsApp(act)}
                            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                            title="Enviar alerta de esta actividad a WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden md:inline">Notificar WA</span>
                          </button>

                          <button
                            onClick={() => onDeleteActivity(act.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Eliminar actividad"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
