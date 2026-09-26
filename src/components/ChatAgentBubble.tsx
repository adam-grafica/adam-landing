/**
 * ChatAgentBubble.tsx
 *
 * Arquetipo C (SPECS.md): bubble de agente embebido en la landing.
 * Consume POST /api/chat del backend FastAPI propio (:3001), que persiste
 * la sesión en SQLite y responde vía A2A gateway o fallback local.
 *
 * Env: VITE_API_BASE_URL (mismo patrón que ModalForm.tsx)
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import X from 'lucide-react/dist/esm/icons/x';
import Send from 'lucide-react/dist/esm/icons/send';
import Minimize2 from 'lucide-react/dist/esm/icons/minimize-2';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import { trackCTAClick } from '../utils/analytics';

type Role = 'user' | 'agent';

interface Msg {
  id: string;
  role: Role;
  text: string;
  meta?: { intent?: string | null; agent_id?: string | null; latency_ms?: number | null };
}

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/** visitor_id estable por navegador: el backend lo usa para agrupar sesiones. */
function getVisitorId(): string {
  const KEY = 'ag_visitor_id';
  try {
    let v = localStorage.getItem(KEY);
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem(KEY, v);
    }
    return v;
  } catch {
    return crypto.randomUUID();
  }
}

export default function ChatAgentBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll al último mensaje
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Bienvenida al abrir por primera vez
  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{
        id: 'welcome',
        role: 'agent',
        text: 'Hola. Cuéntame qué necesitas para tu negocio y te digo cómo lo resolvemos.',
      }]);
    }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const mine: Msg = { id: `u-${Date.now()}`, role: 'user', text };
    setMsgs((m) => [...m, mine]);
    setInput('');
    setError(null);
    setSending(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          visitor_id: getVisitorId(),
          session_id: sessionIdRef.current,
          page_url: window.location.href,
          user_agent: navigator.userAgent,
        }),
      });

      if (!res.ok) throw new Error(`api ${res.status}`);

      const data = await res.json();
      // El backend devuelve session_id uuid; se reusa en los turnos siguientes
      if (data.session_id) sessionIdRef.current = data.session_id;

      setMsgs((m) => [...m, {
        id: `a-${Date.now()}`,
        role: 'agent',
        text: data.reply,
        meta: { intent: data.intent, agent_id: data.agent_id, latency_ms: data.latency_ms },
      }]);
    } catch (err) {
      setError('No pude conectar con el agente. Intenta de nuevo en un momento.');
    } finally {
      setSending(false);
    }
  }, [input, sending]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const toggle = () => {
    trackCTAClick('chat_agent_toggle', open ? 'chat_panel' : 'chat_launcher');
    setOpen((o) => !o);
  };

  return (
    <>
      {/* ---------- Bubble flotante ---------- */}
      {!open && (
        <button
          onClick={toggle}
          aria-label="Abrir chat con el agente"
          className="chat-bubble-launcher fixed bottom-6 right-6 z-[90] group flex items-center gap-2.5 rounded-full border border-white/10 bg-ag-bg-secondary px-5 py-3.5 shadow-2xl transition-all duration-300 ease-expo-out hover:border-ag-blue/50 hover:shadow-[0_0_36px_rgba(51,133,255,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ag-blue"
        >
          <MessageCircle className="h-5 w-5 text-ag-blue transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-medium text-ag-text-white">Habla con un agente</span>
        </button>
      )}

      {/* ---------- Panel de chat ---------- */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat con el agente"
          className="chat-bubble-panel fixed bottom-6 right-6 z-[90] flex h-[min(560px,calc(100vh-3rem))] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ag-bg-secondary shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] bg-ag-bg-tertiary px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ag-green opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ag-green" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ag-text-white">Agente AdamGráfica</p>
                <p className="text-[11px] text-ag-text-muted">Responde en segundos</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggle}
                aria-label="Minimizar chat"
                className="rounded-lg p-1.5 text-ag-text-muted transition-colors hover:bg-white/5 hover:text-ag-text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={toggle}
                aria-label="Cerrar chat"
                className="rounded-lg p-1.5 text-ag-text-muted transition-colors hover:bg-white/5 hover:text-ag-text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-ag-blue text-white'
                      : 'rounded-bl-sm border border-white/[0.07] bg-ag-bg-primary text-ag-text-gray'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.meta?.latency_ms != null && (
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] opacity-60">
                      <Sparkles className="h-2.5 w-2.5" />
                      {m.meta.agent_id || 'agente'} · {m.meta.latency_ms} ms
                    </p>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/[0.07] bg-ag-bg-primary px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ag-text-muted [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ag-text-muted [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ag-text-muted" />
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.07] bg-ag-bg-tertiary p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Escribe tu consulta…"
                maxLength={2000}
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-white/10 bg-ag-bg-primary px-3.5 py-2.5 text-sm text-ag-text-white placeholder-ag-text-muted focus:border-ag-blue/60 focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || sending}
                aria-label="Enviar mensaje"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-ag-blue text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(51,133,255,0.45)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:shadow-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-ag-text-muted">
              Enter para enviar · Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      )}
    </>
  );
}
