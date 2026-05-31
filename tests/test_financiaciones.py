"""
test_financiaciones.py — Tests del sistema de financiaciones.

Cubre: creación, validaciones, permisos por rol,
y flujo completo de aceptar/denegar.
"""

import pytest
from conftest import BASE_URL


class TestCrearFinanciacion:
    """Tests de creación de solicitudes de financiación."""

    def test_cliente_puede_solicitar_financiacion(self, sesion_cliente, primer_coche):
        """Un cliente autenticado puede solicitar financiación."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/financiaciones", json={
            "coche_id":      primer_coche["id"],
            "meses":         60,
            "cuota_mensual": 1500.00,
            "entrada":       20000.00,
            "interes":       3.9,
        })

        assert respuesta.status_code == 201
        fin = respuesta.json()
        assert fin["estado"] == "pendiente"
        assert fin["coche_id"] == primer_coche["id"]

        # Guardamos el id para los tests siguientes
        pytest.fin_test_id = fin["id"]

    def test_financiacion_sin_coche_es_rechazada(self, sesion_cliente):
        """No se puede crear una financiación sin coche_id."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/financiaciones", json={
            "meses":         60,
            "cuota_mensual": 1500.00,
            "entrada":       20000.00,
            "interes":       3.9,
        })

        assert respuesta.status_code == 422

    def test_financiacion_con_coche_inexistente_es_rechazada(self, sesion_cliente):
        """No se puede crear una financiación con un coche que no existe."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/financiaciones", json={
            "coche_id":      999999,
            "meses":         60,
            "cuota_mensual": 1500.00,
            "entrada":       20000.00,
            "interes":       3.9,
        })

        assert respuesta.status_code == 422

    def test_financiacion_sin_meses_es_rechazada(self, sesion_cliente, primer_coche):
        """No se puede crear una financiación sin indicar los meses."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/financiaciones", json={
            "coche_id":      primer_coche["id"],
            "cuota_mensual": 1500.00,
        })

        assert respuesta.status_code == 422

    def test_anonimo_no_puede_solicitar_financiacion(self, sesion_anonima, primer_coche):
        """Un usuario sin autenticar no puede solicitar financiación."""
        respuesta = sesion_anonima.post(f"{BASE_URL}/financiaciones", json={
            "coche_id":      primer_coche["id"],
            "meses":         60,
            "cuota_mensual": 1500.00,
            "entrada":       20000.00,
            "interes":       3.9,
        })

        assert respuesta.status_code in [401, 403]


class TestListarFinanciaciones:
    """Tests de listado de financiaciones."""

    def test_cliente_ve_sus_financiaciones(self, sesion_cliente):
        """El cliente puede ver sus propias financiaciones."""
        respuesta = sesion_cliente.get(f"{BASE_URL}/financiaciones")

        assert respuesta.status_code == 200
        assert isinstance(respuesta.json(), list)

    def test_empleado_ve_todas_las_financiaciones(self, sesion_empleado):
        """El empleado puede ver todas las financiaciones."""
        respuesta = sesion_empleado.get(f"{BASE_URL}/financiaciones/todas")

        assert respuesta.status_code == 200
        assert isinstance(respuesta.json(), list)

    def test_admin_ve_todas_las_financiaciones(self, sesion_admin):
        """El admin puede ver todas las financiaciones."""
        respuesta = sesion_admin.get(f"{BASE_URL}/financiaciones/todas")

        assert respuesta.status_code == 200
        assert isinstance(respuesta.json(), list)

    def test_cliente_no_puede_ver_todas_las_financiaciones(self, sesion_cliente):
        """Un cliente no puede acceder al listado completo de financiaciones."""
        respuesta = sesion_cliente.get(f"{BASE_URL}/financiaciones/todas")
        assert respuesta.status_code == 403

    def test_financiaciones_tienen_estado(self, sesion_empleado):
        """Cada financiación debe tener un campo estado."""
        respuesta = sesion_empleado.get(f"{BASE_URL}/financiaciones/todas")
        financiaciones = respuesta.json()

        if len(financiaciones) == 0:
            pytest.skip("No hay financiaciones en el sistema")

        estados_validos = ["pendiente", "aceptada", "denegada"]
        for fin in financiaciones:
            assert "estado" in fin
            assert fin["estado"] in estados_validos


