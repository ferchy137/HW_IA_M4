# Chatbot con Gemini, Google Search y Streaming
Este directorio contiene un chatbot interactivo en Node.js que utiliza la API de Gemini de Google para generar respuestas, integra resultados de búsqueda en Google usando Serper.dev y mantiene memoria de la conversación. El chatbot responde en tiempo real (streaming) y muestra fuentes relevantes para las respuestas.

📁 Estructura de Archivos
```tree
.
├── .env
├── chatbot.js
├── package.json
└── .qodo/
```

.env: Archivo de configuración con las claves API necesarias.
chatbot.js: Código principal del chatbot.
package.json: Lista de dependencias del proyecto.
.qodo: (No documentado aquí, carpeta auxiliar).

## Descripción General
El propósito de este directorio es proporcionar un chatbot que:

Recibe preguntas del usuario por consola.
Busca información relevante en Google usando la API de Serper.dev.
Usa la API de Gemini para generar respuestas inteligentes, considerando tanto la memoria de la conversación como los resultados de búsqueda.
Muestra las respuestas en tiempo real (streaming).
Presenta las fuentes consultadas para mayor transparencia.

## ⚙️ Configuración
1. Instale las dependencias:
npm install

2. Configure las claves API en el archivo .env:
GROQ_API_KEY=...
SERPER_API_KEY=...

## 🗂️ Explicación de Archivos y Funciones
chatbot.js

1. Importaciones y Configuración
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import readline from "readline";
import fetch from "node-fetch";

dotenv.config();

Carga las dependencias y configura las variables de entorno.
2. Inicialización de Gemini
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

Prepara el modelo de Gemini para generar respuestas.

3. Memoria de Conversación
const memoria = [];

Guarda el historial de la conversación para mantener el contexto.

4. Función: buscarGoogle
async function buscarGoogle(query) { ... }
Realiza una búsqueda en Google usando la API de Serper.dev.
Devuelve fragmentos de texto relevantes (snippets) y enlaces de fuentes (fuentes).

5. Función: responderUsuario
async function responderUsuario(pregunta) { ... }
Añade la pregunta del usuario a la memoria.
Busca información relevante en Google.
Añade los resultados de búsqueda al contexto.
Genera una respuesta usando Gemini y la muestra en tiempo real.
Añade la respuesta a la memoria.
Muestra las fuentes consultadas.

6. Bucle Principal de Conversación
const rl = readline.createInterface({ ... });

function preguntar() { ... }

preguntar();
Permite la interacción continua con el usuario por consola.
El usuario puede escribir "salir" para terminar la conversación.

#🔑 Diagrama de Flujo
```mermaid
flowchart TD
    A[Usuario ingresa pregunta] --> B[buscarGoogle]
    B --> C[Obtener snippets y fuentes]
    C --> D[Agregar contexto a memoria]
    D --> E[Generar respuesta con Gemini]
    E --> F[Mostrar respuesta en streaming]
    F --> G[Mostrar fuentes]
    G --> H[Esperar nueva pregunta o salir]
  ```
## 📝 Ejemplo de Uso
💬 Chatbot con memoria + Google Search + Gemini + streaming

Escribe 'salir' para terminar.

Tú: ¿Qué es la inteligencia artificial?
🤖 Chatbot: [respuesta generada en tiempo real...]

🔎 Fuentes:
https://ejemplo.com/fuente1
https://ejemplo.com/fuente2


## 📚 Características Clave
Memoria de conversación: El chatbot recuerda el historial para mantener el contexto.
Búsqueda en Google: Integra resultados actualizados de la web.
Respuestas en streaming: Muestra la respuesta a medida que se genera.
Fuentes transparentes: Presenta enlaces a la información utilizada.

## 🛠️ Dependencias
@google/generative-ai
dotenv
groq-sdk
node-fetch
readline


## 🧩 Personalización
Puede modificar el modelo de Gemini o la cantidad de resultados de búsqueda ajustando los parámetros en el código.
Para ampliar la memoria o cambiar el formato de las respuestas, edite las funciones memoria y responderUsuario.
