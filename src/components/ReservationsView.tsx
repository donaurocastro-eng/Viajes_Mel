import React from 'react';
import { Trip, Reservation, ReservationStatus } from '../types';
import {
  Hotel,
  Car,
  Utensils,
  Train,
  MapPin,
  Calendar,
  Clock,
  Phone,
  ExternalLink,
  Plus,
  Trash2,
  MessageSquare,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  BookmarkCheck,
  FileText
} from 'lucide-react';

interface ReservationsViewProps {
  trip: Trip;
  reservations: Reservation[];
  onDeleteReservation: (id: string) => void;
  onAddReservation: () => void;
  onToggleReservationStatus?: (id: string, newStatus?: ReservationStatus) => void;
  onUpdateReservation?: (res: Reservation) => void;
  onNotifyWhatsApp: (reservation: Reservation) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  trip,
  reservations,
  onDeleteReservation,
  onAddReservation,
  onToggleReservationStatus,
  onUpdateReservation,
  onNotifyWhatsApp,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  // Persisted checkbox selection for WhatsApp & management
  const [selectedResIds, setSelectedResIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_selected_reservations_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('viajeflow_selected_reservations_v2', JSON.stringify(selectedResIds));
    } catch (e) {
      console.error('Error saving selected reservations', e);
    }
  }, [selectedResIds]);

  const tripReservations = reservations.filter((r) => r.tripId === trip.id);
  const hotelReservations = tripReservations.filter((r) => r.type === 'hotel');
  const checkedInHotelsCount = hotelReservations.filter(
    (r) => r.status === 'checked_in' || r.status === 'completed' || r.completed
  ).length;

  const toggleResSelection = (id: string) => {
    setSelectedResIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllReservations = () => {
    if (selectedResIds.length === tripReservations.length) {
      setSelectedResIds([]);
    } else {
      setSelectedResIds(tripReservations.map((r) => r.id));
    }
  };

  const formatReservationForSharing = (res: Reservation) => {
    const typeLabel =
      res.type === 'hotel'
        ? '🏨 HOTEL / ALOJAMIENTO'
        : res.type === 'car_rental'
        ? '🚗 RENTA DE AUTO'
        : res.type === 'restaurant'
        ? '🍽️ RESTAURANTE'
        : '🚅 TREN / TRANSPORTE';

    const statusText =
      res.status === 'checked_in' || res.completed
        ? '✅ Check-in Realizado / Hospedado'
        : res.status === 'completed'
        ? '🧳 Estancia Finalizada'
        : '📋 Confirmado (100% Pagado de antemano)';

    return `${typeLabel}
📌 Viaje: ${trip.title} [${trip.code || 'VAC'}]
🏨 *${res.title}* (${res.provider})
📍 Estado: ${statusText}

🔑 *Código de Reserva:* ${res.confirmationCode}
🗓️ *Check-In:* ${res.checkIn}
${res.checkOut ? `📅 *Check-Out:* ${res.checkOut}\n` : ''}${res.address ? `📍 *Dirección:* ${res.address}\n` : ''}${res.price ? `💰 *Precio:* $${res.price} ${trip.currency} (Pagado)\n` : ''}${res.notes ? `📝 *Notas:* ${res.notes}\n` : ''}
📲 Compartido con ViajeFlow`;
  };

  const handleShareWhatsAppDirect = (res: Reservation) => {
    const text = formatReservationForSharing(res);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareSelectedWhatsAppDirect = () => {
    const itemsToShare =
      selectedResIds.length > 0
        ? tripReservations.filter((r) => selectedResIds.includes(r.id))
        : tripReservations;

    if (itemsToShare.length === 0) return;

    let summary = `🏨 *RESERVAS Y HOTELES (${itemsToShare.length} ${itemsToShare.length === 1 ? 'reserva' : 'reservas'})*
📌 *${trip.title}* [Código: ${trip.code || 'VAC'}]
👥 *Viajeros:* ${trip.travelersNames?.join(', ') || 'Grupo de Viaje'}
🏨 *Progreso Hoteles:* ${checkedInHotelsCount}/${hotelReservations.length} Check-in Realizados

`;

    itemsToShare.forEach((r, idx) => {
      const isDone = r.status === 'checked_in' || r.status === 'completed' || r.completed;
      summary += `*#${idx + 1} ${r.title}* (${r.provider})
• Estado: ${isDone ? '✅ Check-in Realizado / Hospedado' : '⏳ Confirmado (100% Pagado)'}
• Código: ${r.confirmationCode}
• Entrada: ${r.checkIn}${r.checkOut ? ` | Salida: ${r.checkOut}` : ''}
${r.address ? `• Ubicación: ${r.address}\n` : ''}
`;
    });

    summary += `📲 Compartido directamente desde ViajeFlow`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Hotel className="w-6 h-6 text-amber-400" />
            <span>Reservas y Alojamientos</span>
            <span className="text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              ✅ 100% PAGADOS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestiona y marca el check-in de tus hoteles de forma persistente. Guarda tus códigos y vouchers sin conexión.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tripReservations.length > 0 && (
            <button
              onClick={handleSelectAllReservations}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              {selectedResIds.length === tripReservations.length
                ? 'Desmarcar Todos'
                : `Seleccionar Todos (${tripReservations.length})`}
            </button>
          )}

          <button
            onClick={handleShareSelectedWhatsAppDirect}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0"
            title="Abre WhatsApp Web / App para enviar los hoteles y reservas seleccionados"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>
              {selectedResIds.length > 0
                ? `Enviar Seleccionados (${selectedResIds.length}) por WhatsApp 📲`
                : `Enviar Todos (${tripReservations.length}) por WhatsApp 📲`}
            </span>
          </button>

          <button
            onClick={onAddReservation}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Reserva</span>
          </button>
        </div>
      </div>

      {/* Hotel Checklist & Quick Check-in Tracker Banner */}
      {hotelReservations.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <BookmarkCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Checklist Rápido de Hoteles y Check-in</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {checkedInHotelsCount} de {hotelReservations.length} Realizados
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Toca cualquier hotel para marcar check-in realizado o pendiente. El estado se guarda automáticamente en tu dispositivo.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guardado Permanente Activo</span>
              </span>
            </div>
          </div>

          {/* Quick Check-in items list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {hotelReservations.map((hotel, index) => {
              const isDone = hotel.status === 'checked_in' || hotel.status === 'completed' || hotel.completed;
              const isVocoOsaka = hotel.id === 'res-jp-1' || hotel.title.toLowerCase().includes('voco');
              return (
                <div
                  key={hotel.id}
                  onClick={() => {
                    const nextStatus: ReservationStatus = isDone ? 'confirmed' : 'checked_in';
                    onToggleReservationStatus?.(hotel.id, nextStatus);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between space-y-2.5 ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/50 hover:border-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">
                        Paso {index + 1}
                      </span>
                    </div>

                    {isVocoOsaka && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        📍 EN ESTANCIA
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${isDone ? 'text-emerald-200 line-through decoration-emerald-500/60' : 'text-white'}`}>
                      {hotel.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {hotel.checkIn.split('T')[0]} • Cód: {hotel.confirmationCode}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold ${
                        isDone ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isDone ? '✅ Check-in Realizado' : '⏳ Pendiente Check-in'}
                    </span>
                    <span className="text-[10px] text-slate-500">Tocar para cambiar</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          const isSelected = selectedResIds.includes(res.id);
          const isDone = res.status === 'checked_in' || res.status === 'completed' || res.completed;
          const isVocoOsaka = res.id === 'res-jp-1' || res.title.toLowerCase().includes('voco');

          return (
            <div
              key={res.id}
              className={`bg-slate-900 rounded-2xl border p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/30'
                  : isDone
                  ? 'border-emerald-500/40 bg-slate-900/95'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Type & Status Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center cursor-pointer mr-1" title="Seleccionar para enviar por WhatsApp">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleResSelection(res.id)}
                        className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                      />
                    </label>
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                      {getTypeIcon(res.type)}
                    </div>
                    <div>
                      <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">
                        {res.type === 'hotel' ? 'Hotel / Alojamiento' : res.type === 'car_rental' ? 'Renta de Auto' : res.type === 'restaurant' ? 'Restaurante' : 'Tren / Transporte'}
                      </span>
                      {isVocoOsaka && (
                        <span className="text-[10px] font-bold text-cyan-400 flex items-center space-x-1">
                          <span>📍 Hotel Actual en Osaka</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                      <span>✅ 100% PAGADO</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{res.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">Proveedor: {res.provider}</p>
                  </div>

                  {/* Interactive Toggle Button for Hotel Check-in */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus: ReservationStatus = isDone ? 'confirmed' : 'checked_in';
                      onToggleReservationStatus?.(res.id, nextStatus);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-amber-500 hover:text-amber-300'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950 fill-emerald-300" />
                        <span>¡Check-in Realizado! 🏨</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500" />
                        <span>Marcar Check-in</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Selector Dropdown */}
                <div className="flex items-center justify-between bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Estado del Alojamiento:</span>
                  <select
                    value={res.status || (isDone ? 'checked_in' : 'confirmed')}
                    onChange={(e) => onToggleReservationStatus?.(res.id, e.target.value as ReservationStatus)}
                    className="bg-slate-900 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="confirmed">📋 Confirmado (Pendiente Check-in)</option>
                    <option value="checked_in">🏨 Check-in Realizado / Hospedado</option>
                    <option value="completed">🧳 Estancia Finalizada / Salida</option>
                    <option value="pending">⏳ Pendiente</option>
                  </select>
                </div>

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
                        <span className="text-[10px] text-emerald-400 font-bold">Copiado</span>
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
                  {res.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Teléfono: <strong className="text-white">{res.phone}</strong></span>
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
                    <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      "{res.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-black text-emerald-400 block">
                    {res.price ? `$${res.price} ${trip.currency}` : 'Precio Incluido'}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 font-semibold block">
                    ✅ 100% Pagado de antemano
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleShareWhatsAppDirect(res)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 transition-colors shadow-sm"
                    title="Enviar detalles de esta reserva directamente por WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp 📲</span>
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
