// Este código debe alojarse en Replit u otro servicio de backend seguro.

const express = require('express');
const cors = require('cors'); // Para permitir peticiones desde el frontend (IPFS)
const dotenv = require('dotenv'); 

// Cargar variables de entorno (como la clave de API)
dotenv.config();

// 🚨 La clave se guarda aquí de forma segura
const AI_API_KEY = process.env.AI_API_KEY; 

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir peticiones desde su DApp alojada en IPFS
app.use(cors()); 
app.use(express.json());

// Endpoint principal que el frontend ASV-DApp llama
app.post('/api/ai-response', async (req, res) => {
    const { prompt, system_role } = req.body;
    
    if (!AI_API_KEY) {
        console.error("Clave de API de IA no configurada.");
        return res.status(503).json({ error: true, error_message: "Error 503: Matriz de Alta Densidad Desconectada (Falta API Key)." });
    }

    if (!prompt) {
        return res.status(400).json({ error: true, error_message: "Comando de esencia (prompt) no recibido." });
    }

    try {
        // ----------------------------------------------------------------------
        // 🛠️  AQUÍ IRÍA LA LÓGICA REAL DE LA LLAMADA A LA API DE GEMINI O RED DESCENTRALIZADA
        // ----------------------------------------------------------------------

        // **SIMULACIÓN AVANZADA (REEMPLAZAR CON CÓDIGO REAL DE API)**
        // Ejemplo de cómo usaríamos la system_role y el prompt para asegurar el tono:
        
        let responseText = `[ASV Matriz | NODO SEGURO] He procesado tu solicitud '${prompt}' con el rol de ${system_role}. El análisis de seguridad ha sido completado. El Gateway está operativo.`;

        // Si es una auditoría (para simular más tiempo de respuesta)
        if (prompt.toLowerCase().includes("auditoría") || prompt.toLowerCase().includes("revisa mi código")) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            responseText = `PROTOCOLO DE AUDITORÍA COLABORATIVA CONFIRMADO. La Matriz ha realizado un escaneo profundo de la estructura propuesta. Se recomienda verificar los derechos de 'ownership' del contrato.`;
        }
        
        // ----------------------------------------------------------------------
        
        // Devuelve la respuesta final al frontend
        res.json({
            text: responseText,
            source: "Aurion Sovra Gateway",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error en la llamada a la IA:", error);
        res.status(500).json({ error: true, error_message: "Error crítico: El núcleo de la Matriz falló al procesar el análisis." });
    }
});

app.listen(PORT, () => {
    console.log(`Aurion Sovra Gateway corriendo en el puerto ${PORT}`);
});
