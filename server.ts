import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini SDK safely on server
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. WhatsApp Message Dispatcher Endpoint
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { recipient, message, messageType, tripId, config } = req.body;

    if (!message || !recipient) {
      res.status(400).json({ error: 'Recipiente y mensaje son requeridos.' });
      return;
    }

    const token = config?.apiToken || process.env.WHATSAPP_API_TOKEN;
    const phoneId = config?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

    let isRealApi = false;
    let apiResponse = null;

    // If Meta WhatsApp Cloud API credentials exist, attempt real sending
    if (token && phoneId && config?.provider === 'cloud_api') {
      try {
        const cleanPhone = recipient.replace(/[^0-9]/g, '');
        const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: cleanPhone,
            type: 'text',
            text: { body: message },
          }),
        });

        apiResponse = await response.json();
        if (response.ok) {
          isRealApi = true;
        } else {
          console.warn('WhatsApp Cloud API responded with error, falling back to simulated:', apiResponse);
        }
      } catch (err) {
        console.warn('Error calling Meta WhatsApp API:', err);
      }
    }

    const logEntry = {
      id: 'wa-' + Date.now(),
      tripId: tripId || 'default',
      timestamp: new Date().toISOString(),
      recipient,
      messageType: messageType || 'custom',
      content: message,
      status: isRealApi ? 'sent' : 'simulated',
      isRealApi,
      apiDetails: apiResponse,
    };

    res.json({
      success: true,
      log: logEntry,
      note: isRealApi ? 'Mensaje enviado a través de WhatsApp Cloud API real.' : 'Mensaje registrado en el Simulador de WhatsApp.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error enviando notificación' });
  }
});

// 2. Gemini Itinerary Generator Endpoint
app.post('/api/gemini/generate-itinerary', async (req, res) => {
  try {
    const { destination, days, budget, travelStyle, interests } = req.body;

    if (!destination) {
      res.status(400).json({ error: 'El destino es obligatorio.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Crea un itinerario de viaje optimizado de ${days || 3} días para viajar a "${destination}".
Estilo de viaje: ${travelStyle || 'Cultural y relajado'}, Presupuesto aproximado: ${budget || 'Medio'}, Intereses: ${interests || 'Turismo, gastronomía, fotos'}.

Responde estrictamente en formato JSON con la siguiente estructura:
{
  "title": "Título atractivo del viaje",
  "description": "Breve descripción general",
  "suggestedBudget": 1500,
  "currency": "EUR o USD según destino",
  "recommendedActivities": [
    {
      "day": 1,
      "dateOffset": 0,
      "title": "Nombre de actividad",
      "description": "Detalles de qué ver o hacer",
      "category": "sightseeing",
      "startTime": "09:00",
      "endTime": "11:30",
      "location": "Lugar específico",
      "estimatedCost": 20,
      "priority": "high"
    }
  ],
  "suggestedFlights": [
    {
      "airline": "Línea Aérea típica",
      "flightNumber": "XX 123",
      "departureAirport": "Origen",
      "arrivalAirport": "Destino",
      "notes": "Consejo de vuelo"
    }
  ],
  "suggestedHotels": [
    {
      "name": "Nombre de hotel o zona recomendada",
      "type": "hotel",
      "address": "Dirección aproximada",
      "notes": "Por qué es buena opción"
    }
  ]
}
Categorías permitidas para actividades: "sightseeing", "food", "adventure", "relaxation", "culture", "shopping", "transit".
Prioridades permitidas: "high", "medium", "low".
Escribe todas las explicaciones en ESPAÑOL.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);

    res.json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: error.message || 'Error al generar el itinerario con Gemini' });
  }
});

// 3. Gemini E-Ticket / Reservation Email Parser Endpoint
app.post('/api/gemini/parse-ticket', async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText) {
      res.status(400).json({ error: 'Proporciona texto o confirmación de reserva.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Analiza el siguiente texto de confirmación de vuelo o reserva de hotel y extrae los datos estructurados en formato JSON:

Texto a analizar:
"""
${rawText}
"""

Responde con el siguiente JSON:
{
  "type": "flight" o "hotel" o "unknown",
  "flightData": {
    "flightNumber": "Ej: AA 1234",
    "airline": "Nombre aerolínea",
    "departureAirport": "Código/Nombre origen",
    "arrivalAirport": "Código/Nombre destino",
    "departureCity": "Ciudad origen",
    "arrivalCity": "Ciudad destino",
    "departureTime": "YYYY-MM-DDTHH:MM o texto de hora",
    "arrivalTime": "YYYY-MM-DDTHH:MM o texto de hora",
    "terminal": "Terminal si se menciona",
    "gate": "Puerta si se menciona",
    "seat": "Asiento",
    "confirmationCode": "Código de reserva/pnr",
    "price": 0
  },
  "hotelData": {
    "title": "Nombre del hotel/alojamiento",
    "provider": "Booking/Expedia/Directo",
    "address": "Dirección",
    "checkIn": "YYYY-MM-DDTHH:MM",
    "checkOut": "YYYY-MM-DDTHH:MM",
    "confirmationCode": "Código",
    "price": 0
  }
}
Si un campo no se encuentra en el texto, usa cadenas vacías o 0. Escribe los detalles en español.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonResult = JSON.parse(response.text || '{}');
    res.json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Error parsing ticket:', error);
    res.status(500).json({ error: error.message || 'Error procesando el ticket' });
  }
});

// 4. Gemini AI Travel Assistant Chat Endpoint
app.post('/api/gemini/travel-assistant', async (req, res) => {
  try {
    const { userQuery, tripContext } = req.body;

    if (!userQuery) {
      res.status(400).json({ error: 'La consulta no puede estar vacía.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Eres un asistente de viajes experto y conciso en español.
Contexto del viaje actual del usuario:
${JSON.stringify(tripContext || {})}

Pregunta o petición del usuario:
"${userQuery}"

Responde con consejos prácticos, recomendaciones locales, frases útiles o recordatorios de equipaje. Sé amable, directo y estructurado con puntos clave.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in travel assistant:', error);
    res.status(500).json({ error: error.message || 'Error al comunicarse con el Asistente' });
  }
});

// ----------------------------------------------------
// VITE & STATIC HANDLING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
