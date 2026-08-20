import React, { useState } from 'react';
import { Trip, ChecklistItem, ChecklistCategory, ChecklistImportance } from '../types';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Filter,
  Sparkles,
  FileText,
  DollarSign,
  Smartphone,
  Shirt,
  Heart,
  Luggage,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Share2,
  RotateCcw,
  Star,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Eye,
  Download,
  X,
  Printer,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Plane
} from 'lucide-react';

interface ChecklistViewProps {
  trip: Trip;
  checklistItems: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (newItem: ChecklistItem) => void;
  onDeleteItem: (id: string) => void;
  onResetItems?: (tripId: string) => void;
  onNotifyWhatsAppMessage?: (message: string) => void;
}

const CATEGORY_META: Record<ChecklistCategory, { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string; border: string }> = {
  documentation: {
    label: 'Documentación',
    icon: FileText,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  money: {
    label: 'Dinero y Bancos',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  electronics: {
    label: 'Electrónica',
    icon: Smartphone,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  clothing: {
    label: 'Ropa y Calzado',
    icon: Shirt,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  hygiene: {
    label: 'Higiene Personal',
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30'
  },
  other: {
    label: 'Otros y Extras',
    icon: Luggage,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30'
  }
};

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  trip,
  checklistItems,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetItems,
  onNotifyWhatsAppMessage
}) => {
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<ChecklistCategory | 'all'>('all');
  const [selectedImportance, setSelectedImportance] = useState<ChecklistImportance | 'all'>('all');
  const [selectedTraveler, setSelectedTraveler] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isThaiVisaDocOpen, setIsThaiVisaDocOpen] = useState(false);
  const [isHondurasPassesDocOpen, setIsHondurasPassesDocOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistCategory>('documentation');
  const [newImportance, setNewImportance] = useState<ChecklistImportance>('imprescindible');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('Todos');
  const [newNotes, setNewNotes] = useState('');

  const tripItems = checklistItems.filter((i) => i.tripId === trip.id);

  // Filtered Items
  const filteredItems = tripItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedImportance !== 'all' && item.importance !== selectedImportance) return false;
    if (selectedTraveler !== 'all') {
      if (selectedTraveler === 'Todos') {
        if (item.assignedTo !== 'Todos') return false;
      } else {
        if (item.assignedTo !== selectedTraveler && item.assignedTo !== 'Todos') return false;
      }
    }
    if (statusFilter === 'pending' && item.completed) return false;
    if (statusFilter === 'completed' && !item.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchNotes = item.notes?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc && !matchNotes) return false;
    }
    return true;
  });

  // Calculate Statistics
  const totalCount = tripItems.length;
  const completedCount = tripItems.filter((i) => i.completed).length;
  const pendingCount = totalCount - completedCount;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Essential (Imprescindible) Stats
  const essentialItems = tripItems.filter((i) => i.importance === 'imprescindible');
  const essentialCompleted = essentialItems.filter((i) => i.completed).length;
  const essentialTotal = essentialItems.length;
  const isEssentialDone = essentialTotal > 0 && essentialCompleted === essentialTotal;

  // Recommended (Recomendable) Stats
  const recommendedItems = tripItems.filter((i) => i.importance === 'recomendable');
  const recommendedCompleted = recommendedItems.filter((i) => i.completed).length;
  const recommendedTotal = recommendedItems.length;

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `chk-custom-${Date.now()}`,
      tripId: trip.id,
      category: newCategory,
      importance: newImportance,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      completed: false,
      assignedTo: newAssignedTo,
      notes: newNotes.trim() || undefined,
      isCustom: true
    };

    onAddItem(newItem);
    setNewTitle('');
    setNewDescription('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleCopySummary = () => {
    const lines = [
      `📋 *CHECKLIST DE PREPARACIÓN DE VIAJE* - ${trip.title}`,
      `📊 Progreso: ${completedCount}/${totalCount} tareas completadas (${percentCompleted}%)`,
      `⭐ Imprescindibles: ${essentialCompleted}/${essentialTotal} listos`,
      `💡 Recomendables: ${recommendedCompleted}/${recommendedTotal} listos`,
      '',
      '🚨 *TAREAS PENDIENTES:*',
      ...tripItems
        .filter((i) => !i.completed)
        .map((i) => `• [${i.importance === 'imprescindible' ? '⭐ IMPRESCINDIBLE' : '💡 RECOMENDABLE'}] ${i.title} (${i.assignedTo || 'Todos'})`),
      '',
      '✅ *TAREAS COMPLETADAS:*',
      ...tripItems
        .filter((i) => i.completed)
        .map((i) => `✓ ${i.title} (${i.assignedTo || 'Todos'})`)
    ];

    const text = lines.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });

    if (onNotifyWhatsAppMessage) {
      onNotifyWhatsAppMessage(text);
    }
  };

  // Group filtered items by importance for clean visual flow
  const filteredEssentials = filteredItems.filter((i) => i.importance === 'imprescindible');
  const filteredRecommended = filteredItems.filter((i) => i.importance === 'recomendable');

  const travelersList = trip.travelersNames && trip.travelersNames.length > 0
    ? trip.travelersNames
    : ['Donauro Emmanuel Castro', 'Robinson Josue Castro', 'Robinson Castro', 'Maria Nohemy Israel'];

  return (
    <div className="space-y-6">
      {/* Header & Main Readiness Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Lista de Tareas y Verificación Pre-Viaje</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                    Google Tasks Style
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Verifica que no falte nada antes de salir hacia el aeropuerto: Documentación, Dinero, Electrónica, Ropa y más.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm"
              title="Copiar resumen y enviar por WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copySuccess ? '¡Copiado al portapapeles!' : 'Compartir Resumen'}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* Passport / Official Travel Documents Identity Cards */}
        <div className="space-y-3">
          {/* Card 1: Donauro (Honduras) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 rounded-2xl p-4 border border-cyan-500/30 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/40">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1.5">
                    <span>🇭🇳 Documento Oficial Registrado — Pasaporte Hondureño</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                      ✓ Vigente para el Viaje
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    República de Honduras • Instituto Nacional de Migración
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Número de Pasaporte</span>
                <span className="text-sm font-black font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-cyan-500/40">
                  F847292
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-[11px]">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Titular</span>
                <span className="font-extrabold text-white">DONAURO EMMANUEL CASTRO MENDOZA</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">No. Identidad (DNI)</span>
                <span className="font-mono font-bold text-slate-200">0801-1971-03153</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Fecha Nacimiento</span>
                <span className="font-mono font-bold text-slate-200">03 JUN 1971</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Fecha de Emisión</span>
                <span className="font-mono font-bold text-amber-300">18 OCT 2018</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Fecha de Vencimiento</span>
                <span className="font-mono font-bold text-emerald-400">18 OCT 2028</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Nacionalidad / Sexo</span>
                <span className="font-bold text-slate-200">Hondureña • M</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 font-mono gap-1">
              <span>MRZ: P&lt;HNDCASTRO&lt;MENDOZA&lt;&lt;DONAURO&lt;EMMANUEL&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
              <span className="text-cyan-400 font-semibold">Vigente hasta 18/10/2028 (Amplia vigencia de más de 2 años después del viaje)</span>
            </div>
          </div>

          {/* Card 2: Nohemy Maria Israel (USA) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 rounded-2xl p-4 border border-blue-500/30 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/40">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-blue-300 tracking-wider flex items-center gap-1.5">
                    <span>🇺🇸 Documento Oficial Registrado — United States of America Passport</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                      ✓ Vigente para el Viaje
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    United States Department of State • Passport
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Passport No. / No. de Pasaporte</span>
                <span className="text-sm font-black font-mono text-blue-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-blue-500/40">
                  642491797
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-[11px]">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Surname & Names / Titular</span>
                <span className="font-extrabold text-white">NOHEMY MARIA ISRAEL</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Nationality / País</span>
                <span className="font-bold text-blue-300">USA (United States)</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Date of Birth / Nacimiento</span>
                <span className="font-mono font-bold text-slate-200">01 DEC 1947</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Date of Issue / Emisión</span>
                <span className="font-mono font-bold text-amber-300">02 NOV 2018</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Date of Expiration / Vencimiento</span>
                <span className="font-mono font-bold text-emerald-400">01 NOV 2028</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Place of Birth / Sex</span>
                <span className="font-bold text-slate-200">Honduras • F</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 font-mono gap-1">
              <span>MRZ: P&lt;USAISRAEL&lt;&lt;NOHEMY&lt;MARIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
              <span className="text-blue-400 font-semibold">Vigente hasta 01/11/2028 (Amplia vigencia para Asia y EE.UU.)</span>
            </div>
          </div>

          {/* Card 3: Thai E-Visa (Donauro Emmanuel Castro) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 rounded-2xl p-4 border border-amber-500/40 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/40">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <span>🇹🇭 Documento Oficial Registrado — THAI E-VISA (Visa de Tailandia)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                      ✓ Aprobada & Válida
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Royal Thai Embassy • Place of Issue: Mexico City
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Visa Number / No. de Visa</span>
                <span className="text-sm font-black font-mono text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/40">
                  G1939299
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-[11px]">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Applicant / Titular</span>
                <span className="font-extrabold text-white">DONAURO EMMANUEL CASTRO MENDOZA</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Passport Linked / Pasaporte</span>
                <span className="font-mono font-bold text-cyan-300">Honduras • F847292</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Visa Type / Entry</span>
                <span className="font-mono font-bold text-amber-300">Tourist TR • Single</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Valid From / Emisión</span>
                <span className="font-mono font-bold text-slate-200">14 AUG 2026</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Valid Until / Vencimiento</span>
                <span className="font-mono font-bold text-emerald-400">11 NOV 2026</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Transaction Ref.</span>
                <span className="font-mono font-bold text-slate-300 text-[10px] truncate">MEX001-202605-5685681</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 font-mono gap-2">
              <span className="truncate">Ref: 63DA7TOMG10671692 • Email: donauro.castro@gmail.com</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-semibold hidden md:inline">🇺🇸 Pasaportes USA exentos</span>
                <button
                  type="button"
                  onClick={() => setIsThaiVisaDocOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-lg shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Documento Oficial Completo (Thai E-Visa)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Boletos de Abordaje Oficiales United Airlines (Honduras - Houston - San Antonio) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 rounded-2xl p-4 border border-blue-500/40 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/40">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-blue-300 tracking-wider flex items-center gap-1.5">
                    <span>✈️ Pases de Abordaje Oficiales — United Airlines (Honduras a Texas)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                      ✓ Emitidos & Confirmados
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Martes 18 de Agosto 2026 • Palmerola (XPL) ➔ Houston (IAH) ➔ San Antonio (SAT)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Confirmation / Código PNR</span>
                <span className="text-sm font-black font-mono text-blue-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-blue-500/40">
                  O7TX21
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">Tramo 1: UA 527</span>
                  <span className="text-[10px] font-mono font-bold text-amber-300">12:30 PM - 4:35 PM</span>
                </div>
                <div className="font-extrabold text-white">XPL (Comayagua) ➔ IAH (Houston)</div>
                <div className="text-[10px] text-slate-300 flex justify-between font-mono pt-1 border-t border-slate-800">
                  <span>Abordaje: 11:50 AM</span>
                  <span className="text-cyan-300 font-bold">Grupo 6</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">Tramo 2: UA 1477</span>
                  <span className="text-[10px] font-mono font-bold text-amber-300">6:50 PM - 7:58 PM</span>
                </div>
                <div className="font-extrabold text-white">IAH (Houston) ➔ SAT (San Antonio)</div>
                <div className="text-[10px] text-slate-300 flex justify-between font-mono pt-1 border-t border-slate-800">
                  <span>Abordaje: 6:15 PM</span>
                  <span className="text-cyan-300 font-bold">Grupo 6</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">👤 Donauro Emmanuel Castro</span>
                <div className="font-mono text-cyan-300 font-bold text-[11px]">
                  UA527: <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">28A (Ventana)</span>
                </div>
                <div className="font-mono text-cyan-300 font-bold text-[11px]">
                  UA1477: <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">27D (Pasillo)</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Ticket: 01621079886800</div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">👤 Nohemy Maria Israel</span>
                <div className="font-mono text-cyan-300 font-bold text-[11px]">
                  UA527: <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">28C (Pasillo)</span>
                </div>
                <div className="font-mono text-cyan-300 font-bold text-[11px]">
                  UA1477: <span className="text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">26D (Pasillo)</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Ticket: 01621079886811</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 font-mono gap-2">
              <span className="truncate">Tarifa: Basic Economy (BE-NO CARRY ON) • Star Alliance</span>
              <button
                type="button"
                onClick={() => setIsHondurasPassesDocOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs rounded-lg shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver los 4 Pases de Abordaje Oficiales (PDF Respaldo)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Readiness Progress Bar & Score */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Nivel de Preparación General
              </span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                {percentCompleted}% Listo ({completedCount}/{totalCount})
              </span>
            </div>
            
            {/* Progress Track */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-left"
              >
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{pendingCount} tareas pendientes</span>
              </button>
              <span>{isEssentialDone ? '⭐ ¡Todos los imprescindibles completados!' : `Faltan ${essentialTotal - essentialCompleted} imprescindibles`}</span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <button
              type="button"
              onClick={() => {
                setSelectedImportance('imprescindible');
                setStatusFilter('all');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] ${isEssentialDone ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'}`}
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                <span>Imprescindibles</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <p className="text-base font-black font-mono mt-0.5">
                {essentialCompleted} / {essentialTotal}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedImportance('recomendable');
                setStatusFilter('all');
              }}
              className="p-2.5 rounded-xl border bg-slate-900 border-slate-800 text-slate-300 text-left transition-all hover:scale-[1.02] hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>Recomendables</span>
                <Info className="w-3 h-3 text-cyan-400" />
              </div>
              <p className="text-base font-black font-mono mt-0.5 text-white">
                {recommendedCompleted} / {recommendedTotal}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Main Status Toggle (Todas / Pendientes / Realizadas) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Todas</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ml-1 ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'pending'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>⏳ Pendientes</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ml-1 font-extrabold ${
                statusFilter === 'pending' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {pendingCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✅ Realizadas</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ml-1 font-extrabold ${
                statusFilter === 'completed' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {completedCount}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs px-2">
            {statusFilter === 'pending' && (
              <span className="text-amber-400 flex items-center gap-1.5 font-medium text-[11px] bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Mostrando {pendingCount} ítems por empacar/hacer</span>
              </span>
            )}
            {statusFilter === 'completed' && (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mostrando {completedCount} ítems completados</span>
              </span>
            )}
            {statusFilter === 'all' && (
              <span className="text-slate-400 text-[11px]">
                {completedCount} de {totalCount} completadas
              </span>
            )}
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todas las Categorías ({tripItems.length})</span>
          </button>

          {(Object.keys(CATEGORY_META) as ChecklistCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const count = tripItems.filter((i) => i.category === cat).length;
            const completedInCat = tripItems.filter((i) => i.category === cat && i.completed).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  isActive
                    ? `${meta.bg} ${meta.color} ${meta.border} shadow-sm ring-1 ring-white/10`
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.2 bg-black/30 rounded-full">
                  {completedInCat}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Bar: Importance, Traveler, Status, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          {/* Importance Filter */}
          <div className="flex items-center bg-slate-950 rounded-xl px-3 py-2 border border-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none w-full cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Importancia: Todas</option>
              <option value="imprescindible" className="bg-slate-900 text-white">⭐ Imprescindibles</option>
              <option value="recomendable" className="bg-slate-900 text-white">💡 Recomendables</option>
            </select>
          </div>

          {/* Traveler Filter */}
          <div className="flex items-center bg-slate-950 rounded-xl px-3 py-2 border border-slate-800">
            <User className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
            <select
              value={selectedTraveler}
              onChange={(e) => setSelectedTraveler(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none w-full cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Viajero: Todos</option>
              <option value="Todos" className="bg-slate-900 text-white">Asignado a: Todo el Grupo</option>
              {travelersList.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-white">
                  👤 {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-950 rounded-xl px-3 py-2 border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none w-full cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">Estado: Todos</option>
              <option value="pending" className="bg-slate-900 text-white">⏳ Solo Pendientes</option>
              <option value="completed" className="bg-slate-900 text-white">✅ Solo Completados</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="flex items-center bg-slate-950 rounded-xl px-3 py-2 border border-slate-800">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Buscar tarea o ítem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Task List Content */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            {statusFilter === 'pending' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">🎉 ¡Excelente! No tienes tareas pendientes</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Has completado todas las tareas correspondientes a este filtro. Cambia a "Todas" o "Realizadas" para revisar.
                </p>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
                >
                  Ver Todas las Tareas
                </button>
              </>
            ) : statusFilter === 'completed' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Aún no hay tareas marcadas como realizadas</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  A medida que empaques o prepares tus cosas, haz clic en el círculo de cada ítem para marcarlo como listo.
                </p>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all"
                >
                  Ver Tareas Pendientes
                </button>
              </>
            ) : (
              <>
                <Search className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">No se encontraron tareas con estos filtros</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Intenta cambiar los filtros seleccionados o añade un nuevo ítem a la lista de verificación.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedImportance('all');
                    setSelectedTraveler('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
                >
                  Restablecer Filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Section 1: Imprescindible (Essential) */}
            {filteredEssentials.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      ⭐ Imprescindible (Crítico antes de salir)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {filteredEssentials.filter((i) => i.completed).length} / {filteredEssentials.length} listos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredEssentials.map((item) => renderTaskCard(item))}
                </div>
              </div>
            )}

            {/* Section 2: Recomendable (Recommended) */}
            {filteredRecommended.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                    💡 Recomendable (Consejos y Comodidad)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {filteredRecommended.filter((i) => i.completed).length} / {filteredRecommended.length} listos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredRecommended.map((item) => renderTaskCard(item))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Agregar Nueva Tarea al Checklist</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Título de la Tarea / Ítem *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Comprar adaptador tipo C/F para Corea"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ChecklistCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {(Object.keys(CATEGORY_META) as ChecklistCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_META[cat].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nivel de Importancia
                  </label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as ChecklistImportance)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="imprescindible">⭐ Imprescindible (Crítico)</option>
                    <option value="recomendable">💡 Recomendable (Opcional)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Asignar a Viajero
                </label>
                <select
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Todos">👥 Todos los Viajeros</option>
                  {travelersList.map((t) => (
                    <option key={t} value={t}>
                      👤 {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Descripción / Instrucciones (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre voltajes, lugares de compra o especificaciones..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notas de Referencia (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Guardado en bolsillo frontal de la maleta"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Full Thai E-Visa Official Document Modal */}
      {isThaiVisaDocOpen && (
        <div
          id="modal-thai-evisa-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsThaiVisaDocOpen(false)}
        >
          <div
            id="modal-thai-evisa-content"
            className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 relative my-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar Header */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-amber-500/20 text-amber-300 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    Documento de Respaldo Oficial — THAI E-VISA
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Royal Thai Embassy • Electronic Visa Confirmation
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Imprimir o Guardar como PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsThaiVisaDocOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Document Body (Exact replica of Thai E-Visa Layout) */}
            <div className="p-6 sm:p-8 space-y-6 font-sans bg-[#FAFBFD]">
              {/* Header Title & Thai Emblem */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F3668]">
                    THAI E-VISA
                  </h1>
                  <p className="text-xs font-bold text-slate-600 mt-1">
                    KINGDOM OF THAILAND
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  {/* Garuda Emblem Representation */}
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 shadow-inner">
                    <span className="text-2xl" title="Garuda National Emblem of Thailand">🦅</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">14 August 2026</span>
                </div>
              </div>

              {/* SECTION A: APPLICANT DATA */}
              <div className="space-y-3">
                <div className="bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-[#0F3668]">
                  <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    A. APPLICANT DATA
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium pl-2">
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">First name :</span>
                    <span className="font-bold text-slate-900 uppercase">DONAURO</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Middle name :</span>
                    <span className="font-bold text-slate-900 uppercase">EMMANUEL</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Family name :</span>
                    <span className="font-bold text-slate-900 uppercase">CASTRO MENDOZA</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Sex :</span>
                    <span className="font-bold text-slate-900">M</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Date of birth :</span>
                    <span className="font-bold text-slate-900">03 June 1971</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Nationality :</span>
                    <span className="font-bold text-slate-900">HND (Honduras)</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Passport / TD :</span>
                    <span className="font-bold text-slate-900">Honduras</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-36">Passport / TD number :</span>
                    <span className="font-bold font-mono text-[#0F3668]">F847292</span>
                  </div>
                </div>
              </div>

              {/* SECTION B: VISA DATA */}
              <div className="space-y-3">
                <div className="bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-[#0F3668]">
                  <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    B. VISA DATA
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium pl-2">
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Transaction reference :</span>
                    <span className="font-mono font-bold text-slate-900">MEX001-202605-5685681</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Place of issue :</span>
                    <span className="font-bold text-slate-900">Mexico City</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Visa number :</span>
                    <span className="font-mono font-black text-amber-700 text-sm">G1939299</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Visa type :</span>
                    <span className="font-bold text-slate-900">Tourist TR</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">No. of Entry :</span>
                    <span className="font-bold text-slate-900">Single</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Valid from :</span>
                    <span className="font-bold text-slate-900">14 August 2026</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Valid until :</span>
                    <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 rounded">
                      11 November 2026
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-6 border-b border-slate-200 py-1">
                    <span className="text-slate-500 w-44">Remarks :</span>
                    <span className="font-bold text-red-600">Employment Prohibited</span>
                  </div>
                </div>
              </div>

              {/* Official QR Code & Authentication Footer */}
              <div className="pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-600 space-y-1 text-center sm:text-left">
                  <p className="italic">This e-mail was sent to <strong className="text-slate-900">donauro.castro@gmail.com</strong> on 14 August 2026</p>
                  <p className="font-mono text-[10px] text-slate-500">Security Ref: 63DA7TOMG10671692</p>
                  <p className="font-mono text-[9px] text-slate-400">G4aK759c7UGCAiU0QI6i1AdqB0Q=</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-300">
                  <div className="w-20 h-20 bg-slate-900 rounded-lg p-1.5 flex flex-col items-center justify-center text-white shadow">
                    <QrCode className="w-12 h-12 text-white" />
                    <span className="text-[7px] font-mono tracking-tighter">OFFICIAL QR</span>
                  </div>
                  <div className="text-[10px] text-slate-600 max-w-[130px]">
                    <span className="font-bold text-slate-900 block">E-Visa Verificada</span>
                    <span>Código QR oficial para lectura de oficiales de inmigración en Tailandia.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium text-[11px]">
                🛡️ Respaldo digital seguro guardado en ViajeFlow
              </span>
              <button
                type="button"
                onClick={() => setIsThaiVisaDocOpen(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Honduras - USA United Airlines Boarding Passes Official Backup Modal */}
      {isHondurasPassesDocOpen && (
        <div
          id="modal-hn-passes-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsHondurasPassesDocOpen(false)}
        >
          <div
            id="modal-hn-passes-content"
            className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 relative my-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#002244] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                    <span>UNITED AIRLINES — PASES DE ABORDAJE (XPL ➔ IAH ➔ SAT)</span>
                    <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded font-mono">
                      BE-NO CARRY ON
                    </span>
                  </h3>
                  <p className="text-[10px] text-blue-200 font-mono">
                    Confirmación / PNR: O7TX21 • Martes 18 de Agosto 2026 • Star Alliance
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-blue-600/40"
                  title="Imprimir o Guardar como PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsHondurasPassesDocOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Passes Container Body */}
            <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50">
              {/* PASS 1: DONAURO (UA 527: XPL -> IAH) */}
              <div className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-[#002244]">UNITED</span>
                    <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">INTL</span>
                    <span className="bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">BE-NO CARRY ON</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-600">O7TX21 • 28A • Page 1/4</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Passenger / Pasajero</span>
                    <strong className="text-sm text-slate-900">CASTROMENDOZA / DONAURO</strong>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Flight / Vuelo</span>
                    <strong className="text-base text-[#002244] font-black">UA 527</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Route / Ruta</span>
                    <strong className="text-slate-900">XPL ➔ IAH</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Boarding Begins</span>
                    <strong className="text-slate-900">11:50 AM (Ends 12:15 PM)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Departs / Arrives</span>
                    <strong className="text-slate-900">12:30 PM ➔ 4:35 PM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Seat / Asiento & Group</span>
                    <strong className="text-blue-700 font-bold text-sm">28A (Window) • Group 6</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                  <span>Ticket: 01621079886800</span>
                  <span>Confirmation: O7TX21 • Star Alliance</span>
                </div>
              </div>

              {/* PASS 2: NOHEMY (UA 527: XPL -> IAH) */}
              <div className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-[#002244]">UNITED</span>
                    <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">INTL</span>
                    <span className="bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">BE-NO CARRY ON</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-600">O7TX21 • 28C • Page 2/4</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Passenger / Pasajera</span>
                    <strong className="text-sm text-slate-900">ISRAEL / NOHEMY</strong>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Flight / Vuelo</span>
                    <strong className="text-base text-[#002244] font-black">UA 527</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Route / Ruta</span>
                    <strong className="text-slate-900">XPL ➔ IAH</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Boarding Begins</span>
                    <strong className="text-slate-900">11:50 AM (Ends 12:15 PM)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Departs / Arrives</span>
                    <strong className="text-slate-900">12:30 PM ➔ 4:35 PM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Seat / Asiento & Group</span>
                    <strong className="text-blue-700 font-bold text-sm">28C (Aisle) • Group 6</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                  <span>Ticket: 01621079886811</span>
                  <span>Confirmation: O7TX21 • Star Alliance</span>
                </div>
              </div>

              {/* PASS 3: DONAURO (UA 1477: IAH -> SAT) */}
              <div className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-[#002244]">UNITED</span>
                    <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">INTL / DOM</span>
                    <span className="bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">BE-NO CARRY ON</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-600">O7TX21 • 27D • Page 3/4</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Passenger / Pasajero</span>
                    <strong className="text-sm text-slate-900">CASTROMENDOZA / DONAURO</strong>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Flight / Vuelo</span>
                    <strong className="text-base text-[#002244] font-black">UA 1477</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Route / Ruta</span>
                    <strong className="text-slate-900">IAH ➔ SAT</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Boarding Begins</span>
                    <strong className="text-slate-900">6:15 PM (Ends 6:35 PM)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Departs / Arrives</span>
                    <strong className="text-slate-900">6:50 PM ➔ 7:58 PM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Seat / Asiento & Group</span>
                    <strong className="text-blue-700 font-bold text-sm">27D (Aisle) • Group 6</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                  <span>Ticket: 01621079886800</span>
                  <span>Confirmation: O7TX21 • Star Alliance</span>
                </div>
              </div>

              {/* PASS 4: NOHEMY (UA 1477: IAH -> SAT) */}
              <div className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-[#002244]">UNITED</span>
                    <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">INTL / DOM</span>
                    <span className="bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">BE-NO CARRY ON</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-600">O7TX21 • 26D • Page 4/4</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Passenger / Pasajera</span>
                    <strong className="text-sm text-slate-900">ISRAEL / NOHEMY</strong>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Flight / Vuelo</span>
                    <strong className="text-base text-[#002244] font-black">UA 1477</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Route / Ruta</span>
                    <strong className="text-slate-900">IAH ➔ SAT</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Boarding Begins</span>
                    <strong className="text-slate-900">6:15 PM (Ends 6:35 PM)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Departs / Arrives</span>
                    <strong className="text-slate-900">6:50 PM ➔ 7:58 PM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Seat / Asiento & Group</span>
                    <strong className="text-blue-700 font-bold text-sm">26D (Aisle) • Group 6</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                  <span>Ticket: 01621079886811</span>
                  <span>Confirmation: O7TX21 • Star Alliance</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium text-[11px]">
                🛡️ 4 pases de abordaje emitidos y listos para presentación en el mostrador / puerta
              </span>
              <button
                type="button"
                onClick={() => setIsHondurasPassesDocOpen(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Sub-renderer for task cards with Google Tasks interactive feel
  function renderTaskCard(item: ChecklistItem) {
    const meta = CATEGORY_META[item.category] || CATEGORY_META.other;
    const CategoryIcon = meta.icon;

    return (
      <div
        key={item.id}
        className={`group p-4 rounded-2xl border transition-all duration-200 ${
          item.completed
            ? 'bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-100'
            : 'bg-slate-900 hover:bg-slate-900/90 border-slate-800 shadow-md hover:border-slate-700 hover:shadow-lg'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          {/* Interactive Checkbox */}
          <button
            type="button"
            onClick={() => onToggleItem(item.id)}
            className="mt-0.5 shrink-0 focus:outline-none group-hover:scale-110 transition-transform"
            title={item.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <div className="w-5 h-5 rounded-lg border-2 border-slate-600 hover:border-emerald-400 bg-slate-950 transition-colors flex items-center justify-center" />
            )}
          </button>

          {/* Item Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div
                onClick={() => onToggleItem(item.id)}
                className={`font-bold text-xs cursor-pointer select-none leading-snug ${
                  item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                }`}
              >
                {item.title}
              </div>

              {/* Delete Button (Hover/Visible) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all shrink-0"
                title="Eliminar tarea"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {item.description && (
              <p
                onClick={() => onToggleItem(item.id)}
                className={`text-[11px] leading-relaxed cursor-pointer ${
                  item.completed ? 'text-slate-400 line-through' : 'text-slate-300'
                }`}
              >
                {item.description}
              </p>
            )}

            {/* Badges / Meta Info */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
              {/* Category Badge */}
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-medium border ${meta.bg} ${meta.color} ${meta.border}`}>
                <CategoryIcon className="w-2.5 h-2.5" />
                <span>{meta.label}</span>
              </span>

              {/* Importance Badge */}
              {item.importance === 'imprescindible' ? (
                <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-md font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Imprescindible</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-md font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  <span>Recomendable</span>
                </span>
              )}

              {/* Assigned Traveler */}
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md font-mono text-slate-400 bg-slate-950 border border-slate-800">
                <User className="w-2.5 h-2.5 text-cyan-400" />
                <span>{item.assignedTo || 'Todos'}</span>
              </span>

              {/* Custom tag */}
              {item.isCustom && (
                <span className="px-1.5 py-0.5 rounded-md font-mono text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Personalizado
                </span>
              )}
            </div>

            {/* Extra Notes */}
            {item.notes && (
              <div className="text-[10px] text-slate-400 italic bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800/60 mt-1">
                📌 {item.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
