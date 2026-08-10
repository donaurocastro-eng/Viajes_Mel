import React, { useState } from 'react';
import { Trip, Activity, Flight, Reservation } from '../types';
import { Sparkles, Plane, Hotel, Calendar, Loader2, ArrowRight, CheckCircle2, FileText, Upload } from 'lucide-react';

interface AiTripPlannerModalProps {
  activeTrip: Trip;
  onApplyGeneratedItinerary: (
    activities: Partial<Activity>[],
    flights?: Partial<Flight>[],
    hotels?: Partial<Reservation>[]
  ) => void;
  onAddParsedFlight: (flight: Partial<Flight>) => void;
  onAddParsedHotel: (hotel: Partial<Reservation>) => void;
  onClose: () => void;
}

export const AiTripPlannerModal: React.FC<AiTripPlannerModalProps> = ({
  activeTrip,
  onApplyGeneratedItinerary,
  onAddParsedFlight,
  onAddParsedHotel,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'parse'>('generate');

  // Generator form
  const [destination, setDestination] = useState(activeTrip.destination || 'Madrid y París');
  const [days, setDays] = useState(5);
  const [travelStyle, setTravelStyle] = useState('Cultural, Gastronómico y Aventura');
  const [budget, setBudget] = useState('Medio');
  const [interests, setInterests] = useState('Museos, restaurantes locales, fotos icónicas, compras');

  // Parser form
  const [eTicketText, setETicketText] = useState('');

  // Loading & state
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [generatedPreview, setGeneratedPreview] = useState<any | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg('Analizando destino y creando itinerario personalizado con Gemini AI...');
    setGeneratedPreview(null);

    try {
      const response = await fetch('/api/gemini/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          travelStyle,
          budget,
          interests,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setGeneratedPreview(data.data);
      } else {
        alert('Error: ' + (data.error || 'No se pudo generar el itinerario'));
      }
    } catch (err: any) {
      alert('Error de red al consultar Gemini: ' + err.message);
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  const handleParseETicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTicketText.trim()) return;
    setIsLoading(true);
    setStatusMsg('Extrayendo datos de vuelo y reservas con IA...');
    setParsedPreview(null);

    try {
      const response = await fetch('/api/gemini/parse-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: eTicketText }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setParsedPreview(data.data);
      } else {
        alert('Error analizando e-ticket: ' + (data.error || 'Intenta de nuevo'));
      }
    } catch (err: any) {
      alert('Error de comunicación con el servidor: ' + err.message);
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  const applyGenerated = () => {
    if (!generatedPreview) return;
    const recommendedActs = generatedPreview.recommendedActivities || [];
    const formattedActivities: Partial<Activity>[] = recommendedActs.map((act: any) => ({
      title: act.title || 'Actividad Sugerida',
      description: act.description || '',
      category: act.category || 'sightseeing',
      date: activeTrip.startDate || new Date().toISOString().split('T')[0],
      startTime: act.startTime || '10:00',
      endTime: act.endTime || '12:00',
      location: act.location || destination,
      cost: act.estimatedCost || 20,
      priority: act.priority || 'medium',
      completed: false,
    }));

    onApplyGeneratedItinerary(formattedActivities);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white my-8">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Asistente de Viaje con Gemini AI</h2>
              <p className="text-xs text-slate-400">Genera itinerarios o importa e-tickets con inteligencia artificial</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('generate')}
            className={`pb-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'generate'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Generar Itinerario Día a Día</span>
          </button>
          <button
            onClick={() => setActiveTab('parse')}
            className={`pb-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'parse'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Importar E-Ticket / Email de Reserva</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {activeTab === 'generate' && (
            <form onSubmit={handleGenerateItinerary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Destino:</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Días de Duración:</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Estilo de Viaje:</label>
                  <input
                    type="text"
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Presupuesto Estimado:</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Económico">Económico (Backpacker)</option>
                    <option value="Medio">Medio (Confortable)</option>
                    <option value="Lujo">Lujo (Exclusivo)</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-300 mb-1">Intereses y Lugares Deseados:</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Ej: Gastronomía local, museos de arte, naturaleza, parques de atracciones..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-cyan-400 bg-cyan-950/40 p-3 rounded-xl border border-cyan-800">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {!isLoading && generatedPreview && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-cyan-400">{generatedPreview.title}</h4>
                  <p className="text-xs text-slate-300">{generatedPreview.description}</p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>✨ Actividades sugeridas: <strong className="text-white">{generatedPreview.recommendedActivities?.length || 0}</strong></p>
                  </div>
                  <button
                    type="button"
                    onClick={applyGenerated}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aplicar Itinerario al Viaje</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Itinerario Inteligente con Gemini</span>
              </button>
            </form>
          )}

          {activeTab === 'parse' && (
            <form onSubmit={handleParseETicket} className="space-y-4">
              <div className="text-xs space-y-1">
                <label className="block font-semibold text-slate-300">Pega aquí el texto del correo de confirmación o billete electrónico:</label>
                <textarea
                  rows={6}
                  value={eTicketText}
                  onChange={(e) => setETicketText(e.target.value)}
                  placeholder="Ej: Confirmation #IB9872X. Flight Iberia 6801 departing Mexico City (MEX) at 18:45 on Sep 15 to Madrid (MAD). Seat 14A, Terminal 4..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-cyan-400 bg-cyan-950/40 p-3 rounded-xl border border-cyan-800">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {parsedPreview && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-emerald-400">Datos Extraídos Exitosamente:</h4>
                  
                  {parsedPreview.flightData?.flightNumber && (
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <p className="font-bold text-cyan-400">✈️ Vuelo: {parsedPreview.flightData.airline} {parsedPreview.flightData.flightNumber}</p>
                      <p className="text-slate-300">Ruta: {parsedPreview.flightData.departureAirport} → {parsedPreview.flightData.arrivalAirport}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onAddParsedFlight({
                            tripId: activeTrip.id,
                            flightNumber: parsedPreview.flightData.flightNumber,
                            airline: parsedPreview.flightData.airline || 'Aerolínea',
                            departureAirport: parsedPreview.flightData.departureAirport || 'Origen',
                            arrivalAirport: parsedPreview.flightData.arrivalAirport || 'Destino',
                            departureCity: parsedPreview.flightData.departureCity || '',
                            arrivalCity: parsedPreview.flightData.arrivalCity || '',
                            departureTime: parsedPreview.flightData.departureTime || '12:00',
                            arrivalTime: parsedPreview.flightData.arrivalTime || '18:00',
                            terminal: parsedPreview.flightData.terminal,
                            gate: parsedPreview.flightData.gate,
                            seat: parsedPreview.flightData.seat,
                            confirmationCode: parsedPreview.flightData.confirmationCode,
                            status: 'programado',
                          });
                          onClose();
                        }}
                        className="mt-2 px-3 py-1 bg-cyan-600 text-white rounded text-xs font-bold"
                      >
                        Añadir este Vuelo a la Lista
                      </button>
                    </div>
                  )}

                  {parsedPreview.hotelData?.title && (
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <p className="font-bold text-amber-400">🏨 Hotel: {parsedPreview.hotelData.title}</p>
                      <p className="text-slate-300">Check-in: {parsedPreview.hotelData.checkIn}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onAddParsedHotel({
                            tripId: activeTrip.id,
                            type: 'hotel',
                            title: parsedPreview.hotelData.title,
                            provider: parsedPreview.hotelData.provider || 'Reserva Directa',
                            address: parsedPreview.hotelData.address,
                            checkIn: parsedPreview.hotelData.checkIn || activeTrip.startDate,
                            checkOut: parsedPreview.hotelData.checkOut || activeTrip.endDate,
                            confirmationCode: parsedPreview.hotelData.confirmationCode || 'CONF-123',
                            status: 'confirmed',
                          });
                          onClose();
                        }}
                        className="mt-2 px-3 py-1 bg-amber-600 text-white rounded text-xs font-bold"
                      >
                        Añadir esta Reserva
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Analizar E-Ticket con IA</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
