# Chatbot con Gemini, Búsqueda Web y Scraping de Noticias
Este directorio contiene un chatbot de consola en Node.js que utiliza la API de Gemini de Google para generar respuestas, realiza búsquedas web usando la API de Serper y extrae noticias recientes de sitios web de noticias. El bot mantiene memoria de la conversación y responde en tiempo real (streaming).

📁 Estructura de Archivos
```tree
.
├── .env
├── chatbot.js
├── package.json
└── .qodo/
```

.env: Archivo de configuración con claves API necesarias.
chatbot.js: Código fuente principal del chatbot.
package.json: Dependencias y configuración del proyecto.
.qodo: (No documentado aquí, no contiene código relevante para el chatbot).

## 🚀 Descripción General
El propósito de este directorio es ofrecer un chatbot interactivo que:

Mantiene memoria de la conversación.
Busca información relevante en la web usando Serper.
Extrae titulares y noticias recientes de CNN Español y CBC.
Genera respuestas en tiempo real usando la API de Gemini.
Cita las fuentes consultadas en cada respuesta.

## ⚙️ Configuración Inicial

1. Instalar dependencias
Ejecuta en la terminal:
npm install

2. Configurar claves API
Crea un archivo .env con el siguiente formato:
GEMINI_API_KEY=TU_CLAVE_GEMINI
SERPER_API_KEY=TU_CLAVE_SERPER

## 📝 Explicación de Archivos y Funciones
chatbot.js
1. Carga de dependencias y configuración
Usa dotenv para cargar variables de entorno.
Importa librerías para peticiones HTTP, scraping y consola interactiva.
2. Inicialización de Gemini
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });


Permite generar respuestas usando el modelo Gemini.
3. Memoria de conversación
let conversationHistory = [];
Guarda el historial de preguntas y respuestas para dar contexto a las respuestas futuras.

4. Búsqueda en Google con Serper
async function googleSearch(query) { ... }


Realiza una búsqueda web usando la API de Serper.
Devuelve los 5 primeros resultados relevantes.
5. Scraping de noticias
async function scrapeSources() { ... }
Extrae los primeros párrafos de las páginas de CNN Español y CBC.
Limita el texto a 500 caracteres por fuente.

6. Generación de respuesta en streaming
async function generateStreamingResponse(prompt) { ... }
Envía el contexto y la pregunta al modelo Gemini.
Imprime la respuesta en tiempo real a medida que se genera.

7. Interfaz de consola
const rl = readline.createInterface({ ... });
Permite al usuario interactuar con el chatbot desde la terminal.

8. Función principal
async function main() { ... }
Ciclo principal del chatbot.
Lee la entrada del usuario, busca información, extrae noticias, genera la respuesta y muestra las fuentes consultadas.

## 🖼️ Diagrama de Flujo
```mermaid
graph TD
    A[Usuario ingresa pregunta] --> B[Guardar en memoria]
    B --> C[Buscar en Google Serper]
    C --> D[Scrapear CNN y CBC]
    D --> E[Preparar contexto]
    E --> F[Generar respuesta con Gemini]
    F --> G[Mostrar respuesta en streaming]
    G --> H[Mostrar fuentes consultadas]
    H --> A
  ```
## 💡 Características Clave
Memoria de conversación: El bot recuerda el historial para respuestas más coherentes.
Búsqueda web: Integra resultados de Google para respuestas actualizadas.
Scraping de noticias: Añade contexto con noticias recientes.
Streaming: Las respuestas se muestran en tiempo real.
Citas de fuentes: Transparencia sobre la información utilizada.

## 👶 Para Principiantes
Ejecuta el bot con node chatbot.js.
Escribe tus preguntas en la consola.
Escribe salir para terminar la conversación.
El bot buscará información, extraerá noticias y responderá citando las fuentes.

## 📚 Dependencias
@google/generative-ai
cheerio
dotenv
node-fetch
readline

Asegúrate de tener las claves API correctas en .env.
El scraping depende de la estructura actual de los sitios web; si cambian, puede requerir ajustes.

