import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Flight, Activity, Reservation } from '../types';

interface LeafletMapViewProps {
  flights: Flight[];
  activities: Activity[];
  reservations: Reservation[];
  onSelectCity?: (city: string) => void;
  selectedCity?: string | null;
}

// City coordinates catalog
const CITY_COORDS_MAP: Record<string, { lat: number; lng: number; label: string; flag: string; country: string }> = {
  comayagua: { lat: 14.3817, lng: -87.6214, label: 'Comayagua / Palmerola (XPL)', flag: '🇭🇳', country: 'Honduras' },
  tegucigalpa: { lat: 14.0818, lng: -87.2068, label: 'Tegucigalpa (TGU)', flag: '🇭🇳', country: 'Honduras' },
  'san pedro sula': { lat: 15.4544, lng: -87.9239, label: 'San Pedro Sula (SAP)', flag: '🇭🇳', country: 'Honduras' },
  houston: { lat: 29.9902, lng: -95.3368, label: 'Houston (IAH)', flag: '🇺🇸', country: 'EE.UU.' },
  'san antonio': { lat: 29.5337, lng: -98.4698, label: 'San Antonio (SAT)', flag: '🇺🇸', country: 'EE.UU.' },
  'san francisco': { lat: 37.6213, lng: -122.3790, label: 'San Francisco (SFO)', flag: '🇺🇸', country: 'EE.UU.' },
  osaka: { lat: 34.4347, lng: 135.2327, label: 'Osaka (KIX)', flag: '🇯🇵', country: 'Japón' },
  tokio: { lat: 35.5494, lng: 139.7798, label: 'Tokio (HND / NRT)', flag: '🇯🇵', country: 'Japón' },
  tokyo: { lat: 35.5494, lng: 139.7798, label: 'Tokio (HND / NRT)', flag: '🇯🇵', country: 'Japón' },
  seoul: { lat: 37.4602, lng: 126.4407, label: 'Seúl (ICN)', flag: '🇰🇷', country: 'Corea del Sur' },
  seul: { lat: 37.4602, lng: 126.4407, label: 'Seúl (ICN)', flag: '🇰🇷', country: 'Corea del Sur' },
  bangkok: { lat: 13.6900, lng: 100.7501, label: 'Bangkok (BKK)', flag: '🇹🇭', country: 'Tailandia' },
};

