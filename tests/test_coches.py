"""
test_coches.py — Tests del catálogo de vehículos y marcas.
"""

import pytest
from conftest import BASE_URL


class TestCatalogoPublico:

    def test_obtener_lista_coches(self, sesion_anonima):
        """El catálogo debe devolver una lista de coches."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/coches")
        assert respuesta.status_code == 200
        coches = respuesta.json()
        assert isinstance(coches, list)
        assert len(coches) > 0

    def test_coches_tienen_campos_obligatorios(self, sesion_anonima):
        """Cada coche debe tener los campos mínimos necesarios."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/coches")
        coches = respuesta.json()
        campos_obligatorios = ["id", "modelo", "precio", "marca_id"]
        for coche in coches[:5]:
            for campo in campos_obligatorios:
                assert campo in coche, f"El coche {coche.get('id')} no tiene el campo '{campo}'"

    def test_obtener_detalle_coche(self, sesion_anonima, primer_coche):
        """El detalle de un coche debe devolver sus datos completos."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/coches/{primer_coche['id']}")
        assert respuesta.status_code == 200
        assert respuesta.json()["id"] == primer_coche["id"]

    def test_coche_inexistente_devuelve_404(self, sesion_anonima):
        """Pedir un coche con ID inexistente debe devolver 404."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/coches/999999")
        assert respuesta.status_code == 404

    def test_coches_incluyen_marca(self, sesion_anonima):
        """Los coches deben incluir los datos de su marca."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/coches")
        coches = respuesta.json()
        coches_con_marca = [c for c in coches if "marca" in c and c["marca"]]
        assert len(coches_con_marca) > 0

    def test_precio_es_numero(self, sesion_anonima):
        """El precio de cada coche debe ser un valor numérico válido."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/coches")
        coches = respuesta.json()
        for coche in coches:
            # Laravel puede devolver el precio como string ("8527000.00") o float
            # Convertimos a float para validar que es un número válido
            try:
                precio = float(coche["precio"])
                assert precio > 0, f"El coche {coche['id']} tiene precio 0 o negativo"
            except (ValueError, TypeError):
                assert False, f"El precio del coche {coche['id']} no es un número válido: {coche['precio']}"


class TestMarcas:

    def test_obtener_lista_marcas(self, sesion_anonima):
        """El listado de marcas debe ser accesible públicamente."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/marcas")
        assert respuesta.status_code == 200
        marcas = respuesta.json()
        assert isinstance(marcas, list)
        assert len(marcas) > 0

    def test_marcas_tienen_nombre(self, sesion_anonima):
        """Cada marca debe tener nombre."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/marcas")
        marcas = respuesta.json()
        for marca in marcas:
            assert "nombre" in marca
            assert len(marca["nombre"]) > 0

    def test_obtener_detalle_marca(self, sesion_anonima):
        """El detalle de una marca debe devolver sus datos."""
        marcas = sesion_anonima.get(f"{BASE_URL}/marcas").json()
        primera = marcas[0]
        respuesta = sesion_anonima.get(f"{BASE_URL}/marcas/{primera['id']}")
        assert respuesta.status_code == 200
        assert respuesta.json()["id"] == primera["id"]

    def test_marca_inexistente_devuelve_404(self, sesion_anonima):
        """Una marca inexistente debe devolver 404."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/marcas/999999")
        assert respuesta.status_code == 404


class TestCRUDCoches:

    def test_admin_puede_crear_coche(self, sesion_admin):
        """El admin puede añadir un nuevo coche al catálogo."""
        marcas = sesion_admin.get(f"{BASE_URL}/marcas").json()
        marca_id = marcas[0]["id"]

        respuesta = sesion_admin.post(f"{BASE_URL}/coches", json={
            "modelo": "Coche Test Pytest",
            "anio": 2024,
            "precio": 99999.99,
            "marca_id": marca_id,
            "combustible": "Gasolina",
            "disponible": True,
        })

        assert respuesta.status_code == 201
        coche = respuesta.json()
        assert coche["modelo"] == "Coche Test Pytest"
        pytest.coche_test_id = coche["id"]

    def test_admin_puede_editar_coche(self, sesion_admin):
        """El admin puede modificar los datos de un coche."""
        if not hasattr(pytest, "coche_test_id"):
            pytest.skip("No hay coche de test creado")

        respuesta = sesion_admin.put(f"{BASE_URL}/coches/{pytest.coche_test_id}", json={
            "precio": 88888.00,
        })
        assert respuesta.status_code == 200

    def test_admin_puede_borrar_coche(self, sesion_admin):
        """El admin puede eliminar un coche del catálogo."""
        if not hasattr(pytest, "coche_test_id"):
            pytest.skip("No hay coche de test creado")

        respuesta = sesion_admin.delete(f"{BASE_URL}/coches/{pytest.coche_test_id}")
        assert respuesta.status_code == 200

        respuesta_check = sesion_admin.get(f"{BASE_URL}/coches/{pytest.coche_test_id}")
        assert respuesta_check.status_code == 404

    def test_cliente_no_puede_borrar_coche(self, sesion_cliente, primer_coche):
        """Un cliente no puede eliminar coches."""
        respuesta = sesion_cliente.delete(f"{BASE_URL}/coches/{primer_coche['id']}")
        assert respuesta.status_code == 403