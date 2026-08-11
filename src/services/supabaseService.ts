import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Trip, Flight, Reservation, Activity, WhatsAppLog, SupabaseConfig } from '../types';

const CONFIG_STORAGE_KEY = 'travel_supabase_config_v1';

export function getSavedSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading Supabase config', e);
  }
  return {
    supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    supabaseKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
    isConnected: false,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseInstance(config?: SupabaseConfig): SupabaseClient | null {
  const cfg = config || getSavedSupabaseConfig();
  if (!cfg.supabaseUrl || !cfg.supabaseKey) {
    return null;
  }
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(cfg.supabaseUrl, cfg.supabaseKey);
    } catch (e) {
      console.error('Failed to instantiate Supabase client:', e);
      return null;
    }
  }
  return supabaseClient;
}

export async function testSupabaseConnection(config: SupabaseConfig): Promise<boolean> {
  if (!config.supabaseUrl || !config.supabaseKey) return false;
  try {
    const client = createClient(config.supabaseUrl, config.supabaseKey);
    const { error } = await client.from('trips').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Supabase test failed:', e);
    return false;
  }
}

export const SUPABASE_SQL_SCHEMA = `-- Copia y pega este script en el SQL Editor de tu proyecto Supabase:

CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'planning',
  budget_total NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flights (
  id TEXT PRIMARY KEY,
  trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
  flight_number TEXT NOT NULL,
  airline TEXT,
  departure_airport TEXT,
  arrival_airport TEXT,
  departure_city TEXT,
  arrival_city TEXT,
  departure_time TEXT,
  arrival_time TEXT,
  terminal TEXT,
  gate TEXT,
  seat TEXT,
  status TEXT DEFAULT 'programado',
  confirmation_code TEXT,
  price NUMERIC DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  provider TEXT,
  address TEXT,
  check_in TEXT,
  check_out TEXT,
  confirmation_code TEXT,
  status TEXT DEFAULT 'confirmed',
  price NUMERIC DEFAULT 0,
  phone TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'sightseeing',
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  cost NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium'
);

CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  recipient TEXT,
  message_type TEXT,
  content TEXT,
  status TEXT DEFAULT 'sent',
  is_real_api BOOLEAN DEFAULT FALSE
);

-- Habilitar permisos de lectura y escritura para la Anon Key
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read/write trips" ON trips FOR ALL USING (true);
CREATE POLICY "Allow anon read/write flights" ON flights FOR ALL USING (true);
CREATE POLICY "Allow anon read/write reservations" ON reservations FOR ALL USING (true);
CREATE POLICY "Allow anon read/write activities" ON activities FOR ALL USING (true);
CREATE POLICY "Allow anon read/write whatsapp_logs" ON whatsapp_logs FOR ALL USING (true);
`;
