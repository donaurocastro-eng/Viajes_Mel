import React from 'react';
import { Trip } from '../types';
import { APP_VERSION_INFO } from '../version';
import { Plane, Globe, Calendar, DollarSign, FolderKanban, Settings, Upload, Plus, ChevronDown } from 'lucide-react';

interface NavbarProps {
  trips: Trip[];
  activeTrip: Trip | null;
  onSelectTrip: (trip: Trip) => void;
  onOpenNewTripModal: () => void;
  onOpenAiPlanner: () => void;
  onOpenCurrencyConverter?: () => void;
  onOpenPhotoUpload?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSupabaseConnected: boolean;
  visitedCountriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onOpenNewTripModal,
  onOpenPhotoUpload,
  activeTab,
  setActiveTab,
  isSupabaseConnected,
  visitedCountriesCount,
}) => {
  const mainNavItems = [
    {
      id: 'world_map',
      label: 'Mapa & Recuerdos',
      badge: `${visitedCountriesCount} 🚩`,
      icon: Globe,
      description: 'Mapamundi y fotos'
    },
    {
      id: 'trip_plan',
      label: 'Plan de Viaje',
      icon: Calendar,
      description: 'Itinerario, vuelos y reservas'
    },
    {
      id: 'finances',
      label: 'Gastos & Divisas',
      icon: DollarSign,
      description: 'Presupuesto y monedas'
    },
    {
      id: 'trips_menu',
      label: 'Mis Viajes',
      icon: FolderKanban,
      description: 'Lista de viajes y nuevo'
    },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Clean Row */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('world_map')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ViajeFlow
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                  {visitedCountriesCount} países 🚩
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Bitácora de Viajes & Mapa Mundial
              </p>
            </div>
          </div>

          {/* Clean Main Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              // If activeTab is any sub-tab of trip_plan (itinerary, flights, reservations, checklist, transfers), highlight trip_plan
              const isTripPlanSubtab = ['trip_plan', 'itinerary', 'flights', 'reservations', 'checklist', 'transfers', 'activities'].includes(activeTab);
              const isFinancesSubtab = ['finances', 'expenses'].includes(activeTab);
              
              let isActive = false;
              if (item.id === 'trip_plan' && isTripPlanSubtab) isActive = true;
              else if (item.id === 'finances' && isFinancesSubtab) isActive = true;
              else if (item.id === activeTab) isActive = true;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded-full border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Quick Upload Photos Button */}
            {onOpenPhotoUpload && (
              <button
                onClick={onOpenPhotoUpload}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
                title="Subir fotos a tus países visitados"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Subir Fotos</span>
              </button>
            )}

            {/* Active Trip Selector Pill */}
            {activeTrip && (
              <div className="hidden lg:flex items-center bg-slate-800/70 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
                <span className="text-slate-400 mr-1.5">Viaje:</span>
                <select
                  value={activeTrip.id}
                  onChange={(e) => {
                    const sel = trips.find(t => t.id === e.target.value);
                    if (sel) onSelectTrip(sel);
                  }}
                  className="bg-transparent font-bold text-slate-200 focus:outline-none cursor-pointer pr-1 truncate max-w-[130px]"
                >
                  {trips.map(t => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Settings Icon Button */}
            <button
              onClick={() => setActiveTab('settings')}
              title={`Configuración (${APP_VERSION_INFO.version})`}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Settings className="w-4 h-4 text-purple-400" />
            </button>

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar (Only for mobile viewports) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 overflow-x-auto text-xs">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isTripPlanSubtab = ['trip_plan', 'itinerary', 'flights', 'reservations', 'checklist', 'transfers', 'activities'].includes(activeTab);
            const isFinancesSubtab = ['finances', 'expenses'].includes(activeTab);

            let isActive = false;
            if (item.id === 'trip_plan' && isTripPlanSubtab) isActive = true;
            else if (item.id === 'finances' && isFinancesSubtab) isActive = true;
            else if (item.id === activeTab) isActive = true;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-lg font-medium transition-all ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
