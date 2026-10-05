import React, { useState } from 'react';
import { Trip, Expense } from '../types';
import { ExpensesView } from './ExpensesView';
import { CurrencyConverterModal } from './CurrencyConverterModal';
import { DollarSign, Calculator, ArrowRightLeft, TrendingUp } from 'lucide-react';

interface FinancesContainerProps {
  trip: Trip;
  expenses: Expense[];
  onAddExpense: (exp: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateTripBudget: (amount: number) => void;
  onNotifyWhatsApp: (msg: string, type: any) => void;
}

export const FinancesContainer: React.FC<FinancesContainerProps> = ({
  trip,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateTripBudget,
  onNotifyWhatsApp,
}) => {
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Clean Quick Converter Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Conversor Multidivisa en Tiempo Real</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                USD • JPY • KRW • THB • HNL
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Convierte al instante cualquier precio de hoteles, compras o comidas a tu moneda local.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsConverterOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Abrir Calculadora de Divisas</span>
        </button>
      </div>

      {/* Main Expenses View */}
      <ExpensesView
        trip={trip}
        expenses={expenses}
        onAddExpense={onAddExpense}
        onDeleteExpense={onDeleteExpense}
        onUpdateTripBudget={onUpdateTripBudget}
        onNotifyWhatsAppMessage={onNotifyWhatsApp}
      />

      {/* Currency Modal */}
      <CurrencyConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </div>
  );
};
