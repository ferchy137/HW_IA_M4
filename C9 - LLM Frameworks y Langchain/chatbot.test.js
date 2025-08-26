import { jest } from "@jest/globals";
import * as chatbot from "./chatbot.js";

// chatbot.test.js


// Mock dependencies
jest.mock("node-fetch", () => jest.fn());
jest.mock("@google/generative-ai", () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            generateContentStream: jest.fn(),
        }),
    })),
}));
jest.mock("cheerio", () => ({
    load: jest.fn(),
}));
jest.mock("readline", () => ({
    createInterface: jest.fn().mockReturnValue({
        question: jest.fn(),
        close: jest.fn(),
    }),
}));
jest.mock("https", () => ({
    Agent: jest.fn(),
}));

/* This code snippet is a test suite for the `googleSearch` function in the `chatbot.js` file. Here's a
breakdown of what it does: */
describe("googleSearch", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return top 5 organic results", async () => {
        const fetch = (await import("node-fetch")).default;
        fetch.mockResolvedValueOnce({
            json: async () => ({
                organic: [
                    { title: "t1", link: "l1" },
                    { title: "t2", link: "l2" },
                    { title: "t3", link: "l3" },
                    { title: "t4", link: "l4" },
                    { title: "t5", link: "l5" },
                    { title: "t6", link: "l6" },
                ],
            }),
        });
        const results = await chatbot.googleSearch("test");
        expect(results).toHaveLength(5);
        expect(results[0]).toEqual({ title: "t1", link: "l1" });
    });

    it("should return empty array on error", async () => {
        const fetch = (await import("node-fetch")).default;
        fetch.mockRejectedValueOnce(new Error("fail"));
        const results = await chatbot.googleSearch("test");
        expect(results).toEqual([]);
    });
});
/* This code snippet is a test case for the `scrapeSources` function in the `chatbot.js` file. Here's a
breakdown of what it does: */

describe("scrapeSources", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return docs with source and content", async () => {
        const fetch = (await import("node-fetch")).default;
        fetch
            .mockResolvedValueOnce({
                text: async () => "<p>News1</p><p>News2</p>",
            })
            .mockResolvedValueOnce({
                text: async () => "<p>CBC1</p><p>CBC2</p>",
            });

        const cheerio = await import("cheerio");
        cheerio.load.mockImplementation(html => {
            return {
                map: (cb) => ({
                    get: () => ["News1", "News2"],
                }),
                $: () => {},
                text: () => {},
            };
        });

        // Patch cheerio.load to simulate $("p").map().get()
        cheerio.load.mockImplementation(html => {
            return (selector) => ({
                map: (cb) => ({
                    get: () => html.match(/<p>(.*?)<\/p>/g).map(p => p.replace(/<\/?p>/g, "")),
                }),
            });
        });

        const docs = await chatbot.scrapeSources();
        expect(docs.length).toBe(2);
        expect(docs[0].source).toContain("cnn");
        expect(typeof docs[0].content).toBe("string");
    });

    it("should handle fetch errors gracefully", async () => {
        const fetch = (await import("node-fetch")).default;
        fetch.mockRejectedValueOnce(new Error("fail")).mockResolvedValueOnce({
            text: async () => "<p>CBC1</p>",
        });

        const cheerio = await import("cheerio");
        cheerio.load.mockImplementation(html => {
            return (selector) => ({
                map: (cb) => ({
                    get: () => ["CBC1"],
                }),
            });
        });

        const docs = await chatbot.scrapeSources();
        expect(docs.length).toBe(1);
        expect(docs[0].source).toContain("cbc");
    });
});

/* This code snippet is a test case for the `generateStreamingResponse` function in the `chatbot.js`
file. Here's a breakdown of what it does: */
describe("generateStreamingResponse", () => {
    it("should stream and return response", async () => {
        const fakeStream = {
            stream: (async function* () {
                yield {
                    candidates: [
                        { content: { parts: [{ text: "Hello " }] } },
                    ],
                };
                yield {
                    candidates: [
                        { content: { parts: [{ text: "World!" }] } },
                    ],
                };
            })(),
        };

        const model = {
            generateContentStream: jest.fn().mockResolvedValue(fakeStream),
        };

        // Patch model in chatbot
        chatbot.model = model;
        chatbot.conversationHistory = [
            { role: "user", content: "Hi" },
            { role: "assistant", content: "Hello!" },
        ];

        // Mock process.stdout.write
        const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => {});

        const result = await chatbot.generateStreamingResponse("How are you?");
        expect(result).toBe("Hello World!");

        writeSpy.mockRestore();
    });
});