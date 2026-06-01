"""
conftest.py — Configuración global y fixtures compartidas para todos los tests.

El frontend Angular usa cookies SPA (Sanctum stateful).
Los tests usan tokens de API (Sanctum stateless) porque corren fuera del navegador
y las cookies HttpOnly no funcionan correctamente en clientes externos como requests.
Ambos métodos coexisten sin problema — son rutas independientes.
"""

import pytest
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://localhost/api"

ADMIN_EMAIL    = "admin@carzone.com"
ADMIN_PASSWORD = "Carzone1234."

EMPLEADO_EMAIL    = "empleado@carzone.com"
EMPLEADO_PASSWORD = "Carzone1234."

CLIENTE_EMAIL    = "cliente@carzone.com"
CLIENTE_PASSWORD = "Carzone1234."


def hacer_sesion() -> requests.Session:
    """Crea una sesión base sin autenticar."""
    sesion = requests.Session()
    sesion.verify = False
    sesion.headers.update({
        "Accept": "application/json",
        "Content-Type": "application/json",
    })
    return sesion


def login_con_token(email: str, password: str) -> requests.Session:
    """
    Hace login obteniendo un token de API de Sanctum.
    Devuelve una sesión con el token en la cabecera Authorization.
    """
    sesion = hacer_sesion()

    respuesta = sesion.post(f"{BASE_URL}/login-token", json={
        "email": email,
        "password": password,
    })

    assert respuesta.status_code == 200, (
        f"Login fallido para {email}: {respuesta.status_code} — {respuesta.text}"
    )

    token = respuesta.json().get("token")
    assert token, f"No se recibió token para {email}"

    sesion.headers.update({"Authorization": f"Bearer {token}"})
    return sesion


# ── FIXTURES ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def sesion_anonima():
    """Sesión sin autenticar."""
    return hacer_sesion()


@pytest.fixture(scope="session")
def sesion_cliente():
    """Sesión autenticada como cliente con token."""
    return login_con_token(CLIENTE_EMAIL, CLIENTE_PASSWORD)


@pytest.fixture(scope="session")
def sesion_empleado():
    """Sesión autenticada como empleado con token."""
    return login_con_token(EMPLEADO_EMAIL, EMPLEADO_PASSWORD)


@pytest.fixture(scope="session")
def sesion_admin():
    """Sesión autenticada como administrador con token."""
    return login_con_token(ADMIN_EMAIL, ADMIN_PASSWORD)


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