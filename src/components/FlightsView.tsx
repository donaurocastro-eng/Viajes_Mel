import React, { useState } from 'react';
import { Trip, Flight, FlightStatus, QrTicket, BoardingPassAttachment } from '../types';
import { Plane, Train, Calendar, Clock, MapPin, AlertTriangle, MessageSquare, Plus, Trash2, Edit3, CheckCircle2, Ticket, QrCode, X, Copy, Check, Info, Upload, FileText, File, Eye, Download, Paperclip } from 'lucide-react';

interface FlightsViewProps {
  trip: Trip;
  flights: Flight[];
  onUpdateFlightStatus: (flightId: string, newStatus: FlightStatus, newGate?: string) => void;
  onDeleteFlight: (flightId: string) => void;
  onAddFlight: () => void;
  onNotifyGateChangeWhatsApp: (flight: Flight, newGate: string) => void;
  onNotifyDelayWhatsApp: (flight: Flight, newTime: string) => void;
  onUploadBoardingPass?: (flightId: string, pass: BoardingPassAttachment) => void;
  onDeleteBoardingPass?: (flightId: string, passId: string) => void;
}

export const FlightsView: React.FC<FlightsViewProps> = ({
  trip,
  flights,
  onUpdateFlightStatus,
  onDeleteFlight,
  onAddFlight,
  onNotifyGateChangeWhatsApp,
  onNotifyDelayWhatsApp,
  onUploadBoardingPass,
  onDeleteBoardingPass,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'flight' | 'train'>('all');
  const [selectedQrItem, setSelectedQrItem] = useState<Flight | null>(null);
  const [activePassengerIdx, setActivePassengerIdx] = useState<number>(0);
  const [copiedQr, setCopiedQr] = useState<boolean>(false);

  const [editingGateId, setEditingGateId] = useState<string | null>(null);
  const [newGateInput, setNewGateInput] = useState<string>('');

  const [editingDelayId, setEditingDelayId] = useState<string | null>(null);
  const [newTimeInput, setNewTimeInput] = useState<string>('');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [selectedFlightIds, setSelectedFlightIds] = useState<string[]>([]);

  // Boarding Pass upload & preview modal states
  const [uploadModalFlightId, setUploadModalFlightId] = useState<string | null>(null);
  const [passPassengerName, setPassPassengerName] = useState<string>('');
  const [passSeat, setPassSeat] = useState<string>('');
  const [passFile, setPassFile] = useState<{ fileName: string; fileType: 'image' | 'pdf'; fileDataUrl: string } | null>(null);
  const [selectedPassPreview, setSelectedPassPreview] = useState<{ pass: BoardingPassAttachment; flight: Flight } | null>(null);

  const toggleFlightSelection = (id: string) => {
    setSelectedFlightIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFlights = () => {
    if (selectedFlightIds.length === tripTransport.length) {
      setSelectedFlightIds([]);
    } else {
      setSelectedFlightIds(tripTransport.map((f) => f.id));
    }
  };

  const formatFlightForSharing = (item: Flight) => {
    const isTrain = item.transportType === 'train';
    return `${isTrain ? '🚅' : '✈️'} *TRAYECTO DE VIAJE (${item.airline} ${item.flightNumber})*
📌 Viaje: ${trip.title} [${trip.code || 'VAC'}]

🛫 *Origen:* ${item.departureAirport} (${item.departureCity})
🗓️ *Fecha/Hora:* ${formatDateLabel(item.departureTime)} - ${formatTimeOnly(item.departureTime)}
🛬 *Destino:* ${item.arrivalAirport} (${item.arrivalCity}) (${formatTimeOnly(item.arrivalTime)})
${item.confirmationCode ? `🔑 *Reserva/PNR:* ${item.confirmationCode}\n` : ''}${item.terminal ? `🏢 *${isTrain ? 'Andén/Vía' : 'Terminal'}:* ${item.terminal}\n` : ''}${item.gate ? `🚪 *${isTrain ? 'Coche' : 'Puerta'}:* ${item.gate}\n` : ''}${item.seat ? `💺 *Asiento:* ${item.seat}\n` : ''}
📲 Compartido con ViajeFlow`;
  };

  const handleShareWhatsAppDirect = (item: Flight) => {
    const text = formatFlightForSharing(item);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareSelectedWhatsAppDirect = () => {
    const itemsToShare =
      selectedFlightIds.length > 0
        ? tripTransport.filter((f) => selectedFlightIds.includes(f.id))
        : tripTransport;

    if (itemsToShare.length === 0) return;

    let summary = `✈️ *ITINERARIO DE VUELOS Y TRENES (${itemsToShare.length} ${itemsToShare.length === 1 ? 'trayecto' : 'trayectos'})*
📌 *${trip.title}* [Código: ${trip.code || 'VAC'}]
👥 *Viajeros:* ${trip.travelersNames?.join(', ') || 'Grupo de Viaje'}

`;

    itemsToShare.forEach((f, idx) => {
      const isTrain = f.transportType === 'train';
      summary += `*#${idx + 1} ${isTrain ? '🚅' : '✈️'} ${f.airline} ${f.flightNumber}*
• Origen: ${f.departureAirport} (${formatDateLabel(f.departureTime)} ${formatTimeOnly(f.departureTime)})
• Destino: ${f.arrivalAirport} (${formatTimeOnly(f.arrivalTime)})
• PNR: ${f.confirmationCode || 'Sin código'} | Asiento: ${f.seat || 'Asignado'}

`;
    });

    summary += `📲 Compartido directamente desde ViajeFlow`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  const handleCopyFlightToClipboard = (item: Flight) => {
    const text = formatFlightForSharing(item);
    navigator.clipboard.writeText(text);
    setCopiedTextId(item.id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const reader = new FileReader();
    reader.onload = () => {
      setPassFile({
        fileName: file.name,
        fileType: isPdf ? 'pdf' : 'image',
        fileDataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBoardingPass = () => {
    if (!uploadModalFlightId || !passFile || !onUploadBoardingPass) return;
    const newPass: BoardingPassAttachment = {
      id: 'bp-' + Date.now(),
      fileName: passFile.fileName,
      fileType: passFile.fileType,
      fileDataUrl: passFile.fileDataUrl,
      passengerName: passPassengerName.trim() || undefined,
      seat: passSeat.trim() || undefined,
      uploadedAt: new Date().toISOString(),
    };
    onUploadBoardingPass(uploadModalFlightId, newPass);
    setUploadModalFlightId(null);
    setPassPassengerName('');
    setPassSeat('');
    setPassFile(null);
  };

  const handleShareBoardingPassWhatsApp = (pass: BoardingPassAttachment, flight: Flight) => {
    const text = `📄 *PASE DE ABORDAJE - TRAMO (${flight.airline} ${flight.flightNumber})*
📌 *Viaje:* ${trip.title}
🛫 *Origen:* ${flight.departureAirport} (${flight.departureCity})
🛬 *Destino:* ${flight.arrivalAirport} (${flight.arrivalCity})
🗓️ *Fecha:* ${formatDateLabel(flight.departureTime)} (${formatTimeOnly(flight.departureTime)})

👤 *Pasajero:* ${pass.passengerName || 'Asignado'}
💺 *Asiento:* ${pass.seat || flight.seat || 'No especificado'}
🔑 *PNR/Reserva:* ${flight.confirmationCode || 'Sin código'}
📎 *Archivo:* ${pass.fileName}

📲 Compartido vía ViajeFlow`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Strictly sort all transportation chronologically by departure date/time
  const tripTransport = flights
    .filter((f) => f.tripId === trip.id)
    .filter((f) => {
      if (filterType === 'flight') return f.transportType !== 'train';
      if (filterType === 'train') return f.transportType === 'train';
      return true;
    })
    .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());

  const allFlightsCount = flights.filter((f) => f.tripId === trip.id && f.transportType !== 'train').length;
  const allTrainsCount = flights.filter((f) => f.tripId === trip.id && f.transportType === 'train').length;

  const getStatusBadge = (status: FlightStatus) => {
    switch (status) {
      case 'programado':
        return { label: 'Programado', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'embarcando':
        return { label: 'Embarcando', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
      case 'en_vuelo':
        return { label: 'En Trayecto ✈️', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'retrasado':
        return { label: 'Retrasado ⏱️', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' };
      case 'aterrizado':
        return { label: 'Completado', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: 'Cancelado', bg: 'bg-red-500/20 text-red-400 border-red-500/40' };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQr(true);
    setTimeout(() => setCopiedQr(false), 2000);
  };

  const formatDateLabel = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return isoDate;
    }
  };

  const formatTimeOnly = (isoDate: string) => {
    try {
      if (isoDate.includes('T')) {
        return isoDate.split('T')[1].substring(0, 5);
      }
      return isoDate;
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2.5">
              <Plane className="w-5 h-5 text-cyan-400" />
              <span>Itinerario de Vuelos y Trenes (Cronológico)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Organizado en orden estricto de fechas, con pases QR de torniquete para Shinkansen y alertas de WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tripTransport.length > 0 && (
              <button
                onClick={handleSelectAllFlights}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
              >
                {selectedFlightIds.length === tripTransport.length
                  ? 'Desmarcar Todos'
                  : `Seleccionar Todos (${tripTransport.length})`}
              </button>
            )}

            <button
              onClick={handleShareSelectedWhatsAppDirect}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0"
              title="Abre WhatsApp Web / App para enviar los trayectos seleccionados"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>
                {selectedFlightIds.length > 0
                  ? `Enviar Seleccionados (${selectedFlightIds.length}) por WhatsApp 📲`
                  : `Enviar Todos (${tripTransport.length}) por WhatsApp 📲`}
              </span>
            </button>

            <button
              onClick={onAddFlight}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Trayecto</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterType === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Todos los Trayectos ({allFlightsCount + allTrainsCount})</span>
          </button>

          <button
            onClick={() => setFilterType('flight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterType === 'flight'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Solo Vuelos ({allFlightsCount})</span>
          </button>

          <button
            onClick={() => setFilterType('train')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterType === 'train'
                ? 'bg-purple-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Trenes y Pases QR ({allTrainsCount})</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {tripTransport.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
          <Plane className="w-12 h-12 text-slate-600 mx-auto transform -rotate-45" />
          <h3 className="text-base font-semibold text-slate-300">No hay trayectos registrados para este filtro</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Añade tus boletos de avión o reservas de tren Shinkansen / AREX para mantener el itinerario en orden cronológico.
          </p>
          <button
            onClick={onAddFlight}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Trayecto</span>
          </button>
        </div>
      )}

      {/* Transport Cards Grid (Strict Chronological List) */}
      <div className="grid gap-6">
        {tripTransport.map((item, index) => {
          const isTrain = item.transportType === 'train';
          const statusBadge = getStatusBadge(item.status);
          const hasQrTickets = item.qrTickets && item.qrTickets.length > 0;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border overflow-hidden shadow-xl transition-all ${
                selectedFlightIds.includes(item.id)
                  ? 'bg-slate-900 border-emerald-500/80 ring-2 ring-emerald-500/30'
                  : isTrain
                  ? 'bg-slate-900 border-purple-500/30 hover:border-purple-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header Banner */}
              <div
                className={`px-6 py-3 border-b flex items-center justify-between flex-wrap gap-2 ${
                  isTrain ? 'bg-purple-950/40 border-purple-800/40' : 'bg-slate-800/80 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedFlightIds.includes(item.id)}
                    onChange={() => toggleFlightSelection(item.id)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                    title="Seleccionar para enviar por WhatsApp"
                  />

                  <div className={`p-1.5 rounded-lg ${isTrain ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                    {isTrain ? <Train className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-mono mr-2">#{index + 1}</span>
                    <span className={`font-extrabold text-base tracking-wider ${isTrain ? 'text-purple-300' : 'text-cyan-400'}`}>
                      {item.airline} {item.flightNumber}
                    </span>
                  </div>

                  {item.confirmationCode && (
                    <span className="text-xs text-slate-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                      Cod: {item.confirmationCode}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadge.bg}`}>
                    {statusBadge.label}
                  </span>
                  <button
                    onClick={() => onDeleteFlight(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Eliminar trayecto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Body */}
              <div className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 my-1">
                  
                  {/* Origen */}
                  <div className="text-center md:text-left space-y-1">
                    <span className="text-xs uppercase font-semibold text-slate-400">Origen</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{item.departureAirport}</h3>
                    <p className="text-xs text-slate-300 font-medium">{item.departureCity}</p>
                    <p className="text-xs text-cyan-400 font-semibold flex items-center justify-center md:justify-start space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDateLabel(item.departureTime)}</span>
                      <span className="font-bold text-white ml-1">({formatTimeOnly(item.departureTime)})</span>
                    </p>
                  </div>

                  {/* Icon Divider */}
                  <div className="flex-1 w-full flex flex-col items-center max-w-xs my-2 md:my-0">
                    <div className="w-full flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isTrain ? 'bg-purple-400' : 'bg-cyan-400'}`} />
                      <div className="flex-1 border-t-2 border-dashed border-slate-700 relative">
                        {isTrain ? (
                          <Train className="w-5 h-5 text-purple-400 absolute left-1/2 -top-2.5 -translate-x-1/2" />
                        ) : (
                          <Plane className="w-5 h-5 text-cyan-400 absolute left-1/2 -top-2.5 -translate-x-1/2 transform rotate-90" />
                        )}
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mt-2">
                      {isTrain ? 'Trayecto en Tren Directo' : 'Vuelo Directo'}
                    </span>
                  </div>

                  {/* Destino */}
                  <div className="text-center md:text-right space-y-1">
                    <span className="text-xs uppercase font-semibold text-slate-400">Destino</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">{item.arrivalAirport}</h3>
                    <p className="text-xs text-slate-300 font-medium">{item.arrivalCity}</p>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center md:justify-end space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimeOnly(item.arrivalTime)}</span>
                    </p>
                  </div>

                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {isTrain ? 'Andén / Vía' : 'Terminal'}
                    </span>
                    <p className="text-sm font-bold text-white">{item.terminal || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {isTrain ? 'Coche' : 'Puerta'}
                    </span>
                    <p className="text-sm font-extrabold text-amber-400">{item.gate || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Asientos Reservados</span>
                    <p className="text-sm font-bold text-cyan-300">{item.seat || 'Asignados'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Precio / Estado</span>
                    <p className="text-sm font-bold text-emerald-400">{item.price ? `${item.price} ${trip.currency}` : 'Incluido'}</p>
                  </div>
                </div>

                {/* Individual Passenger Seat Badges */}
                {hasQrTickets && (
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 space-y-2">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">
                      👥 Asignación de Asientos por Pasajero (4 Pasajeros):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {item.qrTickets?.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => {
                            setSelectedQrItem(item);
                            setActivePassengerIdx(pIdx);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all"
                        >
                          <span className="text-xs text-slate-200 font-medium truncate pr-1">{p.passengerName}</span>
                          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                            {p.seat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes & Instructions */}
                {item.notes && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    💡 <strong>Notas:</strong> {item.notes}
                  </p>
                )}

                {/* Boarding Passes per Tramo */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-slate-200">
                        Pases de Abordaje del Tramo
                      </span>
                      {item.boardingPasses && item.boardingPasses.length > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {item.boardingPasses.length} {item.boardingPasses.length === 1 ? 'pase' : 'pases'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUploadModalFlightId(item.id);
                        setPassPassengerName('');
                        setPassSeat(item.seat || '');
                        setPassFile(null);
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                      title="Subir un pase de abordaje (PDF o imagen) para este tramo"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>+ Subir Pase de Abordaje 📤</span>
                    </button>
                  </div>

                  {item.boardingPasses && item.boardingPasses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.boardingPasses.map((pass) => (
                        <div
                          key={pass.id}
                          className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center space-x-2.5 overflow-hidden min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${pass.fileType === 'pdf' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                              {pass.fileType === 'pdf' ? <FileText className="w-4 h-4" /> : <File className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{pass.fileName}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                👤 {pass.passengerName || 'Pasajero no asignado'} {pass.seat ? `• 💺 ${pass.seat}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={() => setSelectedPassPreview({ pass, flight: item })}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                              title="Ver pase de abordaje"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden xs:inline text-[10px]">Ver</span>
                            </button>

                            <button
                              onClick={() => handleShareBoardingPassWhatsApp(pass, item)}
                              className="p-1.5 bg-slate-800 hover:bg-emerald-950 text-emerald-400 rounded-lg text-xs transition-colors"
                              title="Compartir por WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            {onDeleteBoardingPass && (
                              <button
                                onClick={() => onDeleteBoardingPass(item.id, pass.id)}
                                className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition-colors"
                                title="Eliminar pase"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/80 text-center">
                      <p className="text-[11px] text-slate-400">
                        No hay pases de abordaje subidos para este tramo. Haz clic en <strong>"+ Subir Pase"</strong> para adjuntar PDF o foto.
                      </p>
                    </div>
                  )}
                </div>

                {/* Train / Flight QR Tickets Trigger & Controls */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {hasQrTickets ? (
                    <button
                      onClick={() => {
                        setSelectedQrItem(item);
                        setActivePassengerIdx(0);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-900/30 transition-all transform hover:scale-[1.02]"
                    >
                      <QrCode className="w-4 h-4 text-purple-200 animate-pulse" />
                      <span>Ver Pases QR y Boletos (4 Pasajeros)</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-300">Estado:</span>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateFlightStatus(item.id, e.target.value as FlightStatus)}
                        className="bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="programado">Programado</option>
                        <option value="embarcando">Embarcando</option>
                        <option value="en_vuelo">En Trayecto</option>
                        <option value="retrasado">Retrasado</option>
                        <option value="aterrizado">Completado</option>
                      </select>
                    </div>
                  )}

                  {/* Actions Bar for WhatsApp Alerts */}
                  <div className="flex flex-wrap items-center gap-2">
                    {editingGateId === item.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          placeholder="Nueva Puerta"
                          value={newGateInput}
                          onChange={(e) => setNewGateInput(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded text-xs text-white px-2 py-1 w-24 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (newGateInput) {
                              onUpdateFlightStatus(item.id, item.status, newGateInput);
                              onNotifyGateChangeWhatsApp(item, newGateInput);
                              setEditingGateId(null);
                              setNewGateInput('');
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                        >
                          Notificar
                        </button>
                        <button onClick={() => setEditingGateId(null)} className="px-1.5 text-slate-400 text-xs">
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingGateId(item.id);
                          setNewGateInput(item.gate || '');
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Alerta Puerta WA</span>
                      </button>
                    )}

                    {editingDelayId === item.id ? (
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
                              onUpdateFlightStatus(item.id, 'retrasado');
                              onNotifyDelayWhatsApp(item, newTimeInput);
                              setEditingDelayId(null);
                              setNewTimeInput('');
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-semibold"
                        >
                          Notificar
                        </button>
                        <button onClick={() => setEditingDelayId(null)} className="px-1.5 text-slate-400 text-xs">
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingDelayId(item.id);
                          setNewTimeInput(item.departureTime);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Alerta Retraso</span>
                      </button>
                    )}

                    {/* Direct WhatsApp & Copy Actions (No API required) */}
                    <button
                      onClick={() => handleShareWhatsAppDirect(item)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 transition-colors"
                      title="Compartir este trayecto por WhatsApp sin necesidad de API"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp 📲</span>
                    </button>

                    <button
                      onClick={() => handleCopyFlightToClipboard(item)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Copiar detalles del trayecto al portapapeles"
                    >
                      {copiedTextId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* QR Ticket Inspector Modal */}
      {selectedQrItem && selectedQrItem.qrTickets && selectedQrItem.qrTickets.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>Pases QR de Torniquete</span>
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    {selectedQrItem.airline} - {selectedQrItem.flightNumber} ({selectedQrItem.confirmationCode})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedQrItem(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Passenger Tab Switcher */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400">Seleccionar Pasajero:</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedQrItem.qrTickets.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePassengerIdx(idx)}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between border ${
                      activePassengerIdx === idx
                        ? 'bg-purple-600 text-white border-purple-400 shadow-lg'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-1">{t.passengerName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 shrink-0">
                      Asiento {t.seat}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active QR Card Display */}
            {(() => {
              const activeTicket: QrTicket = selectedQrItem.qrTickets[activePassengerIdx] || selectedQrItem.qrTickets[0];
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                activeTicket.qrCodeData
              )}`;

              return (
                <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/30 text-center space-y-4">
                  {/* Passenger & Seat badge */}
                  <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-500/20 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-purple-300 block">Pasajero</span>
                      <strong className="text-sm text-white block">{activeTicket.passengerName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-purple-300 block">
                        {activeTicket.car ? activeTicket.car : 'Coche'}
                      </span>
                      <strong className="text-base text-amber-400 block font-mono">Asiento {activeTicket.seat}</strong>
                    </div>
                  </div>

                  {/* Rendered QR Code Image */}
                  <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-purple-400/20">
                    <img
                      src={qrImageUrl}
                      alt={`QR Ticket ${activeTicket.passengerName}`}
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  </div>

                  {/* Alphanumeric Code String & Copy Button */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Código Alfanumérico del Tiquete</span>
                    <p className="text-xs font-mono text-cyan-300 break-all select-all">{activeTicket.qrCodeData}</p>
                    <button
                      onClick={() => copyToClipboard(activeTicket.qrCodeData)}
                      className="mt-1 inline-flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      {copiedQr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedQr ? 'Copiado' : 'Copiar Código'}</span>
                    </button>
                  </div>

                  {/* Gate Scanner Instructions Banner */}
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-left flex items-start space-x-2.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-200/90 leading-tight">
                      <strong>Instrucción en Torniquetes Shinkansen / AREX:</strong> Sostén el código QR frente al lector óptico de la puerta automática. Recoge el comprobante impreso <em>"Seat Information" (EXご利用票)</em> para presentar al revisor en el tren.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedQrItem(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Cerrar Pases QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Boarding Pass Modal */}
      {uploadModalFlightId && (() => {
        const targetFlight = flights.find((f) => f.id === uploadModalFlightId);
        if (!targetFlight) return null;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 text-cyan-300 rounded-xl">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Subir Pase de Abordaje</h3>
                    <p className="text-xs text-cyan-300 font-medium">
                      Tramo: {targetFlight.airline} {targetFlight.flightNumber} ({targetFlight.departureCity} ✈️ {targetFlight.arrivalCity})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUploadModalFlightId(null);
                    setPassFile(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* Passenger Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Pasajero (Viajero)
                  </label>
                  {trip.travelersNames && trip.travelersNames.length > 0 ? (
                    <select
                      value={passPassengerName}
                      onChange={(e) => setPassPassengerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">Seleccionar de la lista de viajeros...</option>
                      {trip.travelersNames.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <input
                    type="text"
                    placeholder="O escribe el nombre del pasajero..."
                    value={passPassengerName}
                    onChange={(e) => setPassPassengerName(e.target.value)}
                    className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Seat Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Número de Asiento (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 15C, 18A, 9-A..."
                    value={passSeat}
                    onChange={(e) => setPassSeat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* File Attachment Dropzone */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Adjuntar Archivo de Pase (PDF o Foto/Imagen)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-cyan-500/70 bg-slate-950 p-5 rounded-2xl cursor-pointer transition-all">
                    <Paperclip className="w-6 h-6 text-cyan-400 mb-1" />
                    <span className="text-xs text-slate-300 font-semibold">
                      {passFile ? passFile.fileName : 'Haz clic para seleccionar PDF o Imagen'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Formatos soportados: PDF, JPG, PNG, WEBP, HEIC
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {passFile && (
                    <div className="mt-2 p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {passFile.fileType === 'pdf' ? <FileText className="w-4 h-4 text-rose-400" /> : <File className="w-4 h-4 text-emerald-400" />}
                        <span className="text-xs text-cyan-200 font-semibold truncate max-w-[200px]">
                          {passFile.fileName}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded">
                        {passFile.fileType}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setUploadModalFlightId(null);
                    setPassFile(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSaveBoardingPass}
                  disabled={!passFile}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-cyan-600/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Guardar Pase de Abordaje</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Boarding Pass Preview Modal */}
      {selectedPassPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${selectedPassPreview.pass.fileType === 'pdf' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {selectedPassPreview.pass.fileType === 'pdf' ? <FileText className="w-6 h-6" /> : <File className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Pase de Abordaje: {selectedPassPreview.pass.passengerName || 'Pasajero'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedPassPreview.flight.airline} {selectedPassPreview.flight.flightNumber} • {selectedPassPreview.flight.departureCity} ✈️ {selectedPassPreview.flight.arrivalCity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPassPreview(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Summary Banner */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pasajero:</span>
                <strong className="text-white">{selectedPassPreview.pass.passengerName || 'No asignado'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Asiento:</span>
                <strong className="text-cyan-300">{selectedPassPreview.pass.seat || selectedPassPreview.flight.seat || 'No especificado'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">PNR/Reserva:</span>
                <strong className="text-amber-300">{selectedPassPreview.flight.confirmationCode || 'Sin código'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Archivo:</span>
                <span className="text-slate-300 truncate max-w-[120px] block">{selectedPassPreview.pass.fileName}</span>
              </div>
            </div>

            {/* Document / Photo View Area */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex-1 overflow-auto flex items-center justify-center min-h-[250px]">
              {selectedPassPreview.pass.fileType === 'pdf' ? (
                <div className="w-full text-center space-y-4">
                  {selectedPassPreview.pass.fileDataUrl.startsWith('data:application/pdf') ? (
                    <iframe
                      src={selectedPassPreview.pass.fileDataUrl}
                      title="PDF Preview"
                      className="w-full h-80 rounded-xl border border-slate-800"
                    />
                  ) : (
                    <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                      <FileText className="w-12 h-12 text-rose-400 mx-auto" />
                      <p className="text-sm font-bold text-white">Documento PDF del Pase de Abordaje</p>
                      <p className="text-xs text-slate-400">{selectedPassPreview.pass.fileName}</p>
                    </div>
                  )}

                  <a
                    href={selectedPassPreview.pass.fileDataUrl}
                    download={selectedPassPreview.pass.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Abrir / Descargar PDF Completo</span>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <img
                    src={selectedPassPreview.pass.fileDataUrl}
                    alt={selectedPassPreview.pass.fileName}
                    className="max-h-[50vh] max-w-full rounded-xl object-contain mx-auto shadow-2xl border border-slate-700"
                  />
                  <a
                    href={selectedPassPreview.pass.fileDataUrl}
                    download={selectedPassPreview.pass.fileName}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Descargar Imagen Original</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleShareBoardingPassWhatsApp(selectedPassPreview.pass, selectedPassPreview.flight)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Enviar Detalles por WhatsApp 📲</span>
              </button>

              <button
                onClick={() => setSelectedPassPreview(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

