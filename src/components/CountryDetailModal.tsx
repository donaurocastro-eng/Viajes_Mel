import React, { useState } from 'react';
import { VisitedCountry, TravelPhoto } from '../types';
import { X, MapPin, Calendar, Upload, Trash2, Maximize2, CheckCircle2, ChevronRight, ArrowRightLeft, Sparkles } from 'lucide-react';

interface CountryDetailModalProps {
  country: VisitedCountry;
  allCountries?: VisitedCountry[];
  photos: TravelPhoto[];
  onToggleVisited: (countryCode: string) => void;
  onOpenUpload: (countryCode: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onMovePhoto?: (photoId: string, targetCountryCode: string) => void;
  onClose: () => void;
}

export const CountryDetailModal: React.FC<CountryDetailModalProps> = ({
  country,
  allCountries = [],
  photos,
  onToggleVisited,
  onOpenUpload,
  onDeletePhoto,
  onMovePhoto,
  onClose,
}) => {
  const [activePhoto, setActivePhoto] = useState<TravelPhoto | null>(null);
  const [movingPhotoId, setMovingPhotoId] = useState<string | null>(null);

  const countryPhotos = photos.filter(p => p.countryCode === country.code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Country Hero Header */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl select-none">{country.flagEmoji}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{country.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {country.continent}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-300">
                {country.visited ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>🚩 Ya estuve aquí</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[11px]">
                    <span>Aún no visitado</span>
                  </span>
                )}

                {country.visitedDate && (
                  <span className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Visita: {country.visitedDate}</span>
                  </span>
                )}

                {country.tripName && (
                  <span className="text-emerald-400/90 font-medium">
                    • {country.tripName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleVisited(country.code)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border cursor-pointer ${
                country.visited
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              {country.visited ? 'Quitar Banderita' : '🚩 Marcar: Ya estuve aquí'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {country.notes && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300">
              <span className="font-semibold text-emerald-400">Bitácora: </span>
              {country.notes}
            </div>
          )}

          {/* Photos Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Álbum de Recuerdos</span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {countryPhotos.length} fotos
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Fotos tomadas en {country.name}</p>
            </div>
            <button
              onClick={() => onOpenUpload(country.code)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Fotos</span>
            </button>
          </div>

          {/* Photos Grid */}
          {countryPhotos.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">No hay fotos de {country.name} todavía</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Sube tus fotos de las ciudades, monumentos, comidas o recuerdos familiares para archivarlos en tu mapa mundial.
              </p>
              <button
                onClick={() => onOpenUpload(country.code)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                + Subir la primera foto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {countryPhotos.map((photo) => {
                const textLower = `${photo.city || ''} ${photo.title || ''} ${photo.notes || ''}`.toLowerCase();
                const looksLikePanama = country.code === 'HN' && (textLower.includes('panam') || textLower.includes('pty'));
                const looksLikePrague = country.code !== 'CZ' && (textLower.includes('praga') || textLower.includes('checoslovaqui') || textLower.includes('chequia') || textLower.includes('czech'));
                const looksLikeHungary = country.code !== 'HU' && (textLower.includes('hungri') || textLower.includes('budapest'));

                return (
                  <div
                    key={photo.id}
                    className={`group relative rounded-2xl overflow-hidden bg-slate-950 border transition-all shadow-md flex flex-col ${
                      looksLikePanama || looksLikePrague || looksLikeHungary
                        ? 'border-amber-500/70 ring-2 ring-amber-400/20' 
                        : 'border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    {/* Notice if photo belongs to Panama */}
                    {looksLikePanama && (
                      <div className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-3 py-1.5 flex items-center justify-between border-b border-amber-500/30">
                        <span>¿Es una foto de Panamá?</span>
                        {onMovePhoto && (
                          <button
                            onClick={() => onMovePhoto(photo.id, 'PA')}
                            className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black hover:bg-amber-300 transition-colors"
                          >
                            Mover a Panamá 🇵🇦
                          </button>
                        )}
                      </div>
                    )}

                    {/* Notice if photo belongs to Prague / Czechoslovakia */}
                    {looksLikePrague && (
                      <div className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-3 py-1.5 flex items-center justify-between border-b border-amber-500/30">
                        <span>¿Es de Ciudad de Praga?</span>
                        {onMovePhoto && (
                          <button
                            onClick={() => onMovePhoto(photo.id, 'CZ')}
                            className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black hover:bg-amber-300 transition-colors"
                          >
                            Mover a Praga 🇨🇿
                          </button>
                        )}
                      </div>
                    )}

                    {/* Notice if photo belongs to Hungary / Budapest */}
                    {looksLikeHungary && (
                      <div className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-3 py-1.5 flex items-center justify-between border-b border-amber-500/30">
                        <span>¿Es de Hungría / Budapest?</span>
                        {onMovePhoto && (
                          <button
                            onClick={() => onMovePhoto(photo.id, 'HU')}
                            className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black hover:bg-amber-300 transition-colors"
                          >
                            Mover a Hungría 🇭🇺
                          </button>
                        )}
                      </div>
                    )}

                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                      <img
                        src={photo.dataUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <button
                          onClick={() => setActivePhoto(photo)}
                          className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                          title="Ver en pantalla completa"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePhoto(photo.id)}
                          className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                          {photo.title}
                        </h4>
                        {photo.city && (
                          <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{photo.city}</span>
                          </p>
                        )}
                        {photo.notes && (
                          <p className="text-xs text-slate-300 mt-2 line-clamp-2 italic">
                            "{photo.notes}"
                          </p>
                        )}
                      </div>

                      {/* Move to another country selector */}
                      {onMovePhoto && (
                        <div className="pt-2 border-t border-slate-800">
                          {movingPhotoId === photo.id ? (
                            <div className="space-y-1.5 bg-slate-900 p-2 rounded-xl border border-slate-700">
                              <div className="text-[10px] font-bold text-slate-300 flex justify-between items-center">
                                <span>Reasignar a otro país:</span>
                                <button
                                  onClick={() => setMovingPhotoId(null)}
                                  className="text-slate-400 hover:text-white"
                                >
                                  ✕
                                </button>
                              </div>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    onMovePhoto(photo.id, e.target.value);
                                    setMovingPhotoId(null);
                                  }
                                }}
                                defaultValue=""
                                className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-1.5 rounded-lg"
                              >
                                <option value="" disabled>Seleccionar nuevo país...</option>
                                <option value="AR">🇦🇷 Argentina (Buenos Aires)</option>
                                <option value="CL">🇨🇱 Chile (Santiago)</option>
                                <option value="CZ">🇨🇿 República Checa (Checoslovaquia / Praga)</option>
                                <option value="HU">🇭🇺 Hungría (Budapest)</option>
                                <option value="PA">🇵🇦 Panamá</option>
                                <option value="HN">🇭🇳 Honduras</option>
                                <option value="US">🇺🇸 Estados Unidos</option>
                                <option value="ES">🇪🇸 España</option>
                                <option value="FR">🇫🇷 Francia</option>
                                <option value="IT">🇮🇹 Italia</option>
                                <option value="DE">🇩🇪 Alemania</option>
                                <option value="CR">🇨🇷 Costa Rica</option>
                                <option value="CO">🇨🇴 Colombia</option>
                                <option value="MX">🇲🇽 México</option>
                                {allCountries
                                  .filter(c => c.code !== country.code && !['AR', 'CL', 'CZ', 'HU', 'PA', 'HN', 'US', 'ES', 'FR', 'IT', 'DE', 'CR', 'CO', 'MX'].includes(c.code))
                                  .map(c => (
                                    <option key={c.code} value={c.code}>
                                      {c.flagEmoji} {c.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          ) : (
                            <button
                              onClick={() => setMovingPhotoId(photo.id)}
                              className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Mover a otro país...</span>
                            </button>
                          )}
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{photo.date}</span>
                        <button
                          onClick={() => setActivePhoto(photo)}
                          className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Ampliar</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 p-2 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={activePhoto.dataUrl}
                alt={activePhoto.title}
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
              <div className="text-center mt-3 text-white">
                <h4 className="text-lg font-bold">{activePhoto.title}</h4>
                <p className="text-sm text-slate-400">{activePhoto.city || country.name} • {activePhoto.date}</p>
                {activePhoto.notes && <p className="text-xs text-slate-300 mt-1 italic max-w-lg">{activePhoto.notes}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {country.visited ? `🚩 ${country.name} tiene banderita en tu mapa mundial` : 'Sin visitar'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
