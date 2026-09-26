"""
Agent service — wraps A2A gateway call.

Fallback chain:
1. A2A gateway (MIDI SOFT) at 127.0.0.1:9900
2. Hardcoded responses si gateway caída
3. WhatsApp handoff si user frustrated
"""
import logging
import re
import time
import httpx
from app.config import settings

log = logging.getLogger(__name__)


# Hardcoded fallback (mismo del ChatAgentBubble.tsx frontend)
FALLBACK_RESPONSES = {
    "branding": "Para branding arrancamos con un diagnóstico de 30 min. ¿Quieres que te agende con el equipo creativo?",
    "web": "Sitios web arrancan en $1.490.000 CLP, entregamos en 4 semanas. ¿Te paso un case de tu industria?",
    "ia": "Hacemos agentes que responden WhatsApp, agendan citas, califican leads. ¿Tu caso es conversacional o interno?",
    "agenda": "Reunión de diagnóstico sin costo, 30 min. Dime qué día te acomoda y te paso los horarios libres para agendar.",
    "precio": "Branding desde $890K, sitio web desde $1.49M, automatizaciones desde $2.4M. ¿Cuál te interesa?",
    "default": "Cuéntame más. ¿Buscas mejorar imagen (branding), presencia online (web), o automatizar algo (IA)?",
}


# Los keywords se buscan como PALABRAS completas, no como substring. Con
# `k in q` bastaba "ia" para capturar "panadería", "policía", "historia",
# "galería", "farmacia" — el 90% del Leads entraba con intent equivocado y
# recibía copy de automatizaciones. Medido: 8/8 falsos positivos.
#
# Dos familias, porque no es lo mismo:
#   _kw()    — palabra exacta: "ia", "agente", "web", "logo"
#   _stem()  — raíz/prefixo: "automat" cubre automatizar/automatización/
#              automatizaciones. Sin_boundary, "automat" matchea "panaderia" otra vez.
_KEYWORD_CACHE: dict[str, re.Pattern[str]] = {}


def _compile(kind: str, keywords: list[str]) -> re.Pattern[str]:
    key = f"{kind}\x00" + "\x00".join(keywords)
    pat = _KEYWORD_CACHE.get(key)
    if pat is None:
        body = "|".join(re.escape(k) for k in keywords)
        if kind == "word":
            pat = re.compile(rf"(?<!\w)(?:{body})(?!\w)", re.IGNORECASE | re.UNICODE)
        else:
            # raíz: debe empezar palabra, pero el resto puede seguir
            pat = re.compile(rf"(?<!\w)(?:{body})\w*", re.IGNORECASE | re.UNICODE)
        _KEYWORD_CACHE[key] = pat
    return pat


def _kw(keywords: list[str]) -> re.Pattern[str]:
    """Regex de palabra completa para un set de keywords (cacheado)."""
    return _compile("word", keywords)


def _stem(keywords: list[str]) -> re.Pattern[str]:
    """Regex de raíz (prefijo de palabra) para un set de keywords (cacheado)."""
    return _compile("stem", keywords)


def classify_intent(message: str) -> tuple[str, float]:
    """Tiny keyword classifier — fallback si A2A no responde."""
    q = message.lower()
    # Precio va primero: "precio del sitio web" debe clasificar como precio,
    # no dejarse ganar por "sitio" de la regla web.
    if _stem(["precio", "cuanto", "cuánto", "cuesta", "valor", "costo", "tarifa"]).search(q):
        return "precio", 0.80
    if _stem(["branding", "marca", "logo"]).search(q):
        return "branding", 0.85
    if _stem(["web", "sitio", "pagina", "página", "landing"]).search(q):
        return "web", 0.85
    if _stem(["ia", "agente", "automat", "whatsapp"]).search(q):
        return "ia", 0.85
    # Agenda va DESPUÉS de ia a propósito: "automatizar el WhatsApp para agendar
    # citas" es una venta de automatización, no un pedido de hora. Y después de
    # precio/branding/web, para no robarle el caso a intenciones más específicas.
    # Antes no existía: un lead que escribía "quiero agendar una reunión" caía en
    # default y recibía "¿buscas branding, web o IA?" — medido 3/3 frases de
    # agenda en default. "cita" usa _kw (palabra completa) y no _stem, porque el
    # prefijo arrastra "citación"/"citadino" a un pedido de hora.
    if _stem(["agend", "reunion", "reunión", "horario", "reserv"]).search(q):
        return "agenda", 0.80
    if _kw(["cita", "citas"]).search(q):
        return "agenda", 0.80
    return "default", 0.50


