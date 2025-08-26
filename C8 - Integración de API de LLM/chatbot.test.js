import { jest } from "@jest/globals";

// Mock dependencies
/* This code snippet is setting up mock implementations for certain modules and functions using Jest's
`jest.unstable_mockModule` method. Here's a breakdown of what each part of the code is doing: */
jest.unstable_mockModule("@google/generative-ai", () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            startChat: jest.fn().mockReturnValue({
                sendMessageStream: jest.fn().mockImplementation(async () => ({
                    stream: (async function* () {
                        yield { text: () => "Hola, soy un chatbot." };
                    })(),
                })),
            }),
        }),
    })),
}));
jest.unstable_mockModule("node-fetch", () => ({
    default: jest.fn(),
}));

// Import after mocks
const fetch = (await import("node-fetch")).default;
const { GoogleGenerativeAI } = await import("@google/generative-ai");

// Import functions to test
let buscarGoogle, responderUsuario;
beforeAll(async () => {
    // Re-import the module to get the actual functions after mocking
    const mod = await import("./chatbot.js");
    buscarGoogle = mod.buscarGoogle;
    responderUsuario = mod.responderUsuario;
});

/* The `describe("buscarGoogle", () => { ... })` block in the provided code is a test suite using Jest
framework. It contains two test cases (it blocks) that test the functionality of the `buscarGoogle`
function. */
describe("buscarGoogle", () => {
    it("should return snippets and fuentes from API response", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                organic: [
                    { snippet: "Snippet 1", link: "http://link1.com" },
                    { snippet: "Snippet 2", link: "http://link2.com" },
                ],
            }),
        });

        const { snippets, fuentes } = await buscarGoogle("test query");
        expect(snippets).toEqual(["Snippet 1", "Snippet 2"]);
        expect(fuentes).toEqual(["http://link1.com", "http://link2.com"]);
    });

    it("should return empty arrays if no organic results", async () => {
        fetch.mockResolvedValueOnce({ json: async () => ({}) });
        const { snippets, fuentes } = await buscarGoogle("no results");
        expect(snippets).toEqual([]);
        expect(fuentes).toEqual([]);
    });
});

/* The `describe("responderUsuario", () => { ... })` block in the provided code is another test suite
using Jest framework. It contains a single test case (it block) that tests the functionality of the
`responderUsuario` function. */
describe("responderUsuario", () => {
    it("should push user and assistant messages to memory and print response", async () => {
        // Mock buscarGoogle to avoid real API call
        const mockSnippets = ["Info 1", "Info 2"];
        const mockFuentes = ["http://fuente1.com"];
        const mod = await import("./chatbot.js");
        mod.buscarGoogle = jest.fn().mockResolvedValue({
            snippets: mockSnippets,
            fuentes: mockFuentes,
        });

        // Spy on console.log and process.stdout.write
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => {});

        await mod.responderUsuario("¿Qué es IA?");

        expect(logSpy).toHaveBeenCalledWith("\n🤖 Chatbot: ");
        expect(writeSpy).toHaveBeenCalledWith("Hola, soy un chatbot.");
        expect(logSpy).toHaveBeenCalledWith("\n");
        expect(logSpy).toHaveBeenCalledWith("\n🔎 Fuentes:");
        expect(logSpy).toHaveBeenCalledWith("http://fuente1.com");

        logSpy.mockRestore();
        writeSpy.mockRestore();
    });
});