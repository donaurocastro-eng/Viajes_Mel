import React from 'react';
import { Trip, Reservation } from '../types';
import { Hotel, Car, Utensils, Train, MapPin, Calendar, Clock, Phone, ExternalLink, Plus, Trash2, MessageSquare, Copy, Check } from 'lucide-react';

interface ReservationsViewProps {
  trip: Trip;
  reservations: Reservation[];
  onDeleteReservation: (id: string) => void;
  onAddReservation: () => void;
  onNotifyWhatsApp: (reservation: Reservation) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  trip,
  reservations,
  onDeleteReservation,
  onAddReservation,
  onNotifyWhatsApp,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const tripReservations = reservations.filter((r) => r.tripId === trip.id);

  const getTypeIcon = (type: Reservation['type']) => {
    switch (type) {
      case 'hotel':
        return <Hotel className="w-5 h-5 text-amber-400" />;
      case 'car_rental':
        return <Car className="w-5 h-5 text-cyan-400" />;
      case 'restaurant':
        return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'train':
        return <Train className="w-5 h-5 text-purple-400" />;
      default:
        return <Calendar className="w-5 h-5 text-blue-400" />;
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Hotel className="w-5 h-5 text-amber-400" />
            <span>Reservas y Alojamiento</span>
          </h2>
          <p className="text-xs text-slate-400">
            Hoteles, rentas de autos, trenes y restaurantes confirmados
          </p>
        </div>

        <button
          onClick={onAddReservation}
          className="flex items-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Reserva</span>
        </button>
      </div>

      {/* Empty State */}
      {tripReservations.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
          <Hotel className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No tienes reservas registradas</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Guarda tus códigos de confirmación de hoteles, restaurantes y vehículos para tenerlos listos en el viaje.
          </p>
          <button
            onClick={onAddReservation}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Reserva</span>
          </button>
        </div>
      )}

      {/* Reservation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tripReservations.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Type & Status Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                      {getTypeIcon(res.type)}
                    </div>
                    <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                      {res.type === 'hotel' ? 'Hotel / Alojamiento' : res.type === 'car_rental' ? 'Renta de Auto' : res.type === 'restaurant' ? 'Restaurante' : 'Tren / Transporte'}
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Confirmado
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{res.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Proveedor: {res.provider}</p>

                {/* Confirmation Code Copy Box */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Código de Reserva</span>
                    <span className="text-sm font-mono font-extrabold text-amber-400">{res.confirmationCode}</span>
                  </div>
                  <button
                    onClick={() => copyCode(res.confirmationCode, res.id)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors flex items-center space-x-1 text-xs"
                    title="Copiar código"
                  >
                    {copiedId === res.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dates & Address */}
                <div className="space-y-2 text-xs text-slate-300 pt-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Entrada / Check-In: <strong className="text-white">{res.checkIn}</strong></span>
                  </div>
                  {res.checkOut && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Salida / Check-Out: <strong className="text-white">{res.checkOut}</strong></span>
                    </div>
                  )}
                  {res.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(res.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-cyan-300 flex items-center space-x-1"
                      >
                        <span>{res.address}</span>
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    </div>
                  )}
                  {res.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/80">
                      "{res.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  {res.price ? `${res.price} ${trip.currency}` : 'Precio N/A'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNotifyWhatsApp(res)}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                    title="Enviar confirmación a WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Notificar WA</span>
                  </button>
                  <button
                    onClick={() => onDeleteReservation(res.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Eliminar reserva"
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
};