DEGRADED_MARKERS = (
    "LLM error",
    "Token Plan usage limit",
    "rate_limit",
    "Traceback (most recent call last)",
    "I cannot",
)

# El único agente del gateway con LLM real para este widget es agent-lead, cuyo
# system prompt es "head-of-engineering" y sobrescribe cualquier persona que
# mandemos en el mensaje (verificado: ni framing de rol ni de transcripción lo mueve).
# Si la respuesta vuelve con esa voz, el prospecto está leyendo soporte técnico
# en una landing comercial: se marca degradado y cae al copy curado.
OUT_OF_PERSONA_MARKERS = (
    "head-of-engineering",
    "head of engineering",
    "agente técnico",
    "tarea de ingeniería",
    "tarea técnica",
    "decisión técnica",
    "revisión de código",
    "revision de codigo",
    "arquitectura",
    "incident response",
    "post-mortem",
    "roadmap",
    "depencias",
    "sprint",
    "estoy listo para actuar como",
    "estoy listo para recibir instrucciones",
    "estoy operativo como",
)

# Tercera capa: la voz head-of-engineering también existe SIN nombrar la
# identidad. Medido en producción: "Entendido. Estoy listo para asistir en lo
# que necesites. ¿Cuál es el primer tema o tarea que abordamos?" pasó las dos
# capas anteriores (no dice "ADAM OS" ni "ingeniería") y llegó al prospecto.
# Lo que delata el origen no es la identidad sino la oferta de asistencia
# genérica en clave de "nosotros trabajamos/construimos/abordamos": en copy de
# venta AdamGráfica la segunda persona siempre es el cliente ("te", "tu"), nunca
# un "primer tema o tarea" compartido con un ingeniero.
INTERNAL_FRAMING_MARKERS = (
    "tema o tarea",
    "tarea o tema",
    "que abordamos",
)

# El bug de producción se delata por el par "asistente que ofrece asistencia" +
# "primer tema/tarea" (una cola de trabajo compartida), no por la identidad.
# Deliberadamente NO se listan "trabajamos"/"construimos": son legitimos en copy
# comercial ("Trabajamos con marcas como X") y darian falsos positivos.
INTERNAL_FRAMING_RE = re.compile(
    r"\b(?:cual|qué)\s+es\s+el\s+(?:primer|primer\s+)\s*(?:tema|tarea|proyecto)\b"
    r"|\b(?:el\s+)?primer\s+(?:tema|tarea|proyecto)\s+en\s+(?:que|el\s+que)\s+trabajamos\b"
    r"|\btema\s+o\s+tarea\b",
    re.IGNORECASE,
)

# Segunda capa, estructural: el gateway devuelve texto libre del LLM de un
# agente interno, y las variantes de saludo cambian por temperatura
# ("cabeza de ingeniería", "head of engineering", "soy agent-lead, ..."). Una
# lista de frases exactas se escapaba por delante: se midió 12/12 respuestas
# coladas con el filtro viejo. Estas son palabras que NUNCA aparecen en copy
# de venta de AdamGráfica y que delatan al agente interno.
# NO incluir "agente"/"IA" sueltos: los agentes de IA son un servicio que
# vendemos, y "agentes de IA" es una respuesta legítima.
INTERNAL_IDENTITY_MARKERS = (
    "adam os",
    "agent-lead",
    "agent lead",
    "midisoft-manager",
    "backend-engineer",
    "frontend-engineer",
    "devops-engineer",
    "qa-engineer",
    "ml-engineer",
    "cabeza de ingenier",
    "jefe de ingenier",
    "director de ingenier",
    "líder de ingenier",
    "lider de ingenier",
    "ingeniería de software",
    "ingenieria de software",
)

