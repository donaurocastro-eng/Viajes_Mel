import React, { useState } from 'react';
import { SupabaseConfig } from '../types';
import { SUPABASE_SQL_SCHEMA, testSupabaseConnection, saveSupabaseConfig } from '../services/supabaseService';
import { Database, CheckCircle2, AlertCircle, Copy, Check, UploadCloud, RefreshCw, Layers, ExternalLink, Code } from 'lucide-react';

interface SupabaseVercelConfigProps {
  config: SupabaseConfig;
  onUpdateConfig: (cfg: SupabaseConfig) => void;
  onSyncLocalToSupabase: () => void;
  onClose: () => void;
}

export const SupabaseVercelConfig: React.FC<SupabaseVercelConfigProps> = ({
  config,
  onUpdateConfig,
  onSyncLocalToSupabase,
  onClose,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(config.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(config.supabaseKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'supabase' | 'schema' | 'vercel'>('supabase');

  const vercelJsonContent = `{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}`;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const newCfg: SupabaseConfig = {
      supabaseUrl: supabaseUrl.trim(),
      supabaseKey: supabaseKey.trim(),
      isConnected: false,
    };

    const isOk = await testSupabaseConnection(newCfg);
    newCfg.isConnected = isOk;

    saveSupabaseConfig(newCfg);
    onUpdateConfig(newCfg);
    setIsTesting(false);

    if (isOk) {
      setTestResult({ success: true, msg: '¡Conexión exitosa a Supabase! Tablas detectadas.' });
    } else {
      setTestResult({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-white my-8">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Integración Supabase & Vercel</h2>
              <p className="text-xs text-slate-400">Base de datos PostgreSQL en la nube y despliegue continuo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('supabase')}
            className={`pb-3 border-b-2 transition-colors ${
              activeSubTab === 'supabase'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            1. Conexión Supabase
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`pb-3 border-b-2 transition-colors ${
              activeSubTab === 'schema'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            2. Script SQL Tablas
          </button>
          <button
            onClick={() => setActiveSubTab('vercel')}
            className={`pb-3 border-b-2 transition-colors ${
              activeSubTab === 'vercel'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            3. Configuración Vercel (`vercel.json`)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {activeSubTab === 'supabase' && (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-emerald-400">🔗 Paso 1: Ingresa tus credenciales de Supabase</p>
                <p>Crea un proyecto gratuito en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-0.5 inline" /></a> y copia tu Project URL y Anon Key desde Project Settings &gt; API.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Supabase URL:</label>
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

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                    testResult.success
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                  <span>{testResult.msg}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onSyncLocalToSupabase}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  title="Sincronizar datos locales a Supabase"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Sincronizar Datos Locales a Supabase</span>
                </button>

                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg flex items-center space-x-2"
                >
                  {isTesting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Probar y Guardar Conexión</span>
                </button>
              </div>
            </form>
          )}

          {activeSubTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">📜 Script de Migración PostgreSQL para Supabase</span>
                <button
                  onClick={() => copyText(SUPABASE_SQL_SCHEMA, setCopiedSchema)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? '¡Copiado!' : 'Copiar Script SQL'}</span>
                </button>
              </div>

              <textarea
                rows={12}
                readOnly
                value={SUPABASE_SQL_SCHEMA}
                className="w-full bg-slate-950 font-mono text-[11px] text-emerald-300/90 p-4 rounded-xl border border-slate-800 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Abre tu Dashboard de Supabase &gt; SQL Editor &gt; Nuevo Query &gt; Pega este script y presiona RUN.
              </p>
            </div>
          )}

          {activeSubTab === 'vercel' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-cyan-400">🚀 Archivo de Configuración vercel.json</span>
                <button
                  onClick={() => copyText(vercelJsonContent, setCopiedVercel)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
                >
                  {copiedVercel ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVercel ? '¡Copiado!' : 'Copiar vercel.json'}</span>
                </button>
              </div>

              <textarea
                rows={10}
                readOnly
                value={vercelJsonContent}
                className="w-full bg-slate-950 font-mono text-[11px] text-cyan-300/90 p-4 rounded-xl border border-slate-800 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Puedes incluir este archivo en la raíz de tu repositorio para desplegar directamente en Vercel con un solo comando.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
