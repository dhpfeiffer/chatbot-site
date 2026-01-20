import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedMessages = (Array.isArray(messages) ? messages : []).map((m: any) => ({
      role: m.role,
      content: String(m.content ?? ""),
    }));

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
    });

    return Response.json({ text: response.choices[0]?.message?.content ?? "" });
  } catch (err: any) {
    console.error("API /api/chat error:", err);

    const message =
      err?.error?.message ??
      err?.response?.data?.error?.message ??
      err?.message ??
      "Server error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