# Saludos de auto-presentación: el visitante no preguntó quién eres, así que
# cualquier "soy <identidad>" al arrancar es un agente, no un vendedor.
SELF_INTRO_RE = re.compile(
    r"\b(?:soy|habla|te habla|aquí\s+(?:habla|es))\s+"
    r"(?:el\s+|la\s+|un\s+|una\s+)?"
    r"[\w*\-]+(?:\s*\([^)]*\))?\s*[,.]?\s*"
    r"(?:el\s+|la\s+|de\s+)?[\w\- ]*"
    r"(?:ingenier|ingenierí|ADAM OS|agent)",
    re.IGNORECASE,
)


def _is_degraded(reply: str) -> bool:
    """True si el agente respondió, pero con un error del LLM en vez de contenido real."""
    low = reply.lower()
    return any(m.lower() in low for m in DEGRADED_MARKERS)


def _is_out_of_persona(reply: str) -> bool:
    """True si agent-lead respondió con voz de ingeniero en vez de vendedor."""
    low = reply.lower()
    if any(m.lower() in low for m in OUT_OF_PERSONA_MARKERS):
        return True
    if any(m in low for m in INTERNAL_IDENTITY_MARKERS):
        return True
    if any(m in low for m in INTERNAL_FRAMING_MARKERS):
        return True
    if INTERNAL_FRAMING_RE.search(reply):
        return True
    return bool(SELF_INTRO_RE.search(reply))


def _extract_reply(data: dict) -> str | None:
    """
    El gateway anida la respuesta del agente: {"response": {"response": "..."}}.
    Acepta también plano por si el contrato cambia.
    """
    node = data.get("response", data)
    if isinstance(node, dict):
        for key in ("response", "reply", "text", "content", "message"):
            val = node.get(key)
            if isinstance(val, str) and val.strip():
                return val
    elif isinstance(node, str) and node.strip():
        return node
    return None


def _extract_tokens(data: dict) -> int | None:
    node = data.get("response", data)
    usage = node.get("usage", {}) if isinstance(node, dict) else {}
    for key in ("total_tokens", "totalTokens"):
        if isinstance(usage, dict) and isinstance(usage.get(key), int):
            return usage[key]
    return None


# Circuit breaker para la ruta A2A. Medido en producción: el 71/71 de las
# llamadas de la última ventana devolvieron voz de head-of-engineering y
# cayó al copy curado, o sea que el gateway no aporta NADA al widget y cada
# mensaje de prospecto paga 2-3.5s de espera (timeout efectivo) para recibir
# el mismo texto que le daría el clasificador local al instante.
#
# El bug de negocio es la latencia, no sólo el copy: un prospecto que escribe
# "quiero precios" y tarda 3 segundos en ver la respuesta se va. Con el breaker
# abierto el primer mensaje tras el cooldown decide, y mientras esté abierto
# el clasificador local responde en <5ms.
_A2A_FAIL_STREAK = 0
_A2A_OPEN_UNTIL = 0.0
A2A_FAIL_THRESHOLD = 5
A2A_COOLDOWN_SECONDS = 300.0


def _a2a_circuit_state() -> tuple[bool, int, float]:
    """(abierto, streak, segundos restantes de cooldown)."""
    remaining = _A2A_OPEN_UNTIL - time.time()
    return remaining > 0, _A2A_FAIL_STREAK, max(0.0, remaining)


def _a2a_record_success() -> None:
    global _A2A_FAIL_STREAK, _A2A_OPEN_UNTIL
    _A2A_FAIL_STREAK = 0
    _A2A_OPEN_UNTIL = 0.0


