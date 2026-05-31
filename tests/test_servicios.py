"""
test_servicios.py — Tests del endpoint de servicios.

Cubre: acceso público, CRUD del admin y validaciones.
"""

import pytest
from conftest import BASE_URL


class TestServiciosPublicos:
    """Tests de acceso público a los servicios."""

    def test_obtener_lista_servicios(self, sesion_anonima):
        """El listado de servicios es público."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/servicios")

        assert respuesta.status_code == 200
        servicios = respuesta.json()
        assert isinstance(servicios, list)
        assert len(servicios) > 0

    def test_servicios_tienen_nombre_y_precio(self, sesion_anonima):
        """Cada servicio debe tener nombre y precio."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/servicios")
        servicios = respuesta.json()

        for servicio in servicios:
            assert "nombre" in servicio
            assert "precio" in servicio
            assert len(servicio["nombre"]) > 0


class TestCRUDServicios:
    """Tests de creación, edición y borrado de servicios (solo admin)."""

    def test_admin_puede_crear_servicio(self, sesion_admin):
        """El admin puede crear un nuevo servicio."""
        respuesta = sesion_admin.post(f"{BASE_URL}/servicios", json={
            "nombre":      "Servicio Test Pytest",
            "descripcion": "Servicio creado por test automatizado",
            "precio":      99.99,
        })

        assert respuesta.status_code == 201
        servicio = respuesta.json()
        assert servicio["nombre"] == "Servicio Test Pytest"

        pytest.servicio_test_id = servicio["id"]

    def test_admin_puede_editar_servicio(self, sesion_admin):
        """El admin puede modificar un servicio existente."""
        if not hasattr(pytest, "servicio_test_id"):
            pytest.skip("No hay servicio de test creado")

        respuesta = sesion_admin.put(
            f"{BASE_URL}/servicios/{pytest.servicio_test_id}",
            json={"precio": 149.99}
        )

        assert respuesta.status_code == 200

    def test_cliente_no_puede_crear_servicio(self, sesion_cliente):
        """Un cliente no puede crear servicios."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/servicios", json={
            "nombre": "Servicio No Autorizado",
            "precio": 0,
        })

        assert respuesta.status_code == 403

    def test_empleado_no_puede_crear_servicio(self, sesion_empleado):
        """Un empleado no puede crear servicios."""
        respuesta = sesion_empleado.post(f"{BASE_URL}/servicios", json={
            "nombre": "Servicio No Autorizado",
            "precio": 0,
        })

        assert respuesta.status_code == 403

    def test_admin_puede_borrar_servicio(self, sesion_admin):
        """El admin puede eliminar un servicio."""
        if not hasattr(pytest, "servicio_test_id"):
            pytest.skip("No hay servicio de test creado")

        respuesta = sesion_admin.delete(f"{BASE_URL}/servicios/{pytest.servicio_test_id}")
        assert respuesta.status_code == 200