"""
Tests del contrato A2A de services/agent.py.

Corre sin pytest y sin red: parchea httpx.AsyncClient con un fake.
Uso: python3 scripts/test_agent_a2a.py
"""
import asyncio
import sys
import types
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services import agent as agent_mod  # noqa: E402

FAKE_NESTED = {
    "status": "ok",
    "agent": "agent-lead",
    "from": "adamgrafica-landing-v2",
    "response": {
        "status": "ok",
        "agent": "agent-lead",
        "response": "Hola, te paso el precio del sitio web: $1.490.000 CLP.",
        "usage": {"total_tokens": 42},
    },
}
FAKE_FLAT = {"status": "ok", "response": "Respuesta plana."}
FAKE_QUOTA = {
    "status": "ok",
    "agent": "agent-lead",
    "response": {
        "status": "ok",
        "agent": "agent-lead",
        "response": '[agent-lead] LLM error 429: {"type":"error","error":{"type":"rate_limit_error"}}',
    },
}


class _FakeResp:
    def __init__(self, payload, status=200):
        self._payload = payload
        self.status_code = status

    def raise_for_status(self):
        if self.status_code >= 400:
            import httpx
            raise httpx.HTTPStatusError(f"{self.status_code}", request=None, response=None)

    def json(self):
        return self._payload


def _patch_client(payload, status=200, record=None):
    class _FakeClient:
        async def __aenter__(self):
            return self

        async def __aexit__(self, *a):
            return False

        async def post(self, url, json=None, params=None, **kw):
            if record is not None:
                record.append((url, json, params))
            return _FakeResp(payload, status)

    agent_mod.httpx.AsyncClient = lambda **kw: _FakeClient()


PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(("  ok   " if cond else "  FAIL ") + name + (f"  <- {detail}" if detail and not cond else ""))


