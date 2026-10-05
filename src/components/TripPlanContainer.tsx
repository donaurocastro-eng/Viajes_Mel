import React, { useState } from 'react';
import { Trip, Flight, Reservation, Activity, GroundTransfer, ChecklistItem } from '../types';
import { ItineraryView } from './ItineraryView';
import { FlightsView } from './FlightsView';
import { TransfersView } from './TransfersView';
import { ReservationsView } from './ReservationsView';
import { ChecklistView } from './ChecklistView';
import { RouteMapView } from './RouteMapView';
import { Calendar, Plane, Bus, Building2, CheckSquare, Map } from 'lucide-react';

interface TripPlanContainerProps {
  trip: Trip;
  flights: Flight[];
  reservations: Reservation[];
  activities: Activity[];
  groundTransfers: GroundTransfer[];
  checklistItems: ChecklistItem[];
  onToggleActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
  onAddActivity: () => void;
  onNotifyActivity: (act: Activity) => void;
  onUpdateFlightStatus: (flightId: string, status: any) => void;
  onDeleteFlight: (flightId: string) => void;
  onAddFlight: () => void;
  onNotifyGateChange: (f: Flight) => void;
  onNotifyDelay: (f: Flight) => void;
  onUploadBoardingPass: (flightId: string, file: File, passengerName?: string, seat?: string) => Promise<void>;
  onDeleteBoardingPass: (flightId: string, passId: string) => void;
  onAddTransfer: (t: GroundTransfer) => void;
  onDeleteTransfer: (id: string) => void;
  onDeleteReservation: (id: string) => void;
  onAddReservation: () => void;
  onToggleReservationStatus: (id: string) => void;
  onUpdateReservation: (res: Reservation) => void;
  onNotifyReservation: (res: Reservation) => void;
  onToggleChecklistItem: (id: string) => void;
  onAddChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  onDeleteChecklistItem: (id: string) => void;
  onResetChecklistItems: () => void;
  onDispatchWhatsApp: (msg: string, type: any) => void;
}

export const TripPlanContainer: React.FC<TripPlanContainerProps> = ({
  trip,
  flights,
  reservations,
  activities,
  groundTransfers,
  checklistItems,
  onToggleActivity,
  onDeleteActivity,
  onAddActivity,
  onNotifyActivity,
  onUpdateFlightStatus,
  onDeleteFlight,
  onAddFlight,
  onNotifyGateChange,
  onNotifyDelay,
  onUploadBoardingPass,
  onDeleteBoardingPass,
  onAddTransfer,
  onDeleteTransfer,
  onDeleteReservation,
  onAddReservation,
  onToggleReservationStatus,
  onUpdateReservation,
  onNotifyReservation,
  onToggleChecklistItem,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onResetChecklistItems,
  onDispatchWhatsApp,
}) => {
  const [subTab, setSubTab] = useState<'itinerary' | 'flights' | 'hotels' | 'transfers' | 'checklist' | 'map'>('itinerary');

  const subTabs = [
    { id: 'itinerary', label: 'Itinerario Diario', icon: Calendar, count: activities.length },
    { id: 'flights', label: 'Vuelos & Pases', icon: Plane, count: flights.length },
    { id: 'hotels', label: 'Hoteles & Reservas', icon: Building2, count: reservations.length },
    { id: 'checklist', label: 'Checklist & Equipaje', icon: CheckSquare, count: checklistItems.filter(c => !c.completed).length },
    { id: 'transfers', label: 'Traslados Terrestres', icon: Bus, count: groundTransfers.length },
    { id: 'map', label: 'Mapa de Ruta', icon: Map },
  ];

  return (
    <div className="space-y-6">
      
      {/* Clean Secondary Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center justify-between overflow-x-auto shadow-lg">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-view Content */}
      <div className="transition-all duration-200">
        {subTab === 'itinerary' && (
          <ItineraryView
            trip={trip}
            activities={activities}
            flights={flights}
            onToggleActivity={onToggleActivity}
            onDeleteActivity={onDeleteActivity}
            onAddActivity={onAddActivity}
            onNotifyWhatsApp={onNotifyActivity}
            onUpdateFlightStatus={onUpdateFlightStatus}
          />
        )}

        {subTab === 'flights' && (
          <FlightsView
            trip={trip}
            flights={flights}
            onUpdateFlightStatus={onUpdateFlightStatus}
            onDeleteFlight={onDeleteFlight}
            onAddFlight={onAddFlight}
            onNotifyGateChangeWhatsApp={onNotifyGateChange}
            onNotifyDelayWhatsApp={onNotifyDelay}
            onUploadBoardingPass={onUploadBoardingPass}
            onDeleteBoardingPass={onDeleteBoardingPass}
          />
        )}

        {subTab === 'hotels' && (
          <ReservationsView
            trip={trip}
            reservations={reservations}
            onDeleteReservation={onDeleteReservation}
            onAddReservation={onAddReservation}
            onToggleReservationStatus={onToggleReservationStatus}
            onUpdateReservation={onUpdateReservation}
            onNotifyWhatsApp={onNotifyReservation}
          />
        )}

        {subTab === 'checklist' && (
          <ChecklistView
            trip={trip}
            checklistItems={checklistItems}
            onToggleItem={onToggleChecklistItem}
            onAddItem={onAddChecklistItem}
            onDeleteItem={onDeleteChecklistItem}
            onResetItems={onResetChecklistItems}
            onNotifyWhatsAppMessage={(msg) => onDispatchWhatsApp(msg, 'custom')}
          />
        )}

        {subTab === 'transfers' && (
          <TransfersView
            trip={trip}
            groundTransfers={groundTransfers}
            onAddTransfer={onAddTransfer}
            onDeleteTransfer={onDeleteTransfer}
            onNotifyWhatsAppMessage={(msg) => onDispatchWhatsApp(msg, 'custom')}
          />
        )}

        {subTab === 'map' && (
          <RouteMapView
            trip={trip}
            flights={flights}
            activities={activities}
            reservations={reservations}
            onUpdateFlightStatus={onUpdateFlightStatus}
            onToggleActivity={onToggleActivity}
            onNotifyWhatsAppMessage={(msg) => onDispatchWhatsApp(msg, 'itinerary_update')}
          />
        )}
      </div>

    </div>
  );
};