def _a2a_record_failure() -> None:
    global _A2A_FAIL_STREAK, _A2A_OPEN_UNTIL
    _A2A_FAIL_STREAK += 1
    if _A2A_FAIL_STREAK >= A2A_FAIL_THRESHOLD:
        _A2A_OPEN_UNTIL = time.time() + A2A_COOLDOWN_SECONDS
        log.warning(
            "A2A circuit OPEN for %.0fs after %d consecutive failures "
            "(landing chat will answer locally)",
            A2A_COOLDOWN_SECONDS, _A2A_FAIL_STREAK,
        )


def _reset_a2a_circuit() -> None:
    """Solo para tests."""
    global _A2A_FAIL_STREAK, _A2A_OPEN_UNTIL
    _A2A_FAIL_STREAK = 0
    _A2A_OPEN_UNTIL = 0.0


async def call_agent(
    message: str,
    session_id: str | None = None,
    visitor_id: str = "",
) -> dict:
    """
    Call A2A gateway. Falls back to local responses on failure.

    Returns dict with keys: reply, intent, confidence, latency_ms, agent_id.
    """
    start = time.perf_counter()

    # Ruta A2A apagada por config (local-first, ver config.a2a_enabled): no se
    # toca la red. El breaker sigue protegiendo el caso en que se reactive.
    if not settings.a2a_enabled:
        intent, confidence = classify_intent(message)
        return {
            "reply": FALLBACK_RESPONSES[intent],
            "intent": intent,
            "confidence": confidence,
            "tokens": None,
            "latency_ms": int((time.perf_counter() - start) * 1000),
            "agent_id": "local-fallback",
            "tools_invoked": [],
        }

    is_open, streak, remaining = _a2a_circuit_state()
    if is_open:
        log.info("A2A circuit open (%.0fs left), answering locally", remaining)
        intent, confidence = classify_intent(message)
        return {
            "reply": FALLBACK_RESPONSES[intent],
            "intent": intent,
            "confidence": confidence,
            "tokens": None,
            "latency_ms": int((time.perf_counter() - start) * 1000),
            "agent_id": "local-fallback",
            "tools_invoked": [],
        }

    # Try the gateway.
    # Canonical A2A endpoint is POST /a2a/message/send (not /agents/{id}/invoke,
    # which does not exist on ms-a2a-gateway and returned a silent 404).
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                f"{settings.a2a_gateway_url}/a2a/message/send",
                json={
                    "agent_id": settings.a2a_agent_id,
                    "message": f"{settings.a2a_context}\n\nMensaje del visitante: {message}",
                    "from": "adamgrafica-landing-v2",
                },
                params={"session_id": session_id, "visitor_id": visitor_id} if session_id else None,
            )
            resp.raise_for_status()
            data = resp.json()
            reply = _extract_reply(data)
            if reply is None:
                raise ValueError(f"A2A response missing reply field: {list(data)}")
            if _is_degraded(reply):
                # Agent reached the gateway but its LLM is down (429/quota/fallback
                # string). Treat as a gateway failure so the user gets the curated copy.
                raise RuntimeError(f"A2A agent degraded: {reply[:120]}")
            if _is_out_of_persona(reply):
                # El visitante escribió a una landing comercial y recibió voz de
                # ingeniero. Copy curado > respuesta fuera de rol.
                raise RuntimeError(f"A2A agent out of persona: {reply[:120]}")
            latency = int((time.perf_counter() - start) * 1000)
            _a2a_record_success()
            return {
                "reply": reply,
                "intent": "a2a",
                "confidence": None,
                "tokens": _extract_tokens(data),
                "latency_ms": latency,
                "agent_id": data.get("agent", settings.a2a_agent_id),
                "tools_invoked": [],
            }
    except Exception as e:
        _a2a_record_failure()
        log.warning(f"A2A gateway unavailable ({type(e).__name__}: {e}), using fallback")

    # Fallback: local classifier
    intent, confidence = classify_intent(message)
    latency = int((time.perf_counter() - start) * 1000)
    return {
        "reply": FALLBACK_RESPONSES[intent],
        "intent": intent,
        "confidence": confidence,
        "tokens": None,
        "latency_ms": latency,
        "agent_id": "local-fallback",
        "tools_invoked": [],
    }