import React, { useState } from 'react';
import { Trip, Flight, Reservation, Activity } from '../types';
import { Plus, X, Plane, Hotel, Calendar, MapPin, DollarSign, Tag, Clock } from 'lucide-react';

interface NewTripModalProps {
  onAddTrip: (trip: Trip) => void;
  onClose: () => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({ onAddTrip, onClose }) => {
  const [code, setCode] = useState(`VAC-00${Math.floor(Math.random() * 90 + 10)}`);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-10');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [travelersInput, setTravelersInput] = useState<string>('');
  const [countriesInput, setCountriesInput] = useState<string>('');
  const [budgetTotal, setBudgetTotal] = useState(2500);
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination) return;
    
    const parsedTravelers = travelersInput
      ? travelersInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const parsedCountries = countriesInput
      ? countriesInput.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    const newTrip: Trip = {
      id: 'trip-' + Date.now(),
      code: code.trim().toUpperCase() || 'VAC-00' + Math.floor(Math.random() * 10),
      title,
      destination,
      startDate,
      endDate,
      travelersCount: travelersCount || (parsedTravelers.length > 0 ? parsedTravelers.length : 1),
      travelersNames: parsedTravelers.length > 0 ? parsedTravelers : undefined,
      countries: parsedCountries.length > 0 ? parsedCountries : undefined,
      budgetTotal,
      currency,
      description,
      status: 'planning',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
    };
    onAddTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg text-white">Crear Nuevo Viaje con Nomenclatura</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block font-semibold text-amber-400 mb-1">Código de Viaje:</label>
              <input
                type="text"
                required
                placeholder="Ej: VAC-001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 font-mono text-cyan-300 font-bold rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Nombre del Viaje:</label>
              <input
                type="text"
                required
                placeholder="Ej: Viaje Vacaciones Asia / Europa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Destino Principal / Países:</label>
              <input
                type="text"
                required
                placeholder="Ej: Japón, Corea del Sur, Tailandia"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block font-semibold text-slate-300 mb-1">Nº Viajeros:</label>
              <input
                type="number"
                min="1"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Nombres de los Viajeros (Separados por coma):
            </label>
            <input
              type="text"
              placeholder="Ej: Robinson Castro, Robinson Josue Castro, Donauro Emmanuel Castro, Maria Nohemy Israel"
              value={travelersInput}
              onChange={(e) => setTravelersInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Países / Banderas (Separados por coma, Opcional):
            </label>
            <input
              type="text"
              placeholder="Ej: Japón 🇯🇵, Corea del Sur 🇰🇷, Tailandia 🇹🇭"
              value={countriesInput}
              onChange={(e) => setCountriesInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fecha Inicio:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fecha Fin:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Presupuesto Total:</label>
              <input
                type="number"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Moneda:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="HNL">HNL (L)</option>
                <option value="MXN">MXN ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Descripción o Notas:</label>
            <input
              type="text"
              placeholder="Vacaciones de verano en familia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">URL de Imagen de Portada (Opcional):</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg"
            >
              Guardar Viaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddFlightModalProps {
  tripId: string;
  onAddFlight: (flight: Flight) => void;
  onClose: () => void;
}

export const AddFlightModal: React.FC<AddFlightModalProps> = ({ tripId, onAddFlight, onClose }) => {
  const [airline, setAirline] = useState('Iberia');
  const [flightNumber, setFlightNumber] = useState('IB 3120');
  const [departureAirport, setDepartureAirport] = useState('MAD');
  const [arrivalAirport, setArrivalAirport] = useState('CDG');
  const [departureCity, setDepartureCity] = useState('Madrid');
  const [arrivalCity, setArrivalCity] = useState('París');
  const [departureTime, setDepartureTime] = useState('2026-09-15T10:00');
  const [arrivalTime, setArrivalTime] = useState('2026-09-15T12:15');
  const [gate, setGate] = useState('H12');
  const [seat, setSeat] = useState('14A');
  const [confirmationCode, setConfirmationCode] = useState('IB8831');
  const [price, setPrice] = useState(150);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlight: Flight = {
      id: 'flight-' + Date.now(),
      tripId,
      airline,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      gate,
      seat,
      confirmationCode,
      price,
      status: 'programado',
    };
    onAddFlight(newFlight);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg text-white">Añadir Vuelo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Aerolínea:</label>
              <input
                type="text"
                required
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Número de Vuelo:</label>
              <input
                type="text"
                required
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Aeropuerto Origen:</label>
              <input
                type="text"
                required
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Aeropuerto Destino:</label>
              <input
                type="text"
                required
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fecha/Hora Salida:</label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fecha/Hora Llegada:</label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Puerta:</label>
              <input
                type="text"
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Asiento:</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Precio:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Código de Confirmación (PNR):</label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg"
            >
              Guardar Vuelo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddReservationModalProps {
  tripId: string;
  onAddReservation: (res: Reservation) => void;
  onClose: () => void;
}

export const AddReservationModal: React.FC<AddReservationModalProps> = ({ tripId, onAddReservation, onClose }) => {
  const [type, setType] = useState<Reservation['type']>('hotel');
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('Booking.com');
  const [address, setAddress] = useState('');
  const [checkIn, setCheckIn] = useState('2026-09-16T15:00');
  const [checkOut, setCheckOut] = useState('2026-09-20T11:00');
  const [confirmationCode, setConfirmationCode] = useState('BK-' + Math.floor(Math.random() * 89999 + 10000));
  const [price, setPrice] = useState(300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newRes: Reservation = {
      id: 'res-' + Date.now(),
      tripId,
      type,
      title,
      provider,
      address,
      checkIn,
      checkOut,
      confirmationCode,
      price,
      status: 'confirmed',
    };
    onAddReservation(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg text-white">Añadir Reserva / Alojamiento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Tipo de Reserva:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Reservation['type'])}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="hotel">Hotel / Alojamiento</option>
              <option value="car_rental">Renta de Auto</option>
              <option value="restaurant">Restaurante</option>
              <option value="train">Tren / Transporte</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Nombre del Establecimiento:</label>
            <input
              type="text"
              required
              placeholder="Ej: Hotel Gran Vía Boutique"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Proveedor:</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Código Confirmación:</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Check-In / Entrada:</label>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Check-Out / Salida:</label>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Dirección:</label>
            <input
              type="text"
              placeholder="Calle Gran Vía 32, Madrid"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Precio Total:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg"
            >
              Guardar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddActivityModalProps {
  tripId: string;
  defaultDate?: string;
  onAddActivity: (act: Activity) => void;
  onClose: () => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ tripId, defaultDate, onAddActivity, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Activity['category']>('sightseeing');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      tripId,
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      cost,
      completed: false,
      priority: 'medium',
    };
    onAddActivity(newAct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg text-white">Añadir Actividad al Itinerario</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Título de la Actividad:</label>
            <input
              type="text"
              required
              placeholder="Ej: Visita al Museo del Prado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Categoría:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Activity['category'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="sightseeing">Turismo / Puntos de Interés</option>
                <option value="food">Gastronomía / Restaurante</option>
                <option value="culture">Cultura / Museo</option>
                <option value="adventure">Aventura / Excursión</option>
                <option value="relaxation">Relax / Paseo</option>
                <option value="shopping">Compras</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fecha:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hora Inicio:</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hora Fin:</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Costo Estimado:</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Lugar u Ubicación:</label>
            <input
              type="text"
              placeholder="Ej: Plaza Mayor, Madrid"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Descripción / Notas:</label>
            <input
              type="text"
              placeholder="Comprar entradas anticipadas en línea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg"
            >
              Guardar Actividad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
