"""Local-first: con A2A_ENABLED apagado el widget no toca el gateway.

Contexto (2026-09-26): el gateway :9900 corre desde un directorio borrado, su
unidad systemd es not-found y Restart=no, asi que puede desaparecer y no volver.
Con el breaker como unica proteccion, la caida se descubre tarde: el visitante
paga 1-3.7s por mensaje y hacen falta 5 mensajes para abrir el circuito.

Estos tests fijan que con a2a_enabled=False la ruta A2A no se invoca NUNCA, ni
siendo el gateway lento, ni errando, ni devolviendo basura. Runner propio con
check(), no pytest: PYTHONPATH=. ./.venv/bin/python scripts/test_a2a_disabled.py
"""
import asyncio
import sys

sys.path.insert(0, ".")

from app.config import settings
from app.services import agent as agent_mod
from app.services.agent import call_agent


def check(name: str, cond: bool, detail: str = "") -> bool:
    print(f"{'PASS' if cond else 'FAIL'}: {name}" + (f" ({detail})" if detail else ""))
    return cond


async def main() -> int:
    results = []

    # 0. Default de config: apagado. Si esto cambia, el widget vuelve a
    # depender de un gateway que no se puede relanzar.
    results.append(check(
        "a2a_enabled default OFF en config",
        settings.a2a_enabled is False,
        f"a2a_enabled={settings.a2a_enabled}",
    ))

    called = {"n": 0}
    orig_post = None

    # 1. Con la ruta apagada, un POST al gateway = test fallando.
    class _Boom:
        def __init__(self, *a, **k):
            called["n"] += 1
            raise AssertionError("call_agent intentó llamar al gateway con a2a_enabled=False")

    try:
        import httpx
        orig_post = httpx.AsyncClient.post
        setattr(httpx.AsyncClient, "post", _Boom)
    except Exception as e:  # pragma: no cover
        results.append(check("poder monkeypatchear httpx", False, repr(e)))
        return 1

    try:
        r = await call_agent("quiero precios de una landing page", session_id=None)
        results.append(check("responde con a2a apagado", bool(r.get("reply")), r.get("agent_id", "?")))
        results.append(check("agent_id=local-fallback", r.get("agent_id") == "local-fallback"))
        results.append(check("NO llamó al gateway", called["n"] == 0, f"post calls={called['n']}"))

        # 2. Latencia: sin espera de red. La regresión que justificaba esto.
        import time
        t0 = time.perf_counter()
        for _ in range(5):
            await call_agent("quiero precios", session_id=None)
        per = (time.perf_counter() - t0) / 5
        results.append(check(
            "responde en <100ms por mensaje (sin red)",
            per < 0.100,
            f"{per*1000:.1f} ms/prompt",
        ))

        # 3. No toca el breaker: con la ruta apagada no hay fallos que contar.
        is_open, streak, _ = agent_mod._a2a_circuit_state()
        results.append(check(
            "el breaker no se ensucia con la ruta apagada",
            streak == 0 and not is_open,
            f"streak={streak} open={is_open}",
        ))
    finally:
        setattr(httpx.AsyncClient, "post", orig_post)

    # 4. La ruta sigue viva si alguien la reactiva: el codigo de gateway
    #    debe seguir siendo alcanzable con a2a_enabled=True.
    agent_mod._reset_a2a_circuit()
    old = settings.a2a_enabled
    settings.a2a_enabled = True
    try:
        import httpx

        async def _fake_post(self, url, **kw):
            class _R:
                status_code = 200

                def raise_for_status(self):
                    return None

                def json(self):
                    return {"reply": "Con gusto te cotizo la landing, ¿qué necesitas?",
                            "agent": "agent-lead"}
            return _R()

        orig = httpx.AsyncClient.post
        setattr(httpx.AsyncClient, "post", _fake_post)
        try:
            r = await call_agent("quiero precios", session_id=None)
            ok = r.get("agent_id") == "agent-lead" and "cotizo" in r.get("reply", "")
            results.append(check("A2A_ENABLED=1 vuelve a usar el gateway", ok,
                                 f"agent_id={r.get('agent_id')}"))
        finally:
            setattr(httpx.AsyncClient, "post", orig)
    finally:
        settings.a2a_enabled = old

    passed = sum(1 for r in results if r)
    print(f"\n{passed}/{len(results)} checks pasaron")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
