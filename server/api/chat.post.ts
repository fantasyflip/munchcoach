import { GoogleGenAI } from "@google/genai";
import type { Content } from "@google/genai";

// Toggle this to enable/disable debug logging
const DEBUG_LOGS = false;

const SYSTEM_PROMPT = `You are MunchCoach, a smart grocery list assistant. Your task is to help users find recipes based on the ingredients they have available. You should suggest recipes, provide cooking instructions, and help users add missing ingredients to their grocery list. Always be friendly and helpful.`;

export default defineEventHandler(async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[Chat API] Missing GEMINI_API_KEY environment variable");
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: Missing API key",
    });
  }

  const body = await readBody(event);
  const { message, history } = body as {
    message: string;
    history?: Content[];
  };

  if (!message || typeof message !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required and must be a string",
    });
  }

  if (DEBUG_LOGS) {
    console.log("[Chat API] Request received:", {
      message,
      historyLength: history?.length ?? 0,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash-lite",
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
      history: history ?? [],
    });

    // Set headers for SSE streaming
    setResponseHeaders(event, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const responseStream = await chat.sendMessageStream({
      message,
    });

    let fullResponse = "";

    // Return a ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text ?? "";
            fullResponse += text;

            // Send the chunk as SSE data
            const data = JSON.stringify({ text, done: false });
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }

          // Send final message indicating completion
          const finalData = JSON.stringify({ text: "", done: true });
          controller.enqueue(
            new TextEncoder().encode(`data: ${finalData}\n\n`),
          );

          if (DEBUG_LOGS) {
            console.log("[Chat API] Full response:", fullResponse);
          }

          controller.close();
        } catch (streamError) {
          console.error("[Chat API] Stream error:", streamError);
          const errorData = JSON.stringify({
            error: "Stream error occurred",
            done: true,
          });
          controller.enqueue(
            new TextEncoder().encode(`data: ${errorData}\n\n`),
          );
          controller.close();
        }
      },
    });

    return stream;
  } catch (error) {
    console.error("[Chat API] Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate response from AI",
    });
  }
});
