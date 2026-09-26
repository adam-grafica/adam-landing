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

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FALLAS: " + ", ".join(FAIL))
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
