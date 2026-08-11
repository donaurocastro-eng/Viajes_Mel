import React from 'react';
import { Trip } from '../types';
import { Plane, Sparkles, Plus, MapPin, Calendar, LayoutGrid, Settings, Smartphone, Globe, Bus } from 'lucide-react';

interface NavbarProps {
  trips: Trip[];
  activeTrip: Trip | null;
  onSelectTrip: (trip: Trip) => void;
  onOpenNewTripModal: () => void;
  onOpenAiPlanner: () => void;
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
          <div
            onClick={() => setActiveTab('trips_menu')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ViajeFlow
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  {activeTrip?.code || 'VAC-001'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Gestor de Viajes con Nomenclatura y Notificaciones
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
                if (selected) {
                  onSelectTrip(selected);
                  if (activeTab === 'trips_menu') setActiveTab('itinerary');
                }
              }}
              className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none px-2 py-1 pr-6 cursor-pointer"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  [{t.code || 'VAC'}] {t.title}
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

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* AI Generator Button */}
            <button
              onClick={onOpenAiPlanner}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Generar con IA</span>
            </button>

            {/* Unified Settings Button */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Configuración de WhatsApp, Supabase y Vercel"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Configuración</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </button>

          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800 scrollbar-none text-xs sm:text-sm font-medium text-slate-400">
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Always available: Trips Menu */}
            <button
              onClick={() => setActiveTab('trips_menu')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'trips_menu'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${activeTab === 'trips_menu' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Menú de Viajes</span>
            </button>

            {/* Trip Specific Tabs: Only shown when an active trip exists */}
            {activeTrip && (
              <>
                <span className="text-slate-700 hidden sm:inline">|</span>
                {[
                  { id: 'itinerary', label: 'Itinerario Diario', icon: Calendar },
                  { id: 'flights', label: 'Vuelos y Puertas', icon: Plane },
                  { id: 'transfers', label: 'Trayectos y Conexiones 🚌', icon: Bus },
                  { id: 'route_map', label: 'Mapa de Ruta Live 🗺️', icon: Globe },
                  { id: 'reservations', label: 'Reservas e HOTELES', icon: MapPin },
                  { id: 'activities', label: 'Actividades y Equipaje', icon: Sparkles },
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
              </>
            )}

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Settings Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'settings'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                  : 'hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-purple-400' : 'text-slate-400'}`} />
              <span>Configuración</span>
            </button>
          </div>

          {/* Helper hint when on Trips Menu */}
          {activeTab === 'trips_menu' && activeTrip && (
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Viaje activo: <strong className="text-slate-200 font-mono">[{activeTrip.code}] {activeTrip.title}</strong></span>
            </div>
          )}
        </nav>

      </div>
    </header>
  );
};

