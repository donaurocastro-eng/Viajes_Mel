import React, { useState } from 'react';
import { Trip, WhatsAppLog, WhatsAppConfig, SupabaseConfig } from '../types';
import { WhatsAppCenter } from './WhatsAppCenter';
import { SUPABASE_SQL_SCHEMA, testSupabaseConnection, saveSupabaseConfig } from '../services/supabaseService';
import { APP_VERSION_INFO } from '../version';
import {
  Settings,
  Smartphone,
  Database,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  UploadCloud,
  RefreshCw,
  ExternalLink,
  Tag,
  Calendar,
  Info,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState<'whatsapp' | 'supabase' | 'vercel' | 'version'>('whatsapp');
  const [copiedVersionInfo, setCopiedVersionInfo] = useState(false);

  // Supabase Local State
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.supabaseKey);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);
  const [copiedEnvVars, setCopiedEnvVars] = useState(false);

  const vercelJsonContent = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const vercelEnvSnippet = `VITE_SUPABASE_URL=${supabaseConfig.supabaseUrl || 'https://rqmpldlfjzgeiqfdjiua.supabase.co'}
VITE_SUPABASE_ANON_KEY=${supabaseConfig.supabaseKey || ''}`;

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                Panel de Integraciones y Configuración
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Versión: {APP_VERSION_INFO.version}
              </span>
              <span className="px-3 py-1 rounded-full text-xs text-slate-300 bg-slate-950/70 border border-slate-800 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Actualizado: {APP_VERSION_INFO.releaseDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Centro de Conexiones: WhatsApp, Supabase y Versión
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Administra las credenciales de mensajería, la base de datos PostgreSQL en Supabase, el despliegue y revisa la versión de la aplicación.
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
            <span>1. WhatsApp API</span>
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
            <span>2. Base de Datos Supabase</span>
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

          <button
            onClick={() => setActiveSection('version')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeSection === 'version'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>4. Versión & Actualizaciones ({APP_VERSION_INFO.version})</span>
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
              <p className="text-xs text-slate-400">Publica la aplicación en tu propio dominio en cuestión de segundos sin errores.</p>
            </div>
          </div>

          {/* Solución al Error Común en Vercel */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>¿Por qué Vercel dio error con el archivo anterior?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vercel <strong>ya no permite</strong> definir la clave <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">"env": &#123; ... &#125;</code> ni secretos con <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">@secreto</code> dentro de <code className="text-cyan-300 font-mono">vercel.json</code>.
              Por seguridad, las variables deben añadirse directamente en el panel de Vercel en <strong>Settings &gt; Environment Variables</strong>.
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-300">
            {/* Paso 1: Archivo vercel.json corregido */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div>
                  <span className="font-bold text-cyan-400">1. Archivo vercel.json Corregido (Con soporte SPA):</span>
                  <p className="text-[11px] text-slate-400">Coloca este archivo en la raíz del proyecto para evitar errores 404 al recargar:</p>
                </div>
                <button
                  onClick={() => copyText(vercelJsonContent, setCopiedVercel)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  {copiedVercel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVercel ? '¡Copiado!' : 'Copiar vercel.json'}</span>
                </button>
              </div>

              <textarea
                rows={10}
                readOnly
                value={vercelJsonContent}
                className="w-full bg-slate-950 font-mono text-[11px] text-cyan-300/90 p-4 rounded-2xl border border-slate-800 focus:outline-none"
              />
            </div>

            {/* Paso 2: Variables de Entorno */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div>
                  <span className="font-bold text-emerald-400">2. Variables de Entorno para Vercel:</span>
                  <p className="text-[11px] text-slate-400">En Vercel.com &gt; Tu Proyecto &gt; <strong>Settings &gt; Environment Variables</strong>:</p>
                </div>
                <button
                  onClick={() => copyText(vercelEnvSnippet, setCopiedEnvVars)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  {copiedEnvVars ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEnvVars ? '¡Copiado!' : 'Copiar Variables'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                readOnly
                value={vercelEnvSnippet}
                className="w-full bg-slate-950 font-mono text-[11px] text-emerald-300/90 p-4 rounded-2xl border border-slate-800 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                💡 <em>Tip:</em> En el panel de Vercel puedes pegar todo el bloque de texto directamente en la primera casilla y Vercel detectará automáticamente ambas variables clave y valor.
              </p>
            </div>

            {/* Pasos de despliegue resumidos */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-cyan-400 text-sm">🚀 Pasos Rápidos para Desplegar:</h3>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                <li>Sube tu repositorio a GitHub.</li>
                <li>Importa el proyecto en <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-cyan-400 font-bold underline">Vercel.com</a>.</li>
                <li>Pega las dos variables de entorno en la sección <strong>Environment Variables</strong>.</li>
                <li>Haz clic en <strong>Deploy</strong> y tu sitio estará en línea en menos de un minuto.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 4. Versión de la Aplicación y Registro de Actualizaciones */}
      {activeSection === 'version' && (
        <div className="space-y-6">
          {/* Main Version Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-3.5">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
                  <Tag className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {APP_VERSION_INFO.appName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500 text-slate-950 shadow-md">
                      {APP_VERSION_INFO.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estado: <span className="text-emerald-300 font-semibold">{APP_VERSION_INFO.environment}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const sysReport = `App: ${APP_VERSION_INFO.appName}\nVersión: ${APP_VERSION_INFO.version}\nFecha: ${APP_VERSION_INFO.releaseDate}\nBuild: ${APP_VERSION_INFO.buildNumber}\nSupabase Conectado: ${supabaseConfig.isConnected ? 'Sí' : 'No'}`;
                  copyText(sysReport, setCopiedVersionInfo);
                }}
                className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 text-xs font-bold transition-all text-slate-200 self-start sm:self-auto cursor-pointer"
              >
                {copiedVersionInfo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedVersionInfo ? '¡Datos Copiados!' : 'Copiar Diagnóstico'}</span>
              </button>
            </div>

            {/* Grid of Key Info Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  Versión Actual
                </span>
                <p className="text-lg font-mono font-black text-emerald-400">{APP_VERSION_INFO.version}</p>
                <p className="text-[11px] text-slate-400">Versión en ejecución</p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Fecha de Actualización
                </span>
                <p className="text-lg font-bold text-white">{APP_VERSION_INFO.releaseDate}</p>
                <p className="text-[11px] text-slate-400 font-mono">{APP_VERSION_INFO.releaseDateIso}</p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Compilación / Build
                </span>
                <p className="text-sm font-mono font-bold text-amber-300 pt-1">{APP_VERSION_INFO.buildNumber}</p>
                <p className="text-[11px] text-slate-400">Compilado y verificado</p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Base de Datos
                </span>
                <div className="flex items-center space-x-1.5 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${supabaseConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <p className="text-sm font-bold text-white">
                    {supabaseConfig.isConnected ? 'Supabase Activo' : 'Almacenamiento Local'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400">
                  {supabaseConfig.isConnected ? 'PostgreSQL sincronizado' : 'Modo local seguro'}
                </p>
              </div>
            </div>
          </div>

          {/* Historial de Versiones y Novedades (Changelog) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-xl">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registro de Actualizaciones y Cambios</h3>
                <p className="text-xs text-slate-400">
                  Historial cronológico de versiones y novedades implementadas en ViajeFlow.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {APP_VERSION_INFO.changelog.map((entry, idx) => (
                <div
                  key={entry.version}
                  className={`p-5 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-slate-950/80 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-950/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${
                        idx === 0
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {entry.version}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {entry.title}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Versión Actual
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {entry.date}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
                    {entry.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Footer: Always visible in Configuración */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>
            <strong className="text-white">{APP_VERSION_INFO.appName}</strong> • Versión{' '}
            <span className="font-mono text-emerald-400 font-bold">{APP_VERSION_INFO.version}</span> • Actualizado:{' '}
            <span className="text-slate-200 font-medium">{APP_VERSION_INFO.releaseDate}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400">
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            {APP_VERSION_INFO.buildNumber}
          </span>
        </div>
      </div>
    </div>
  );
};