class TestResponderFinanciacion:
    """Tests del flujo de aceptar y denegar financiaciones."""

    def test_empleado_puede_aceptar_financiacion(self, sesion_empleado):
        """Un empleado puede aceptar una financiación pendiente."""
        if not hasattr(pytest, "fin_test_id"):
            pytest.skip("No hay financiación de test creada")

        respuesta = sesion_empleado.patch(
            f"{BASE_URL}/financiaciones/{pytest.fin_test_id}/responder",
            json={"estado": "aceptada"}
        )

        assert respuesta.status_code == 200
        assert respuesta.json()["financiacion"]["estado"] == "aceptada"

    def test_cliente_no_puede_responder_financiacion(self, sesion_cliente, sesion_admin, primer_coche):
        """Un cliente no puede aceptar ni denegar financiaciones."""
        # Creamos una financiación nueva para este test
        nueva = sesion_cliente.post(f"{BASE_URL}/financiaciones", json={
            "coche_id":      primer_coche["id"],
            "meses":         48,
            "cuota_mensual": 2000.00,
            "entrada":       15000.00,
            "interes":       3.9,
        })

        if nueva.status_code != 201:
            pytest.skip("No se pudo crear financiación de test")

        fin_id = nueva.json()["id"]

        respuesta = sesion_cliente.patch(
            f"{BASE_URL}/financiaciones/{fin_id}/responder",
            json={"estado": "aceptada"}
        )

        assert respuesta.status_code == 403

        # Limpieza
        sesion_admin.delete(f"{BASE_URL}/financiaciones/{fin_id}")

    def test_estado_invalido_es_rechazado(self, sesion_empleado):
        """Un estado que no sea 'aceptada' o 'denegada' debe ser rechazado."""
        if not hasattr(pytest, "fin_test_id"):
            pytest.skip("No hay financiación de test creada")

        respuesta = sesion_empleado.patch(
            f"{BASE_URL}/financiaciones/{pytest.fin_test_id}/responder",
            json={"estado": "pendiente"}  # No es un estado válido para responder
        )

        assert respuesta.status_code == 422

    def test_admin_puede_denegar_financiacion(self, sesion_admin, sesion_cliente, primer_coche):
        """El admin puede denegar una financiación."""
        # Creamos una financiación nueva
        nueva = sesion_cliente.post(f"{BASE_URL}/financiaciones", json={
            "coche_id":      primer_coche["id"],
            "meses":         36,
            "cuota_mensual": 3000.00,
            "entrada":       10000.00,
            "interes":       3.9,
        })

        if nueva.status_code != 201:
            pytest.skip("No se pudo crear financiación de test")

        fin_id = nueva.json()["id"]

        respuesta = sesion_admin.patch(
            f"{BASE_URL}/financiaciones/{fin_id}/responder",
            json={"estado": "denegada"}
        )

        assert respuesta.status_code == 200
        assert respuesta.json()["financiacion"]["estado"] == "denegada"


class TestEliminarFinanciacion:
    """Tests de eliminación de financiaciones."""

    def test_admin_puede_eliminar_financiacion(self, sesion_admin):
        """El admin puede eliminar una financiación."""
        if not hasattr(pytest, "fin_test_id"):
            pytest.skip("No hay financiación de test creada")

        respuesta = sesion_admin.delete(f"{BASE_URL}/financiaciones/{pytest.fin_test_id}")
        assert respuesta.status_code == 200

    def test_eliminar_financiacion_inexistente_devuelve_404(self, sesion_admin):
        """Eliminar una financiación que no existe debe devolver 404."""
        respuesta = sesion_admin.delete(f"{BASE_URL}/financiaciones/999999")
        assert respuesta.status_code == 404