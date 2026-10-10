import React, { useState, useRef, MouseEvent } from 'react';
import { VisitedCountry, TravelPhoto, ContinentName } from '../types';
import { WORLD_COUNTRIES_CATALOG } from '../data/worldCountries';
import { 
  Globe, 
  MapPin, 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Flag,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  X,
  RotateCcw,
  Check,
  Eye,
  Compass,
  Cloud,
  Database
} from 'lucide-react';
import fixedMapImage from '../assets/images/world_map_continents_1791216231996.jpg';

interface WorldTravelMapProps {
  countries: VisitedCountry[];
  photos: TravelPhoto[];
  isSupabaseConnected?: boolean;
  onOpenSettings?: () => void;
  onToggleVisited: (countryCode: string) => void;
  onOpenUpload: (countryCode?: string) => void;
  onSelectCountry: (country: VisitedCountry) => void;
  onAddCustomCountry?: (country: VisitedCountry) => void;
}

// Reliable coordinate resolver ensuring percentage coordinates (0-100) are always returned
const getFlagCoords = (country: VisitedCountry): { x: number; y: number } => {
  const catalogEntry = WORLD_COUNTRIES_CATALOG.find(c => c.code === country.code);
  let x = catalogEntry?.svgCoords?.x ?? country.svgCoords?.x ?? 50;
  let y = catalogEntry?.svgCoords?.y ?? country.svgCoords?.y ?? 50;

  // If old 1000x640 scale:
  if (x > 100) x = (x / 1000) * 100;
  if (y > 100) y = (y / 640) * 100;

  // If catalog has modern percentage coordinates, prefer catalog coordinates
  if (catalogEntry?.svgCoords && catalogEntry.svgCoords.x <= 100) {
    x = catalogEntry.svgCoords.x;
    y = catalogEntry.svgCoords.y;
  }
  return { x, y };
};

