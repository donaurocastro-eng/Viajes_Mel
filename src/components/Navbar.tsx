import React from 'react';
import { Trip } from '../types';
import { Plane, MessageSquare, Database, Sparkles, Plus, MapPin, Calendar, Smartphone } from 'lucide-react';

interface NavbarProps {
  trips: Trip[];
  activeTrip: Trip | null;
  onSelectTrip: (trip: Trip) => void;
  onOpenNewTripModal: () => void;
  onOpenAiPlanner: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenSupabaseModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSupabaseConnected: boolean;
  whatsAppLogsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onOpenNewTripModal,
  onOpenAiPlanner,
  onOpenWhatsAppModal,
  onOpenSupabaseModal,
  activeTab,
  setActiveTab,
  isSupabaseConnected,
  whatsAppLogsCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ViajeFlow
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Supabase & WhatsApp API
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Itinerarios, Vuelos y Notificaciones Automáticas
              </p>
            </div>
          </div>

          {/* Active Trip Selector Dropdown */}
          <div className="hidden md:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
            <MapPin className="w-4 h-4 text-emerald-400 ml-2" />
            <select
              value={activeTrip?.id || ''}
              onChange={(e) => {
                const selected = trips.find((t) => t.id === e.target.value);
                if (selected) onSelectTrip(selected);
              }}
              className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none px-2 py-1 pr-6 cursor-pointer"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.title} ({t.destination})
                </option>
              ))}
            </select>
            <button
              onClick={onOpenNewTripModal}
              title="Crear nuevo viaje"
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Integration Status Badges & Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* AI Generator Button */}
            <button
              onClick={onOpenAiPlanner}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Generar con IA</span>
            </button>

            {/* WhatsApp Integration Center */}
            <button
              onClick={onOpenWhatsAppModal}
              className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              title="Panel y Simulador de WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp API</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {whatsAppLogsCount > 0 && (
                <span className="ml-1 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-1.5 rounded-full">
                  {whatsAppLogsCount}
                </span>
              )}
            </button>

            {/* Supabase & Vercel Sync */}
            <button
              onClick={onOpenSupabaseModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isSupabaseConnected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Configurar Supabase y Vercel"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Supabase & Vercel</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </button>

          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 border-t border-slate-800 scrollbar-none text-xs sm:text-sm font-medium text-slate-400">
          {[
            { id: 'itinerary', label: 'Itinerario Diario', icon: Calendar },
            { id: 'flights', label: 'Vuelos y Puertas', icon: Plane },
            { id: 'reservations', label: 'Reservas e HOTELES', icon: MapPin },
            { id: 'activities', label: 'Actividades y Equipaje', icon: Sparkles },
            { id: 'whatsapp', label: 'Centro WhatsApp', icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
