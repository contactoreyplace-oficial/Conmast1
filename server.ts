import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

// API Route for Telemetry AI Analysis & Diagnostics
app.post('/api/ai/analyze-telemetry', async (req, res) => {
  try {
    const { deviceName, telemetryData, recentLogs } = req.body;
    
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({
        analysis: "Análisis simulado (Configure su clave de API de Gemini para análisis neuronal completo): El dispositivo muestra comportamiento estable con fluctuaciones térmicas normales. Se recomienda verificar los niveles de voltaje en la próxima ventana de mantenimiento preventivo.",
        riskLevel: "Bajo",
        recommendations: [
          "Mantener firmware actualizado a v2.4.1",
          "Revisar conexiones USB/OTG si ocurren desconexiones intermitentes",
          "Calibrar sensor de temperatura cada 3 meses"
        ]
      });
    }

    const prompt = `Actúa como un experto en sistemas IoT y telemetría industrial. Analiza los siguientes datos de telemetría del dispositivo "${deviceName}":
    Datos actuales: ${JSON.stringify(telemetryData, null, 2)}
    Registros recientes: ${JSON.stringify(recentLogs || [], null, 2)}
    
    Proporciona un diagnóstico técnico en español estructurado, incluyendo:
    1. Análisis detallado de rendimiento y anomalías detectadas.
    2. Nivel de riesgo (Bajo, Medio, Alto, Crítico).
    3. Recomendaciones de acción correctiva y mantenimiento predictivo (lista de 3 puntos).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "No se pudo generar el análisis.";

    res.json({
      analysis: text,
      riskLevel: text.toLowerCase().includes('crítico') ? 'Crítico' : text.toLowerCase().includes('alto') ? 'Alto' : text.toLowerCase().includes('medio') ? 'Medio' : 'Bajo',
      recommendations: [
        "Verificar integridad de la red Wi-Fi / MQTT",
        "Inspeccionar voltajes de entrada en puerto USB/OTG",
        "Optimizar intervalos de muestreo de sensores"
      ]
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Error al procesar el análisis con IA" });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
