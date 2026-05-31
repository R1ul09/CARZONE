"""
test_auth.py — Tests de autenticación y gestión de usuarios.
"""

import pytest
import uuid
from conftest import BASE_URL, hacer_sesion, login, ADMIN_EMAIL, ADMIN_PASSWORD, CLIENTE_EMAIL, CLIENTE_PASSWORD


class TestLogin:

    def test_login_correcto(self):
        """Un usuario con credenciales correctas debe poder loguearse."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        # Usamos admin porque siempre tiene el email verificado
        respuesta = sesion.post(f"{BASE_URL}/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        })

        assert respuesta.status_code == 200
        datos = respuesta.json()
        assert "user" in datos
        assert datos["user"]["email"] == ADMIN_EMAIL

    def test_login_password_incorrecta(self):
        """Credenciales incorrectas deben devolver 401 o 422."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/login", json={
            "email": ADMIN_EMAIL,
            "password": "contraseña_incorrecta",
        })

        assert respuesta.status_code in [401, 422]

    def test_login_email_inexistente(self):
        """Un email que no existe debe devolver error."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/login", json={
            "email": "noexiste@carzone.com",
            "password": "Carzone1234.",
        })

        assert respuesta.status_code in [401, 422]

    def test_login_sin_email(self):
        """Login sin email debe devolver error de validación."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/login", json={
            "password": "Carzone1234.",
        })

        assert respuesta.status_code == 422

    def test_login_sin_password(self):
        """Login sin password debe devolver error de validación."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/login", json={
            "email": ADMIN_EMAIL,
        })

        assert respuesta.status_code == 422


class TestRegistro:

    def test_registro_correcto(self):
        """Un usuario nuevo debe poder registrarse correctamente."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        email_unico = f"test_{uuid.uuid4().hex[:8]}@carzone.com"

        respuesta = sesion.post(f"{BASE_URL}/register", json={
            "name": "Usuario Test",
            "email": email_unico,
            "password": "Test1234!",
            "password_confirmation": "Test1234!",
        })

        # Aceptamos 200 o 201 — depende de la versión de Breeze
        assert respuesta.status_code in [200, 201]
        datos = respuesta.json()
        assert "user" in datos
        assert datos["user"]["email"] == email_unico

    def test_registro_email_duplicado(self):
        """Registrarse con un email ya existente debe devolver error."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/register", json={
            "name": "Admin Test",
            "email": ADMIN_EMAIL,
            "password": "Test1234!",
            "password_confirmation": "Test1234!",
        })

        assert respuesta.status_code == 422

    def test_registro_password_debil(self):
        """Una contraseña débil debe ser rechazada."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/register", json={
            "name": "Usuario Test",
            "email": f"test_{uuid.uuid4().hex[:8]}@carzone.com",
            "password": "1234",
            "password_confirmation": "1234",
        })

        assert respuesta.status_code == 422

    def test_registro_sin_nombre(self):
        """Registro sin nombre debe devolver error de validación."""
        sesion = hacer_sesion()
        sesion.get("https://localhost/sanctum/csrf-cookie", verify=False)

        respuesta = sesion.post(f"{BASE_URL}/register", json={
            "email": f"test_{uuid.uuid4().hex[:8]}@carzone.com",
            "password": "Test1234!",
            "password_confirmation": "Test1234!",
        })

        assert respuesta.status_code == 422


class TestAccesoProtegido:

    def test_citas_requiere_autenticacion(self, sesion_anonima):
        """Un usuario no autenticado no puede ver citas."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/citas")
        assert respuesta.status_code in [401, 403]

    def test_financiaciones_requiere_autenticacion(self, sesion_anonima):
        """Un usuario no autenticado no puede ver financiaciones."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/financiaciones")
        assert respuesta.status_code in [401, 403]

    def test_panel_admin_requiere_autenticacion(self, sesion_anonima):
        """Un usuario no autenticado no puede acceder al panel de admin."""
        respuesta = sesion_anonima.get(f"{BASE_URL}/users")
        assert respuesta.status_code in [401, 403]


class TestPermisos:

    def test_cliente_no_puede_ver_todos_los_usuarios(self, sesion_cliente):
        """Un cliente no puede acceder al listado de usuarios."""
        respuesta = sesion_cliente.get(f"{BASE_URL}/users")
        assert respuesta.status_code == 403

    def test_cliente_no_puede_ver_todas_las_citas(self, sesion_cliente):
        """Un cliente no puede ver las citas de otros usuarios."""
        respuesta = sesion_cliente.get(f"{BASE_URL}/citas/todas")
        assert respuesta.status_code == 403

    def test_empleado_puede_ver_todas_las_citas(self, sesion_empleado):
        """Un empleado sí puede ver todas las citas."""
        respuesta = sesion_empleado.get(f"{BASE_URL}/citas/todas")
        assert respuesta.status_code == 200

    def test_admin_puede_ver_todos_los_usuarios(self, sesion_admin):
        """Un admin puede ver el listado completo de usuarios."""
        respuesta = sesion_admin.get(f"{BASE_URL}/users")
        assert respuesta.status_code == 200
        assert isinstance(respuesta.json(), list)

    def test_cliente_no_puede_crear_marcas(self, sesion_cliente):
        """Un cliente no puede crear marcas."""
        respuesta = sesion_cliente.post(f"{BASE_URL}/marcas", json={
            "nombre": "MarcaTest",
            "slogan": "Test",
        })
        assert respuesta.status_code == 403

    def test_empleado_no_puede_crear_marcas(self, sesion_empleado):
        """Un empleado tampoco puede crear marcas."""
        respuesta = sesion_empleado.post(f"{BASE_URL}/marcas", json={
            "nombre": "MarcaTest",
            "slogan": "Test",
        })
        assert respuesta.status_code == 403