def main():
    # 1) respuesta anidada (contrato real del gateway)
    rec = []
    _patch_client(FAKE_NESTED, record=rec)
    r = asyncio.run(agent_mod.call_agent("hola", session_id="sid-1", visitor_id="v-1"))
    check("extrae reply de respuesta anidada", r["reply"].startswith("Hola, te pas"), r["reply"])
    check("agent_id real (no local-fallback)", r["agent_id"] == "agent-lead", r["agent_id"])
    check("extrae tokens", r["tokens"] == 42, str(r["tokens"]))
    check("usa /a2a/message/send", rec[0][0].endswith("/a2a/message/send"), rec[0][0])
    check("manda agent_id en el body", rec[0][1].get("agent_id") == "agent-lead", str(rec[0][1]))
    check("NO usa /agents/../invoke (ruta 404)", "/invoke" not in rec[0][0], rec[0][0])
    check("latency > 0", r["latency_ms"] >= 0)

    # 2) contrato plano (tolerancia a cambio de API)
    _patch_client(FAKE_FLAT)
    r2 = asyncio.run(agent_mod.call_agent("hola"))
    check("tolera respuesta plana", r2["reply"] == "Respuesta plana.", r2["reply"])

    # 3) LLM degradado por cuota -> fallback curado, nunca el error al usuario
    _patch_client(FAKE_QUOTA)
    r3 = asyncio.run(agent_mod.call_agent("quiero precio"))
    check("cuota agotada cae a fallback", r3["agent_id"] == "local-fallback", r3["agent_id"])
    check("no filtra error 429 al usuario", "429" not in r3["reply"] and "LLM error" not in r3["reply"], r3["reply"])
    check("fallback mantiene intent clasificado", r3["intent"] == "precio", r3["intent"])

    # 4) gateway caído -> fallback
    _patch_client(None, status=503)
    r4 = asyncio.run(agent_mod.call_agent("quiero un logo"))
    check("gateway caído cae a fallback", r4["agent_id"] == "local-fallback", r4["agent_id"])
    check("fallback devuelve las 5 claves", set(r4) == {"reply", "intent", "confidence", "tokens", "latency_ms", "agent_id", "tools_invoked"}, str(sorted(r4)))

    # 5) clasificador
    cases = [("quiero un logo", "branding"), ("precio del sitio", "precio"),
             ("un agente para whatsapp", "ia"), ("hola", "default")]
    for msg, want in cases:
        got, conf = agent_mod.classify_intent(msg)
        check(f"classify '{msg}' -> {want}", got == want and 0 < conf <= 1, f"{got}/{conf}")

    # 6) persona de ventas: el contexto se antepone al mensaje del visitante.
    # Regresión: el widget de ventas respondía como ingeniero porque el gateway
    # A2A no acepta system prompt y el mensaje iba crudo.
    rec2 = []
    _patch_client(FAKE_NESTED, record=rec2)
    asyncio.run(agent_mod.call_agent("¿cuánto cuesta un sitio?", session_id="s", visitor_id="v"))
    sent = rec2[0][1]["message"]
    check("inyecta contexto de ventas", "AdamGráfica" in sent, sent[:80])
    check("conserva mensaje del visitante", "¿cuánto cuesta un sitio?" in sent, sent[-80:])
    check("prohibe responder como ingeniero", "NUNCA respondas como asistente técnico" in sent, sent[:80])

    # 7) el fallback NO debe llevar el contexto (el clasificador local ya responde en rol)
    _patch_client(None, status=503)
    r5 = asyncio.run(agent_mod.call_agent("quiero precio"))
    check("fallback local sin contexto inyectado", r5["agent_id"] == "local-fallback", r5["agent_id"])

    # 8) respuesta fuera de persona (agent-lead con voz de ingeniero) -> copy curado.
    # Es el bug real en producción: la landing comercial respondía como head-of-engineering.
    _patch_client({
        "status": "ok", "agent": "agent-lead",
        "response": {"status": "ok", "agent": "agent-lead",
                     "response": "Entendido. Estoy listo para actuar como agent-lead (head-of-engineering) en ADAM OS. ¿En qué tarea de ingeniería trabajamos?"},
    })
    r6 = asyncio.run(agent_mod.call_agent("¿cuánto cuesta un sitio?"))
    check("voz de ingeniero cae a copy curado", r6["agent_id"] == "local-fallback", r6["agent_id"])
    check("copy curado responde en rol comercial", "$" in r6["reply"] or "AdamGráfica" in r6["reply"] or "agende" in r6["reply"], r6["reply"])
    check("no filtra voz de ingeniero al visitante", "head-of-engineering" not in r6["reply"], r6["reply"])

    # 9) una respuesta realmente en rol NO debe descartarse
    _patch_client({
        "status": "ok", "agent": "agent-lead",
        "response": {"status": "ok", "agent": "agent-lead",
                     "response": "¡Hola! Somos AdamGráfica. El sitio web parte en $1.490.000 CLP con entrega en 4 semanas. ¿Te agendo una reunión?"},
    })
    r7 = asyncio.run(agent_mod.call_agent("¿cuánto cuesta un sitio?"))
    check("respuesta comercial se conserva", r7["agent_id"] == "agent-lead" and "AdamGráfica" in r7["reply"], r7["agent_id"])

    # 10) REGRESIÓN REAL de producción (medida el 2026-09-26): el filtro viejo
    # dejaba pasar la variante "cabeza de ingeniería" y el visitante de la
    # landing recibió voz interna. Estos 12 son las respuestas crudas que el
    # gateway devolvió en vivo; si alguna vuelve a colarse, el bug regresa.
    leaked = [
        "Hola. Soy agent-lead, cabeza de ingeniería de ADAM OS. ¿En qué puedo ayudarte?",
        "Hola. Soy el head-of-engineering de ADAM OS. ¿En qué puedo ayudarte?",
        "Hola. Soy agent-lead, head of engineering de ADAM OS. ¿En qué puedo ayudarte hoy?",
        "Entendido. Soy agent-lead, head-of-engineering de ADAM OS. ¿En qué puedo ayudarte?",
        "Entendido. Soy **agent-lead** del sistema ADAM OS, con rol de **head-of-engineering**.",
        "Entendido. Estoy operativo como agent-lead en el sistema ADAM OS.",
        "Entendido. Estoy operativo como agent-lead dentro de ADAM OS, con rol de head-of-engineering.",
        "Entendido. Estoy operativo como agent-lead de ADAM OS, rol head-of-engineering.",
        "Entendido. Estoy listo para actuar como agent-lead (head-of-engineering) en ADAM OS.",
        "Hola, soy el asistente de engineering de ADAM OS. ¿Cuál es la tarea?",
        "Entendido. Soy el jefe de ingeniería de ADAM OS. ¿Qué construimos hoy?",
        "Aquí habla el director de ingeniería de ADAM OS, ¿en qué te ayudo?",
    ]
    for leak in leaked:
        check(f"bloquea voz interna: {leak[:44]}...",
              agent_mod._is_out_of_persona(leak), "se escapó el filtro")

    # 11) el filtro NO puede comerse copy de venta legítimo: "agentes de IA" es
    # un servicio que vendemos, y AdamGráfica/ADAM OS solo es voz interna.
    clean = [
        "¡Hola! Somos AdamGráfica. El sitio web parte en $1.490.000 CLP.",
        "Hacemos agentes de IA que responden WhatsApp y agendan citas. ¿Tu caso es conversacional?",
        "Branding desde $890K, sitio web desde $1.49M, automatizaciones desde $2.4M. ¿Cuál te interesa?",
        "Cuéntame más. ¿Buscas mejorar imagen (branding), presencia online (web), o automatizar algo (IA)?",
        "Podemos conectar tu web con un agente de IA que atienda a tus clientes las 24 horas.",
    ]
    for ok in clean:
        check(f"NO bloquea copy comercial: {ok[:44]}...",
              not agent_mod._is_out_of_persona(ok), "falso positivo, copy bueno descartado")

    # 12) regresión del leak de producción: voz de operador SIN nombrar la
    # identidad. Ninguna de las dos capas anteriores lo frenaba (no dice
    # "ADAM OS" ni "ingeniería") y llegó crudo al prospecto por HTTP 200.
    framings = [
        "Entendido. Estoy listo para asistir en lo que necesites. ¿Cuál es el primer tema o tarea que abordamos?",
        "Claro. Dime en qué tema o tarea quieres que trabajemos.",
        "Entendido. ¿Cuál es el primer proyecto en que trabajamos juntos?",
    ]
    for leak in framings:
        check(f"bloquea encuadre interno: {leak[:44]}...",
              agent_mod._is_out_of_persona(leak), "se escapó el filtro de framing")

    # 13) y el filtro de framing NO puede comerse "trabajamos/construimos" en
    # copy comercial: esas palabras son legitimas vendiendo diseño.
    for ok in ["Trabajamos con marcas como Starbucks en identidad visual.",
               "¿Qué construimos juntos? Cuéntame de tu negocio."]:
        check(f"NO bloquea copy comercial: {ok[:44]}...",
              not agent_mod._is_out_of_persona(ok), "falso positivo, copy bueno descartado")

    # 14) circuit breaker: medido en producción el 71/71 de las llamadas al
    # gateway (la ventana de journalctl del 3001) terminó en fallback, así que
    # cada mensaje de prospecto pagaba 2-3.5s de espera para recibir el mismo
    # copy curado que el clasificador local devuelve en <5ms. Tras 5 fallos
    # consecutivos el breaker abre y el gateway deja de tocar el hot path.
    agent_mod._reset_a2a_circuit()
    rec3 = []
    _patch_client(None, status=503, record=rec3)
    for i in range(agent_mod.A2A_FAIL_THRESHOLD):
        asyncio.run(agent_mod.call_agent("quiero precio", session_id="s", visitor_id="v"))
    is_open, streak, remaining = agent_mod._a2a_circuit_state()
    check("abre el circuito tras 5 fallos seguidos", is_open, f"streak={streak}")
    check("el streak cuenta los 5 fallos", streak == agent_mod.A2A_FAIL_THRESHOLD, f"streak={streak}")
    calls_before = len(rec3)
    r8 = asyncio.run(agent_mod.call_agent("quiero precio", session_id="s", visitor_id="v"))
    check("con el circuito abierto NO toca el gateway", len(rec3) == calls_before,
          f"hizo {len(rec3) - calls_before} llamadas extra al gateway")
    check("responde igual pero al instante", r8["agent_id"] == "local-fallback"
          and r8["intent"] == "precio" and r8["reply"] == agent_mod.FALLBACK_RESPONSES["precio"],
          str(r8))
    check("latency del fallback abierto es ~0ms", r8["latency_ms"] < 50, f"{r8['latency_ms']}ms")

    # 15) el cooldown expira solo: pasado el tiempo vuelve a intentarlo, y si el
    # gateway se recuperó el streak se limpia. Un breaker que nunca se abre
    # otra vez deja la landing muda para siempre.
    agent_mod._A2A_OPEN_UNTIL = agent_mod.time.time() - 1.0
    rec4 = []
    _patch_client(FAKE_NESTED, record=rec4)
    r9 = asyncio.run(agent_mod.call_agent("¿cuánto cuesta un sitio?", session_id="s", visitor_id="v"))
    check("tras el cooldown vuelve a llamar al gateway", len(rec4) == 1, f"{len(rec4)} llamadas")
    check("y si responde bien, usa la respuesta real", r9["agent_id"] == "agent-lead", r9["agent_id"])
    check("el éxito limpia el streak", agent_mod._a2a_circuit_state()[1] == 0,
          f"streak={agent_mod._a2a_circuit_state()[1]}")
    check("y el circuito queda cerrado", not agent_mod._a2a_circuit_state()[0])

    # 16) un éxito intermedio NO debe abrir el circuito: 4 fallos y un acierto
    # es ruido, no una caída del gateway.
    agent_mod._reset_a2a_circuit()
    _patch_client(None, status=503)
    for _ in range(agent_mod.A2A_FAIL_THRESHOLD - 1):
        asyncio.run(agent_mod.call_agent("quiero precio"))
    _patch_client(FAKE_NESTED)
    asyncio.run(agent_mod.call_agent("¿cuánto cuesta un sitio?"))
    _patch_client(None, status=503)
    asyncio.run(agent_mod.call_agent("quiero precio"))
    check("no abre con 4 fallos + acierto + 1 fallo",
          not agent_mod._a2a_circuit_state()[0], "ruido de red abriendo el circuito")
    agent_mod._reset_a2a_circuit()

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FALLAS: " + ", ".join(FAIL))
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
