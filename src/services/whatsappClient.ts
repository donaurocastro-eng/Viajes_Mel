import { WhatsAppConfig, WhatsAppLog } from '../types';

const WA_CONFIG_KEY = 'travel_whatsapp_config_v1';

export function getSavedWhatsAppConfig(): WhatsAppConfig {
  try {
    const saved = localStorage.getItem(WA_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading WhatsApp config:', e);
  }
  return {
    apiToken: '',
    phoneNumberId: '',
    defaultRecipient: '+34 600 000 000',
    enableAutoAlerts: true,
    provider: 'simulator',
  };
}

export function saveWhatsAppConfig(config: WhatsAppConfig) {
  localStorage.setItem(WA_CONFIG_KEY, JSON.stringify(config));
}

export async function sendWhatsAppNotification(
  message: string,
  messageType: WhatsAppLog['messageType'],
  tripId: string,
  recipientOverride?: string
): Promise<{ success: boolean; log: WhatsAppLog; note: string }> {
  const config = getSavedWhatsAppConfig();
  const recipient = recipientOverride || config.defaultRecipient || '+34600000000';

  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient,
        message,
        messageType,
        tripId,
        config,
      }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      return data;
    }
    throw new Error(data.error || 'Error enviando mensaje');
  } catch (err: any) {
    // Return simulated log fallback
    const simulatedLog: WhatsAppLog = {
      id: 'wa-fallback-' + Date.now(),
      tripId,
      timestamp: new Date().toISOString(),
      recipient,
      messageType,
      content: message,
      status: 'simulated',
      isRealApi: false,
    };
    return {
      success: true,
      log: simulatedLog,
      note: 'Simulación local de WhatsApp (sin conexión a servidor).',
    };
  }
}

// Templates for instant automatic alert generation
export function formatGateChangeAlert(airline: string, flightNumber: string, gate: string, terminal?: string): string {
  return `🚨 *CAMBIO DE PUERTA DE ABORDAJE*\n\nHola, te informamos que el vuelo *${airline} ${flightNumber}* ha actualizado su puerta de salida:\n\n📍 *Nueva Puerta:* ${gate}${terminal ? ` (Terminal ${terminal})` : ''}\n\nPor favor acércate a la sala de abordaje a tiempo. ✈️`;
}

export function formatFlightDelayAlert(airline: string, flightNumber: string, oldTime: string, newTime: string, reason?: string): string {
  return `⏱️ *ALERTA DE RETRASO DE VUELO*\n\nEl vuelo *${airline} ${flightNumber}* presenta un cambio de horario:\n\n⏰ Hora anterior: ${oldTime}\n⌛ *Nueva Hora Estimada:* ${newTime}\n${reason ? `ℹ️ Motivo: ${reason}\n` : ''}\nMantendremos el estado actualizado.`;
}

export function formatActivityReminderAlert(activityTitle: string, date: string, time: string, location?: string): string {
  return `📌 *RECORDATORIO DE ACTIVIDAD*\n\n🗓️ *${date}* a las *${time}*\n🎯 *${activityTitle}*\n${location ? `📍 Lugar: ${location}\n` : ''}\n¡Que disfrutes esta experiencia! ✨`;
}

export function formatReservationConfirmationAlert(type: string, title: string, code: string, date: string, address?: string): string {
  return `🏨 *NUEVA RESERVA CONFIRMADA*\n\nHas registrado una reserva de *${type.toUpperCase()}*:\n\n*${title}*\n🔑 Código de Reserva: *${code}*\n📅 Fecha/Hora: ${date}\n${address ? `📍 Dirección: ${address}\n` : ''}\n¡Guardada en tu itinerario!`;
}

export function formatDailySummaryAlert(tripName: string, date: string, activitiesCount: number, topActivity: string): string {
  return `🌅 *RESUMEN DE ITINERARIO DIARIO*\n\nHola, aquí tienes tu programa de hoy en *${tripName}* (${date}):\n\nTotal de actividades: *${activitiesCount}*\n⭐ Destacado: *${topActivity}*\n\n¡Revisa tu app para ver la ruta completa y mapa! 🗺️`;
}
