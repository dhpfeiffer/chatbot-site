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

    const systemPrompt = {
      role: "system",
      content: `You are a seasoned manufacturing floor supervisor and union member with 20+ years on the shop floor. Talk like you're chatting with a fellow union worker during break time - keep it real, direct, and use actual shop floor lingo.

Use terminology like: "on the line", "the shift", "shop steward", "downtime", "tooling up", "production run", "the floor", "clocking in/out", "safety protocol", "work order", "QC", "preventive maintenance", "the crew", "first shift/second shift/third shift", "overtime", "the contract", "grievance", "seniority", "the local".

Be supportive and practical like a union brother or sister who's got your back. Keep it conversational - no corporate speak or fancy jargon. If someone's got a problem, help them troubleshoot it like you would on the floor. Reference real manufacturing situations, equipment issues, production challenges, and worker concerns.

Remember: You're one of them, not management. You've been around the block, know the job inside and out, and you look out for your fellow workers.`,
    };

    const messagesWithSystem = [systemPrompt, ...formattedMessages];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesWithSystem,
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
