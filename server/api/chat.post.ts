import Cerebras from "@cerebras/cerebras_cloud_sdk";
import type { Stream } from "@cerebras/cerebras_cloud_sdk/streaming";
import type { ChatCompletion } from "@cerebras/cerebras_cloud_sdk/resources/chat/completions";
import { serverSupabaseUser } from "#supabase/server";

// Enable/disable debug logging
const DEBUG = true;

const SYSTEM_PROMPT = `You are MunchCoach, a smart grocery list assistant. Your task is to help users find recipes based on the ingredients they have available. You should suggest recipes, provide cooking instructions, and help users add missing ingredients to their grocery list. Always be friendly and helpful.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  const user = await serverSupabaseUser(event);

  if (!user) {
    if (DEBUG) {
      console.error("[Chat API] Unauthorized: User not logged in");
    }
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: You must be logged in to use the chat feature",
    });
  }

  if (DEBUG) {
    console.log("[Chat API] Authenticated user:", user.email);
  }

  const config = useRuntimeConfig();
  const apiKey = config.cerebrasApiKey;

  if (!apiKey) {
    if (DEBUG) {
      console.error("[Chat API] CEREBRAS_API_KEY is not configured");
    }
    throw createError({
      statusCode: 500,
      statusMessage: "CEREBRAS_API_KEY is not configured",
    });
  }

  const body = await readBody<ChatRequest>(event);

  if (!body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required",
    });
  }

  if (DEBUG) {
    console.log("[Chat API] Request:", {
      message: body.message,
      historyLength: body.history?.length || 0,
    });
  }

  const client = new Cerebras({ apiKey });

  // Build messages array with system prompt, history, and new message
  const messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [{ role: "system", content: SYSTEM_PROMPT }];

  // Add conversation history
  if (body.history && body.history.length > 0) {
    for (const msg of body.history) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Add the new user message
  messages.push({
    role: "user",
    content: body.message,
  });

  if (DEBUG) {
    console.log(
      "[Chat API] Full messages array:",
      JSON.stringify(messages, null, 2),
    );
  }

  // Set up SSE response
  setResponseHeaders(event, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendSSE = (data: object) => {
    return `data: ${JSON.stringify(data)}\n\n`;
  };

  try {
    const stream: Stream<ChatCompletion> = await client.chat.completions.create(
      {
        model: "gpt-oss-120b",
        messages,
        stream: true,
      },
    );

    let fullResponse = "";

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // Handle streaming chunk response
            if ("choices" in chunk && Array.isArray(chunk.choices)) {
              const choice = chunk.choices[0];
              if (choice && "delta" in choice) {
                const delta = choice.delta as { content?: string };
                if (delta.content) {
                  fullResponse += delta.content;
                  controller.enqueue(
                    encoder.encode(sendSSE({ text: delta.content })),
                  );
                }
              }
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode(sendSSE({ done: true })));

          if (DEBUG) {
            console.log("[Chat API] Full response:", fullResponse);
          }

          controller.close();
        } catch (error) {
          console.error("[Chat API] Stream error:", error);
          controller.enqueue(
            encoder.encode(
              sendSSE({ error: "An error occurred during streaming" }),
            ),
          );
          controller.close();
        }
      },
    });

    return sendStream(event, readableStream);
  } catch (error) {
    console.error("[Chat API] Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to get response from Cerebras",
    });
  }
});
