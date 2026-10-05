import React, { useState, useRef, useEffect } from 'react';
import { VisitedCountry, TravelPhoto } from '../types';
import { X, Upload, Image as ImageIcon, MapPin, Calendar, Check, AlertCircle, Sparkles, Search, Globe, ChevronDown } from 'lucide-react';

interface PhotoUploadModalProps {
  countries: VisitedCountry[];
  preselectedCountryCode?: string;
  onSavePhoto: (photo: Omit<TravelPhoto, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  countries,
  preselectedCountryCode,
  onSavePhoto,
  onClose,
}) => {
  // Respect preselected country if provided; otherwise pick from prop or default
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() => {
    if (preselectedCountryCode) return preselectedCountryCode;
    return 'PA'; // Default to Panama if none preselected or let user choose
  });

  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoDetectNotice, setAutoDetectNotice] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when preselectedCountryCode changes
  useEffect(() => {
    if (preselectedCountryCode) {
      setSelectedCountryCode(preselectedCountryCode);
    }
  }, [preselectedCountryCode]);

  // Intelligent country detection from text or filename
  const detectCountryFromText = (text: string) => {
    if (!text) return;
    const clean = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Direct check for Prague / Czechoslovakia / Czech Republic
    if (
      clean.includes('praga') ||
      clean.includes('prague') ||
      clean.includes('checoslovaqui') ||
      clean.includes('chequia') ||
      clean.includes('republica checa') ||
      clean.includes('czech')
    ) {
      const cz = countries.find(c => c.code === 'CZ');
      if (cz) {
        setSelectedCountryCode('CZ');
        setAutoDetectNotice('✨ ¡Detectada Ciudad de Praga! Se archivará en 🇨🇿 República Checa (Checoslovaquia).');
        setTimeout(() => setAutoDetectNotice(null), 5000);
        return;
      }
    }

    // 2. Direct check for Hungary / Budapest
    if (
      clean.includes('hungri') ||
      clean.includes('budapest') ||
      clean.includes('hungary') ||
      clean.includes('magyar')
    ) {
      const hu = countries.find(c => c.code === 'HU');
      if (hu) {
        setSelectedCountryCode('HU');
        setAutoDetectNotice('✨ ¡Detectada Hungría / Budapest! Se archivará en 🇭🇺 Hungría.');
        setTimeout(() => setAutoDetectNotice(null), 5000);
        return;
      }
    }

    // 3. Direct check for Panama
    if (clean.includes('panama') || clean.includes('pty') || clean.includes('bocas del toro') || clean.includes('san blas')) {
      setSelectedCountryCode('PA');
      setAutoDetectNotice('¡Detectado Panamá! La foto se guardará en 🇵🇦 Panamá.');
      setTimeout(() => setAutoDetectNotice(null), 4000);
      return;
    }

    // 4. Direct check for Honduras
    if (clean.includes('honduras') || clean.includes('tegucigalpa') || clean.includes('roatan') || clean.includes('palmerola') || clean.includes('san pedro sula')) {
      setSelectedCountryCode('HN');
      setAutoDetectNotice('¡Detectado Honduras! La foto se guardará en 🇭🇳 Honduras.');
      setTimeout(() => setAutoDetectNotice(null), 4000);
      return;
    }

    // 5. Check against all countries, capitals and aliases
    for (const c of countries) {
      const cNameClean = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (clean.includes(cNameClean)) {
        setSelectedCountryCode(c.code);
        setAutoDetectNotice(`¡Detectado ${c.name}! La foto se guardará en ${c.flagEmoji} ${c.name}.`);
        setTimeout(() => setAutoDetectNotice(null), 4000);
        return;
      }
      if (c.capital) {
        const capClean = c.capital.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (clean.includes(capClean)) {
          setSelectedCountryCode(c.code);
          setAutoDetectNotice(`¡Detectada ciudad de ${c.capital}! La foto se guardará en ${c.flagEmoji} ${c.name}.`);
          setTimeout(() => setAutoDetectNotice(null), 4000);
          return;
        }
      }
      if (c.aliases) {
        for (const alias of c.aliases) {
          const aliasClean = alias.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (clean.includes(aliasClean)) {
            setSelectedCountryCode(c.code);
            setAutoDetectNotice(`¡Detectado ${alias}! La foto se guardará en ${c.flagEmoji} ${c.name}.`);
            setTimeout(() => setAutoDetectNotice(null), 4000);
            return;
          }
        }
      }
    }
  };

  // Resize and compress image using HTML Canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPEG, PNG, WEBP).');
      return;
    }

    setError(null);
    setIsProcessing(true);

    // Check filename for country name
    detectCountryFromText(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setImagePreview(compressedDataUrl);
          if (!title) {
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
          }
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setError('No se pudo cargar la imagen seleccionada.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    detectCountryFromText(val);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    detectCountryFromText(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Debes cargar una foto para continuar.');
      return;
    }

    const countryObj = countries.find(c => c.code === selectedCountryCode);
    const countryName = countryObj ? countryObj.name : 'Destino';

    onSavePhoto({
      countryCode: selectedCountryCode,
      countryName,
      city: city.trim() || undefined,
      title: title.trim() || `Recuerdo en ${countryName}`,
      dataUrl: imagePreview,
      date,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const selectedCountry = countries.find(c => c.code === selectedCountryCode);

  // Filtered countries list for search
  const filteredCountries = countries.filter(c => {
    if (!countrySearch.trim()) return true;
    const q = countrySearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nameMatch = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q);
    const codeMatch = c.code.toLowerCase().includes(q);
    const continentMatch = c.continent.toLowerCase().includes(q);
    const capitalMatch = c.capital ? c.capital.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) : false;
    const aliasMatch = c.aliases ? c.aliases.some(a => a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q)) : false;
    return nameMatch || codeMatch || continentMatch || capitalMatch || aliasMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-750 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Subir Foto de Viaje</h2>
              <p className="text-xs text-slate-400">Asigna la foto al país correcto y fijará su banderita en el mapa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="flex items-center space-x-2 text-rose-300 bg-rose-500/15 border border-rose-500/30 px-3.5 py-2.5 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {autoDetectNotice && (
            <div className="flex items-center space-x-2 text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{autoDetectNotice}</span>
            </div>
          )}

          {/* Prominent Country Destination Confirmation Box */}
          <div className="bg-slate-950/90 border-2 border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3">
              <span className="text-3xl select-none">{selectedCountry?.flagEmoji || '🌍'}</span>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Esta foto se archivará en:
                </div>
                <div className="text-base font-black text-white flex items-center gap-2">
                  <span>{selectedCountry?.name || 'Selecciona país'}</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {selectedCountry?.continent}
                  </span>
                </div>
                {selectedCountry?.capital && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    🏛️ Capital / Ciudad: <strong>{selectedCountry.capital}</strong>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg shadow-sm">
                <span>🚩 {selectedCountry?.code}</span>
              </span>
            </div>
          </div>

          {/* Photo Dropzone / Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Fotografía <span className="text-emerald-400">*</span>
            </label>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-52 object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Cambiar Fotografía</span>
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/80"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  Arrastra tu fotografía aquí o haz clic para explorar
                </p>
                <p className="text-xs text-slate-400">
                  Soporta JPEG, PNG, WEBP (se optimiza y comprime automáticamente)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* City / Place - With Instant Auto-Detection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Ciudad o Lugar Específico</span>
              <span className="text-[10px] text-emerald-400 font-normal">✨ Auto-detecta país al escribir</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Ej: Ciudad de Praga, Budapest, Ciudad de Panamá, Tegucigalpa, Tokio..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Al escribir <strong>"Praga"</strong>, <strong>"Budapest"</strong>, <strong>"Panamá"</strong>, etc., el país se selecciona de inmediato.
            </p>
          </div>

          {/* Country Selection with Quick Buttons and Searchable List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                País de Destino <span className="text-emerald-400">*</span>
              </label>

              {/* Quick direct buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-sm">
                <button
                  type="button"
                  onClick={() => setSelectedCountryCode('CZ')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedCountryCode === 'CZ'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                  }`}
                  title="República Checa (Checoslovaquia / Praga)"
                >
                  🇨🇿 Praga
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCountryCode('HU')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedCountryCode === 'HU'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                  }`}
                  title="Hungría (Budapest)"
                >
                  🇭🇺 Hungría
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCountryCode('PA')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedCountryCode === 'PA'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  🇵🇦 Panamá
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCountryCode('HN')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedCountryCode === 'HN'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  🇭🇳 Honduras
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCountryCode('ES')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    selectedCountryCode === 'ES'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  🇪🇸 España
                </button>
              </div>
            </div>

            {/* Search Filter for Countries */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Filtrar país o ciudad... (ej. Praga, Budapest, Checoslovaquia, España...)"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {countrySearch && (
                <button
                  type="button"
                  onClick={() => setCountrySearch('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer shadow-inner"
            >
              {countrySearch.trim() ? (
                <optgroup label={`Resultados de búsqueda (${filteredCountries.length})`}>
                  {filteredCountries.map(c => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                      {c.flagEmoji} {c.name} {c.capital ? `(Capital: ${c.capital})` : ''} {c.visited ? '🚩 (Visitado)' : ''}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <>
                  <optgroup label="Europa (Incluye Praga / Checoslovaquia y Hungría)">
                    {countries.filter(c => c.continent === 'Europe').map(c => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flagEmoji} {c.name} {c.capital ? `(${c.capital})` : ''} {c.visited ? '🚩' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="América Central y del Norte">
                    {countries.filter(c => c.continent === 'North America').map(c => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flagEmoji} {c.name} {c.visited ? '🚩' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="América del Sur">
                    {countries.filter(c => c.continent === 'South America').map(c => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flagEmoji} {c.name} {c.visited ? '🚩' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Asia">
                    {countries.filter(c => c.continent === 'Asia').map(c => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flagEmoji} {c.name} {c.visited ? '🚩' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="África y Oceanía">
                    {countries.filter(c => c.continent === 'Africa' || c.continent === 'Oceania').map(c => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flagEmoji} {c.name} {c.visited ? '🚩' : ''}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Título del Recuerdo <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ej: Puente de Carlos en Praga, Parlamento en Budapest..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Fecha de la Foto
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Notes / Memories */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Notas, Anécdotas o Recuerdos
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe recuerdos sobre el viaje, lugares visitados, comida probada..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar y Fijar Banderita 🚩</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
