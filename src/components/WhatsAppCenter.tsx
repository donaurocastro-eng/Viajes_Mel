import React, { useState } from 'react';
import { Trip, WhatsAppLog, WhatsAppConfig } from '../types';
import { MessageSquare, Send, Smartphone, Settings, CheckCheck, AlertCircle, RefreshCw, Sparkles, Shield, Bell } from 'lucide-react';

interface WhatsAppCenterProps {
  trip: Trip;
  logs: WhatsAppLog[];
  config: WhatsAppConfig;
  onSaveConfig: (cfg: WhatsAppConfig) => void;
  onSendCustomMessage: (message: string, recipient?: string) => void;
  onClearLogs: () => void;
  onTriggerQuickAlert: (type: 'gate_change' | 'delay_alert' | 'booking' | 'daily_summary') => void;
}

export const WhatsAppCenter: React.FC<WhatsAppCenterProps> = ({
  trip,
  logs,
  config,
  onSaveConfig,
  onSendCustomMessage,
  onClearLogs,
  onTriggerQuickAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'config' | 'triggers'>('simulator');
  const [customMessageInput, setCustomMessageInput] = useState<string>('');
  const [recipientInput, setRecipientInput] = useState<string>(config.defaultRecipient || '+34 600 000 000');

  // Form state for config
  const [apiToken, setApiToken] = useState(config.apiToken);
  const [phoneNumberId, setPhoneNumberId] = useState(config.phoneNumberId);
  const [defaultRecipient, setDefaultRecipient] = useState(config.defaultRecipient);
  const [provider, setProvider] = useState(config.provider);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      apiToken,
      phoneNumberId,
      defaultRecipient,
      enableAutoAlerts: true,
      provider,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessageInput.trim()) return;
    onSendCustomMessage(customMessageInput, recipientInput);
    setCustomMessageInput('');
  };

  const tripLogs = logs.filter((l) => l.tripId === trip.id || l.tripId === 'default');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 rounded-2xl border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-extrabold tracking-tight">Centro de Notificaciones WhatsApp API</h2>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              {config.provider === 'cloud_api' ? 'Meta Cloud API Activa' : 'Simulador Interactivo'}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Envía mensajes directos a tu teléfono con cambios de puerta, retrasos de vuelos, confirmaciones y resúmenes diarios.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista Teléfono Live</span>
          </button>
          <button
            onClick={() => setActiveTab('triggers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'triggers'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alertas Rápidas</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'config'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurar API</span>
          </button>
        </div>
      </div>

      {/* Content views */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* WhatsApp Phone Mockup (2 cols) */}
          <div className="lg:col-span-2 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px]">
            
            {/* WhatsApp Header Bar */}
            <div className="bg-emerald-900/90 px-4 py-3 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 border border-emerald-400">
                  WA
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center space-x-1">
                    <span>ViajeFlow Copilot</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-emerald-200">Bot de Alertas de Viaje • {config.defaultRecipient || '+34 600 000 000'}</p>
                </div>
              </div>

              <button
                onClick={onClearLogs}
                className="text-xs text-emerald-200 hover:text-white bg-emerald-950/60 px-2 py-1 rounded border border-emerald-700"
              >
                Limpiar Historial
              </button>
            </div>

            {/* Chat Body Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950">
              {tripLogs.length === 0 ? (
                <div className="text-center py-20 text-slate-500 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-700" />
                  <p className="text-xs">Sin mensajes enviados aún.</p>
                  <p className="text-[11px] text-slate-600">Prueba enviando una alerta de puerta o un resumen de itinerario.</p>
                </div>
              ) : (
                tripLogs.map((log) => (
                  <div key={log.id} className="flex flex-col items-start max-w-lg">
                    <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-100 p-3 rounded-2xl rounded-tl-xs shadow-md space-y-1.5 w-full">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 border-b border-emerald-900 pb-1">
                        <span className="font-extrabold uppercase tracking-wider">{log.messageType}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {/* Message Content rendered cleanly */}
                      <p className="text-xs whitespace-pre-wrap font-sans text-slate-100 leading-relaxed">
                        {log.content}
                      </p>

                      <div className="flex items-center justify-end space-x-1 text-[10px] text-emerald-400/80 pt-1">
                        <span>{log.isRealApi ? 'Meta API Real' : 'Simulado'}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendCustom} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Escribe un mensaje directo para enviar por WhatsApp..."
                value={customMessageInput}
                onChange={(e) => setCustomMessageInput(e.target.value)}
                className="flex-1 bg-slate-950 text-white placeholder-slate-500 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-colors"
                title="Enviar mensaje directo"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Direct Send Control Panel (1 col) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Envío Directo Personalizado</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Teléfono Destino (WhatsApp):</label>
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mensaje de Prueba:</label>
                <textarea
                  rows={4}
                  value={customMessageInput}
                  onChange={(e) => setCustomMessageInput(e.target.value)}
                  placeholder="Ej: Hola! Recordatorio de tu vuelo IB 6801 mañana a las 18:45."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <button
                onClick={handleSendCustom}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Notificación WhatsApp</span>
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-[11px] text-slate-400">
              <p className="font-semibold text-emerald-400">💡 Información de Envío:</p>
              <p>Si configuras tu API Token de Meta Business en la pestaña "Configurar API", el mensaje se enviará a tu cuenta real de WhatsApp. De lo contrario, se procesará en este simulador en vivo.</p>
            </div>
          </div>

        </div>
      )}

      {/* Quick Alert Triggers Tab */}
      {activeTab === 'triggers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="p-3 bg-amber-500/10 rounded-xl w-fit text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Alerta Cambio de Puerta</h3>
            <p className="text-xs text-slate-400">Notifica instantáneamente un cambio en la puerta de abordaje al viajero.</p>
            <button
              onClick={() => onTriggerQuickAlert('gate_change')}
              className="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors"
            >
              Probar Alerta de Puerta
            </button>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-rose-500/50 transition-all">
            <div className="p-3 bg-rose-500/10 rounded-xl w-fit text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Alerta Retraso de Vuelo</h3>
            <p className="text-xs text-slate-400">Avisa sobre cambios de horario o demora en la hora de salida.</p>
            <button
              onClick={() => onTriggerQuickAlert('delay_alert')}
              className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
            >
              Probar Alerta de Retraso
            </button>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all">
            <div className="p-3 bg-cyan-500/10 rounded-xl w-fit text-cyan-400 border border-cyan-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Confirmación de Reserva</h3>
            <p className="text-xs text-slate-400">Envía código de confirmación y dirección de hotel o vehículo.</p>
            <button
              onClick={() => onTriggerQuickAlert('booking')}
              className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-colors"
            >
              Probar Confirmación
            </button>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="p-3 bg-emerald-500/10 rounded-xl w-fit text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Resumen de Itinerario Día</h3>
            <p className="text-xs text-slate-400">Genera y envía el programa de actividades sugeridas para hoy.</p>
            <button
              onClick={() => onTriggerQuickAlert('daily_summary')}
              className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
            >
              Enviar Resumen Diario
            </button>
          </div>
        </div>
      )}

      {/* Config Settings Tab */}
      {activeTab === 'config' && (
        <form onSubmit={handleSave} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 max-w-2xl mx-auto shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Configuración de Credenciales WhatsApp API</span>
            </h3>
            <p className="text-xs text-slate-400">
              Puedes usar las credenciales de Meta Cloud API o desplegar tu webhook a Vercel
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Proveedor de Servicio:</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as WhatsAppConfig['provider'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="simulator">Simulador Integrado (Recomendado para Pruebas)</option>
                <option value="cloud_api">Meta WhatsApp Cloud API (API Token Real)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Teléfono Destino por Defecto:</label>
              <input
                type="text"
                placeholder="+34600000000"
                value={defaultRecipient}
                onChange={(e) => setDefaultRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meta WhatsApp API Token:</label>
              <input
                type="password"
                placeholder="EAAG..."
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number ID (Meta Business):</label>
              <input
                type="text"
                placeholder="10060938..."
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isSaved ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCheck className="w-4 h-4" />
                <span>¡Configuración guardada correctamente!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
