import React, { useState } from 'react';
import { Trip, Flight, FlightStatus } from '../types';
import { Plane, Calendar, Clock, MapPin, AlertTriangle, MessageSquare, Plus, Trash2, Edit3, CheckCircle2, Ticket } from 'lucide-react';

interface FlightsViewProps {
  trip: Trip;
  flights: Flight[];
  onUpdateFlightStatus: (flightId: string, newStatus: FlightStatus, newGate?: string) => void;
  onDeleteFlight: (flightId: string) => void;
  onAddFlight: () => void;
  onNotifyGateChangeWhatsApp: (flight: Flight, newGate: string) => void;
  onNotifyDelayWhatsApp: (flight: Flight, newTime: string) => void;
}

export const FlightsView: React.FC<FlightsViewProps> = ({
  trip,
  flights,
  onUpdateFlightStatus,
  onDeleteFlight,
  onAddFlight,
  onNotifyGateChangeWhatsApp,
  onNotifyDelayWhatsApp,
}) => {
  const tripFlights = flights.filter((f) => f.tripId === trip.id);

  const [editingGateId, setEditingGateId] = useState<string | null>(null);
  const [newGateInput, setNewGateInput] = useState<string>('');

  const [editingDelayId, setEditingDelayId] = useState<string | null>(null);
  const [newTimeInput, setNewTimeInput] = useState<string>('');

  const getStatusBadge = (status: FlightStatus) => {
    switch (status) {
      case 'programado':
        return { label: 'Programado', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'embarcando':
        return { label: 'Embarcando', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
      case 'en_vuelo':
        return { label: 'En Vuelo ✈️', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'retrasado':
        return { label: 'Retrasado ⏱️', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' };
      case 'aterrizado':
        return { label: 'Aterrizado', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: 'Cancelado', bg: 'bg-red-500/20 text-red-400 border-red-500/40' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Plane className="w-5 h-5 text-cyan-400" />
            <span>Vuelos y Boletos de Avión</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitoreo en tiempo real de itinerario aéreo y alertas de puerta a WhatsApp
          </p>
        </div>

        <button
          onClick={onAddFlight}
          className="flex items-center space-x-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Vuelo</span>
        </button>
      </div>

      {/* Empty State */}
      {tripFlights.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
          <Plane className="w-12 h-12 text-slate-600 mx-auto transform -rotate-45" />
          <h3 className="text-base font-semibold text-slate-300">No hay vuelos registrados para este viaje</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Registra tus números de vuelo, horarios y asientos o pega tu billete electrónico para importar los detalles automáticamente.
          </p>
          <button
            onClick={onAddFlight}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Vuelo</span>
          </button>
        </div>
      )}

      {/* Flight Cards Grid */}
      <div className="grid gap-6">
        {tripFlights.map((flight) => {
          const statusBadge = getStatusBadge(flight.status);

          return (
            <div
              key={flight.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all"
            >
              {/* Card Top Banner */}
              <div className="bg-slate-800/80 px-6 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-base text-cyan-400 tracking-wider">
                    {flight.airline} {flight.flightNumber}
                  </span>
                  {flight.confirmationCode && (
                    <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      Cod: {flight.confirmationCode}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadge.bg}`}>
                    {statusBadge.label}
                  </span>
                  <button
                    onClick={() => onDeleteFlight(flight.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Eliminar vuelo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Flight Route Body */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 my-2">
                  
                  {/* Departure */}
                  <div className="text-center md:text-left space-y-1">
                    <span className="text-xs uppercase font-semibold text-slate-400">Origen</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{flight.departureAirport}</h3>
                    <p className="text-xs text-slate-300 font-medium">{flight.departureCity}</p>
                    <p className="text-xs text-cyan-400 font-semibold flex items-center justify-center md:justify-start space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{flight.departureTime}</span>
                    </p>
                  </div>

                  {/* Flight Icon Route Divider */}
                  <div className="flex-1 w-full flex flex-col items-center max-w-xs my-2 md:my-0">
                    <div className="w-full flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <div className="flex-1 border-t-2 border-dashed border-slate-700 relative">
                        <Plane className="w-5 h-5 text-cyan-400 absolute left-1/2 -top-2.5 -translate-x-1/2 transform rotate-90" />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mt-2">Vuelo Directo</span>
                  </div>

                  {/* Arrival */}
                  <div className="text-center md:text-right space-y-1">
                    <span className="text-xs uppercase font-semibold text-slate-400">Destino</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{flight.arrivalAirport}</h3>
                    <p className="text-xs text-slate-300 font-medium">{flight.arrivalCity}</p>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center md:justify-end space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{flight.arrivalTime}</span>
                    </p>
                  </div>

                </div>

                {/* Gate, Terminal, Seat & Price Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Terminal</span>
                    <p className="text-sm font-bold text-white">{flight.terminal || 'T4'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Puerta</span>
                    <p className="text-sm font-extrabold text-amber-400">{flight.gate || 'H12'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Asiento</span>
                    <p className="text-sm font-bold text-cyan-300">{flight.seat || '12A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Precio</span>
                    <p className="text-sm font-bold text-emerald-400">{flight.price ? `${flight.price} ${trip.currency}` : 'N/A'}</p>
                  </div>
                </div>

                {/* Interactive WhatsApp Gate Change & Status Simulation Controls */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-300">Cambiar Estado:</span>
                    <select
                      value={flight.status}
                      onChange={(e) => onUpdateFlightStatus(flight.id, e.target.value as FlightStatus)}
                      className="bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="programado">Programado</option>
                      <option value="embarcando">Embarcando</option>
                      <option value="en_vuelo">En Vuelo</option>
                      <option value="retrasado">Retrasado</option>
                      <option value="aterrizado">Aterrizado</option>
                    </select>
                  </div>

                  {/* Actions Bar for WhatsApp Notifications */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Gate Change Trigger */}
                    {editingGateId === flight.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          placeholder="Ej: H25"
                          value={newGateInput}
                          onChange={(e) => setNewGateInput(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded text-xs text-white px-2 py-1 w-20 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (newGateInput) {
                              onUpdateFlightStatus(flight.id, flight.status, newGateInput);
                              onNotifyGateChangeWhatsApp(flight, newGateInput);
                              setEditingGateId(null);
                              setNewGateInput('');
                            }
                          }}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                        >
                          Notificar
                        </button>
                        <button
                          onClick={() => setEditingGateId(null)}
                          className="px-1.5 py-1 text-slate-400 text-xs hover:text-white"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingGateId(flight.id);
                          setNewGateInput(flight.gate || '');
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Alerta Cambio de Puerta</span>
                      </button>
                    )}

                    {/* Delay Trigger */}
                    {editingDelayId === flight.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          placeholder="Nueva hora"
                          value={newTimeInput}
                          onChange={(e) => setNewTimeInput(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded text-xs text-white px-2 py-1 w-28 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (newTimeInput) {
                              onUpdateFlightStatus(flight.id, 'retrasado');
                              onNotifyDelayWhatsApp(flight, newTimeInput);
                              setEditingDelayId(null);
                              setNewTimeInput('');
                            }
                          }}
                          className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-semibold"
                        >
                          Notificar Retraso
                        </button>
                        <button
                          onClick={() => setEditingDelayId(null)}
                          className="px-1.5 py-1 text-slate-400 text-xs hover:text-white"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingDelayId(flight.id);
                          setNewTimeInput(flight.departureTime);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Alerta de Retraso</span>
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
