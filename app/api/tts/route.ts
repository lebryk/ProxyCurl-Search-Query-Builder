import { OpenAI } from "openai";

export const runtime = "edge";

export async function GET(req: Request): Promise<Response> {
  const openai = new OpenAI();
  const url = new URL(req.url);
  const text = url.searchParams.get("text");

  if (!text) {
    return new Response("Text parameter is missing", { status: 400 });
  }

  try {
    const response = await openai.audio.speech.create({
      voice: "alloy",
      input: text,
      model: "tts-1",
    });

    return response;
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
