import React, { useState } from 'react';
import { Trip, Activity } from '../types';
import { CheckSquare, Square, Plus, Trash2, Tag, Calendar, DollarSign, MessageSquare, Briefcase, Compass, Filter } from 'lucide-react';

interface ActivitiesViewProps {
  trip: Trip;
  activities: Activity[];
  onToggleActivity: (id: string) => void;
  onDeleteActivity: (id: string) => void;
  onAddActivity: () => void;
  onNotifyWhatsApp: (activity: Activity) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  trip,
  activities,
  onToggleActivity,
  onDeleteActivity,
  onAddActivity,
  onNotifyWhatsApp,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'checklist'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tripActivities = activities.filter((a) => a.tripId === trip.id);

  const filtered = tripActivities.filter((a) => {
    if (searchQuery) {
      return a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const packingItems = [
    { id: 'p-1', label: 'Pasaporte y Visados', category: 'Documentos' },
    { id: 'p-2', label: 'Billetes de Avión y Reservas de Hotel Impresas/PDF', category: 'Documentos' },
    { id: 'p-3', label: 'Adaptador de Enchufe Universal', category: 'Electrónica' },
    { id: 'p-4', label: 'Cargador Portátil (Power Bank)', category: 'Electrónica' },
    { id: 'p-5', label: 'Botiquín de Viaje y Medicamentos', category: 'Salud' },
    { id: 'p-6', label: 'Tarjetas de Crédito / Débito sin comisión en divisas', category: 'Finanzas' },
  ];

  const [checkedPacking, setCheckedPacking] = useState<Record<string, boolean>>({});

  const togglePacking = (id: string) => {
    setCheckedPacking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>Gestor de Actividades y Lista de Equipaje</span>
          </h2>
          <p className="text-xs text-slate-400">
            Organizador de tareas de viaje y checklist de maleta
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Actividades
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'checklist' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Lista de Maleta
          </button>
          <button
            onClick={onAddActivity}
            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {activeTab === 'all' ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Buscar actividad o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <div className="grid gap-3">
            {filtered.map((act) => (
              <div
                key={act.id}
                className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <button onClick={() => onToggleActivity(act.id)} className="text-slate-400 hover:text-emerald-400">
                    {act.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-semibold ${act.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {act.date} • {act.location || trip.destination} {act.cost ? `• ${act.cost} ${trip.currency}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNotifyWhatsApp(act)}
                    className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-emerald-500/30"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>Lista de Verificación de Maleta (Packing List)</span>
          </h3>

          <div className="grid gap-2">
            {packingItems.map((item) => {
              const isDone = !!checkedPacking[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => togglePacking(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-400'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                    <span className={`text-xs font-semibold ${isDone ? 'line-through' : ''}`}>
                      {item.label}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
