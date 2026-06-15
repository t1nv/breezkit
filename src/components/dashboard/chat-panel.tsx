import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Bot, Send, Sparkles, Trash2 } from "lucide-react";
import { chatWithAdvisor, clearChat, getChatHistory } from "@/lib/ai.functions";

export function ChatPanel() {
  const qc = useQueryClient();
  const chatFn = useServerFn(chatWithAdvisor);
  const historyFn = useServerFn(getChatHistory);
  const clearFn = useServerFn(clearChat);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const history = useQuery({ queryKey: ["chat-history"], queryFn: () => historyFn() });

  const send = useMutation({
    mutationFn: async (message: string) => {
      const res = await chatFn({ data: { message } });
      if ("error" in res) throw new Error(res.error);
      return res.reply;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-history"] });
      setInput("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al guardar los datos."),
  });

  const clear = useMutation({
    mutationFn: () => clearFn(),
    onSuccess: () => {
      toast.success("Historial limpiado");
      qc.invalidateQueries({ queryKey: ["chat-history"] });
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history.data, send.isPending]);

  const messages = history.data?.messages ?? [];

  return (
    <div className="bk-chat-shell bg-card flex flex-col h-[72vh] min-h-[520px] max-w-5xl">
      <div className="p-5 md:p-7 border-b-2 border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bk-ai-orb">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-black">Asesor Breezkit IA</h2>
            <p className="text-xs font-semibold text-muted-foreground">
              Conoce tu perfil, transacciones y metas.
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => clear.mutate()}
            className="bk-ghost-icon text-muted-foreground hover:text-foreground transition"
            aria-label="Limpiar chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && !send.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-muted-foreground space-y-3"
          >
            <p>Soy tu asesor financiero. Algunas ideas para empezar:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "¿Cómo puedo ahorrar más este mes?",
                "Analiza mis gastos del mes",
                "¿En qué debería invertir según mi perfil?",
                "Tengo deudas, ¿qué hago primero?",
              ].map((s) => (
                <motion.button
                  key={s}
                  onClick={() => send.mutate(s)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs border-2 border-border bg-background px-3 py-1.5 hover:bg-muted transition-colors inline-flex items-center gap-1.5 font-bold"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`bk-chat-bubble max-w-[85%] px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bk-chat-bubble--user whitespace-pre-wrap"
                  : "bk-chat-bubble--assistant prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2"
              }`}
            >
              {m.role === "user" ? (
                m.content
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{m.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {send.isPending && (
          <div className="flex justify-start">
            <div className="bk-chat-bubble bk-chat-bubble--assistant text-muted-foreground px-4 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) send.mutate(input.trim());
        }}
        className="p-3 md:p-4 border-t-2 border-border flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={send.isPending}
          maxLength={2000}
          className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={send.isPending || !input.trim()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bk-primary-action inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Enviar</span>
        </motion.button>
      </form>
    </div>
  );
}
