import React, { useState } from 'react';
import { Trip, WhatsAppLog, WhatsAppConfig, SupabaseConfig } from '../types';
import { WhatsAppCenter } from './WhatsAppCenter';
import { SUPABASE_SQL_SCHEMA, testSupabaseConnection, saveSupabaseConfig } from '../services/supabaseService';
import { Settings, Smartphone, Database, Rocket, CheckCircle2, AlertCircle, Copy, Check, UploadCloud, RefreshCw, ExternalLink } from 'lucide-react';

interface SettingsViewProps {
  trip: Trip;
  whatsAppLogs: WhatsAppLog[];
  whatsAppConfig: WhatsAppConfig;
  supabaseConfig: SupabaseConfig;
  onSaveWhatsAppConfig: (cfg: WhatsAppConfig) => void;
  onSendCustomWhatsAppMessage: (message: string, recipient?: string) => void;
  onClearWhatsAppLogs: () => void;
  onTriggerQuickWhatsAppAlert: (type: 'gate_change' | 'delay_alert' | 'booking' | 'daily_summary') => void;
  onUpdateSupabaseConfig: (cfg: SupabaseConfig) => void;
  onSyncLocalToSupabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  trip,
  whatsAppLogs,
  whatsAppConfig,
  supabaseConfig,
  onSaveWhatsAppConfig,
  onSendCustomWhatsAppMessage,
  onClearWhatsAppLogs,
  onTriggerQuickWhatsAppAlert,
  onUpdateSupabaseConfig,
  onSyncLocalToSupabase,
}) => {
  const [activeSection, setActiveSection] = useState<'whatsapp' | 'supabase' | 'vercel'>('whatsapp');

  // Supabase Local State
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.supabaseKey);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);

  const vercelJsonContent = `{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "${supabaseConfig.supabaseUrl || '@supabase_url'}",
    "VITE_SUPABASE_ANON_KEY": "${supabaseConfig.supabaseKey || '@supabase_anon_key'}",
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}`;

  const handleTestAndSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);

    const newCfg: SupabaseConfig = {
      supabaseUrl: supabaseUrl.trim(),
      supabaseKey: supabaseKey.trim(),
      isConnected: false,
    };

    const isOk = await testSupabaseConnection(newCfg);
    newCfg.isConnected = isOk;

    saveSupabaseConfig(newCfg);
    onUpdateSupabaseConfig(newCfg);
    setIsTestingSupabase(false);

    if (isOk) {
      setSupabaseTestResult({ success: true, msg: '¡Conexión exitosa a Supabase! Tablas sincronizadas.' });
    } else {
      setSupabaseTestResult({
        success: false,
        msg: 'No se pudo conectar a Supabase. Verifica la URL y Anon Key, y asegúrate de ejecutar el script SQL.',
      });
    }
  };

  const copyText = (text: string, setFn: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                Panel de Integraciones y Configuración
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Centro de Conexiones: WhatsApp, Supabase y Vercel
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Administra las credenciales de mensajería, la base de datos PostgreSQL en la nube y el despliegue automático.
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 text-xs font-bold">
          <button
            onClick={() => setActiveSection('whatsapp')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeSection === 'whatsapp'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. WhatsApp API & Notificaciones</span>
          </button>

          <button
            onClick={() => setActiveSection('supabase')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeSection === 'supabase'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Supabase (PostgreSQL Cloud)</span>
          </button>

          <button
            onClick={() => setActiveSection('vercel')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeSection === 'vercel'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>3. Despliegue en Vercel</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSection === 'whatsapp' && (
        <WhatsAppCenter
          trip={trip}
          logs={whatsAppLogs}
          config={whatsAppConfig}
          onSaveConfig={onSaveWhatsAppConfig}
          onSendCustomMessage={onSendCustomWhatsAppMessage}
          onClearLogs={onClearWhatsAppLogs}
          onTriggerQuickAlert={onTriggerQuickWhatsAppAlert}
        />
      )}

      {activeSection === 'supabase' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-xl">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configuración de Base de Datos Supabase</h2>
              <p className="text-xs text-slate-400">Conecta tu backend de PostgreSQL para persisitir viajes, boletos y reservas.</p>
            </div>
          </div>

          <form onSubmit={handleTestAndSaveSupabase} className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-emerald-400">🔗 Paso 1: Obtén tus llaves de proyecto</p>
              <p>
                Ingresa a tu dashboard en{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline inline-flex items-center font-bold"
                >
                  supabase.com <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                </a>{' '}
                y copia la URL y Anon Key desde <strong>Project Settings &gt; API</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Supabase Project URL:</label>
                <input
                  type="text"
                  placeholder="https://xyzxyz.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Supabase Anon Key:</label>
                <input
                  type="password"
                  placeholder="eyJh..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {supabaseTestResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
                  supabaseTestResult.success
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}
              >
                {supabaseTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{supabaseTestResult.msg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onSyncLocalToSupabase}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Sincronizar Datos Locales a Supabase</span>
              </button>

              <button
                type="submit"
                disabled={isTestingSupabase}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
              >
                {isTestingSupabase && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Probar y Guardar Conexión</span>
              </button>
            </div>
          </form>

          {/* SQL Script Viewer */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold text-emerald-400">📜 Script de Estructura SQL (Tablas para Supabase)</span>
              <button
                onClick={() => copyText(SUPABASE_SQL_SCHEMA, setCopiedSchema)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? '¡Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>

            <textarea
              rows={10}
              readOnly
              value={SUPABASE_SQL_SCHEMA}
              className="w-full bg-slate-950 font-mono text-[11px] text-emerald-300/90 p-4 rounded-2xl border border-slate-800 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Abre tu Dashboard en Supabase &gt; SQL Editor &gt; Nuevo Query &gt; Pega este script y ejecuta para crear automáticamente las tablas.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'vercel' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-xl">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Despliegue Continuo en Vercel</h2>
              <p className="text-xs text-slate-400">Publica la aplicación en tu propio dominio en cuestión de segundos.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-cyan-400 text-sm">📋 Pasos para Desplegar en Vercel:</h3>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                <li>Exporta o sube el código fuente a tu cuenta de GitHub / GitLab.</li>
                <li>Conecta tu repositorio en <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-cyan-400 font-bold underline">Vercel.com</a>.</li>
                <li>En la sección <strong>Environment Variables</strong> de Vercel, agrega:
                  <ul className="list-disc list-inside pl-4 pt-1 font-mono text-emerald-300 text-[11px] space-y-0.5">
                    <li>VITE_SUPABASE_URL = {supabaseConfig.supabaseUrl || 'https://tu-proyecto.supabase.co'}</li>
                    <li>VITE_SUPABASE_ANON_KEY = {supabaseConfig.supabaseKey || 'tu-anon-key'}</li>
                    <li>GEMINI_API_KEY = (Opcional para el Planificador con IA)</li>
                  </ul>
                </li>
                <li>Haz clic en <strong>Deploy</strong> y ¡listo! Tu app estará en producción.</li>
              </ol>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold text-cyan-400">📁 Archivo vercel.json Generado:</span>
                <button
                  onClick={() => copyText(vercelJsonContent, setCopiedVercel)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
                >
                  {copiedVercel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVercel ? '¡Copiado!' : 'Copiar vercel.json'}</span>
                </button>
              </div>

              <textarea
                rows={9}
                readOnly
                value={vercelJsonContent}
                className="w-full bg-slate-950 font-mono text-[11px] text-cyan-300/90 p-4 rounded-2xl border border-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
