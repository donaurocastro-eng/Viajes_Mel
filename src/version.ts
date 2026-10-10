/**
 * Configuración oficial de la versión de la aplicación y fecha de actualización.
 * IMPORTANTE: Cada vez que se actualice la aplicación con nuevas características o cambios,
 * se debe incrementar la versión y actualizar la fecha de lanzamiento.
 */

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: string[];
}

export interface AppVersionInfo {
  version: string;
  releaseDate: string;
  releaseDateIso: string;
  buildNumber: string;
  appName: string;
  environment: string;
  changelog: ChangelogEntry[];
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: 'v1.3.0',
  releaseDate: '10 de Octubre de 2026',
  releaseDateIso: '2026-10-10',
  buildNumber: 'build-20261010.3',
  appName: 'ViajeFlow',
  environment: 'Producción / Supabase Ready',
  changelog: [
    {
      version: 'v1.3.0',
      date: '10 de Octubre de 2026',
      title: 'Versión Oficial, Fechas en Configuración y Mapa Interactivo',
      items: [
        'Módulo de versión de la aplicación y fecha de actualización visible en el panel de Configuración.',
        'Centrado y ampliación inteligente del mapa mundial al tocar cualquier país o marcador de ciudad.',
        'Soporte completo y persistencia en Supabase para ciudades visitadas (Nápoles, Medellín, Cartagena, Guatapé).',
        'Sincronización en tiempo real y carga segura de fotos a la base de datos.',
        'Optimización táctil y gestual para dispositivos móviles (pinch-to-zoom y desplazamiento fluido).'
      ]
    },
    {
      version: 'v1.2.0',
      date: '10 de Octubre de 2026',
      title: 'Integración Supabase PostgreSQL y Filtro de Países',
      items: [
        'Conexión directa con Supabase para almacenamiento en la nube de viajes, vuelos y recuerdos.',
        'Exportador de configuración de Vercel y script SQL automatizado.',
        'Corrección de visualización para España, Portugal y catálogo de países visitados.'
      ]
    },
    {
      version: 'v1.1.0',
      date: '9 de Octubre de 2026',
      title: 'Centro WhatsApp y Control de Finanzas',
      items: [
        'Notificaciones de alertas de vuelo, reservas e itinerarios diarios vía WhatsApp.',
        'Convertidor de divisas con soporte multimonedas y presupuestos.',
        'Planificador asistido por inteligencia artificial.'
      ]
    }
  ]
};
