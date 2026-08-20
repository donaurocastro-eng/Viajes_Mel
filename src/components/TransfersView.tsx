import React, { useState } from 'react';
import { Trip, GroundTransfer, GroundTransferStep, QrTicket } from '../types';
import {
  Navigation,
  Bus,
  Train,
  Footprints,
  Car,
  Clock,
  MapPin,
  QrCode,
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Search,
  ArrowRight,
  Info,
  CheckCircle2,
  Copy,
  X
} from 'lucide-react';

interface TransfersViewProps {
  trip: Trip;
  groundTransfers: GroundTransfer[];
  onAddTransfer?: (transfer: GroundTransfer) => void;
  onDeleteTransfer?: (transferId: string) => void;
  onNotifyWhatsAppMessage?: (message: string) => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  trip,
  groundTransfers,
  onAddTransfer,
  onDeleteTransfer,
  onNotifyWhatsAppMessage,
}) => {
  const [selectedFilterMode, setSelectedFilterMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTransferId, setExpandedTransferId] = useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = useState<{ title: string; tickets: QrTicket[] } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Transfer Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Filter transfers for current trip
  const tripTransfers = groundTransfers.filter((gt) => gt.tripId === trip.id);

  // Filter by search and mode
  const filteredTransfers = tripTransfers.filter((gt) => {
    const matchesSearch =
      gt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gt.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gt.toLocation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilterMode === 'all') return true;
    return gt.transportModes.includes(selectedFilterMode as any);
  });

  const getModeBadge = (mode: GroundTransferStep['mode']) => {
    switch (mode) {
      case 'shinkansen':
        return { label: 'Shinkansen 🚄', icon: Train, bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'train':
        return { label: 'Tren 🚆', icon: Train, bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'subway':
        return { label: 'Metro 🚇', icon: Train, bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'bus':
        return { label: 'Autobús 🚌', icon: Bus, bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'walk':
        return { label: 'A Pie 🚶‍♂️', icon: Footprints, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'taxi':
        return { label: 'Taxi / App 🚖', icon: Car, bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'Tránsito 📍', icon: MapPin, bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  const handleShareTransferWhatsApp = (gt: GroundTransfer) => {
    let text = `🚌 *TRAYECTO Y CONEXIÓN DE TERRENO* 🗺️
📌 *${gt.title}*
📍 *Origen:* ${gt.fromLocation}
🎯 *Destino:* ${gt.toLocation}
⏱️ *Tiempo Estimado:* ${gt.estimatedDuration || 'No especificado'}

📝 *PASO A PASO DEL TRAYECTO:*
`;

    gt.steps.forEach((step) => {
      text += `*${step.stepNumber}.* ${step.instruction} (${step.durationOrDistance || ''})\n`;
      if (step.lineOrService) text += `   • Servicio: ${step.lineOrService}\n`;
      if (step.notes) text += `   • Nota: ${step.notes}\n`;
      text += `\n`;
    });

    if (gt.notes) {
      text += `⚠️ *Notas Adicionales:* ${gt.notes}\n`;
    }

    text += `📲 *Organizado en ViajeFlow*`;

    if (onNotifyWhatsAppMessage) {
      onNotifyWhatsAppMessage(text);
    } else {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenGoogleMaps = (from: string, to: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=transit`;
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  };

  const handleCreateTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newFrom || !newTo) return;

    const newTransfer: GroundTransfer = {
      id: `gt-custom-${Date.now()}`,
      tripId: trip.id,
      title: newTitle,
      fromLocation: newFrom,
      toLocation: newTo,
      estimatedDuration: newDuration || '45 min',
      transportModes: ['bus', 'subway', 'walk'],
      notes: newNotes,
      steps: [
        {
          id: `step-1-${Date.now()}`,
          stepNumber: 1,
          instruction: `Dirígete desde ${newFrom} hacia la estación o parada de transporte más cercana.`,
          mode: 'walk',
          durationOrDistance: '5 min (~300 m)'
        },
        {
          id: `step-2-${Date.now()}`,
          stepNumber: 2,
          instruction: `Toma el transporte de enlace directo hacia ${newTo}.`,
          mode: 'bus',
          durationOrDistance: newDuration || '30 min'
        },
        {
          id: `step-3-${Date.now()}`,
          stepNumber: 3,
          instruction: `Arribo a ${newTo}.`,
          mode: 'walk',
          durationOrDistance: '2 min'
        }
      ]
    };

    if (onAddTransfer) {
      onAddTransfer(newTransfer);
    }
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewFrom('');
    setNewTo('');
    setNewDuration('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-emerald-500 rounded-xl text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Navigation className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <span>Trayectos y Conexiones Terrestres</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GUÍA DE RUTAS PASO A PASO
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Guía exacta de transporte entre aeropuertos, hoteles, estaciones de tren/Shinkansen y puntos turísticos
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nuevo Trayecto</span>
        </button>
      </div>

      {/* Confirmation Callout Banner */}
      <div className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p>
            <strong className="text-white font-bold">Estado de Pagos:</strong> Los vuelos, los 4 hoteles y el <strong className="text-white">Tren Shinkansen Nozomi</strong> (Osaka ➔ Tokio - 4p) están <span className="text-emerald-300 font-bold underline">100% INCLUIDOS Y PAGADOS</span>.
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 font-semibold shrink-0">
          ⚠️ Traslados Aeropuerto ↔ Hotel: NO incluidos en paquete (Se pagan en el destino vía Metro/Tren/Taxi)
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por ciudad, hotel, aeropuerto o línea de metro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'shinkansen', label: 'Shinkansen 🚄' },
            { id: 'train', label: 'Tren 🚆' },
            { id: 'bus', label: 'Autobús 🚌' },
            { id: 'subway', label: 'Metro 🚇' },
            { id: 'walk', label: 'Caminata 🚶‍♂️' },
            { id: 'taxi', label: 'Taxi 🚖' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedFilterMode(mode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                selectedFilterMode === mode.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredTransfers.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
          <Navigation className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No se encontraron trayectos</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Prueba ajustando el filtro de transporte o agrega un nuevo trayecto terrestre personalizado.
          </p>
        </div>
      )}

      {/* Transfers Cards Accordion / List */}
      <div className="space-y-5">
        {filteredTransfers.map((gt) => {
          const isExpanded = expandedTransferId === gt.id || filteredTransfers.length === 1;

          return (
            <div
              key={gt.id}
              className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden shadow-lg ${
                isExpanded ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedTransferId(isExpanded ? null : gt.id)}
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 hover:bg-slate-800/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {gt.transportModes.map((mode) => {
                      const badge = getModeBadge(mode as any);
                      return (
                        <span
                          key={mode}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      );
                    })}

                    {gt.estimatedDuration && (
                      <span className="flex items-center space-x-1 text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{gt.estimatedDuration}</span>
                      </span>
                    )}

                    {gt.qrTickets && gt.qrTickets.length > 0 && (
                      <span className="flex items-center space-x-1 text-xs text-purple-300 font-extrabold bg-purple-500/20 px-2.5 py-0.5 rounded-md border border-purple-500/40">
                        <QrCode className="w-3.5 h-3.5 text-purple-400" />
                        <span>{gt.qrTickets.length} Boletos QR</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {gt.title}
                  </h3>

                  {/* Route points */}
                  <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold">
                    <span className="flex items-center space-x-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{gt.fromLocation}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="flex items-center space-x-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{gt.toLocation}</span>
                    </span>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareTransferWhatsApp(gt);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
                    title="Enviar pasos detallados a WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                    <span className="hidden sm:inline">Compartir WA</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenGoogleMaps(gt.fromLocation, gt.toLocation);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all"
                    title="Ver mapa de ruta en Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Google Maps</span>
                  </button>

                  <div className="p-2 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Card Body - Step by Step Timeline */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-5 animate-in fade-in duration-200">
                  {gt.notes && (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p><strong>Nota / Recomendación:</strong> {gt.notes}</p>
                    </div>
                  )}

                  {/* QR Tickets Display if available */}
                  {gt.qrTickets && gt.qrTickets.length > 0 && (
                    <div className="p-4 bg-purple-950/20 border border-purple-500/40 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-5 h-5 text-purple-400" />
                          <h4 className="text-xs font-extrabold text-purple-200 uppercase tracking-wider">
                            Boletos QR para este Trayecto (Shinkansen / Expreso)
                          </h4>
                        </div>
                        <button
                          onClick={() => setActiveQrModal({ title: gt.title, tickets: gt.qrTickets || [] })}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-lg transition-colors"
                        >
                          Ver QR Escaneables 📱
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {gt.qrTickets.map((t, idx) => (
                          <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-purple-500/30 text-xs flex items-center justify-between">
                            <div>
                              <p className="font-bold text-white">{t.passengerName}</p>
                              <p className="text-[10px] text-purple-300 font-mono">
                                {t.car ? `${t.car} • ` : ''}Asiento: {t.seat}
                              </p>
                            </div>
                            <QrCode className="w-6 h-6 text-purple-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline Steps */}
                  <div className="space-y-4 relative pl-4 border-l-2 border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Pasos Detallados del Recorrido:
                    </h4>

                    {gt.steps.map((step) => {
                      const badge = getModeBadge(step.mode);
                      const ModeIcon = badge.icon;

                      return (
                        <div key={step.id} className="relative pl-6 space-y-1.5 group">
                          {/* Step Marker */}
                          <div className={`absolute -left-[25px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black ${badge.bg}`}>
                            {step.stepNumber}
                          </div>

                          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center space-x-1 ${badge.bg}`}>
                                <ModeIcon className="w-3 h-3" />
                                <span>{badge.label}</span>
                              </span>

                              {step.durationOrDistance && (
                                <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  {step.durationOrDistance}
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-bold text-slate-100 leading-relaxed">
                              {step.instruction}
                            </p>

                            {step.lineOrService && (
                              <p className="text-[11px] text-cyan-300 font-semibold bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                                🚆 Servicio / Línea: {step.lineOrService}
                              </p>
                            )}

                            {step.notes && (
                              <p className="text-[11px] text-slate-400 italic">
                                💡 {step.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    {onDeleteTransfer && (
                      <button
                        onClick={() => onDeleteTransfer(gt.id)}
                        className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Trayecto</span>
                      </button>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenGoogleMaps(gt.fromLocation, gt.toLocation)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Abrir Navegación en Google Maps</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* QR Code Inspection Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-6 h-6 text-purple-400" />
                <h3 className="text-base font-bold text-white">Boletos QR para Escaneo</h3>
              </div>
              <button
                onClick={() => setActiveQrModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-300 font-medium">
              {activeQrModal.title}
            </p>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {activeQrModal.tickets.map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 text-center space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-2">
                    <span>Pasajero: {t.passengerName}</span>
                    <span className="text-purple-300 font-mono">
                      {t.car ? `${t.car} • ` : ''}Asiento: {t.seat}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl inline-block shadow-lg mx-auto">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        t.qrCodeData
                      )}`}
                      alt="Boletín QR"
                      className="w-36 h-36 mx-auto"
                    />
                  </div>

                  <p className="text-[10px] font-mono text-slate-400 break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {t.qrCodeData}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveQrModal(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Cerrar Boletos QR
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Transfer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Agregar Nuevo Trayecto / Conexión</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransferSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Título del Trayecto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. De Hotel en Tokio a Aeropuerto Haneda"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Punto de Origen</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hotel Ginza"
                    value={newFrom}
                    onChange={(e) => setNewFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Punto de Destino</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Aeropuerto Haneda"
                    value={newTo}
                    onChange={(e) => setNewTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Duración Estimada</label>
                <input
                  type="text"
                  placeholder="Ej. 45 min"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Notas de la Ruta</label>
                <textarea
                  placeholder="Ej. Salida por la puerta sur, comprar boleto de monorriel..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-amber-500 h-20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  Guardar Trayecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