export const WorldTravelMap: React.FC<WorldTravelMapProps> = ({
  countries,
  photos,
  isSupabaseConnected = false,
  onOpenSettings,
  onToggleVisited,
  onOpenUpload,
  onSelectCountry,
  onAddCustomCountry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [activePopupCountry, setActivePopupCountry] = useState<VisitedCountry | null>(null);

  // View Mode: 'visited_only' (solo banderas clavadas) o 'all_countries' (ver todos los países en el mapa)
  const [viewFilter, setViewFilter] = useState<'visited_only' | 'all_countries'>('visited_only');

  // Custom Country Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCapital, setCustomCapital] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🚩');
  const [customContinent, setCustomContinent] = useState<ContinentName>('Europe');

  // Pan & Zoom controls for the fixed map
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapViewportRef = useRef<HTMLDivElement>(null);

  // Filtered countries
  const visitedCountries = countries.filter(c => c.visited);
  const visitedCount = visitedCountries.length;
  const worldPercentage = ((visitedCount / Math.max(countries.length, 1)) * 100).toFixed(1);

  // Countries to render on map depending on viewFilter
  const countriesToRender = viewFilter === 'visited_only' ? visitedCountries : countries;

  // Filtered countries for the quick-add search dropdown (checks name, capital, code, continent, aliases)
  const searchResults = searchQuery.trim()
    ? countries.filter(c => {
        const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const nameMatch = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q);
        const codeMatch = c.code.toLowerCase().includes(q);
        const continentMatch = c.continent.toLowerCase().includes(q);
        const capMatch = c.capital ? c.capital.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) : false;
        const aliasMatch = c.aliases ? c.aliases.some(a => a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)) : false;
        return nameMatch || codeMatch || continentMatch || capMatch || aliasMatch;
      }).slice(0, 10)
    : [];

  // Pan / Drag handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setActivePopupCountry(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.35, 3.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Focus and center on a specific country on the fixed map
  const handleFocusCountry = (country: VisitedCountry) => {
    setActivePopupCountry(country);
    const coords = getFlagCoords(country);
    const targetZoom = 2.0;
    setZoomLevel(targetZoom);

    // Calculate exact pixel offset relative to center of map container
    if (mapViewportRef.current) {
      const containerWidth = mapViewportRef.current.clientWidth || 1000;
      const containerHeight = mapViewportRef.current.clientHeight || 650;
      // Map base width is min(containerWidth - 32, 1200)
      const mapWidth = Math.min(containerWidth - 32, 1200);
      const mapHeight = mapWidth * (9 / 16);

      // Flag position in map container coordinates (from center):
      const flagX = ((coords.x - 50) / 100) * mapWidth;
      const flagY = ((coords.y - 50) / 100) * mapHeight;

      // To bring this flag to center at targetZoom:
      const offsetX = -flagX * targetZoom;
      const offsetY = -flagY * targetZoom;
      setPanPosition({ x: Math.round(offsetX), y: Math.round(offsetY) });
    } else {
      const offsetX = (50 - coords.x) * 11;
      const offsetY = (50 - coords.y) * 8;
      setPanPosition({ x: Math.round(offsetX), y: Math.round(offsetY) });
    }
  };

  // Add country and focus on it
  const handleAddCountry = (country: VisitedCountry) => {
    if (!country.visited) {
      onToggleVisited(country.code);
    }
    setSearchQuery('');
    setIsAddMenuOpen(false);
    handleFocusCountry(country);
  };

  // Add Custom Country submission
  const handleCreateCustomCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const code = `CUSTOM-${Date.now().toString().slice(-4)}`;
    // Assign reasonable default coords based on continent
    let coords: { x: number; y: number } = { x: 50, y: 50 };
    if (customContinent === 'Europe') coords = { x: 53.0, y: 22.0 };
    else if (customContinent === 'North America') coords = { x: 25.0, y: 45.0 };
    else if (customContinent === 'South America') coords = { x: 32.0, y: 65.0 };
    else if (customContinent === 'Asia') coords = { x: 75.0, y: 40.0 };
    else if (customContinent === 'Africa') coords = { x: 55.0, y: 55.0 };
    else if (customContinent === 'Oceania') coords = { x: 86.0, y: 72.0 };

    const newCountry: VisitedCountry = {
      code,
      name: customName.trim(),
      continent: customContinent,
      flagEmoji: customEmoji || '🚩',
      coordinates: [0, 0],
      svgCoords: coords,
      visited: true,
      visitedDate: new Date().toISOString().split('T')[0],
      capital: customCapital.trim() || undefined,
      aliases: [customName.trim(), customCapital.trim()].filter(Boolean),
    };

    if (onAddCustomCountry) {
      onAddCustomCountry(newCountry);
    } else {
      onToggleVisited(newCountry.code);
    }

    setIsCustomModalOpen(false);
    setCustomName('');
    setCustomCapital('');
    handleFocusCountry(newCountry);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          HEADER SUMMARY & METRICS
          ========================================================================= */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Mapa Mundial & Bitácora de Viajes</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Mapamundi</span>
              <span className="text-emerald-400 font-semibold text-sm sm:text-base">· Banderas de Viaje 🚩</span>
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Banderas interactivas en el mapa. Haz clic en cualquier país para ver recuerdos o registrar fotos.
            </p>
          </div>

          {/* Quick Metrics & Upload Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-center min-w-[80px] shadow-sm">
              <span className="block text-lg font-bold text-emerald-400 font-mono">
                {visitedCount}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                🚩 Países
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-center min-w-[80px] shadow-sm">
              <span className="block text-lg font-bold text-sky-400 font-mono">
                {photos.length}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                📸 Fotos
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-center min-w-[80px] shadow-sm">
              <span className="block text-lg font-bold text-amber-400 font-mono">
                {worldPercentage}%
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                🌍 Mundo
              </span>
            </div>

            {/* Supabase Status Indicator */}
            {isSupabaseConnected ? (
              <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-center min-w-[80px] shadow-sm flex flex-col items-center justify-center">
                <span className="flex items-center text-[11px] font-bold text-emerald-400 gap-1">
                  <Database className="w-3 h-3" /> Supabase
                </span>
                <span className="text-[9px] text-emerald-300/80 font-medium mt-0.5">
                  ✓ Conectado
                </span>
              </div>
            ) : (
              onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-center text-xs font-semibold text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                  title="Conectar tu base de datos Supabase para registrar y guardar tus fotos y viajes"
                >
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Conectar Supabase</span>
                </button>
              )
            )}

            <button
              onClick={() => onOpenUpload()}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto</span>
            </button>
          </div>
        </div>

        {/* Visited Country Flag Chips Quick Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Flag className="w-3 h-3 text-emerald-400" />
            <span>Banderas fijadas ({visitedCount}):</span>
          </span>

          {visitedCountries.length === 0 ? (
            <span className="text-[11px] text-slate-500 italic">
              Aún no tienes banderitas fijadas. Usa el buscador o los accesos rápidos abajo para clavar tu primera bandera.
            </span>
          ) : (
            visitedCountries.map((vc) => {
              const count = photos.filter(p => p.countryCode === vc.code).length;
              const isSelected = activePopupCountry?.code === vc.code;
              return (
                <button
                  key={vc.code}
                  onClick={() => handleFocusCountry(vc)}
                  className={`group flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Centrar ${vc.name} en el mapa`}
                >
                  <span className="text-xs leading-none">{vc.flagEmoji}</span>
                  <span>{vc.name}</span>
                  <span className={`text-[9px] ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                    🚩
                  </span>
                  {count > 0 && (
                    <span className={`text-[9px] font-mono px-1 rounded ${
                      isSelected ? 'bg-slate-900/30 text-slate-950' : 'bg-amber-400/15 text-amber-300'
                    }`}>
                      📸{count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Featured Suggestions: Directly plant flags on requested places (Praga / Checoslovaquia, Hungría, etc.) */}
        <div className="mt-2.5 flex items-center flex-wrap gap-1.5 text-[11px] text-slate-400">
          <span className="font-medium text-slate-400">💡 Acceso rápido:</span>
          
          {/* Praga / Checoslovaquia shortcut */}
          {(() => {
            const cz = countries.find(c => c.code === 'CZ');
            if (!cz) return null;
            return (
              <button
                onClick={() => cz.visited ? handleFocusCountry(cz) : handleAddCountry(cz)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  cz.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇨🇿</span>
                <span>Praga</span>
                <span>{cz.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* Hungría / Budapest shortcut */}
          {(() => {
            const hu = countries.find(c => c.code === 'HU');
            if (!hu) return null;
            return (
              <button
                onClick={() => hu.visited ? handleFocusCountry(hu) : handleAddCountry(hu)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  hu.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇭🇺</span>
                <span>Hungría</span>
                <span>{hu.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* Argentina */}
          {(() => {
            const ar = countries.find(c => c.code === 'AR');
            if (!ar) return null;
            return (
              <button
                onClick={() => ar.visited ? handleFocusCountry(ar) : handleAddCountry(ar)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  ar.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇦🇷</span>
                <span>Argentina</span>
                <span>{ar.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* Chile */}
          {(() => {
            const cl = countries.find(c => c.code === 'CL');
            if (!cl) return null;
            return (
              <button
                onClick={() => cl.visited ? handleFocusCountry(cl) : handleAddCountry(cl)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  cl.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇨🇱</span>
                <span>Chile</span>
                <span>{cl.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* España */}
          {(() => {
            const es = countries.find(c => c.code === 'ES');
            if (!es) return null;
            return (
              <button
                onClick={() => es.visited ? handleFocusCountry(es) : handleAddCountry(es)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  es.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇪🇸</span>
                <span>España</span>
                <span>{es.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* Portugal */}
          {(() => {
            const pt = countries.find(c => c.code === 'PT');
            if (!pt) return null;
            return (
              <button
                onClick={() => pt.visited ? handleFocusCountry(pt) : handleAddCountry(pt)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  pt.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇵🇹</span>
                <span>Portugal</span>
                <span>{pt.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* Francia */}
          {(() => {
            const fr = countries.find(c => c.code === 'FR');
            if (!fr) return null;
            return (
              <button
                onClick={() => fr.visited ? handleFocusCountry(fr) : handleAddCountry(fr)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  fr.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇫🇷</span>
                <span>Francia</span>
                <span>{fr.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}

          {/* Italia */}
          {(() => {
            const it = countries.find(c => c.code === 'IT');
            if (!it) return null;
            return (
              <button
                onClick={() => it.visited ? handleFocusCountry(it) : handleAddCountry(it)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  it.visited 
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span>🇮🇹</span>
                <span>Italia</span>
                <span>{it.visited ? '🚩' : '➕'}</span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* =========================================================================
          CONTROLS BAR: SEARCH / CLAVAR BANDERITA, VIEW FILTER & ZOOM
          ========================================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-md">
        
        {/* Search & Add Pin */}
        <div className="relative flex-1 max-w-lg">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsAddMenuOpen(true);
                }}
                onFocus={() => setIsAddMenuOpen(true)}
                placeholder="Buscar país o ciudad... (ej. Praga, Hungría, Checoslovaquia, España...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setCustomName(searchQuery.trim());
                setIsCustomModalOpen(true);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
              title="Agregar país o ciudad no listada"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Agregar Destino</span>
            </button>
          </div>

          {/* Autocomplete dropdown with aliases and capital detection */}
          {isAddMenuOpen && (searchQuery.trim() || searchResults.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1 flex justify-between items-center">
                <span>Resultados de Países y Ciudades</span>
                <button
                  onClick={() => setIsAddMenuOpen(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-3 text-center">
                  <p className="text-xs text-slate-400 mb-2">
                    No encontramos "{searchQuery}" en la lista predeterminada.
                  </p>
                  <button
                    onClick={() => {
                      setCustomName(searchQuery.trim());
                      setIsAddMenuOpen(false);
                      setIsCustomModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>¡Agregar "{searchQuery}" como nuevo destino!</span>
                  </button>
                </div>
              ) : (
                searchResults.map((c) => {
                  return (
                    <div
                      key={c.code}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-2xl">{c.flagEmoji}</span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {c.capital && (
                              <span className="text-[10px] text-emerald-400 font-normal">
                                • {c.capital}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {c.continent} {c.visited ? '• 🚩 Banderita fijada' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {c.visited ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                handleFocusCountry(c);
                                setIsAddMenuOpen(false);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Ver en mapa 📍
                            </button>
                            <button
                              onClick={() => onToggleVisited(c.code)}
                              className="p-1 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition-colors cursor-pointer"
                              title="Quitar banderita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddCountry(c)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-lg transition-colors shadow flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>¡Clavar Banderita! 🚩</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* View Filter Toggle & Zoom Controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {/* Toggle between Visited Only vs All Countries */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
            <button
              onClick={() => setViewFilter('visited_only')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewFilter === 'visited_only'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ver únicamente las banderas de los países que has visitado"
            >
              <span>🚩 Solo Visitados ({visitedCount})</span>
            </button>
            <button
              onClick={() => setViewFilter('all_countries')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewFilter === 'all_countries'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ver todos los países en el mapa para explorar y clavar banderas"
            >
              <span>🌍 Ver Todos ({countries.length})</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Acercar mapa"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Alejar mapa"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
                title="Restablecer vista"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE FIXED MAP VIEWPORT WITH VISITED FLAGS PINNED ON TOP
          ========================================================================= */}
      <div 
        ref={mapViewportRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[620px] sm:h-[680px] rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-[#091b33] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Floating Hint Overlay */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">
              {viewFilter === 'visited_only' 
                ? `Mostrando ${visitedCount} banderitas fijadas • Clic en cualquiera para ver álbum`
                : `Modo exploración mundial: ${countries.length} países disponibles • Clic para clavar banderita`}
            </span>
          </div>
        </div>

        {/* Transformable Container for Map & Flags */}
        <div
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative w-full h-full flex items-center justify-center p-2 sm:p-4"
        >
          {/* Base Fixed Map Image Container */}
          <div className="relative w-full max-w-[1200px] aspect-[16/9] shadow-2xl rounded-2xl border border-white/20">
            <img
              src={fixedMapImage}
              alt="Mapa Mundial de Continentes Fijo"
              className="w-full h-full object-cover select-none pointer-events-none rounded-2xl"
              onError={(e) => {
                // Fallback to public path if needed
                (e.target as HTMLImageElement).src = '/world_map_fixed.jpg';
              }}
            />

            {/* =================================================================
                FLAGS PINNED ON THE FIXED MAP
                ================================================================= */}
            {countriesToRender.map((country) => {
              const coords = getFlagCoords(country);
              const countryPhotos = photos.filter(p => p.countryCode === country.code);
              const isSelected = activePopupCountry?.code === country.code;
              const isVisited = country.visited;

              return (
                <div
                  key={country.code}
                  style={{
                    position: 'absolute',
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -100%)',
                    zIndex: isSelected ? 60 : isVisited ? 40 : 20,
                    pointerEvents: 'auto',
                  }}
                  className="group flex flex-col items-center cursor-pointer select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopupCountry(country);
                  }}
                >
                  {/* Scaled & Refined Flag Pin */}
                  <div
                    style={{
                      transform: isSelected ? 'scale(1.1)' : undefined,
                      transition: 'all 0.15s ease-out',
                    }}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-md shadow-lg border backdrop-blur-md transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-white ring-2 ring-emerald-300/70 shadow-emerald-500/40'
                        : isVisited
                        ? 'bg-slate-950/90 hover:bg-slate-900 text-white border-emerald-500/60 hover:border-emerald-400'
                        : 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-xs leading-none select-none">{country.flagEmoji}</span>
                    <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
                      {country.name}
                    </span>
                    {isVisited && (
                      <span className={`text-[8px] ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                        🚩
                      </span>
                    )}
                    {countryPhotos.length > 0 && (
                      <span className={`text-[8px] font-mono px-1 py-0.2 rounded font-semibold ${
                        isSelected ? 'bg-slate-900/30 text-slate-950' : 'bg-amber-400/20 text-amber-300'
                      }`}>
                        📸{countryPhotos.length}
                      </span>
                    )}
                  </div>

                  {/* Slender Needle / Pole */}
                  <div className={`w-[1.5px] h-2.5 ${
                    isVisited 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-500'
                  }`} />

                  {/* Compact Anchor Dot */}
                  <div className="relative flex items-center justify-center -mt-0.5">
                    {isVisited ? (
                      <>
                        <span className="absolute w-3 h-3 rounded-full bg-emerald-400/50 animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white shadow-sm" />
                      </>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-white" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            ACTIVE COUNTRY POPUP MODAL / CARD OVERLAY
            ========================================================================= */}
        {activePopupCountry && (
          <div className="absolute bottom-3 right-3 z-40 max-w-xs sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-xl p-3.5 text-white animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-2xl select-none">{activePopupCountry.flagEmoji}</span>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">
                    {activePopupCountry.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    {activePopupCountry.visited ? (
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        🚩 Ya estuve aquí
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        🗺️ No visitado aún
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      • {activePopupCountry.continent}
                    </span>
                  </div>
                  {activePopupCountry.capital && (
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      Capital: <strong>{activePopupCountry.capital}</strong>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setActivePopupCountry(null)}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Travel metadata */}
            {activePopupCountry.visited && activePopupCountry.visitedDate && (
              <div className="text-xs text-slate-300 flex items-center gap-1.5 mb-2 bg-slate-950/60 p-2 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fecha: <strong>{activePopupCountry.visitedDate}</strong></span>
              </div>
            )}

            {/* Photo Preview Thumbnail */}
            {(() => {
              const countryPhotos = photos.filter(p => p.countryCode === activePopupCountry.code);
              const latestPhoto = countryPhotos[0];
              return latestPhoto ? (
                <div 
                  onClick={() => onSelectCountry(activePopupCountry)}
                  className="relative h-28 rounded-xl overflow-hidden mb-3 cursor-pointer group bg-slate-950 border border-slate-800"
                >
                  <img
                    src={latestPhoto.dataUrl}
                    alt={activePopupCountry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    📸 {countryPhotos.length} {countryPhotos.length === 1 ? 'foto' : 'fotos'}
                  </span>
                </div>
              ) : null;
            })()}

            {/* Action buttons */}
            <div className="flex flex-col gap-1.5">
              {activePopupCountry.visited ? (
                <>
                  <button
                    onClick={() => onSelectCountry(activePopupCountry)}
                    className="w-full py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>📸 Ver Álbum ({photos.filter(p => p.countryCode === activePopupCountry.code).length})</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenUpload(activePopupCountry.code)}
                      className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Subir Foto</span>
                    </button>
                    <button
                      onClick={() => {
                        onToggleVisited(activePopupCountry.code);
                        setActivePopupCountry(null);
                      }}
                      className="py-1.5 px-2.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold rounded-xl transition-colors border border-rose-500/30 cursor-pointer"
                      title="Quitar banderita de este país"
                    >
                      Quitar
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      onToggleVisited(activePopupCountry.code);
                      handleFocusCountry({ ...activePopupCountry, visited: true });
                    }}
                    className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>¡Clavar Banderita! 🚩</span>
                  </button>
                  <button
                    onClick={() => onOpenUpload(activePopupCountry.code)}
                    className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Subir Foto a este Destino</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ALBUMS GALLERY GRID BY VISITED COUNTRY
          ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-base">📸</span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Tus Álbumes por País Visitado ({visitedCount})
            </h2>
          </div>
          <button
            onClick={() => onOpenUpload()}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>+ Subir más fotos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {visitedCountries.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <Flag className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-white mb-1">
              No tienes países con banderita aún
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Usa el mapa arriba para clavar tu primera banderita o sube fotos para desbloquear países automáticamente.
            </p>
            <button
              onClick={() => onOpenUpload()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Subir tu primera foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {visitedCountries.map((c) => {
              const countryPhotos = photos.filter(p => p.countryCode === c.code);
              const coverPhoto = countryPhotos[0];

              return (
                <div
                  key={c.code}
                  className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-md overflow-hidden transition-all duration-300 hover:shadow-emerald-500/10 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Card Cover */}
                  <div
                    onClick={() => onSelectCountry(c)}
                    className="relative h-36 bg-slate-950 cursor-pointer overflow-hidden"
                  >
                    {coverPhoto ? (
                      <img
                        src={coverPhoto.dataUrl}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-gradient-to-br from-slate-950 to-slate-900 p-4 text-center">
                        <ImageIcon className="w-7 h-7 mb-1.5 opacity-40 text-emerald-400" />
                        <span className="text-xs font-medium text-slate-400">Sin fotos aún</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Haz clic para añadir</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Badge Flag & Code */}
                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-800 shadow">
                      <span className="text-sm leading-none">{c.flagEmoji}</span>
                      <span className="text-[11px] font-bold text-white">{c.code}</span>
                    </div>

                    {/* Photo count pill */}
                    <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow flex items-center space-x-1">
                      <span>📸 {countryPhotos.length}</span>
                    </div>

                    {/* Country Name on bottom */}
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <h3 className="text-sm font-bold text-white truncate drop-shadow-md">
                        {c.name}
                      </h3>
                      {c.capital && (
                        <p className="text-[10px] text-slate-300 drop-shadow">
                          {c.capital}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() => handleFocusCountry(c)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                      title="Enfocar en el mapa"
                    >
                      <span>Centrar 📍</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenUpload(c.code)}
                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors cursor-pointer border border-emerald-500/30"
                        title="Subir fotos a este país"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectCountry(c)}
                        className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Ver Fotos</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          CUSTOM COUNTRY / CITY MODAL
          ========================================================================= */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base">Agregar Destino o Ciudad</h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomCountry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nombre del País o Ciudad <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej: Ciudad de Praga, Budapest, etc."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Ciudad o Lugar Específico
                </label>
                <input
                  type="text"
                  value={customCapital}
                  onChange={(e) => setCustomCapital(e.target.value)}
                  placeholder="Ej: Praga, Castillo de Praga..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Continente
                  </label>
                  <select
                    value={customContinent}
                    onChange={(e) => setCustomContinent(e.target.value as ContinentName)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Europe">Europa</option>
                    <option value="North America">América del Norte / Central</option>
                    <option value="South America">América del Sur</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">África</option>
                    <option value="Oceania">Oceanía</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Emoji / Bandera
                  </label>
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400">Emojis sugeridos:</span>
                {['🇨🇿', '🇭🇺', '🇸🇰', '🇦🇹', '🇵🇱', '🇩🇪', '🇫🇷', '🇪🇸', '🇮🇹', '🇬🇧', '🇵🇦', '🇭🇳', '🚩'].map(emoji => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setCustomEmoji(emoji)}
                    className="text-lg p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>¡Clavar Banderita! 🚩</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
