#!/bin/sh

echo ">>> [1/4] Esperando a que MySQL responda..."

# Usamos PHP para intentar conectar a MySQL
until php -r "
    try {
        new PDO(
            'mysql:host=${DB_HOST};port=3306;dbname=${DB_DATABASE}',
            '${DB_USERNAME}',
            '${DB_PASSWORD}'
        );
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null; do
    echo "    MySQL no está listo todavía, reintentando en 3 segundos..."
    sleep 3
done

# Si MySQL se está reiniciando en su primera inicialización (tras down -v), 
# esto evita que Laravel intente migrar a mitad del reinicio.
echo " Dando un breve respiro para la estabilización de MySQL..."
sleep 5

echo ">>> [2/4] MySQL listo y estable."

echo ">>> [3/4] Limpiando cachés viejos de optimización y regenerando autoloader..."
# Forzamos a Laravel a olvidar rutas/configuraciones cacheadas que puedan romper el arranque
php artisan config:clear --no-interaction || true
php artisan cache:clear --no-interaction || true

echo ">>> [3/4] Generando APP_KEY si no existe..."
php artisan key:generate --no-interaction --force

echo ">>> [3/4] Comprobando si la base de datos necesita inicializarse..."

# Contamos las tablas usando PHP y PDO directamente
TABLE_COUNT=$(php -r "
    try {
        \$pdo = new PDO(
            'mysql:host=${DB_HOST};port=3306;dbname=${DB_DATABASE}',
            '${DB_USERNAME}',
            '${DB_PASSWORD}'
        );
        \$stmt = \$pdo->query(\"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${DB_DATABASE}'\");
        echo \$stmt->fetchColumn();
    } catch (Exception \$e) {
        echo 'ERROR';
    }
" 2>/dev/null)

if [ "$TABLE_COUNT" = "0" ] || [ -z "$TABLE_COUNT" ]; then
    echo "Base de datos vacía — ejecutando migrations y seeders..."
    
    # Ejecutamos y comprobamos si el comando fue exitoso
    if php artisan migrate --seed --no-interaction --force; then
        echo "¡Base de datos e inicialización de seeders completada con éxito!"
    else
        echo "[ERROR CRÍTICO] Las migraciones o los seeders fallaron. Revisa los logs de arriba."
    fi

elif [ "$TABLE_COUNT" = "ERROR" ]; then
    echo "[ERROR] No se pudo comprobar el conteo de tablas. Posible fallo de conexión."
else
    echo "La base de datos ya tiene datos (${TABLE_COUNT} tablas), omitiendo migrations."
fi

echo ">>> [4/4] Arrancando Apache..."
exec apache2-foreground