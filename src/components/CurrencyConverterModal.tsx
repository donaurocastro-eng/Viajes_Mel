import React, { useState } from 'react';
import { X, ArrowLeftRight, DollarSign, Sparkles, Copy, Check, Calculator } from 'lucide-react';

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialFromCurrency?: string;
  initialToCurrency?: string;
}

export const RATES: Record<string, { rate: number; symbol: string; name: string; flag: string; country: string }> = {
  USD: { rate: 1, symbol: '$', name: 'Dólar Estadounidense', flag: '🇺🇸', country: 'EE.UU.' },
  JPY: { rate: 155, symbol: '¥', name: 'Yen Japonés', flag: '🇯🇵', country: 'Japón' },
  KRW: { rate: 1350, symbol: '₩', name: 'Won Surcoreano', flag: '🇰🇷', country: 'Corea del Sur' },
  THB: { rate: 36, symbol: '฿', name: 'Baht Tailandés', flag: '🇹🇭', country: 'Tailandia' },
  HNL: { rate: 26.9449, symbol: 'L.', name: 'Lempira Hondureño', flag: '🇭🇳', country: 'Honduras' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro', flag: '🇪🇺', country: 'Europa' },
};

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 100,
  initialFromCurrency = 'USD',
  initialToCurrency = 'JPY',
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [fromCurrency, setFromCurrency] = useState<string>(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState<string>(initialToCurrency);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Calculate result
  const fromUSD = amount / (RATES[fromCurrency]?.rate || 1);
  const convertedValue = fromUSD * (RATES[toCurrency]?.rate || 1);
  const exchangeRate = (RATES[toCurrency]?.rate || 1) / (RATES[fromCurrency]?.rate || 1);

  const presets = [
    { label: '$10 USD', amt: 10, curr: 'USD' },
    { label: '$50 USD', amt: 50, curr: 'USD' },
    { label: '$100 USD', amt: 100, curr: 'USD' },
    { label: '$500 USD', amt: 500, curr: 'USD' },
    { label: '¥10,000 JPY', amt: 10000, curr: 'JPY' },
    { label: '₩50,000 KRW', amt: 50000, curr: 'KRW' },
    { label: '฿1,000 THB', amt: 1000, curr: 'THB' },
  ];

  const handleCopyText = () => {
    const text = `${amount} ${fromCurrency} = ${RATES[toCurrency]?.symbol || ''}${convertedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl text-slate-950 font-black shadow-lg">
              <Calculator className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>Calculadora de Cambio de Divisas</span>
              </h3>
              <p className="text-xs text-slate-400">
                Conversión en tiempo real para tu viaje a Asia 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Preset Buttons */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Accesos Rápidos Frecuentes:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAmount(p.amt);
                  setFromCurrency(p.curr);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-700 text-xs font-extrabold transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Converter Inputs */}
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Monto a Convertir</label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Ej. 100"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl text-xl font-black text-amber-300 p-3 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">De (Origen)</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(RATES).map(([code, meta]) => (
                  <option key={code} value={code}>
                    {meta.flag} {code} ({meta.symbol}) - {meta.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center sm:pt-5">
              <button
                onClick={handleSwap}
                className="p-3 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 rounded-xl border border-slate-700 transition-all shadow-md transform active:scale-95"
                title="Cambiar dirección de conversión"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">A (Destino)</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(RATES).map(([code, meta]) => (
                  <option key={code} value={code}>
                    {meta.flag} {code} ({meta.symbol}) - {meta.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Result Box */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2 relative">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              {amount} {fromCurrency} Equivalen A:
            </span>
            <div className="text-3xl font-black text-emerald-300 flex items-center justify-center space-x-2">
              <span>{RATES[toCurrency]?.flag}</span>
              <span>
                {RATES[toCurrency]?.symbol || ''}{' '}
                {convertedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-bold text-emerald-400">{toCurrency}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Tasa de Cambio: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </div>

            <button
              onClick={handleCopyText}
              className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Cálculo'}</span>
            </button>
          </div>
        </div>

        {/* Multi-Currency Matrix */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-white flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Equivalencia Simultánea de {amount} {fromCurrency}:</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(RATES).map(([code, meta]) => {
              const val = fromUSD * meta.rate;
              return (
                <div
                  key={code}
                  className={`p-2.5 rounded-xl border transition-all ${
                    code === toCurrency
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>{meta.flag} {code}</span>
                    <span className="font-semibold">{meta.country}</span>
                  </div>
                  <div className="font-extrabold text-sm text-white">
                    {meta.symbol}{' '}
                    {val.toLocaleString('en-US', {
                      minimumFractionDigits: val < 10 ? 2 : 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-slate-400">
          💡 <em>Tip: Las tasas corresponden al promedio de cambio bancario para el itinerario Asia 2026.</em>
        </div>
      </div>
    </div>
  );
};