function resolveCoords(cityName: string, airportCode?: string): { lat: number; lng: number; label: string; flag: string; country: string } {
  const clean = (cityName || '').toLowerCase();
  for (const key of Object.keys(CITY_COORDS_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return CITY_COORDS_MAP[key];
    }
  }

  const str = ((airportCode || '') + ' ' + cityName).toUpperCase();
  if (str.includes('XPL') || str.includes('TGU') || str.includes('SAP') || str.includes('HONDURAS')) return CITY_COORDS_MAP['comayagua'];
  if (str.includes('IAH') || str.includes('HOUSTON')) return CITY_COORDS_MAP['houston'];
  if (str.includes('SAT') || str.includes('SAN ANTONIO')) return CITY_COORDS_MAP['san antonio'];
  if (str.includes('SFO') || str.includes('SAN FRANCISCO')) return CITY_COORDS_MAP['san francisco'];
  if (str.includes('KIX') || str.includes('OSAKA')) return CITY_COORDS_MAP['osaka'];
  if (str.includes('HND') || str.includes('NRT') || str.includes('TOKYO')) return CITY_COORDS_MAP['tokyo'];
  if (str.includes('ICN') || str.includes('SEOUL')) return CITY_COORDS_MAP['seoul'];
  if (str.includes('BKK') || str.includes('BANGKOK')) return CITY_COORDS_MAP['bangkok'];

  return { lat: 20.0, lng: 0.0, label: cityName, flag: '📍', country: 'Destino' };
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  flights,
  activities,
  reservations,
  onSelectCity,
  selectedCity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map with OpenStreetMap CartoDB Dark Matter / Standard tiles
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25, 20],
        zoom: 2,
        minZoom: 1,
        maxZoom: 18,
        zoomControl: true,
      });

      // High-performance OpenStreetMap / CartoDB tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers (except tileLayer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const allLatLngs: L.LatLngExpression[] = [];

    // Draw Flight Route Polylines and Markers
    flights.forEach((f, idx) => {
      const dep = resolveCoords(f.departureCity, f.departureAirport);
      const arr = resolveCoords(f.arrivalCity, f.arrivalAirport);

      const latLng1: [number, number] = [dep.lat, dep.lng];
      const latLng2: [number, number] = [arr.lat, arr.lng];
      allLatLngs.push(latLng1, latLng2);

      const isCompleted = f.status === 'aterrizado';
      const isInFlight = f.status === 'en_vuelo' || f.status === 'embarcando';
      const isTrain = f.transportType === 'train';

      const routeColor = isCompleted ? '#10b981' : isInFlight ? '#f59e0b' : '#0284c7';
      const dashArray = isCompleted ? undefined : '6, 8';

      // Flight Route Line
      const polyline = L.polyline([latLng1, latLng2], {
        color: routeColor,
        weight: 3.5,
        opacity: 0.85,
        dashArray,
      }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 4px;">
          <div style="font-size: 11px; font-weight: 800; color: ${routeColor}; text-transform: uppercase; margin-bottom: 4px;">
            ${isTrain ? '🚅 Tren Bala' : '✈️ Tramo #' + (idx + 1)} • ${isCompleted ? '🟢 Realizado' : isInFlight ? '🛫 En Tránsito' : '🕒 Programado'}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            ${f.airline} ${f.flightNumber}
          </div>
          <div style="font-size: 12px; color: #334155; margin-bottom: 6px;">
            ${dep.flag} ${f.departureCity} ➔ ${arr.flag} ${f.arrivalCity}
          </div>
          <div style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            📅 ${f.departureTime.replace('T', ' ')}
            ${f.confirmationCode ? '<br><b>PNR:</b> ' + f.confirmationCode : ''}
          </div>
        </div>
      `;
      polyline.bindPopup(popupContent);
    });

    // Collect Unique Cities and Draw Custom Rich Markers
    const citySet = new Map<string, { lat: number; lng: number; label: string; flag: string; country: string; actsCount: number; resCount: number }>();

    flights.forEach((f) => {
      const dep = resolveCoords(f.departureCity, f.departureAirport);
      const arr = resolveCoords(f.arrivalCity, f.arrivalAirport);

      [dep, arr].forEach((loc) => {
        const key = loc.label.toLowerCase();
        if (!citySet.has(key)) {
          const acts = activities.filter((a) => (a.location || '').toLowerCase().includes(loc.label.toLowerCase()) || (a.title || '').toLowerCase().includes(loc.label.toLowerCase()));
          const res = reservations.filter((r) => (r.address || '').toLowerCase().includes(loc.label.toLowerCase()) || (r.title || '').toLowerCase().includes(loc.label.toLowerCase()));
          citySet.set(key, { ...loc, actsCount: acts.length, resCount: res.length });
        }
      });
    });

    citySet.forEach((cityData) => {
      const customIcon = L.divIcon({
        className: 'custom-leaflet-city-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            background: #0f172a;
            color: #ffffff;
            padding: 3px 8px;
            border-radius: 9999px;
            border: 2px solid #06b6d4;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span>${cityData.flag}</span>
            <span>${cityData.label.split('(')[0].trim()}</span>
            ${cityData.actsCount > 0 ? `<span style="background: #10b981; color: #020617; font-size: 9px; padding: 1px 4px; border-radius: 6px;">${cityData.actsCount}</span>` : ''}
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      const marker = L.marker([cityData.lat, cityData.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 4px;">
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
            <span>${cityData.flag}</span> <span>${cityData.label}</span>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            País: ${cityData.country}
          </div>
          <div style="font-size: 11px; color: #334155; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            📍 <b>Actividades programadas:</b> ${cityData.actsCount}<br>
            🏨 <b>Reservas/Hoteles:</b> ${cityData.resCount}
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityData.label)}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: 700; color: #0284c7; text-decoration: none;">
              Abrir en Google Maps ↗
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectCity) {
          onSelectCity(cityData.label);
        }
      });
    });

    // Fit bounds automatically so all route destinations are immediately visible
    if (allLatLngs.length > 0) {
      try {
        const bounds = L.latLngBounds(allLatLngs);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      } catch (err) {
        console.error('Leaflet fitBounds error:', err);
      }
    }

    // Invalidate size to ensure crisp rendering after mounting in tab layout
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

  }, [flights, activities, reservations, onSelectCity]);

  // Handle focus on selected city
  useEffect(() => {
    if (!selectedCity || !mapInstanceRef.current) return;
    const coords = resolveCoords(selectedCity);
    if (coords) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 10, { duration: 1.2 });
    }
  }, [selectedCity]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Floating Control Overlay */}
      <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl flex items-center space-x-2">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              const allPoints = flights.map((f) => {
                const dep = resolveCoords(f.departureCity, f.departureAirport);
                return [dep.lat, dep.lng] as [number, number];
              });
              if (allPoints.length > 0) {
                mapInstanceRef.current.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50] });
              }
            }
          }}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-lg transition-colors flex items-center space-x-1"
        >
          <span>🎯 Centrar Todo</span>
        </button>
      </div>
    </div>
  );
};
