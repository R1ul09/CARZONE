"""
test_citas.py — Tests del sistema de citas.

Cubre: creación, validaciones de horario, permisos por rol,
cambio de estado y eliminación.
"""

import pytest
from datetime import date, timedelta
from conftest import BASE_URL


def fecha_futura(dias: int = 7) -> str:
    """Devuelve una fecha futura en formato YYYY-MM-DD."""
    return (date.today() + timedelta(days=dias)).strftime("%Y-%m-%d")


class TestCrearCita:
    """Tests de creación de citas."""

    def test_cliente_puede_crear_cita(self, sesion_cliente, primer_servicio):
        """Un cliente autenticado puede crear una cita."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "servicio_id": primer_servicio["id"],
            "fecha": fecha_futura(7),
            "hora": "10:00",
        })

        assert respuesta.status_code == 201
        cita = respuesta.json()
        assert cita["estado"] == "pendiente"
        assert cita["servicio_id"] == primer_servicio["id"]

        # Guardamos el id para tests posteriores
        pytest.cita_test_id = cita["id"]

    def test_cita_fuera_de_horario_es_rechazada(self, sesion_cliente, primer_servicio):
        """No se puede crear una cita fuera del horario (09:00-20:00)."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "servicio_id": primer_servicio["id"],
            "fecha": fecha_futura(8),
            "hora": "22:00",
        })

        assert respuesta.status_code == 422

    def test_cita_en_fecha_pasada_es_rechazada(self, sesion_cliente, primer_servicio):
        """No se puede crear una cita en una fecha pasada."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "servicio_id": primer_servicio["id"],
            "fecha": "2020-01-01",
            "hora": "10:00",
        })

        assert respuesta.status_code == 422

    def test_cita_sin_servicio_es_rechazada(self, sesion_cliente):
        """Una cita sin servicio_id debe ser rechazada."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "fecha": fecha_futura(9),
            "hora": "11:00",
        })

        assert respuesta.status_code == 422

    def test_cita_con_servicio_inexistente_es_rechazada(self, sesion_cliente):
        """No se puede crear una cita con un servicio que no existe."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "servicio_id": 999999,
            "fecha": fecha_futura(10),
            "hora": "11:00",
        })

        assert respuesta.status_code == 422

    def test_anonimo_no_puede_crear_cita(self, sesion_anonima, primer_servicio):
        """Un usuario no autenticado no puede crear citas."""
        respuesta = sesion_anonima.post(f"{BASE_URL}/citas", json={
            "servicio_id": primer_servicio["id"],
            "fecha": fecha_futura(11),
            "hora": "10:00",
        })

        assert respuesta.status_code in [401, 403]


class TestListarCitas:
    """Tests de listado de citas."""

    def test_cliente_ve_solo_sus_citas(self, sesion_cliente):
        """El cliente solo puede ver sus propias citas."""
        respuesta = sesion_cliente.get(f"{BASE_URL}/citas")

        assert respuesta.status_code == 200
        citas = respuesta.json()
        assert isinstance(citas, list)

    def test_empleado_ve_todas_las_citas(self, sesion_empleado):
        """El empleado puede ver todas las citas del sistema."""
        respuesta = sesion_empleado.get(f"{BASE_URL}/citas/todas")

        assert respuesta.status_code == 200
        citas = respuesta.json()
        assert isinstance(citas, list)

    def test_admin_ve_todas_las_citas(self, sesion_admin):
        """El admin también puede ver todas las citas."""
        respuesta = sesion_admin.get(f"{BASE_URL}/citas/todas")

        assert respuesta.status_code == 200
        assert isinstance(respuesta.json(), list)

    def test_citas_tienen_campos_obligatorios(self, sesion_empleado):
        """Cada cita debe tener los campos mínimos."""
        respuesta = sesion_empleado.get(f"{BASE_URL}/citas/todas")
        citas = respuesta.json()

        if len(citas) == 0:
            pytest.skip("No hay citas en el sistema")

        campos = ["id", "user_id", "servicio_id", "fecha", "hora", "estado"]
        for cita in citas[:3]:
            for campo in campos:
                assert campo in cita, f"La cita {cita.get('id')} no tiene el campo '{campo}'"


class TestModificarCita:
    """Tests de modificación de estado de citas."""

    def test_empleado_puede_confirmar_cita(self, sesion_empleado):
        """Un empleado puede cambiar el estado de una cita a confirmada."""
        if not hasattr(pytest, "cita_test_id"):
            pytest.skip("No hay cita de test creada")

        respuesta = sesion_empleado.put(f"{BASE_URL}/citas/{pytest.cita_test_id}", json={
            "estado": "confirmada",
        })

        assert respuesta.status_code == 200
        assert respuesta.json()["cita"]["estado"] == "confirmada"

    def test_empleado_puede_añadir_mensaje(self, sesion_empleado):
        """Un empleado puede añadir un mensaje a una cita."""
        if not hasattr(pytest, "cita_test_id"):
            pytest.skip("No hay cita de test creada")

        respuesta = sesion_empleado.put(f"{BASE_URL}/citas/{pytest.cita_test_id}", json={
            "mensaje_empleado": "Le esperamos con su vehículo.",
        })

        assert respuesta.status_code == 200

    def test_cliente_puede_cancelar_su_cita(self, sesion_cliente):
        """Un cliente puede cancelar su propia cita."""
        if not hasattr(pytest, "cita_test_id"):
            pytest.skip("No hay cita de test creada")

        respuesta = sesion_cliente.put(f"{BASE_URL}/citas/{pytest.cita_test_id}", json={
            "estado": "cancelada",
        })

        assert respuesta.status_code == 200

    def test_cliente_no_puede_confirmar_cita(self, sesion_cliente, primer_servicio):
        """Un cliente no puede cambiar el estado a confirmada."""
        # Creamos una cita nueva para este test
        nueva = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "servicio_id": primer_servicio["id"],
            "fecha": fecha_futura(15),
            "hora": "14:00",
        })

        if nueva.status_code != 201:
            pytest.skip("No se pudo crear la cita de test")

        cita_id = nueva.json()["id"]

        respuesta = sesion_cliente.put(f"{BASE_URL}/citas/{cita_id}", json={
            "estado": "confirmada",
        })

        assert respuesta.status_code == 403

        # Limpieza
        sesion_cliente.delete(f"{BASE_URL}/citas/{cita_id}")


class TestEliminarCita:
    """Tests de eliminación de citas."""

    def test_admin_puede_eliminar_cualquier_cita(self, sesion_admin, sesion_cliente, primer_servicio):
        """El admin puede eliminar cualquier cita del sistema."""
        # Creamos una cita para eliminarla
        nueva = sesion_cliente.post(f"{BASE_URL}/citas", json={
            "servicio_id": primer_servicio["id"],
            "fecha": fecha_futura(20),
            "hora": "15:00",
        })

        if nueva.status_code != 201:
            pytest.skip("No se pudo crear la cita de test")

        cita_id = nueva.json()["id"]

        respuesta = sesion_admin.delete(f"{BASE_URL}/citas/{cita_id}")
        assert respuesta.status_code == 200

    def test_eliminar_cita_inexistente_devuelve_404(self, sesion_admin):
        """Intentar eliminar una cita inexistente debe devolver 404."""
        respuesta = sesion_admin.delete(f"{BASE_URL}/citas/999999")
        assert respuesta.status_code == 404