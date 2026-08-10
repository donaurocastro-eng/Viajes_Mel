import React from 'react';
import { Trip, Flight, Reservation, Activity } from '../types';
import { Calendar, MapPin, DollarSign, Plus, Plane, Hotel, CheckSquare, Sparkles, AlertCircle } from 'lucide-react';

interface TripHeaderProps {
  trip: Trip;
  flights: Flight[];
  reservations: Reservation[];
  activities: Activity[];
  onAddFlight: () => void;
  onAddReservation: () => void;
  onAddActivity: () => void;
  onOpenAiPlanner: () => void;
  onSendDailyBriefingWhatsApp: () => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  flights,
  reservations,
  activities,
  onAddFlight,
  onAddReservation,
  onAddActivity,
  onOpenAiPlanner,
  onSendDailyBriefingWhatsApp,
}) => {
  // Calculate expenses breakdown
  const flightCosts = flights.reduce((acc, f) => acc + (f.price || 0), 0);
  const reservationCosts = reservations.reduce((acc, r) => acc + (r.price || 0), 0);
  const activityCosts = activities.reduce((acc, a) => acc + (a.cost || 0), 0);
  const totalSpent = flightCosts + reservationCosts + activityCosts;
  const remainingBudget = trip.budgetTotal - totalSpent;
  const budgetPercentage = Math.min(100, Math.round((totalSpent / (trip.budgetTotal || 1)) * 100));

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-2xl mb-8">
      {/* Background Cover Image with Gradient Overlay */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.title}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-400">
            {trip.status === 'planning' ? 'En Planificación' : trip.status === 'upcoming' ? 'Próximo Viaje' : trip.status === 'ongoing' ? 'En Curso' : 'Completado'}
          </span>
        </div>
      </div>

      {/* Content overlay */}
      <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          
          {/* Title & Info */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>{trip.destination}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              {trip.title}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
              {trip.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{trip.startDate} al {trip.endDate}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Plane className="w-4 h-4 text-cyan-400" />
                <span>{flights.length} Vuelos</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Hotel className="w-4 h-4 text-amber-400" />
                <span>{reservations.length} Reservas</span>
              </div>
            </div>
          </div>

          {/* Budget Widget */}
          <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 w-full lg:w-80 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Presupuesto y Gastos</span>
              </span>
              <span className="text-emerald-400 font-bold">
                {totalSpent} / {trip.budgetTotal} {trip.currency}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetPercentage > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Restante: {remainingBudget} {trip.currency}</span>
              <span>{budgetPercentage}% usado</span>
            </div>
          </div>

        </div>

        {/* Quick Add Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAddFlight}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Añadir Vuelo</span>
            </button>
            <button
              onClick={onAddReservation}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Añadir Reserva</span>
            </button>
            <button
              onClick={onAddActivity}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Añadir Actividad</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onSendDailyBriefingWhatsApp}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              title="Enviar resumen del día por WhatsApp al usuario"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enviar Resumen a WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
