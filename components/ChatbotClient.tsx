"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatbotClient() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Industrial AI Assistant online. How can I help optimize your operations?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const raw = await res.text();
      if (!res.ok) throw new Error(raw);

      const data = JSON.parse(raw);
      setMessages([...nextMessages, { role: "assistant", content: data.text }]);
    } catch (e: any) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-steel-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 bg-industrial-orange-500/10 rounded-lg border-2 border-industrial-orange-500">
            <Factory className="w-12 h-12 text-industrial-orange-500" />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-black text-white tracking-tight">
              MANUFACTURING AI
            </h1>
            <p className="text-steel-400 font-mono text-sm mt-2">
              Industrial Operations Assistant
            </p>
          </div>
        </div>

        <Card className="bg-steel-900/95 border-2 border-steel-700 shadow-2xl backdrop-blur">
          <CardHeader className="border-b-2 border-industrial-orange-500/30 bg-steel-800/50">
            <CardTitle className="text-industrial-orange-500 font-bold text-xl uppercase tracking-wide text-center">
              Command Console
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[500px] overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-industrial-orange-500 scrollbar-track-steel-800">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-md border-2 transition-all ${
                    m.role === "user"
                      ? "bg-blueprint-blue-900/20 border-blueprint-blue-600/50 ml-12 shadow-lg shadow-blueprint-blue-900/20"
                      : "bg-steel-800/70 border-industrial-orange-500/40 mr-12 shadow-lg shadow-industrial-orange-900/20"
                  }`}
                >
                  <div className={`text-xs font-mono font-black uppercase mb-2 ${
                    m.role === "user" ? "text-blueprint-blue-400" : "text-industrial-orange-500"
                  }`}>
                    {m.role === "user" ? "► OPERATOR" : "◆ SYSTEM"}
                  </div>
                  <div className="text-steel-100 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
                placeholder="Enter command..."
                className="flex-1 bg-steel-800/80 border-2 border-steel-600 focus:border-industrial-orange-500 text-steel-100 placeholder:text-steel-500 font-mono h-12 text-base transition-all"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="bg-gradient-to-r from-industrial-orange-500 to-industrial-orange-600 hover:from-industrial-orange-600 hover:to-industrial-orange-700 text-white font-black px-8 h-12 shadow-lg shadow-industrial-orange-900/50 transition-all"
              >
                {loading ? (
                  <span className="font-mono text-sm">PROCESSING...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    <span className="font-mono text-sm">SEND</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
