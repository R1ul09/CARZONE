"""
conftest.py — Configuración global y fixtures compartidas para todos los tests.
"""

import pytest
import requests

BASE_URL = "https://localhost/api"

ADMIN_EMAIL    = "admin@carzone.com"
ADMIN_PASSWORD = "Carzone1234."

EMPLEADO_EMAIL    = "empleado@carzone.com"
EMPLEADO_PASSWORD = "Carzone1234."

CLIENTE_EMAIL    = "cliente@carzone.com"
CLIENTE_PASSWORD = "Carzone1234."


def hacer_sesion() -> requests.Session:
    """Crea una sesión con las cabeceras necesarias para Sanctum SPA."""
    sesion = requests.Session()
    sesion.verify = False
    sesion.headers.update({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Referer": "https://localhost",
        "Origin": "https://localhost",
    })
    return sesion


def login(sesion: requests.Session, email: str, password: str) -> dict:
    """Obtiene el cookie CSRF y hace login. Devuelve los datos del usuario."""
    sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

    respuesta = sesion.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password,
    })

    assert respuesta.status_code == 200, (
        f"Login fallido para {email}: {respuesta.status_code} — {respuesta.text}"
    )

    return respuesta.json()


# ── FIXTURES ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def sesion_anonima():
    """Sesión sin autenticar — para testear rutas públicas."""
    return hacer_sesion()


@pytest.fixture(scope="session")
def sesion_cliente():
    """Sesión autenticada como cliente."""
    sesion = hacer_sesion()
    login(sesion, CLIENTE_EMAIL, CLIENTE_PASSWORD)
    return sesion


@pytest.fixture(scope="session")
def sesion_empleado():
    """Sesión autenticada como empleado."""
    sesion = hacer_sesion()
    login(sesion, EMPLEADO_EMAIL, EMPLEADO_PASSWORD)
    return sesion


@pytest.fixture(scope="session")
def sesion_admin():
    """Sesión autenticada como administrador."""
    sesion = hacer_sesion()
    login(sesion, ADMIN_EMAIL, ADMIN_PASSWORD)
    return sesion


@pytest.fixture(scope="session")
def primer_coche(sesion_anonima):
    """Devuelve el primer coche del catálogo."""
    respuesta = sesion_anonima.get(f"{BASE_URL}/coches")
    coches = respuesta.json()
    assert len(coches) > 0, "No hay coches en la base de datos"
    return coches[0]


@pytest.fixture(scope="session")
def primer_servicio(sesion_anonima):
    """Devuelve el primer servicio disponible."""
    respuesta = sesion_anonima.get(f"{BASE_URL}/servicios")
    servicios = respuesta.json()
    assert len(servicios) > 0, "No hay servicios en la base de datos"
    return servicios[0]