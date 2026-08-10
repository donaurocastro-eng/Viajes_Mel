import React, { useState, useEffect } from 'react';
import { Trip, Flight, Reservation, Activity, WhatsAppLog, WhatsAppConfig, SupabaseConfig, FlightStatus } from './types';
import { initialTrips, initialFlights, initialReservations, initialActivities, initialWhatsAppLogs } from './data/mockData';
import { Navbar } from './components/Navbar';
import { TripHeader } from './components/TripHeader';
import { ItineraryView } from './components/ItineraryView';
import { FlightsView } from './components/FlightsView';
import { ReservationsView } from './components/ReservationsView';
import { ActivitiesView } from './components/ActivitiesView';
import { WhatsAppCenter } from './components/WhatsAppCenter';
import { SupabaseVercelConfig } from './components/SupabaseVercelConfig';
import { AiTripPlannerModal } from './components/AiTripPlannerModal';
import { NewTripModal, AddFlightModal, AddReservationModal, AddActivityModal } from './components/Modals';
import {
  getSavedWhatsAppConfig,
  saveWhatsAppConfig,
  sendWhatsAppNotification,
  formatGateChangeAlert,
  formatFlightDelayAlert,
  formatActivityReminderAlert,
  formatReservationConfirmationAlert,
  formatDailySummaryAlert,
} from './services/whatsappClient';
import { getSavedSupabaseConfig, saveSupabaseConfig, getSupabaseInstance } from './services/supabaseService';

