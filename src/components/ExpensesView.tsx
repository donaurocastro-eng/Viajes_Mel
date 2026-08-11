import React, { useState } from 'react';
import { Trip, Expense, ExpenseCategory, PaymentMethod } from '../types';
import {
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  User,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Calculator,
  RefreshCw,
  MessageSquare,
  Globe,
  Receipt,
  X,
  CheckCircle2,
  HelpCircle,
  Tag
} from 'lucide-react';

interface ExpensesViewProps {
  trip: Trip;
  expenses: Expense[];
  onAddExpense?: (expense: Expense) => void;
  onDeleteExpense?: (expenseId: string) => void;
  onUpdateTripBudget?: (tripId: string, newBudget: number) => void;
  onNotifyWhatsAppMessage?: (message: string) => void;
}

// Fixed conversion rates relative to 1 USD
const EXCHANGE_RATES: Record<string, { rate: number; symbol: string; name: string; flag: string }> = {
  USD: { rate: 1, symbol: '$', name: 'Dólar Estadounidense', flag: '🇺🇸' },
  JPY: { rate: 155, symbol: '¥', name: 'Yen Japonés', flag: '🇯🇵' },
  KRW: { rate: 1350, symbol: '₩', name: 'Won Surcoreano', flag: '🇰🇷' },
  THB: { rate: 36, symbol: '฿', name: 'Baht Tailandés', flag: '🇹🇭' },
  HNL: { rate: 26.9449, symbol: 'L.', name: 'Lempira Hondureño', flag: '🇭🇳' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro', flag: '🇪🇺' },
};

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  trip,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateTripBudget,
  onNotifyWhatsAppMessage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'analytics' | 'splits' | 'converter'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayer, setSelectedPayer] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState<string>((trip.budgetTotal || 15000).toString());

  // Currency Converter State
  const [converterAmount, setConverterAmount] = useState<number>(100);
  const [converterFrom, setConverterFrom] = useState<string>('USD');
  const [converterTo, setConverterTo] = useState<string>('JPY');

  // New Expense Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmountOriginal, setNewAmountOriginal] = useState('');
  const [newCurrency, setNewCurrency] = useState<'USD' | 'JPY' | 'KRW' | 'THB' | 'HNL' | 'EUR'>('USD');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('food');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPaidBy, setNewPaidBy] = useState(trip.travelersNames?.[0] || 'Donauro Emmanuel Castro');
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Filter trip expenses
  const tripExpenses = expenses.filter((e) => e.tripId === trip.id);

  // Filtered list
  const filteredExpenses = tripExpenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (selectedPayer !== 'all' && e.paidBy !== selectedPayer) return false;

    return true;
  });

  // Calculate totals
  const totalSpentUSD = tripExpenses.reduce((sum, e) => sum + e.amountUSD, 0);
  const budgetTotal = trip.budgetTotal || 15000;
  const remainingBudgetUSD = budgetTotal - totalSpentUSD;
  const percentageSpent = Math.min(Math.round((totalSpentUSD / budgetTotal) * 100), 100);

  // Category breakdown
  const categoryTotalsUSD: Record<ExpenseCategory, number> = tripExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amountUSD;
    return acc;
  }, {
    flight: 0,
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    shopping: 0,
    other: 0,
  });

  // Payer breakdown & Splits
  const payers = Array.from(new Set(tripExpenses.map((e) => e.paidBy)));
  const payerTotalsUSD: Record<string, number> = tripExpenses.reduce((acc, e) => {
    acc[e.paidBy] = (acc[e.paidBy] || 0) + e.amountUSD;
    return acc;
  }, {} as Record<string, number>);

  const categoryMeta: Record<ExpenseCategory, { label: string; icon: string; bg: string; color: string }> = {
    flight: { label: 'Vuelos y Paquetes ✈️', icon: '✈️', bg: 'bg-indigo-500/20', color: 'text-indigo-400' },
    accommodation: { label: 'Hospedaje 🏨', icon: '🏨', bg: 'bg-purple-500/20', color: 'text-purple-400' },
    food: { label: 'Comida & Bebida 🍜', icon: '🍜', bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
    transport: { label: 'Transporte 🚌', icon: '🚌', bg: 'bg-amber-500/20', color: 'text-amber-400' },
    activities: { label: 'Actividades 🎟️', icon: '🎟️', bg: 'bg-cyan-500/20', color: 'text-cyan-400' },
    shopping: { label: 'Compras 🛍️', icon: '🛍️', bg: 'bg-rose-500/20', color: 'text-rose-400' },
    other: { label: 'Otros 📌', icon: '📌', bg: 'bg-slate-500/20', color: 'text-slate-400' },
  };

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    credit_card: 'Tarjeta de Crédito 💳',
    debit_card: 'Tarjeta de Débito 💳',
    cash: 'Efectivo 💵',
    transfer: 'Transferencia 🏦',
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const origAmount = parseFloat(newAmountOriginal) || 0;
    if (!newTitle || origAmount <= 0) return;

    // Convert to USD using fixed rates
    const rateToUSD = EXCHANGE_RATES[newCurrency]?.rate || 1;
    const computedUSD = Math.round((origAmount / rateToUSD) * 100) / 100;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      tripId: trip.id,
      title: newTitle,
      amountUSD: computedUSD,
      originalAmount: origAmount,
      originalCurrency: newCurrency,
      category: newCategory,
      date: newDate,
      paidBy: newPaidBy,
      splitWith: trip.travelersNames || ['Familia'],
      paymentMethod: newPaymentMethod,
      location: newLocation,
      notes: newNotes,
    };

    if (onAddExpense) {
      onAddExpense(newExpense);
    }

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewAmountOriginal('');
    setNewLocation('');
    setNewNotes('');
  };

  const handleSaveBudget = () => {
    const val = parseFloat(newBudgetValue);
    if (!isNaN(val) && val > 0 && onUpdateTripBudget) {
      onUpdateTripBudget(trip.id, val);
    }
    setIsEditingBudget(false);
  };

  const handleShareExpensesWhatsApp = () => {
    let text = `💵 *RESUMEN DE GASTOS Y PRESUPUESTO VIAJEFLOW* 📊
📌 *Viaje:* ${trip.title} (${trip.destination})
💰 *Presupuesto Total Meta:* $${budgetTotal.toLocaleString('en-US')} USD
💸 *Gasto Total Acumulado:* $${totalSpentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
⚖️ *Saldo Disponible:* $${remainingBudgetUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD

📊 *DESGLOSE Y DIVISIÓN ENTRE VIAJEROS:*
`;

    Object.entries(payerTotalsUSD).forEach(([payer, amt]) => {
      text += `• *${payer}:* $${amt.toFixed(2)} USD\n`;
    });

    text += `\n🛒 *ÚLTIMOS GASTOS REGISTRADOS:*\n`;
    tripExpenses.slice(0, 5).forEach((exp) => {
      text += `• ${exp.title}: $${exp.amountUSD.toFixed(2)} USD (${exp.paidBy})\n`;
    });

    text += `\n📲 *Generado por ViajeFlow*`;

    if (onNotifyWhatsAppMessage) {
      onNotifyWhatsAppMessage(text);
    } else {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  // Convert function for Currency Calculator
  const convertedResult = (() => {
    const fromUSD = converterAmount / (EXCHANGE_RATES[converterFrom]?.rate || 1);
    const targetVal = fromUSD * (EXCHANGE_RATES[converterTo]?.rate || 1);
    return targetVal;
  })();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <DollarSign className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <span>Control de Gastos y Presupuesto</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {tripExpenses.length} REGISTROS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Contabilidad en tiempo real con conversor multi-divisa (USD, JPY 🇯🇵, KRW 🇰🇷, THB 🇹🇭) y división exacta entre viajeros
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end lg:self-center">
          <button
            onClick={handleShareExpensesWhatsApp}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Compartir Resumen WA</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Header Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Gasto Acumulado</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">
            ${totalSpentUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {tripExpenses.length} transacciones registradas
          </p>
        </div>

        {/* Budget Limit & Edit */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Presupuesto Meta</span>
            <button
              onClick={() => setIsEditingBudget(true)}
              className="text-[10px] text-amber-400 hover:underline font-bold"
            >
              Cambiar Meta
            </button>
          </div>
          <div className="text-xl font-black text-amber-300">
            ${budgetTotal.toLocaleString('en-US')} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                percentageSpent > 90 ? 'bg-rose-500' : percentageSpent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentageSpent}%` }}
            />
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Saldo Disponible</span>
            <Calculator className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-xl font-black ${remainingBudgetUSD < 0 ? 'text-rose-400' : 'text-cyan-300'}`}>
            ${remainingBudgetUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {remainingBudgetUSD < 0 ? '⚠️ Has superado el presupuesto inicial' : `Dispones del ${100 - percentageSpent}% del fondo`}
          </p>
        </div>

        {/* Foreign Currencies Quick Overview */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Divisas del Viaje</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">1 USD = 155 JPY 🇯🇵</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">1350 KRW 🇰🇷</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Tipos de cambio de referencia para Asia 2026
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'expenses', label: 'Lista de Gastos 📝', icon: Receipt },
          { id: 'analytics', label: 'Análisis por Categoría 📊', icon: PieChartIcon },
          { id: 'splits', label: 'División entre 4 Viajeros 👥', icon: Users },
          { id: 'converter', label: 'Conversor de Moneda 🪪', icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Expenses List View */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-4">
          {/* Key Packages & Flight Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* San Antonio Package Highlight Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-5 rounded-2xl border border-indigo-500/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300 font-bold">
                    ✈️
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-extrabold text-white">Paquete San Antonio (SAT)</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✅ VUELOS + HOTELES + SHINKANSEN PAGADOS
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Vuelos ida/vuelta SAT + 4 Hoteles + Tren Shinkansen Nozomi (Shin-Osaka ➔ Tokio - 4p). <span className="text-amber-300 font-semibold">⚠️ Traslados aeropuerto ↔ hotel no incluidos (se pagan en sitio).</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-emerald-400">$10,706.76 USD</div>
                  <div className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mt-0.5">
                    $2,676.69 USD c/u (x4)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-slate-800 text-[11px] font-medium text-slate-300">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Donauro</span>
                  <span className="font-bold text-white">$2,676.69</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Robinson Josue</span>
                  <span className="font-bold text-white">$2,676.69</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Robinson Castro</span>
                  <span className="font-bold text-white">$2,676.69</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Maria Nohemy</span>
                  <span className="font-bold text-white">$2,676.69</span>
                </div>
              </div>
            </div>

            {/* Honduras -> San Antonio Flight Highlight Card */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 p-5 rounded-2xl border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold">
                    🛩️
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-extrabold text-white">Vuelo Honduras 🇭🇳 ✈️ San Antonio 🇺🇸</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        DIVIDIDO 50 / 50
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Conexión San Pedro Sula → San Antonio
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-emerald-400">$1,105.62 USD</div>
                  <div className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mt-0.5">
                    $552.81 USD c/u (50%)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-medium text-slate-300">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">👨‍✈️ Donauro Castro:</span>
                  <span className="font-bold text-emerald-400">$552.81 USD</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">👩‍💼 Maria Nohemy Israel:</span>
                  <span className="font-bold text-emerald-400">$552.81 USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por descripción, ubicación o nota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todas las Categorías</option>
                {Object.entries(categoryMeta).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>
                    {meta.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPayer}
                onChange={(e) => setSelectedPayer(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todos los Pagadores</option>
                {payers.map((p) => (
                  <option key={p} value={p}>
                    Pagado por: {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-300">No hay gastos registrados</h3>
                <p className="text-xs text-slate-500">
                  Prueba cambiando los filtros o agrega un nuevo gasto presionando "+ Registrar Gasto".
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {filteredExpenses.map((exp) => {
                  const meta = categoryMeta[exp.category];

                  return (
                    <div
                      key={exp.id}
                      className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-xl border border-slate-700/50 shrink-0 ${meta.bg}`}>
                          <span className="text-xl">{meta.icon}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-extrabold text-white">{exp.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${meta.bg} ${meta.color}`}>
                              {meta.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>{exp.date}</span>
                            </span>

                            <span className="flex items-center space-x-1">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-amber-300 font-semibold">{exp.paidBy}</span>
                            </span>

                            {exp.paymentMethod && (
                              <span className="text-slate-500">
                                • {paymentMethodLabels[exp.paymentMethod]}
                              </span>
                            )}

                            {exp.location && (
                              <span className="text-cyan-400">
                                📍 {exp.location}
                              </span>
                            )}
                          </div>

                          {exp.notes && (
                            <p className="text-xs text-slate-400 italic">
                              💡 {exp.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                        <div className="text-right">
                          <div className="text-base font-black text-emerald-400">
                            ${exp.amountUSD.toFixed(2)} <span className="text-xs text-slate-400">USD</span>
                          </div>
                          {exp.originalAmount && exp.originalCurrency && exp.originalCurrency !== 'USD' && (
                            <div className="text-[11px] font-mono text-slate-400">
                              {EXCHANGE_RATES[exp.originalCurrency]?.symbol || ''}
                              {exp.originalAmount.toLocaleString('en-US')} {exp.originalCurrency}
                            </div>
                          )}
                        </div>

                        {onDeleteExpense && (
                          <button
                            onClick={() => onDeleteExpense(exp.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Eliminar gasto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Analytics & Category Breakdown */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <PieChartIcon className="w-4 h-4 text-emerald-400" />
              <span>Gastos por Categoría</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryTotalsUSD).map(([catKey, total]) => {
                const meta = categoryMeta[catKey as ExpenseCategory];
                const pct = totalSpentUSD > 0 ? Math.round((total / totalSpentUSD) * 100) : 0;

                return (
                  <div key={catKey} className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center space-x-2">
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                      <span className="font-extrabold text-emerald-400">
                        ${total.toFixed(2)} USD ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recomendaciones Financieras de Viaje</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1">
                <p className="font-bold text-indigo-300">✈️ Paquete San Antonio ($10,706.76 USD)</p>
                <p className="text-slate-400">
                  Cubre todos los trayectos aéreos ida y vuelta desde San Antonio, hospedajes principales y conexiones de transporte internacional.
                </p>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-1">
                <p className="font-bold text-amber-300">🇯🇵 Efectivo en Japón (Yenes)</p>
                <p className="text-slate-400">
                  A pesar de la alta tecnología, pequeños restaurantes, templos y recargas de la tarjeta Suica requieren efectivo Yenes (JPY).
                </p>
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1">
                <p className="font-bold text-purple-300">💳 Uso de Tarjetas sin Comisión Extranjera</p>
                <p className="text-slate-400">
                  Usa tarjetas de crédito sin cargo por transacción internacional para hoteles y compras para obtener mejor tipo de cambio.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Splits & Payer Balances */}
      {activeSubTab === 'splits' && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>División de Gastos y Balances del Grupo</span>
              </h3>
              <p className="text-xs text-slate-400">
                Resumen de cuentas individuales para el grupo de 4 a Asia y la conexión de Honduras
              </p>
            </div>
          </div>

          {/* Hotel & Transfer Paid Confirmation Callout */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p>
                <strong className="text-white font-bold">Estado de Pagos:</strong> Vuelos internacionales, los 4 Hoteles y Tren Shinkansen Nozomi están <span className="text-emerald-300 font-bold underline">100% INCLUIDOS Y PAGADOS EN EL PAQUETE ($10,706.76 USD)</span>.
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 font-semibold shrink-0">
              ⚠️ Traslados Aeropuerto ↔ Hotel: No incluidos (Se pagan en sitio)
            </div>
          </div>

          {/* Consolidated Balance Summary Per Person */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  💳 Resumen de Balance / Gastos por Persona (Hasta el Momento)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Línea de Base Actualizada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Donauro */}
              <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-white">Donauro Emmanuel</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    Viajero 1
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Asia (Cuota 4p):</span>
                    <span className="font-bold text-amber-300">$2,764.38 USD</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Vuelo Honduras (50%):</span>
                    <span className="font-bold text-cyan-300">$552.81 USD</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>Total de Cuota:</span>
                    <span className="text-emerald-400">$3,317.19 USD</span>
                  </div>
                </div>
              </div>

              {/* Robinson Josue */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-white">Robinson Josue</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    Viajero 2
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Asia (Cuota 4p):</span>
                    <span className="font-bold text-amber-300">$2,764.38 USD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Vuelo Honduras:</span>
                    <span>N/A</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>Total de Cuota:</span>
                    <span className="text-amber-300">$2,764.38 USD</span>
                  </div>
                </div>
              </div>

              {/* Robinson Castro */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-white">Robinson Castro</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    Viajero 3
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Asia (Cuota 4p):</span>
                    <span className="font-bold text-amber-300">$2,764.38 USD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Vuelo Honduras:</span>
                    <span>N/A</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>Total de Cuota:</span>
                    <span className="text-amber-300">$2,764.38 USD</span>
                  </div>
                </div>
              </div>

              {/* Maria Nohemy */}
              <div className="bg-slate-900 p-3 rounded-xl border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-white">Maria Nohemy Israel</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                    Viajero 4
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Asia (Cuota 4p):</span>
                    <span className="font-bold text-amber-300">$2,764.38 USD</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Vuelo Honduras (50%):</span>
                    <span className="font-bold text-cyan-300">$552.81 USD</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>Total de Cuota:</span>
                    <span className="text-cyan-300">$3,317.19 USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Asia Trip 4 Travelers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                🌏 Grupo Principal Asia 2026 (4 Personas)
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Paquete SAT ($10,706.76 USD con Shinkansen) + Entradas + Recargas IC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Donauro Emmanuel Castro', role: 'Viajero 1', paid: 10706.76 + 129.03 + 118.51, share: (10706.76 + 103.22 + 129.03 + 118.51) / 4 },
                { name: 'Robinson Josue Castro', role: 'Viajero 2', paid: 103.22, share: (10706.76 + 103.22 + 129.03 + 118.51) / 4 },
                { name: 'Robinson Castro', role: 'Viajero 3', paid: 0, share: (10706.76 + 103.22 + 129.03 + 118.51) / 4 },
                { name: 'Maria Nohemy Israel', role: 'Viajero 4', paid: 0, share: (10706.76 + 103.22 + 129.03 + 118.51) / 4 },
              ].map((v) => {
                const netBalance = v.paid - v.share;

                return (
                  <div key={v.name} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-xs">{v.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {v.role}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                        <span className="text-slate-400 text-[10px]">Cuota Asia:</span>
                        <span className="font-extrabold text-amber-300">${v.share.toFixed(2)} USD</span>
                      </div>

                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                        <span className="text-slate-400 text-[10px]">Aporte abonado:</span>
                        <span className="font-extrabold text-emerald-400">${v.paid.toFixed(2)} USD</span>
                      </div>

                      <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                        <span className="text-slate-400 text-[10px]">Balance Neto:</span>
                        <span className={`font-extrabold ${netBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                          {netBalance >= 0 ? `+$${netBalance.toFixed(2)}` : `-$${Math.abs(netBalance).toFixed(2)}`} USD
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Honduras to San Antonio Flight Split (Donauro & Maria Nohemy) */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                🛩️ Vuelo de Conexión Honduras 🇭🇳 → San Antonio 🇺🇸 ($1,105.62 USD Total)
              </h4>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                División 50% / 50%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">Donauro Emmanuel Castro</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    PAGADO EN TARJETA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Total Vuelo:</span>
                    <span className="font-extrabold text-white">$1,105.62 USD</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Su Cuota (50%):</span>
                    <span className="font-extrabold text-amber-300">$552.81 USD</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">Maria Nohemy Israel</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    PASAJERA 50%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Abonado:</span>
                    <span className="font-extrabold text-emerald-400">$0.00 USD</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Su Cuota (50%):</span>
                    <span className="font-extrabold text-cyan-300">$552.81 USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Currency Calculator */}
      {activeSubTab === 'converter' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <div className="inline-p-3 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl text-slate-950 font-black mx-auto p-3 shadow-lg">
              <RefreshCw className="w-6 h-6 text-slate-950 mx-auto" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Conversor de Moneda Internacional</h3>
            <p className="text-xs text-slate-400">
              Convierte valores instantáneamente entre divisas locales del viaje
            </p>
          </div>

          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Monto a Convertir</label>
              <input
                type="number"
                value={converterAmount}
                onChange={(e) => setConverterAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl text-lg font-extrabold text-amber-300 p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Moneda Origen</label>
                <select
                  value={converterFrom}
                  onChange={(e) => setConverterFrom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-amber-500"
                >
                  {Object.entries(EXCHANGE_RATES).map(([code, meta]) => (
                    <option key={code} value={code}>
                      {meta.flag} {code} - {meta.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Moneda Destino</label>
                <select
                  value={converterTo}
                  onChange={(e) => setConverterTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-amber-500"
                >
                  {Object.entries(EXCHANGE_RATES).map(([code, meta]) => (
                    <option key={code} value={code}>
                      {meta.flag} {code} - {meta.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Display */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-1">
              <span className="text-xs text-slate-400 block font-semibold">Resultado Estimado:</span>
              <div className="text-2xl font-black text-emerald-300">
                {EXCHANGE_RATES[converterTo]?.symbol || ''}{' '}
                {convertedResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                {converterTo}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Tasa: 1 {converterFrom} = {(EXCHANGE_RATES[converterTo].rate / EXCHANGE_RATES[converterFrom].rate).toFixed(4)} {converterTo}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {isEditingBudget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-white">Ajustar Presupuesto Meta (USD)</h3>
            <input
              type="number"
              value={newBudgetValue}
              onChange={(e) => setNewBudgetValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white p-3 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsEditingBudget(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs"
              >
                Guardar Presupuesto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Registrar Nuevo Gasto</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Descripción del Gasto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cena Sushi en Ginza, Recarga Suica..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Monto Original</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="Ej. 15000"
                    value={newAmountOriginal}
                    onChange={(e) => setNewAmountOriginal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Moneda</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="THB">THB (฿)</option>
                    <option value="HNL">HNL (L.)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.entries(categoryMeta).map(([k, meta]) => (
                      <option key={k} value={k}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Pagado Por</label>
                  <input
                    type="text"
                    value={newPaidBy}
                    onChange={(e) => setNewPaidBy(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Método de Pago</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="credit_card">Tarjeta Crédito</option>
                    <option value="debit_card">Tarjeta Débito</option>
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Ubicación / Lugar</label>
                <input
                  type="text"
                  placeholder="Ej. Tokio, Japón"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
