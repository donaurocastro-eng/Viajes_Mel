import React, { useState } from 'react';
import { Trip, Flight, Reservation, Activity } from '../types';
import { Plane, Hotel, Calendar, Users, MapPin, DollarSign, Tag, ArrowRight, Plus, Search, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface TripsMenuViewProps {
  trips: Trip[];
  activeTripId: string;
  flights: Flight[];
  reservations: Reservation[];
  activities: Activity[];
  onSelectTrip: (trip: Trip, tab?: string) => void;
  onOpenNewTripModal: () => void;
  onOpenAiPlanner: () => void;
}

export const TripsMenuView: React.FC<TripsMenuViewProps> = ({
  trips,
  activeTripId,
  flights,
  reservations,
  activities,
  onSelectTrip,
  onOpenNewTripModal,
  onOpenAiPlanner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.code && trip.code.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && trip.status === statusFilter;
  });

  const getTripStats = (tripId: string) => {
    const tripFlights = flights.filter((f) => f.tripId === tripId);
    const tripRes = reservations.filter((r) => r.tripId === tripId);
    const tripActs = activities.filter((a) => a.tripId === tripId);
    return {
      flightsCount: tripFlights.length,
      reservationsCount: tripRes.length,
      activitiesCount: tripActs.length,
    };
  };

  const formatDates = (start: string, end: string) => {
    if (!start || !end) return 'Fechas por definir';
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${s.getDate()} ${months[s.getMonth()]} - ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                Menú Principal de Viajes
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {trips.length} {trips.length === 1 ? 'Proyecto' : 'Proyectos de Viaje'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Catálogo y Galería de Viajes
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Organiza tus proyectos de vacaciones mediante nomenclatura estándar (Código de Viaje, Viajeros, Itinerarios y Reservaciones). Selecciona un viaje para ingresar a su consola central.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewTripModal}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>+ Crear Nuevo Viaje</span>
            </button>

            <button
              onClick={onOpenAiPlanner}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Generar con IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej: VAC-001), título o destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'upcoming', label: 'Próximos' },
            { id: 'planning', label: 'En Planificación' },
            { id: 'completed', label: 'Completados' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                statusFilter === btn.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Trip Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => {
          const stats = getTripStats(trip.id);
          const isActive = trip.id === activeTripId;

          return (
            <div
              key={trip.id}
              className={`group relative bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-500/80 shadow-2xl shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
              }`}
            >
              {/* Cover Image Header */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                <img
                  src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                  alt={trip.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Code Pill Badges on Top */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/60 font-mono text-cyan-300 text-xs font-extrabold shadow-lg flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>{trip.code || 'VAC-001'}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-bold">
                    👥 {trip.travelersCount || 1} {trip.travelersCount === 1 ? 'Viajero' : 'Viajeros'}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {trip.status === 'upcoming' && (
                    <span className="px-3 py-1 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-500 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
                      ✈️ Próximo
                    </span>
                  )}
                  {trip.status === 'planning' && (
                    <span className="px-3 py-1 rounded-xl bg-amber-950/90 backdrop-blur-md border border-amber-500 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                      ✏️ En Planificación
                    </span>
                  )}
                  {trip.status === 'completed' && (
                    <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider">
                      ✅ Completado
                    </span>
                  )}
                </div>

                {/* Active Indicator Overlay */}
                {isActive && (
                  <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                    <span>Seleccionado Actualmente</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Title & Destination */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{trip.destination}</span>
                    </p>
                  </div>

                  {/* General Metadata Box */}
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-semibold text-slate-200">
                          {formatDates(trip.startDate, trip.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-300">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-emerald-400">
                          {trip.budgetTotal.toLocaleString()} {trip.currency}
                        </span>
                      </div>
                    </div>

                    {/* Travelers Names Badge */}
                    {trip.travelersNames && trip.travelersNames.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-start space-x-2">
                        <Users className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Integrantes del Grupo:
                          </span>
                          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                            {trip.travelersNames.join(' • ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Countries / Flags Badge */}
                    {trip.countries && trip.countries.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2">
                        <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {trip.countries.map((c, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trip Item Stats Counter */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                      <p className="text-sm font-extrabold text-cyan-400">{stats.flightsCount}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Vuelos / Trenes</p>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                      <p className="text-sm font-extrabold text-purple-400">{stats.reservationsCount}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Hoteles</p>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                      <p className="text-sm font-extrabold text-amber-400">{stats.activitiesCount}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Actividades</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrip(trip, 'expenses');
                      }}
                      className="bg-emerald-950/40 hover:bg-emerald-900/50 p-2 rounded-xl border border-emerald-500/30 transition-all text-left"
                    >
                      <p className="text-sm font-extrabold text-emerald-400">${trip.budgetTotal ? trip.budgetTotal.toLocaleString() : '0'}</p>
                      <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                        <span>💵 Gastos</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </p>
                    </button>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Código: <strong className="text-slate-300 font-mono">{trip.code}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectTrip(trip, 'expenses')}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all"
                      title="Ver y administrar el presupuesto y gastos de este viaje"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>Control de Gastos 💵</span>
                    </button>

                    <button
                      onClick={() => onSelectTrip(trip, 'itinerary')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all transform hover:scale-[1.02] ${
                        isActive
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>{isActive ? 'Gestionar Viaje' : 'Seleccionar e Ingresar'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-slate-400 text-sm">No se encontraron viajes con la búsqueda o filtro aplicado.</p>
          <button
            onClick={onOpenNewTripModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
          >
            + Crear Nuevo Viaje
          </button>
        </div>
      )}
    </div>
  );
};
