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

export const SUPABASE_SQL_SCHEMA = `-- Copia y pega este script completo en el SQL Editor de tu proyecto Supabase:

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

-- NUEVA TABLA: Registro y persistencia de fotos de viaje en la nube
CREATE TABLE IF NOT EXISTS travel_photos (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  country_code TEXT NOT NULL,
  country_name TEXT,
  city TEXT,
  title TEXT NOT NULL,
  data_url TEXT NOT NULL,
  date TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NUEVA TABLA: Países visitados y banderitas clavadas
CREATE TABLE IF NOT EXISTS visited_countries (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  continent TEXT,
  flag_emoji TEXT,
  capital TEXT,
  visited BOOLEAN DEFAULT TRUE,
  visited_date TEXT,
  trip_name TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- Habilitar permisos de lectura y escritura (Row Level Security) para la Anon Key
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE visited_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read/write trips" ON trips FOR ALL USING (true);
CREATE POLICY "Allow anon read/write flights" ON flights FOR ALL USING (true);
CREATE POLICY "Allow anon read/write reservations" ON reservations FOR ALL USING (true);
CREATE POLICY "Allow anon read/write activities" ON activities FOR ALL USING (true);
CREATE POLICY "Allow anon read/write travel_photos" ON travel_photos FOR ALL USING (true);
CREATE POLICY "Allow anon read/write visited_countries" ON visited_countries FOR ALL USING (true);
CREATE POLICY "Allow anon read/write whatsapp_logs" ON whatsapp_logs FOR ALL USING (true);
`;

// Helper: Guardar o actualizar una foto individual en Supabase
export async function savePhotoToSupabase(photo: any, config?: SupabaseConfig): Promise<boolean> {
  const client = getSupabaseInstance(config);
  if (!client) return false;
  try {
    const payload = {
      id: photo.id,
      trip_id: photo.tripId || null,
      country_code: photo.countryCode,
      country_name: photo.countryName || '',
      city: photo.city || '',
      title: photo.title || 'Foto de viaje',
      data_url: photo.dataUrl,
      date: photo.date || new Date().toISOString().split('T')[0],
      notes: photo.notes || '',
      created_at: photo.createdAt || new Date().toISOString(),
    };
    const { error } = await client.from('travel_photos').upsert(payload);
    if (error) {
      console.error('Error saving photo to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase savePhotoToSupabase exception:', err);
    return false;
  }
}

// Helper: Eliminar una foto de Supabase
export async function deletePhotoFromSupabase(photoId: string, config?: SupabaseConfig): Promise<boolean> {
  const client = getSupabaseInstance(config);
  if (!client) return false;
  try {
    const { error } = await client.from('travel_photos').delete().eq('id', photoId);
    if (error) {
      console.error('Error deleting photo from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deletePhotoFromSupabase exception:', err);
    return false;
  }
}

// Helper: Descargar todas las fotos guardadas en Supabase
export async function fetchPhotosFromSupabase(config?: SupabaseConfig): Promise<any[] | null> {
  const client = getSupabaseInstance(config);
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('travel_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos from Supabase:', error);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      tripId: row.trip_id,
      countryCode: row.country_code,
      countryName: row.country_name,
      city: row.city,
      title: row.title,
      dataUrl: row.data_url,
      date: row.date,
      notes: row.notes,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Supabase fetchPhotosFromSupabase exception:', err);
    return null;
  }
}

// Helper: Sincronizar masivamente un lote de fotos a Supabase
export async function syncAllPhotosToSupabase(photos: any[], config?: SupabaseConfig): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseInstance(config);
  if (!client) return { success: false, count: 0, error: 'Supabase no configurado' };
  try {
    const payloads = photos.map(photo => ({
      id: photo.id,
      trip_id: photo.tripId || null,
      country_code: photo.countryCode,
      country_name: photo.countryName || '',
      city: photo.city || '',
      title: photo.title || 'Foto de viaje',
      data_url: photo.dataUrl,
      date: photo.date || new Date().toISOString().split('T')[0],
      notes: photo.notes || '',
      created_at: photo.createdAt || new Date().toISOString(),
    }));

    const { error } = await client.from('travel_photos').upsert(payloads);
    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    return { success: true, count: payloads.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message };
  }
}

// Helper: Guardar o actualizar país visitado en Supabase
export async function saveVisitedCountryToSupabase(country: any, config?: SupabaseConfig): Promise<boolean> {
  const client = getSupabaseInstance(config);
  if (!client) return false;
  try {
    const payload = {
      code: country.code,
      name: country.name,
      continent: country.continent || '',
      flag_emoji: country.flagEmoji || '',
      capital: country.capital || '',
      visited: !!country.visited,
      visited_date: country.visitedDate || null,
      notes: country.notes || '',
      trip_name: country.tripName || '',
    };
    const { error } = await client.from('visited_countries').upsert(payload);
    return !error;
  } catch {
    return false;
  }
}

// Helper: Descargar países visitados desde Supabase
export async function fetchVisitedCountriesFromSupabase(config?: SupabaseConfig): Promise<any[] | null> {
  const client = getSupabaseInstance(config);
  if (!client) return null;
  try {
    const { data, error } = await client.from('visited_countries').select('*');
    if (error) return null;
    return (data || []).map((row: any) => ({
      code: row.code,
      name: row.name,
      continent: row.continent,
      flagEmoji: row.flag_emoji,
      capital: row.capital,
      visited: row.visited,
      visitedDate: row.visited_date,
      notes: row.notes,
      tripName: row.trip_name,
    }));
  } catch {
    return null;
  }
}
