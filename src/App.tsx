import React, { useState, useEffect } from 'react';
import { 
  Trip, Flight, Reservation, ReservationStatus, Activity, 
  WhatsAppLog, WhatsAppConfig, SupabaseConfig, FlightStatus, 
  BoardingPassAttachment, GroundTransfer, Expense, ChecklistItem,
  VisitedCountry, TravelPhoto 
} from './types';
import { 
  initialTrips, initialFlights, initialReservations, 
  initialActivities, initialWhatsAppLogs, initialGroundTransfers, 
  initialExpenses, initialChecklistItems 
} from './data/mockData';
import { WORLD_COUNTRIES_CATALOG, INITIAL_TRAVEL_PHOTOS } from './data/worldCountries';
import { Navbar } from './components/Navbar';
import { TripHeader } from './components/TripHeader';
import { TripsMenuView } from './components/TripsMenuView';
import { TripPlanContainer } from './components/TripPlanContainer';
import { FinancesContainer } from './components/FinancesContainer';
import { WorldTravelMap } from './components/WorldTravelMap';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { CountryDetailModal } from './components/CountryDetailModal';
import { ItineraryView } from './components/ItineraryView';
import { FlightsView } from './components/FlightsView';
import { TransfersView } from './components/TransfersView';
import { ExpensesView } from './components/ExpensesView';
import { ChecklistView } from './components/ChecklistView';
import { RouteMapView } from './components/RouteMapView';
import { ReservationsView } from './components/ReservationsView';
import { ActivitiesView } from './components/ActivitiesView';
import { WhatsAppCenter } from './components/WhatsAppCenter';
import { SettingsView } from './components/SettingsView';
import { SupabaseVercelConfig } from './components/SupabaseVercelConfig';
import { AiTripPlannerModal } from './components/AiTripPlannerModal';
import { CurrencyConverterModal } from './components/CurrencyConverterModal';
import { NewTripModal, AddFlightModal, AddReservationModal, AddActivityModal } from './components/Modals';
import {
  getSavedWhatsAppConfig,
  saveWhatsAppConfig,
  sendWhatsAppNotification,
  formatGateChangeAlert,
  formatFlightDelayAlert,
  formatActivityReminderAlert,
  formatReservationConfirmationAlert,
  formatDailySummaryAlert,
} from './services/whatsappClient';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseInstance,
  savePhotoToSupabase,
  deletePhotoFromSupabase,
  fetchPhotosFromSupabase,
  syncAllPhotosToSupabase,
  saveVisitedCountryToSupabase,
  fetchVisitedCountriesFromSupabase,
} from './services/supabaseService';

// Hotel IDs mapping to Checklist Item IDs for seamless 2-way synchronization
const HOTEL_RES_TO_CHECKLIST_MAP: Record<string, string> = {
  'res-jp-1': 'chk-hotel-1-voco',
  'res-jp-2': 'chk-hotel-2-ginza',
  'res-kr-1': 'chk-hotel-3-insadong',
  'res-th-1': 'chk-hotel-4-bangkok',
};

const CHECKLIST_TO_HOTEL_RES_MAP: Record<string, string> = {
  'chk-hotel-1-voco': 'res-jp-1',
  'chk-hotel-2-ginza': 'res-jp-2',
  'chk-hotel-3-insadong': 'res-kr-1',
  'chk-hotel-4-bangkok': 'res-th-1',
};