export default function App() {
  // Persistence state
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_trips_v1');
      return saved ? JSON.parse(saved) : initialTrips;
    } catch {
      return initialTrips;
    }
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => trips[0]?.id || 'trip-1');

  const [flights, setFlights] = useState<Flight[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_flights_v1');
      return saved ? JSON.parse(saved) : initialFlights;
    } catch {
      return initialFlights;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_reservations_v1');
      return saved ? JSON.parse(saved) : initialReservations;
    } catch {
      return initialReservations;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_activities_v1');
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppLog[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_walogs_v1');
      return saved ? JSON.parse(saved) : initialWhatsAppLogs;
    } catch {
      return initialWhatsAppLogs;
    }
  });

  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(getSavedWhatsAppConfig);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getSavedSupabaseConfig);

  // Active Tab & Modal States
  const [activeTab, setActiveTab] = useState<string>('itinerary');
  const [isNewTripOpen, setIsNewTripOpen] = useState(false);
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Toast alert banner for WhatsApp notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('viajeflow_trips_v1', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('viajeflow_flights_v1', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem('viajeflow_reservations_v1', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('viajeflow_activities_v1', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('viajeflow_walogs_v1', JSON.stringify(whatsAppLogs));
  }, [whatsAppLogs]);

  // Active Trip object
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  const handleAddTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
  };

  const handleAddFlight = (newFlight: Flight) => {
    setFlights((prev) => [newFlight, ...prev]);
  };

  const handleUpdateFlightStatus = (flightId: string, newStatus: FlightStatus, newGate?: string) => {
    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === flightId) {
          return {
            ...f,
            status: newStatus,
            gate: newGate || f.gate,
          };
        }
        return f;
      })
    );
  };

  const handleDeleteFlight = (id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);

    // Send instant WhatsApp notification
    const msg = formatReservationConfirmationAlert(
      newRes.type,
      newRes.title,
      newRes.confirmationCode,
      newRes.checkIn,
      newRes.address
    );
    dispatchWhatsAppMessage(msg, 'booking_confirmation');
  };

  const handleDeleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [...prev, newAct]);
  };

  const handleToggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  // WhatsApp Dispatcher
  const dispatchWhatsAppMessage = async (content: string, type: WhatsAppLog['messageType']) => {
    const result = await sendWhatsAppNotification(content, type, activeTrip.id);
    if (result.log) {
      setWhatsAppLogs((prev) => [result.log, ...prev]);
      triggerToast(`📲 Notificación WhatsApp enviada a ${result.log.recipient}`);
    }
  };

  // Specific triggers
  const handleNotifyGateChange = (flight: Flight, newGate: string) => {
    const msg = formatGateChangeAlert(flight.airline, flight.flightNumber, newGate, flight.terminal);
    dispatchWhatsAppMessage(msg, 'gate_change');
  };

  const handleNotifyDelay = (flight: Flight, newTime: string) => {
    const msg = formatFlightDelayAlert(flight.airline, flight.flightNumber, flight.departureTime, newTime);
    dispatchWhatsAppMessage(msg, 'delay_alert');
  };

  const handleNotifyActivity = (activity: Activity) => {
    const msg = formatActivityReminderAlert(activity.title, activity.date, activity.startTime || 'Por programar', activity.location);
    dispatchWhatsAppMessage(msg, 'itinerary_update');
  };

  const handleSendDailyBriefingWhatsApp = () => {
    const tripActs = activities.filter((a) => a.tripId === activeTrip.id);
    const top = tripActs[0]?.title || 'Recorrido por la ciudad';
    const msg = formatDailySummaryAlert(activeTrip.title, activeTrip.startDate, tripActs.length, top);
    dispatchWhatsAppMessage(msg, 'daily_reminder');
  };

  const handleTriggerQuickAlert = (type: 'gate_change' | 'delay_alert' | 'booking' | 'daily_summary') => {
    if (type === 'gate_change') {
      const flight = flights[0] || { airline: 'Iberia', flightNumber: 'IB 6801', terminal: 'T4' };
      handleNotifyGateChange(flight as Flight, 'H28');
    } else if (type === 'delay_alert') {
      const flight = flights[0] || { airline: 'Iberia', flightNumber: 'IB 6801', departureTime: '18:45' };
      handleNotifyDelay(flight as Flight, '20:15');
    } else if (type === 'booking') {
      const res = reservations[0] || { type: 'hotel', title: 'Hotel Gran Vía', confirmationCode: 'BK-99120', checkIn: '2026-09-16' };
      const msg = formatReservationConfirmationAlert(res.type, res.title, res.confirmationCode, res.checkIn);
      dispatchWhatsAppMessage(msg, 'booking_confirmation');
    } else {
      handleSendDailyBriefingWhatsApp();
    }
  };

  // AI Itinerary Application
  const handleApplyAiItinerary = (newActivities: Partial<Activity>[]) => {
    const created: Activity[] = newActivities.map((act, idx) => ({
      id: 'act-ai-' + Date.now() + '-' + idx,
      tripId: activeTrip.id,
      title: act.title || 'Actividad Sugerida',
      description: act.description,
      category: act.category || 'sightseeing',
      date: act.date || activeTrip.startDate,
      startTime: act.startTime || '10:00',
      endTime: act.endTime || '12:00',
      location: act.location,
      cost: act.cost || 15,
      completed: false,
      priority: act.priority || 'medium',
    }));

    setActivities((prev) => [...created, ...prev]);
    triggerToast(`✨ Se añadieron ${created.length} actividades generadas por IA a tu itinerario.`);
  };

  // Sync Local to Supabase
  const handleSyncLocalToSupabase = async () => {
    const supabase = getSupabaseInstance(supabaseConfig);
    if (!supabase) {
      alert('Configura primero tu Supabase URL y Anon Key en la pestaña de Conexión.');
      return;
    }

    try {
      // Upsert trips
      const formattedTrips = trips.map((t) => ({
        id: t.id,
        title: t.title,
        destination: t.destination,
        start_date: t.startDate,
        end_date: t.endDate,
        cover_image: t.coverImage,
        status: t.status,
        budget_total: t.budgetTotal,
        currency: t.currency,
        description: t.description,
      }));

      const { error } = await supabase.from('trips').upsert(formattedTrips);
      if (error) throw error;

      alert('¡Sincronización exitosa! Todos tus datos se guardaron en Supabase en la nube.');
    } catch (err: any) {
      alert('Error al sincronizar con Supabase: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={(t) => setActiveTripId(t.id)}
        onOpenNewTripModal={() => setIsNewTripOpen(true)}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        onOpenWhatsAppModal={() => setActiveTab('whatsapp')}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSupabaseConnected={supabaseConfig.isConnected}
        whatsAppLogsCount={whatsAppLogs.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Active Trip Header */}
        {activeTrip && (
          <TripHeader
            trip={activeTrip}
            flights={flights}
            reservations={reservations}
            activities={activities}
            onAddFlight={() => setIsAddFlightOpen(true)}
            onAddReservation={() => setIsAddReservationOpen(true)}
            onAddActivity={() => setIsAddActivityOpen(true)}
            onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
            onSendDailyBriefingWhatsApp={handleSendDailyBriefingWhatsApp}
          />
        )}

        {/* View Tabs */}
        {activeTab === 'itinerary' && (
          <ItineraryView
            trip={activeTrip}
            activities={activities}
            onToggleActivity={handleToggleActivity}
            onDeleteActivity={handleDeleteActivity}
            onAddActivity={() => setIsAddActivityOpen(true)}
            onNotifyWhatsApp={handleNotifyActivity}
          />
        )}

        {activeTab === 'flights' && (
          <FlightsView
            trip={activeTrip}
            flights={flights}
            onUpdateFlightStatus={handleUpdateFlightStatus}
            onDeleteFlight={handleDeleteFlight}
            onAddFlight={() => setIsAddFlightOpen(true)}
            onNotifyGateChangeWhatsApp={handleNotifyGateChange}
            onNotifyDelayWhatsApp={handleNotifyDelay}
          />
        )}

        {activeTab === 'reservations' && (
          <ReservationsView
            trip={activeTrip}
            reservations={reservations}
            onDeleteReservation={handleDeleteReservation}
            onAddReservation={() => setIsAddReservationOpen(true)}
            onNotifyWhatsApp={(res) => {
              const msg = formatReservationConfirmationAlert(res.type, res.title, res.confirmationCode, res.checkIn, res.address);
              dispatchWhatsAppMessage(msg, 'booking_confirmation');
            }}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitiesView
            trip={activeTrip}
            activities={activities}
            onToggleActivity={handleToggleActivity}
            onDeleteActivity={handleDeleteActivity}
            onAddActivity={() => setIsAddActivityOpen(true)}
            onNotifyWhatsApp={handleNotifyActivity}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppCenter
            trip={activeTrip}
            logs={whatsAppLogs}
            config={whatsAppConfig}
            onSaveConfig={(cfg) => {
              setWhatsAppConfig(cfg);
              saveWhatsAppConfig(cfg);
            }}
            onSendCustomMessage={(msg, rec) => dispatchWhatsAppMessage(msg, 'custom')}
            onClearLogs={() => setWhatsAppLogs([])}
            onTriggerQuickAlert={handleTriggerQuickAlert}
          />
        )}

      </main>

      {/* Modals */}
      {isNewTripOpen && (
        <NewTripModal
          onAddTrip={handleAddTrip}
          onClose={() => setIsNewTripOpen(false)}
        />
      )}

      {isAddFlightOpen && activeTrip && (
        <AddFlightModal
          tripId={activeTrip.id}
          onAddFlight={handleAddFlight}
          onClose={() => setIsAddFlightOpen(false)}
        />
      )}

      {isAddReservationOpen && activeTrip && (
        <AddReservationModal
          tripId={activeTrip.id}
          onAddReservation={handleAddReservation}
          onClose={() => setIsAddReservationOpen(false)}
        />
      )}

      {isAddActivityOpen && activeTrip && (
        <AddActivityModal
          tripId={activeTrip.id}
          defaultDate={activeTrip.startDate}
          onAddActivity={handleAddActivity}
          onClose={() => setIsAddActivityOpen(false)}
        />
      )}

      {isAiPlannerOpen && activeTrip && (
        <AiTripPlannerModal
          activeTrip={activeTrip}
          onApplyGeneratedItinerary={handleApplyAiItinerary}
          onAddParsedFlight={(flight) => {
            if (flight.flightNumber) handleAddFlight(flight as Flight);
          }}
          onAddParsedHotel={(hotel) => {
            if (hotel.title) handleAddReservation(hotel as Reservation);
          }}
          onClose={() => setIsAiPlannerOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseVercelConfig
          config={supabaseConfig}
          onUpdateConfig={setSupabaseConfig}
          onSyncLocalToSupabase={handleSyncLocalToSupabase}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}

    </div>
  );
}
