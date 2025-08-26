import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import readline from "readline";
import fetch from "node-fetch";

dotenv.config();

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

// Memoria de conversación
const memoria = [];

// 🔎 Función para buscar en Google usando Serper.dev
/**
 * The function `buscarGoogle` sends a POST request to a Google search API endpoint with a query,
 * retrieves search results, extracts snippets and sources from the results, and returns them.
 * @param query - The `buscarGoogle` function you provided is an asynchronous function that sends a
 * POST request to a Google search API endpoint to retrieve search results based on the provided query.
 * It then extracts snippets and sources from the response data and returns them as an object.
 * @returns The `buscarGoogle` function is making a POST request to a Google search API endpoint with a
 * query parameter and retrieving search results. It then extracts snippets and sources (links) from
 * the search results and returns an object containing arrays of snippets and sources.
 */
async function buscarGoogle(query) {
  const url = "https://google.serper.dev/search";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5 }),
  });

  const data = await response.json();
  const snippets = [];
  const fuentes = [];

  if (data.organic) {
    for (let item of data.organic.slice(0, 5)) {
      if (item.snippet) snippets.push(item.snippet);
      if (item.link) fuentes.push(item.link);
    }
  }

  return { snippets, fuentes };
}

// 🤖 Función para responder al usuario con memoria y streaming
/* The `async function responderUsuario(pregunta) { ... }` function in the provided JavaScript code is
responsible for handling user interactions and responses within the chatbot system. Here is a
breakdown of what this function does: */
async function responderUsuario(pregunta) {
  // Guardamos en la memoria
  memoria.push({ role: "user", content: pregunta });

  // 🔎 Buscar en Google
  const { snippets, fuentes } = await buscarGoogle(pregunta);
  const contexto = snippets.join("\n");

  if (contexto) {
    memoria.push({
      role: "system",
      content: `Información encontrada en Google:\n${contexto}`,
    });
  }

  // 🚀 Respuesta en streaming
  console.log("\n🤖 Chatbot: ");
  const chat = model.startChat({
    history: memoria.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  });

  const stream = await chat.sendMessageStream(pregunta);

  let respuesta = "";
  for await (const chunk of stream.stream) {
    const text = chunk.text();
    process.stdout.write(text);
    respuesta += text;
  }
  console.log("\n");

  memoria.push({ role: "assistant", content: respuesta });

  // 📌 Mostrar fuentes
  if (fuentes.length > 0) {
    console.log("\n🔎 Fuentes:");
    fuentes.forEach((f) => console.log(f));
  }
}

// ----------------- 🚀 LOOP PRINCIPAL -----------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("💬 Chatbot con memoria + Google Search + Gemini + streaming\n");
console.log("Escribe 'salir' para terminar.\n");

/**
 * The function "preguntar" prompts the user for input, responds based on the input, and continues to
 * prompt the user until they type "salir" to exit.
 */
function preguntar() {
  rl.question("Tú: ", async (input) => {
    if (input.toLowerCase() === "salir") {
      console.log("👋 ¡Hasta luego!");
      rl.close();
      return;
    }
    await responderUsuario(input);
    preguntar();
  });
}

preguntar();