export default function App() {
  // Persistence state
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_trips_v1');
      if (saved) {
        const parsed: Trip[] = JSON.parse(saved);
        const cleaned = parsed.filter(t => t.id !== 'trip-1' && !t.title.toLowerCase().includes('aventura europea') && !t.title.toLowerCase().includes('escape tropical'));
        const hasAsia = cleaned.some(t => t.id === 'trip-asia-2026');
        if (!hasAsia) {
          return [...initialTrips.filter(it => it.id === 'trip-asia-2026'), ...cleaned];
        }
        return cleaned.length > 0 ? cleaned : initialTrips;
      }
      return initialTrips;
    } catch {
      return initialTrips;
    }
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    const asia = trips.find(t => t.id === 'trip-asia-2026');
    return asia ? asia.id : (trips[0]?.id || 'trip-asia-2026');
  });

  const [flights, setFlights] = useState<Flight[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_flights_v3') || localStorage.getItem('viajeflow_flights_v2');
      if (saved) {
        const parsed: Flight[] = JSON.parse(saved);
        // Ensure flights up to Osaka (flight-hn-1, flight-hn-2, flight-jp-1, flight-jp-2) default to aterrizado if not already
        const updated = parsed.map(f => {
          if (['flight-hn-1', 'flight-hn-2', 'flight-jp-1', 'flight-jp-2'].includes(f.id) && f.status === 'programado') {
            return { ...f, status: 'aterrizado' as FlightStatus };
          }
          return f;
        });
        const existingIds = new Set(updated.map(f => f.id));
        const missingAsia = initialFlights.filter(f => f.tripId === 'trip-asia-2026' && !existingIds.has(f.id));
        return [...missingAsia, ...updated];
      }
      return initialFlights;
    } catch {
      return initialFlights;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_reservations_v2') || localStorage.getItem('viajeflow_reservations_v1');
      if (saved) {
        const parsed: Reservation[] = JSON.parse(saved);
        // Ensure hotel at Osaka (voco) is checked-in / completed if currently staying there
        const updated = parsed.map(r => {
          if (r.id === 'res-jp-1' && r.status === 'confirmed' && !r.completed) {
            return { ...r, status: 'checked_in' as ReservationStatus, completed: true, checkedIn: true };
          }
          return r;
        });
        const existingIds = new Set(updated.map(r => r.id));
        const missingAsianest = initialReservations.filter(r => r.tripId === 'trip-asia-2026' && !existingIds.has(r.id));
        return [...missingAsianest, ...updated];
      }
      return initialReservations;
    } catch {
      return initialReservations;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_activities_v1');
      if (saved) {
        const parsed: Activity[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(a => a.id));
        const missingAsia = initialActivities.filter(a => a.tripId === 'trip-asia-2026' && !existingIds.has(a.id));
        return [...missingAsia, ...parsed];
      }
      return initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppLog[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_walogs_v1');
      return saved ? JSON.parse(saved) : initialWhatsAppLogs;
    } catch {
      return initialWhatsAppLogs;
    }
  });

  const [groundTransfers, setGroundTransfers] = useState<GroundTransfer[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_ground_transfers_v2');
      if (saved) {
        const parsed: GroundTransfer[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(g => g.id));
        const missingAsia = initialGroundTransfers.filter(g => g.tripId === 'trip-asia-2026' && !existingIds.has(g.id));
        return [...missingAsia, ...parsed];
      }
      return initialGroundTransfers;
    } catch {
      return initialGroundTransfers;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_expenses_v2');
      if (saved) {
        const parsed: Expense[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(e => e.id));
        const missingAsia拼 = initialExpenses.filter(e => e.tripId === 'trip-asia-2026' && !existingIds.has(e.id));
        return [...missingAsia拼, ...parsed];
      }
      return initialExpenses;
    } catch {
      return initialExpenses;
    }
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved不易 = localStorage.getItem('viajeflow_checklist_v6') || localStorage.getItem('viajeflow_checklist_v5');
      if (saved不易) {
        const parsed: ChecklistItem[] = JSON.parse(saved不易);
        const existingIds = new Set(parsed.map(i => i.id));
        const missingAsia = initialChecklistItems.filter(i => i.tripId === 'trip-asia-2026' && !existingIds.has(i.id));
        return [...missingAsia, ...parsed];
      }
      return initialChecklistItems;
    } catch {
      return initialChecklistItems;
    }
  });

  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(getSavedWhatsAppConfig);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getSavedSupabaseConfig);

  // Travel photos state with persistence and automatic Panama fix
  // Universal recovery and persistence of travel photos across all storage keys
  const [travelPhotos, setTravelPhotos] = useState<TravelPhoto[]>(() => {
    try {
      const keysToCheck = [
        'viajeflow_travel_photos_v2',
        'viajeflow_travel_photos_v1',
        'viajeflow_travel_photos',
        'viajeflow_photos',
        'travel_photos',
        'travelPhotos'
      ];

      const photosMap = new Map<string, TravelPhoto>();

      // 1. First seed with INITIAL_TRAVEL_PHOTOS
      INITIAL_TRAVEL_PHOTOS.forEach(p => photosMap.set(p.id, p));

      // 2. Scan known storage keys in priority order (older keys first, newer keys overwrite)
      const reversedKeys = [...keysToCheck].reverse();
      for (const key of reversedKeys) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: any) => {
                if (item && (item.dataUrl || item.imageUrl || item.url)) {
                  const id = item.id || `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
                  photosMap.set(id, {
                    ...item,
                    id,
                    dataUrl: item.dataUrl || item.imageUrl || item.url,
                    countryCode: item.countryCode || 'PA',
                  });
                }
              });
            }
          } catch (e) {
            console.warn(`Error reading photo key ${key}:`, e);
          }
        }
      }

      // 3. Scan ALL other localStorage keys in case user photos are under an unexpected key
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && !keysToCheck.includes(k) && (k.includes('photo') || k.includes('viaje') || k.includes('travel'))) {
            const raw = localStorage.getItem(k);
            if (raw && (raw.includes('dataUrl') || raw.includes('image/'))) {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                  parsed.forEach((item: any) => {
                    if (item && (item.dataUrl || item.imageUrl)) {
                      const id = item.id || `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
                      if (!photosMap.has(id)) {
                        photosMap.set(id, item);
                      }
                    }
                  });
                }
              } catch {}
            }
          }
        }
      } catch {}

      let photosList = Array.from(photosMap.values());

      // Auto-reconciliation: If any photo mentions Panama, Prague/Czechoslovakia, Hungary, Argentina or Chile
      photosList = photosList.map(p => {
        const text = `${p.city || ''} ${p.title || ''} ${p.notes || ''}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (p.countryCode === 'HN' && (text.includes('panama') || text.includes('pty') || text.includes('canal de panama'))) {
          return {
            ...p,
            countryCode: 'PA',
            countryName: 'Panamá',
          };
        }
        if (text.includes('praga') || text.includes('checoslovaqui') || text.includes('czech') || text.includes('chequia')) {
          if (p.countryCode !== 'CZ') {
            return {
              ...p,
              countryCode: 'CZ',
              countryName: 'República Checa (Checoslovaquia)',
              city: p.city || 'Ciudad de Praga',
            };
          }
        }
        if (text.includes('hungri') || text.includes('budapest')) {
          if (p.countryCode !== 'HU') {
            return {
              ...p,
              countryCode: 'HU',
              countryName: 'Hungría',
              city: p.city || 'Budapest',
            };
          }
        }
        if (text.includes('argentin') || text.includes('buenos aires') || text.includes('bariloche') || text.includes('mendoza') || text.includes('obelisco')) {
          if (p.countryCode !== 'AR') {
            return {
              ...p,
              countryCode: 'AR',
              countryName: 'Argentina',
              city: p.city || 'Buenos Aires',
            };
          }
        }
        if (text.includes('chile') || text.includes('santiago') || text.includes('valparaiso') || text.includes('cordillera de los andes')) {
          if (p.countryCode !== 'CL') {
            return {
              ...p,
              countryCode: 'CL',
              countryName: 'Chile',
              city: p.city || 'Santiago de Chile',
            };
          }
        }
        return p;
      });

      // Synchronize safely to current and legacy keys so they are resilient across reloads
      try {
        localStorage.setItem('viajeflow_travel_photos_v2', JSON.stringify(photosList));
        localStorage.setItem('viajeflow_travel_photos_v1', JSON.stringify(photosList));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }

      return photosList;
    } catch {
      return INITIAL_TRAVEL_PHOTOS;
    }
  });

  // Visited countries state with persistence and coordinate healing
  const [visitedCountries, setVisitedCountries] = useState<VisitedCountry[]>(() => {
    try {
      const saved = localStorage.getItem('viajeflow_visited_countries_v2');
      const savedList: VisitedCountry[] = saved ? JSON.parse(saved) : [];

      // Check photos to see which countries have user photos
      const savedPhotosStr = localStorage.getItem('viajeflow_travel_photos_v2');
      const currentPhotos: TravelPhoto[] = savedPhotosStr ? JSON.parse(savedPhotosStr) : INITIAL_TRAVEL_PHOTOS;
      const hasPanamaPhotos = currentPhotos.some(p => {
        const text = `${p.city || ''} ${p.title || ''} ${p.notes || ''}`.toLowerCase();
        return p.countryCode === 'PA' || text.includes('panam');
      });
      const hasPraguePhotos = currentPhotos.some(p => {
        const text = `${p.city || ''} ${p.title || ''} ${p.notes || ''}`.toLowerCase();
        return p.countryCode === 'CZ' || text.includes('praga') || text.includes('checoslovaqui');
      });
      const hasHungaryPhotos = currentPhotos.some(p => {
        const text = `${p.city || ''} ${p.title || ''} ${p.notes || ''}`.toLowerCase();
        return p.countryCode === 'HU' || text.includes('hungri') || text.includes('budapest');
      });
      const hasArgentinaPhotos = currentPhotos.some(p => {
        const text = `${p.city || ''} ${p.title || ''} ${p.notes || ''}`.toLowerCase();
        return p.countryCode === 'AR' || text.includes('argentin') || text.includes('buenos aires');
      });
      const hasChilePhotos = currentPhotos.some(p => {
        const text = `${p.city || ''} ${p.title || ''} ${p.notes || ''}`.toLowerCase();
        return p.countryCode === 'CL' || text.includes('chile') || text.includes('santiago');
      });

      // Merge saved visit status into the latest WORLD_COUNTRIES_CATALOG
      // This guarantees svgCoords are ALWAYS percentage coordinates (0-100) and never old 800+ px values
      const mergedList = WORLD_COUNTRIES_CATALOG.map(catalogCountry => {
        const savedCountry = savedList.find(s => s.code === catalogCountry.code);
        let isVisited = catalogCountry.visited;
        if (savedCountry && typeof savedCountry.visited === 'boolean') {
          isVisited = savedCountry.visited;
        }
        if (catalogCountry.code === 'PA' && (hasPanamaPhotos || isVisited)) {
          isVisited = true;
        }
        if (catalogCountry.code === 'CZ' && (hasPraguePhotos || isVisited)) {
          isVisited = true;
        }
        if (catalogCountry.code === 'HU' && (hasHungaryPhotos || isVisited)) {
          isVisited = true;
        }
        if (catalogCountry.code === 'AR' && (hasArgentinaPhotos || isVisited || catalogCountry.visited)) {
          isVisited = true;
        }
        if (catalogCountry.code === 'CL' && (hasChilePhotos || isVisited || catalogCountry.visited)) {
          isVisited = true;
        }
        return {
          ...catalogCountry,
          visited: isVisited,
          visitedDate: savedCountry?.visitedDate || catalogCountry.visitedDate,
          notes: savedCountry?.notes || catalogCountry.notes,
          tripName: savedCountry?.tripName || catalogCountry.tripName,
        };
      });

      // Also preserve any custom user-added countries from savedList
      const customSaved = savedList.filter(s => !WORLD_COUNTRIES_CATALOG.some(c => c.code === s.code));
      const combined = [...mergedList, ...customSaved];

      localStorage.setItem('viajeflow_visited_countries_v2', JSON.stringify(combined));
      return combined;
    } catch {
      return WORLD_COUNTRIES_CATALOG;
    }
  });

  // Active Tab & Modal States
  const [activeTab, setActiveTab] = useState<string>('world_map');
  const [isNewTripOpen, setIsNewTripOpen] = useState(false);
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [preselectedUploadCountry, setPreselectedUploadCountry] = useState<string | undefined>(undefined);
  const [selectedCountryForDetail, setSelectedCountryForDetail] = useState<VisitedCountry | null>(null);

  // Toast alert banner for WhatsApp notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('viajeflow_visited_countries_v2', JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  useEffect(() => {
    try {
      localStorage.setItem('viajeflow_travel_photos_v2', JSON.stringify(travelPhotos));
      localStorage.setItem('viajeflow_travel_photos_v1', JSON.stringify(travelPhotos));
    } catch (err) {
      console.warn('LocalStorage quota limit reached while saving photos:', err);
    }
  }, [travelPhotos]);

  // Auto-fetch photos and visited countries from Supabase if configured
  useEffect(() => {
    if (supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
      fetchPhotosFromSupabase(supabaseConfig).then((remotePhotos) => {
        if (remotePhotos && remotePhotos.length > 0) {
          setTravelPhotos((prev) => {
            const map = new Map<string, TravelPhoto>();
            // Remote photos take priority, merge with local
            remotePhotos.forEach((p) => map.set(p.id, p));
            prev.forEach((p) => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('viajeflow_travel_photos_v2', JSON.stringify(merged));
              localStorage.setItem('viajeflow_travel_photos_v1', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      });

      fetchVisitedCountriesFromSupabase(supabaseConfig).then((remoteCountries) => {
        if (remoteCountries && remoteCountries.length > 0) {
          setVisitedCountries((prev) => {
            return prev.map((c) => {
              const remote = remoteCountries.find((rc) => rc.code === c.code);
              if (remote && remote.visited) {
                return {
                  ...c,
                  visited: true,
                  visitedDate: remote.visitedDate || c.visitedDate,
                };
              }
              return c;
            });
          });
        }
      });
    }
  }, [supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey]);

  const handleToggleVisitedCountry = (countryCode: string) => {
    setVisitedCountries(prev => prev.map(c => {
      if (c.code === countryCode) {
        const nextVisited = !c.visited;
        if (nextVisited) {
          triggerToast(`🚩 ¡Banderita fijada en ${c.name} ("Ya estuve aquí")!`);
        } else {
          triggerToast(`Banderita retirada de ${c.name}`);
        }
        const updated = {
          ...c,
          visited: nextVisited,
          visitedDate: nextVisited ? (c.visitedDate || new Date().toISOString().split('T')[0]) : undefined,
        };

        // Sync visited country state to Supabase
        if (supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
          saveVisitedCountryToSupabase(updated, supabaseConfig);
        }

        return updated;
      }
      return c;
    }));
  };

  const handleSavePhoto = (newPhotoData: Omit<TravelPhoto, 'id' | 'createdAt'>) => {
    const photoId = `photo-${Date.now()}`;
    const newPhoto: TravelPhoto = {
      ...newPhotoData,
      id: photoId,
      tripId: activeTripId,
      createdAt: new Date().toISOString(),
    };

    setTravelPhotos(prev => [newPhoto, ...prev]);

    // Automatically mark the country as visited with flag
    setVisitedCountries(prev => prev.map(c => {
      if (c.code === newPhotoData.countryCode) {
        const updatedCountry = {
          ...c,
          visited: true,
          visitedDate: c.visitedDate || newPhotoData.date,
        };
        // Save to Supabase
        if (supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
          saveVisitedCountryToSupabase(updatedCountry, supabaseConfig);
        }
        return updatedCountry;
      }
      return c;
    }));

    // If Supabase is connected, automatically persist photo directly to Supabase cloud
    if (supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
      savePhotoToSupabase(newPhoto, supabaseConfig).then((success) => {
        if (success) {
          triggerToast(`☁️ ¡Foto registrada y guardada en Supabase con éxito!`);
        } else {
          triggerToast(`📸 Foto guardada localmente.`);
        }
      });
    } else {
      triggerToast(`📸 ¡Foto guardada y banderita fijada en ${newPhotoData.countryName}!`);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setTravelPhotos(prev => prev.filter(p => p.id !== photoId));
    if (supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
      deletePhotoFromSupabase(photoId, supabaseConfig);
    }
    triggerToast('Foto eliminada del álbum.');
  };

  const handleMovePhoto = (photoId: string, newCountryCode: string) => {
    const targetCountry = visitedCountries.find(c => c.code === newCountryCode);
    if (!targetCountry) return;

    let updatedTargetPhoto: TravelPhoto | null = null;
    setTravelPhotos(prev => prev.map(p => {
      if (p.id === photoId) {
        const updated = {
          ...p,
          countryCode: newCountryCode,
          countryName: targetCountry.name,
        };
        updatedTargetPhoto = updated;
        return updated;
      }
      return p;
    }));

    // Sync moved photo to Supabase
    if (updatedTargetPhoto && supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
      savePhotoToSupabase(updatedTargetPhoto, supabaseConfig);
    }

    // Ensure the new country is marked visited so its flag shows on the map
    setVisitedCountries(prev => prev.map(c => {
      if (c.code === newCountryCode) {
        const updated = {
          ...c,
          visited: true,
          visitedDate: c.visitedDate || new Date().toISOString().split('T')[0],
        };
        if (supabaseConfig.supabaseUrl && supabaseConfig.supabaseKey) {
          saveVisitedCountryToSupabase(updated, supabaseConfig);
        }
        return updated;
      }
      return c;
    }));

    triggerToast(`📸 Foto trasladada exitosamente a ${targetCountry.flagEmoji} ${targetCountry.name}`);
  };

  const handleOpenUploadForCountry = (countryCode?: string) => {
    setPreselectedUploadCountry(countryCode);
    setIsPhotoUploadOpen(true);
  };

  const handleAddCustomCountry = (newCountry: VisitedCountry) => {
    setVisitedCountries(prev => {
      const existing = prev.find(c => c.code === newCountry.code || c.name.toLowerCase() === newCountry.name.toLowerCase());
      if (existing) {
        return prev.map(c => c.code === existing.code ? { ...c, ...newCountry, visited: true } : c);
      }
      return [newCountry, ...prev];
    });
    triggerToast(`🚩 ¡Destino "${newCountry.name}" agregado y banderita fijada en el mapa!`);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('viajeflow_trips_v1', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('viajeflow_flights_v3', JSON.stringify(flights));
    localStorage.setItem('viajeflow_flights_v2', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem('viajeflow_reservations_v2', JSON.stringify(reservations));
    localStorage.setItem('viajeflow_reservations_v1', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('viajeflow_activities_v1', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('viajeflow_ground_transfers_v2', JSON.stringify(groundTransfers));
  }, [groundTransfers]);

  useEffect(() => {
    localStorage.setItem('viajeflow_expenses_v2', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('viajeflow_checklist_v6', JSON.stringify(checklistItems));
    localStorage.setItem('viajeflow_checklist_v5', JSON.stringify(checklistItems));
  }, [checklistItems]);

  const handleToggleChecklistItem = (id: string) => {
    let nextStatus = false;
    let targetTitle = '';
    
    setChecklistItems((prev) => {
      const target = prev.find((item) => item.id === id);
      nextStatus = target ? !target.completed : true;
      targetTitle = target ? target.title : '';
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: nextStatus } : item
      );
      try {
        localStorage.setItem('viajeflow_checklist_v6', JSON.stringify(updated));
        localStorage.setItem('viajeflow_checklist_v5', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving checklist:', err);
      }
      return updated;
    });

    if (targetTitle) {
      triggerToast(
        nextStatus
          ? `✅ Tarea "${targetTitle}" marcada como completada.`
          : `⏳ Tarea "${targetTitle}" marcada como pendiente.`
      );
    }

    // 2-Way Sync: If this is a hotel check-in task, also sync the corresponding hotel reservation
    const correspondingResId = CHECKLIST_TO_HOTEL_RES_MAP[id];
    if (correspondingResId) {
      setReservations((prevRes) => {
        const updatedRes = prevRes.map((r) => {
          if (r.id === correspondingResId) {
            return {
              ...r,
              status: (nextStatus ? 'checked_in' : 'confirmed') as ReservationStatus,
              completed: nextStatus,
              checkedIn: nextStatus,
            };
          }
          return r;
        });
        try {
          localStorage.setItem('viajeflow_reservations_v2', JSON.stringify(updatedRes));
          localStorage.setItem('viajeflow_reservations_v1', JSON.stringify(updatedRes));
        } catch (err) {
          console.error('Error saving synced reservation:', err);
        }
        return updatedRes;
      });
    }
  };

  const handleAddChecklistItem = (newItem: ChecklistItem) => {
    setChecklistItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('viajeflow_checklist_v6', JSON.stringify(updated));
        localStorage.setItem('viajeflow_checklist_v5', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving checklist:', err);
      }
      return updated;
    });
    triggerToast(`📋 Tarea "${newItem.title}" agregada al checklist.`);
  };

  const handleDeleteChecklistItem = (id: string) => {
    setChecklistItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('viajeflow_checklist_v6', JSON.stringify(updated));
        localStorage.setItem('viajeflow_checklist_v5', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving checklist:', err);
      }
      return updated;
    });
    triggerToast(`🗑️ Tarea eliminada del checklist.`);
  };

  const handleResetChecklistItems = (tripId: string) => {
    const defaultForTrip = initialChecklistItems.filter((i) => i.tripId === tripId);
    setChecklistItems((prev) => {
      const updated = [
        ...prev.filter((i) => i.tripId !== tripId),
        ...defaultForTrip
      ];
      try {
        localStorage.setItem('viajeflow_checklist_v6', JSON.stringify(updated));
        localStorage.setItem('viajeflow_checklist_v5', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving checklist:', err);
      }
      return updated;
    });
    triggerToast(`🔄 Checklist restaurado a valores iniciales.`);
  };

  const handleAddTransfer = (newTransfer: GroundTransfer) => {
    setGroundTransfers((prev) => [newTransfer, ...prev]);
    triggerToast(`🚌 Trayecto "${newTransfer.title}" agregado exitosamente.`);
  };

  const handleDeleteTransfer = (id: string) => {
    setGroundTransfers((prev) => prev.filter((g) => g.id !== id));
    triggerToast(`🗑️ Trayecto eliminado.`);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    triggerToast(`💵 Gasto "${newExpense.title}" ($${newExpense.amountUSD.toFixed(2)} USD) registrado.`);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    triggerToast(`🗑️ Gasto eliminado.`);
  };

  const handleUpdateTripBudget = (tripId: string, newBudget: number) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, budgetTotal: newBudget } : t))
    );
    triggerToast(`📊 Presupuesto del viaje actualizado a $${newBudget.toLocaleString('en-US')} USD.`);
  };

  useEffect(() => {
    localStorage.setItem('viajeflow_walogs_v1', JSON.stringify(whatsAppLogs));
  }, [whatsAppLogs]);

  // Active Trip object
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  const handleAddTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
  };

  const handleAddFlight = (newFlight: Flight) => {
    setFlights((prev) => [newFlight, ...prev]);
  };

  const handleUpdateFlightStatus = (flightId: string, newStatus: FlightStatus, newGate?: string) => {
    setFlights((prev) => {
      const target = prev.find((f) => f.id === flightId);
      const updated = prev.map((f) => {
        if (f.id === flightId) {
          return {
            ...f,
            status: newStatus,
            gate: newGate || f.gate,
          };
        }
        return f;
      });
      try {
        localStorage.setItem('viajeflow_flights_v2', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving flights:', err);
      }
      if (target) {
        const statusLabel =
          newStatus === 'aterrizado'
            ? 'Completado / Realizado 🛬'
            : newStatus === 'en_vuelo'
            ? 'En Vuelo / En Trayecto ✈️'
            : newStatus === 'retrasado'
            ? 'Retrasado ⏱️'
            : newStatus === 'embarcando'
            ? 'Embarcando 🚪'
            : 'Programado 🗓️';
        triggerToast(`✈️ Tramo "${target.airline} ${target.flightNumber}" actualizado a: ${statusLabel}`);
      }
      return updated;
    });
  };

  const handleDeleteFlight = (id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUploadBoardingPass = (flightId: string, pass: BoardingPassAttachment) => {
    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === flightId) {
          const currentPasses = f.boardingPasses || [];
          return {
            ...f,
            boardingPasses: [pass, ...currentPasses],
          };
        }
        return f;
      })
    );
  };

  const handleDeleteBoardingPass = (flightId: string, passId: string) => {
    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === flightId) {
          return {
            ...f,
            boardingPasses: (f.boardingPasses || []).filter((p) => p.id !== passId),
          };
        }
        return f;
      })
    );
  };

  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);

    // Send instant WhatsApp notification
    const msg = formatReservationConfirmationAlert(
      newRes.type,
      newRes.title,
      newRes.confirmationCode,
      newRes.checkIn,
      newRes.address
    );
    dispatchWhatsAppMessage(msg, 'booking_confirmation');
  };

  const handleDeleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleReservationStatus = (id: string, newStatus?: ReservationStatus) => {
    let isDone = false;
    let targetTitle = '';

    setReservations((prev) => {
      const target = prev.find((r) => r.id === id);
      const nextStatus = newStatus || (target && (target.status === 'checked_in' || target.status === 'completed' || target.completed) ? 'confirmed' : 'checked_in');
      isDone = nextStatus === 'checked_in' || nextStatus === 'completed';
      targetTitle = target ? target.title : '';

      const updated = prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: nextStatus,
            completed: isDone,
            checkedIn: isDone,
          };
        }
        return r;
      });
      try {
        localStorage.setItem('viajeflow_reservations_v2', JSON.stringify(updated));
        localStorage.setItem('viajeflow_reservations_v1', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving reservations:', err);
      }
      return updated;
    });

    if (targetTitle) {
      triggerToast(
        isDone
          ? `🏨 ¡Check-in en "${targetTitle}" marcado como REALIZADO / HOSPEDADO! ✅`
          : `🏨 Reserva "${targetTitle}" marcada como pendiente de check-in.`
      );
    }

    // 2-Way Sync: If this is a hotel with a corresponding checklist item, also sync the checklist state
    const correspondingChkId = HOTEL_RES_TO_CHECKLIST_MAP[id];
    if (correspondingChkId) {
      setChecklistItems((prevChk) => {
        const updatedChk = prevChk.map((chk) => {
          if (chk.id === correspondingChkId) {
            return {
              ...chk,
              completed: isDone,
            };
          }
          return chk;
        });
        try {
          localStorage.setItem('viajeflow_checklist_v6', JSON.stringify(updatedChk));
          localStorage.setItem('viajeflow_checklist_v5', JSON.stringify(updatedChk));
        } catch (err) {
          console.error('Error saving synced checklist item:', err);
        }
        return updatedChk;
      });
    }
  };

  const handleUpdateReservation = (updatedRes: Reservation) => {
    setReservations((prev) => {
      const updated = prev.map((r) => (r.id === updatedRes.id ? updatedRes : r));
      try {
        localStorage.setItem('viajeflow_reservations_v2', JSON.stringify(updated));
        localStorage.setItem('viajeflow_reservations_v1', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving reservations:', err);
      }
      return updated;
    });
    triggerToast(`🏨 Reserva "${updatedRes.title}" actualizada.`);
  };

  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [...prev, newAct]);
  };

  const handleToggleActivity = (id: string) => {
    setActivities((prev) => {
      const target = prev.find((a) => a.id === id);
      const nextStatus = target ? !target.completed : true;
      const updated = prev.map((a) => (a.id === id ? { ...a, completed: nextStatus } : a));
      try {
        localStorage.setItem('viajeflow_activities_v1', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving activities:', err);
      }
      if (target) {
        triggerToast(
          nextStatus
            ? `✅ Actividad "${target.title}" marcada como completada.`
            : `⏳ Actividad "${target.title}" marcada como pendiente.`
        );
      }
      return updated;
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  // WhatsApp Dispatcher
  const dispatchWhatsAppMessage = async (content: string, type: WhatsAppLog['messageType']) => {
    const result = await sendWhatsAppNotification(content, type, activeTrip.id);
    if (result.log) {
      setWhatsAppLogs((prev) => [result.log, ...prev]);
      triggerToast(`📲 Notificación WhatsApp enviada a ${result.log.recipient}`);
    }
  };

  // Specific triggers
  const handleNotifyGateChange = (flight: Flight, newGate: string) => {
    const msg = formatGateChangeAlert(flight.airline, flight.flightNumber, newGate, flight.terminal);
    dispatchWhatsAppMessage(msg, 'gate_change');
  };

  const handleNotifyDelay = (flight: Flight, newTime: string) => {
    const msg = formatFlightDelayAlert(flight.airline, flight.flightNumber, flight.departureTime, newTime);
    dispatchWhatsAppMessage(msg, 'delay_alert');
  };

  const handleNotifyActivity = (activity: Activity) => {
    const msg = formatActivityReminderAlert(activity.title, activity.date, activity.startTime || 'Por programar', activity.location);
    dispatchWhatsAppMessage(msg, 'itinerary_update');
  };

  const handleSendDailyBriefingWhatsApp = () => {
    const tripActs = activities.filter((a) => a.tripId === activeTrip.id);
    const top = tripActs[0]?.title || 'Recorrido por la ciudad';
    const msg = formatDailySummaryAlert(activeTrip.title, activeTrip.startDate, tripActs.length, top);
    dispatchWhatsAppMessage(msg, 'daily_reminder');
  };

  const handleTriggerQuickAlert = (type: 'gate_change' | 'delay_alert' | 'booking' | 'daily_summary') => {
    if (type === 'gate_change') {
      const flight = flights[0] || { airline: 'Iberia', flightNumber: 'IB 6801', terminal: 'T4' };
      handleNotifyGateChange(flight as Flight, 'H28');
    } else if (type === 'delay_alert') {
      const flight = flights[0] || { airline: 'Iberia', flightNumber: 'IB 6801', departureTime: '18:45' };
      handleNotifyDelay(flight as Flight, '20:15');
    } else if (type === 'booking') {
      const res = reservations[0] || { type: 'hotel', title: 'Hotel Gran Vía', confirmationCode: 'BK-99120', checkIn: '2026-09-16' };
      const msg = formatReservationConfirmationAlert(res.type, res.title, res.confirmationCode, res.checkIn);
      dispatchWhatsAppMessage(msg, 'booking_confirmation');
    } else {
      handleSendDailyBriefingWhatsApp();
    }
  };

  // AI Itinerary Application
  const handleApplyAiItinerary = (newActivities: Partial<Activity>[]) => {
    const created: Activity[] = newActivities.map((act, idx) => ({
      id: 'act-ai-' + Date.now() + '-' + idx,
      tripId: activeTrip.id,
      title: act.title || 'Actividad Sugerida',
      description: act.description,
      category: act.category || 'sightseeing',
      date: act.date || activeTrip.startDate,
      startTime: act.startTime || '10:00',
      endTime: act.endTime || '12:00',
      location: act.location,
      cost: act.cost || 15,
      completed: false,
      priority: act.priority || 'medium',
    }));

    setActivities((prev) => [...created, ...prev]);
    triggerToast(`✨ Se añadieron ${created.length} actividades generadas por IA a tu itinerario.`);
  };

  // Sync Local to Supabase
  const handleSyncLocalToSupabase = async () => {
    const supabase = getSupabaseInstance(supabaseConfig);
    if (!supabase) {
      alert('Configura primero tu Supabase URL y Anon Key en la pestaña de Conexión.');
      return;
    }

    try {
      // 1. Upsert trips
      const formattedTrips = trips.map((t) => ({
        id: t.id,
        title: t.title,
        destination: t.destination,
        start_date: t.startDate,
        end_date: t.endDate,
        cover_image: t.coverImage,
        status: t.status,
        budget_total: t.budgetTotal,
        currency: t.currency,
        description: t.description,
      }));
      const { error: tripsError } = await supabase.from('trips').upsert(formattedTrips);
      if (tripsError) throw new Error('Error al sincronizar viajes: ' + tripsError.message);

      // 2. Upsert travel_photos
      const formattedPhotos = travelPhotos.map((p) => ({
        id: p.id,
        trip_id: p.tripId || null,
        country_code: p.countryCode,
        country_name: p.countryName || '',
        city: p.city || '',
        title: p.title || 'Foto de viaje',
        data_url: p.dataUrl,
        date: p.date || new Date().toISOString().split('T')[0],
        notes: p.notes || '',
        created_at: p.createdAt || new Date().toISOString(),
      }));
      const { error: photosError } = await supabase.from('travel_photos').upsert(formattedPhotos);
      if (photosError) throw new Error('Error al sincronizar fotos: ' + photosError.message);

      // 3. Upsert visited_countries
      const formattedCountries = visitedCountries
        .filter((c) => c.visited)
        .map((c) => ({
          code: c.code,
          name: c.name,
          continent: c.continent || '',
          flag_emoji: c.flagEmoji || '',
          capital: c.capital || '',
          visited: true,
          visited_date: c.visitedDate || null,
          notes: c.notes || '',
          trip_name: c.tripName || '',
        }));
      if (formattedCountries.length > 0) {
        const { error: countriesError } = await supabase.from('visited_countries').upsert(formattedCountries);
        if (countriesError) throw new Error('Error al sincronizar países visitados: ' + countriesError.message);
      }

      // 4. Upsert flights
      const formattedFlights = flights.map((f) => ({
        id: f.id,
        trip_id: f.tripId,
        flight_number: f.flightNumber,
        airline: f.airline,
        departure_airport: f.departureAirport,
        arrival_airport: f.arrivalAirport,
        departure_city: f.departureCity,
        arrival_city: f.arrivalCity,
        departure_time: f.departureTime,
        arrival_time: f.arrivalTime,
        terminal: f.terminal,
        gate: f.gate,
        seat: f.seat,
        status: f.status,
        confirmation_code: f.confirmationCode,
        price: f.price,
        notes: f.notes,
      }));
      await supabase.from('flights').upsert(formattedFlights);

      // 5. Upsert reservations
      const formattedReservations = reservations.map((r) => ({
        id: r.id,
        trip_id: r.tripId,
        type: r.type,
        title: r.title,
        provider: r.provider,
        address: r.address,
        check_in: r.checkIn,
        check_out: r.checkOut,
        confirmation_code: r.confirmationCode,
        status: r.status,
        price: r.price,
        phone: r.phone,
        notes: r.notes,
      }));
      await supabase.from('reservations').upsert(formattedReservations);

      alert(`¡Sincronización exitosa con Supabase!\n\n⚡ Guardados en tu base de datos Supabase:\n• ${formattedTrips.length} viajes\n• ${formattedPhotos.length} fotos de viaje\n• ${formattedCountries.length} banderas de países visitados\n• ${formattedFlights.length} vuelos y reservas`);
      triggerToast('⚡ Datos y fotos sincronizados en Supabase.');
    } catch (err: any) {
      alert('Error al sincronizar con Supabase: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={(t) => setActiveTripId(t.id)}
        onOpenNewTripModal={() => setIsNewTripOpen(true)}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        onOpenCurrencyConverter={() => setIsCurrencyConverterOpen(true)}
        onOpenPhotoUpload={() => handleOpenUploadForCountry()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSupabaseConnected={supabaseConfig.isConnected}
        visitedCountriesCount={visitedCountries.filter(c => c.visited).length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* World Travel Map & Photos Bitácora (Hero View) */}
        {activeTab === 'world_map' && (
          <WorldTravelMap
            countries={visitedCountries}
            photos={travelPhotos}
            isSupabaseConnected={supabaseConfig.isConnected}
            onOpenSettings={() => setActiveTab('settings')}
            onToggleVisited={handleToggleVisitedCountry}
            onOpenUpload={handleOpenUploadForCountry}
            onSelectCountry={(country) => setSelectedCountryForDetail(country)}
            onAddCustomCountry={handleAddCustomCountry}
          />
        )}

        {/* Clean Trip Plan Container (Itinerary, Flights, Hotels, Transfers, Checklist, Route Map) */}
        {['trip_plan', 'itinerary', 'flights', 'reservations', 'checklist', 'transfers', 'activities', 'route_map'].includes(activeTab) && activeTrip && (
          <div className="space-y-6">
            {/* Active Trip Header */}
            <TripHeader
              trip={activeTrip}
              flights={flights}
              reservations={reservations}
              activities={activities}
              onAddFlight={() => setIsAddFlightOpen(true)}
              onAddReservation={() => setIsAddReservationOpen(true)}
              onAddActivity={() => setIsAddActivityOpen(true)}
              onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
              onSendDailyBriefingWhatsApp={handleSendDailyBriefingWhatsApp}
              onBackToMenu={() => setActiveTab('trips_menu')}
            />

            <TripPlanContainer
              trip={activeTrip}
              flights={flights}
              reservations={reservations}
              activities={activities}
              groundTransfers={groundTransfers}
              checklistItems={checklistItems}
              onToggleActivity={handleToggleActivity}
              onDeleteActivity={handleDeleteActivity}
              onAddActivity={() => setIsAddActivityOpen(true)}
              onNotifyActivity={handleNotifyActivity}
              onUpdateFlightStatus={handleUpdateFlightStatus}
              onDeleteFlight={handleDeleteFlight}
              onAddFlight={() => setIsAddFlightOpen(true)}
              onNotifyGateChange={handleNotifyGateChange}
              onNotifyDelay={handleNotifyDelay}
              onUploadBoardingPass={handleUploadBoardingPass}
              onDeleteBoardingPass={handleDeleteBoardingPass}
              onAddTransfer={handleAddTransfer}
              onDeleteTransfer={handleDeleteTransfer}
              onDeleteReservation={handleDeleteReservation}
              onAddReservation={() => setIsAddReservationOpen(true)}
              onToggleReservationStatus={handleToggleReservationStatus}
              onUpdateReservation={handleUpdateReservation}
              onNotifyReservation={(res) => {
                const msg = formatReservationConfirmationAlert(res.type, res.title, res.confirmationCode, res.checkIn, res.address);
                dispatchWhatsAppMessage(msg, 'booking_confirmation');
              }}
              onToggleChecklistItem={handleToggleChecklistItem}
              onAddChecklistItem={handleAddChecklistItem}
              onDeleteChecklistItem={handleDeleteChecklistItem}
              onResetChecklistItems={handleResetChecklistItems}
              onDispatchWhatsApp={dispatchWhatsAppMessage}
            />
          </div>
        )}

        {/* Clean Finances & Currency Converter View */}
        {['finances', 'expenses'].includes(activeTab) && activeTrip && (
          <FinancesContainer
            trip={activeTrip}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onUpdateTripBudget={handleUpdateTripBudget}
            onNotifyWhatsApp={(msg) => dispatchWhatsAppMessage(msg, 'custom')}
          />
        )}

        {/* Trips Menu Catalog View */}
        {activeTab === 'trips_menu' && (
          <TripsMenuView
            trips={trips}
            activeTripId={activeTripId}
            flights={flights}
            reservations={reservations}
            activities={activities}
            onSelectTrip={(t, tab = 'trip_plan') => {
              setActiveTripId(t.id);
              setActiveTab(tab);
            }}
            onOpenNewTripModal={() => setIsNewTripOpen(true)}
            onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
          />
        )}

        {/* Unified Settings View (WhatsApp, Supabase & Vercel) */}
        {activeTab === 'settings' && activeTrip && (
          <SettingsView
            trip={activeTrip}
            whatsAppLogs={whatsAppLogs}
            whatsAppConfig={whatsAppConfig}
            supabaseConfig={supabaseConfig}
            onSaveWhatsAppConfig={(cfg) => {
              setWhatsAppConfig(cfg);
              saveWhatsAppConfig(cfg);
            }}
            onSendCustomWhatsAppMessage={(msg, rec) => dispatchWhatsAppMessage(msg, 'custom')}
            onClearWhatsAppLogs={() => setWhatsAppLogs([])}
            onTriggerQuickWhatsAppAlert={handleTriggerQuickAlert}
            onUpdateSupabaseConfig={(cfg) => setSupabaseConfig(cfg)}
            onSyncLocalToSupabase={handleSyncLocalToSupabase}
          />
        )}

      </main>

      {/* Modals */}
      {isPhotoUploadOpen && (
        <PhotoUploadModal
          countries={visitedCountries}
          preselectedCountryCode={preselectedUploadCountry}
          isSupabaseConnected={supabaseConfig.isConnected}
          onSavePhoto={handleSavePhoto}
          onClose={() => {
            setIsPhotoUploadOpen(false);
            setPreselectedUploadCountry(undefined);
          }}
        />
      )}

      {selectedCountryForDetail && (
        <CountryDetailModal
          country={visitedCountries.find(c => c.code === selectedCountryForDetail.code) || selectedCountryForDetail}
          allCountries={visitedCountries}
          photos={travelPhotos}
          onToggleVisited={handleToggleVisitedCountry}
          onOpenUpload={(code) => {
            handleOpenUploadForCountry(code);
          }}
          onDeletePhoto={handleDeletePhoto}
          onMovePhoto={handleMovePhoto}
          onClose={() => setSelectedCountryForDetail(null)}
        />
      )}

      {/* Modals */}
      {isNewTripOpen && (
        <NewTripModal
          onAddTrip={handleAddTrip}
          onClose={() => setIsNewTripOpen(false)}
        />
      )}

      {isAddFlightOpen && activeTrip && (
        <AddFlightModal
          tripId={activeTrip.id}
          onAddFlight={handleAddFlight}
          onClose={() => setIsAddFlightOpen(false)}
        />
      )}

      {isAddReservationOpen && activeTrip && (
        <AddReservationModal
          tripId={activeTrip.id}
          onAddReservation={handleAddReservation}
          onClose={() => setIsAddReservationOpen(false)}
        />
      )}

      {isAddActivityOpen && activeTrip && (
        <AddActivityModal
          tripId={activeTrip.id}
          defaultDate={activeTrip.startDate}
          onAddActivity={handleAddActivity}
          onClose={() => setIsAddActivityOpen(false)}
        />
      )}

      {isAiPlannerOpen && activeTrip && (
        <AiTripPlannerModal
          activeTrip={activeTrip}
          onApplyGeneratedItinerary={handleApplyAiItinerary}
          onAddParsedFlight={(flight) => {
            if (flight.flightNumber) handleAddFlight(flight as Flight);
          }}
          onAddParsedHotel={(hotel) => {
            if (hotel.title) handleAddReservation(hotel as Reservation);
          }}
          onClose={() => setIsAiPlannerOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseVercelConfig
          config={supabaseConfig}
          onUpdateConfig={setSupabaseConfig}
          onSyncLocalToSupabase={handleSyncLocalToSupabase}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}

      <CurrencyConverterModal
        isOpen={isCurrencyConverterOpen}
        onClose={() => setIsCurrencyConverterOpen(false)}
      />

    </div>
  );
}
