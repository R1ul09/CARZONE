<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coche;
use App\Models\Servicio;
use Gemini\Laravel\Facades\Gemini;

class ChatbotController extends Controller
{
    public function procesarMensaje(Request $request)
    {
        $mensajeUsuario = $request->input('mensaje');
        $historial = $request->input('historial', []);

        $coches = Coche::with(['marca', 'financiacion'])->get();

        $catalogoTexto = "CATÁLOGO DE VEHÍCULOS EN STOCK:\n";
        foreach ($coches as $coche) {
            $marca = $coche->marca ? $coche->marca->nombre : 'Marca Desconocida';
            $disponible = $coche->disponible ? 'Disponible' : 'No disponible';
            $destacado = $coche->destacado  ? ' Destacado' : '';

            $catalogoTexto .= "\n--- {$marca} {$coche->modelo} ({$coche->anio}) ---\n";
            $catalogoTexto .= "  Precio: {$coche->precio}€ | Estado: {$disponible}{$destacado}\n";

            // Ficha técnica
            $ficha = [];
            if ($coche->potencia) $ficha[] = "Potencia: {$coche->potencia} CV";
            if ($coche->par_motor) $ficha[] = "Par motor: {$coche->par_motor} Nm";
            if ($coche->velocidad_max) $ficha[] = "Vel. máx: {$coche->velocidad_max} km/h";
            if ($coche->aceleracion) $ficha[] = "0-100: {$coche->aceleracion}s";
            if ($coche->combustible) $ficha[] = "Combustible: {$coche->combustible}";
            if ($coche->transmision) $ficha[] = "Transmisión: {$coche->transmision}";
            if ($coche->traccion) $ficha[] = "Tracción: {$coche->traccion}";
            if ($coche->num_plazas) $ficha[] = "Plazas: {$coche->num_plazas}";
            if ($coche->num_puertas) $ficha[] = "Puertas: {$coche->num_puertas}";
            if ($coche->tipo_carroceria) $ficha[] = "Carrocería: {$coche->tipo_carroceria}";
            if ($coche->color) $ficha[] = "Color: {$coche->color}";

            if (!empty($ficha)) {
                $catalogoTexto .= "  " . implode(' | ', $ficha) . "\n";
            }

            if ($coche->descripcion) {
                $catalogoTexto .= "  Descripción: {$coche->descripcion}\n";
            }

            // Financiación si existe
            if ($coche->financiacion) {
                $f = $coche->financiacion;
                $catalogoTexto .= "  Financiación: desde {$f->cuota_mensual}€/mes a {$f->meses} meses";
                if ($f->entrada)  $catalogoTexto .= " (entrada {$f->entrada}€)";
                if ($f->interes)  $catalogoTexto .= " al {$f->interes}% TIN";
                $catalogoTexto .= "\n";
            }
        }

        $servicios = Servicio::all();
        $serviciosTexto = "\nSERVICIOS QUE OFRECEMOS:\n";
        foreach ($servicios as $servicio) {
            $serviciosTexto .= "- {$servicio->nombre}";
            if ($servicio->precio) $serviciosTexto .= " ({$servicio->precio}€)";
            if ($servicio->descripcion) $serviciosTexto .= ": {$servicio->descripcion}";
            $serviciosTexto .= "\n";
        }

        $historialTexto = "";
        foreach ($historial as $msg) {
            $rol = $msg['esUsuario'] ? 'Cliente' : 'Asistente';
            $historialTexto .= "{$rol}: {$msg['texto']}\n";
        }

        $prompt = "Eres el asistente virtual de CarZone, un concesionario de vehículos de lujo ubicado en Cádiz, España.
        Tu misión es ayudar a los clientes a encontrar el coche perfecto, resolver dudas sobre financiación, servicios y citas, y cerrar ventas con un trato cercano y profesional.

        INFORMACIÓN DEL CONCESIONARIO:
        - Nombre: CarZone
        - Ubicación: Cádiz, España
        - Especialidad: Vehículos de lujo y alta gama
        - Los clientes pueden solicitar citas desde su área privada en la web

        {$catalogoTexto}
        {$serviciosTexto}

        INSTRUCCIONES DE COMPORTAMIENTO:
        - Sé amable, profesional y conciso. No uses respuestas excesivamente largas.
        - NUNCA inventes coches, precios ni datos que no estén en el catálogo anterior.
        - Si preguntan por un coche que no tenemos, discúlpate y sugiere alternativas similares del catálogo.
        - Si el cliente menciona un presupuesto, filtra y recomienda los coches que se ajusten.
        - Si pregunta por financiación, usa los datos reales del catálogo. Si no hay financiación para ese coche, dile que puede consultarlo con nuestro equipo.
        - Si quiere pedir cita o hablar con un asesor, indícale que puede hacerlo desde su área de cliente en la web.
        - Recuerda todo lo que el cliente te haya dicho en esta conversación (nombre, preferencias, presupuesto, etc.).
        - Responde siempre en español.
        - No uses asteriscos ni markdown en tus respuestas, escribe en texto plano.

        " . ($historialTexto ? "CONVERSACIÓN HASTA AHORA:\n{$historialTexto}\n" : "") . "Cliente: {$mensajeUsuario}

        Asistente:";

        try {
            $result = Gemini::generativeModel(model: 'gemini-2.5-flash')
                ->generateContent($prompt);

            $respuestaIA = $result->text();

            return response()->json(['respuesta' => $respuestaIA], 200);

        } catch (\Exception $e) {
            \Log::error("Error en el Chatbot: " . $e->getMessage());
            return response()->json([
                'error_real' => 'Ocurrió un error al contactar con la IA.',
                'mensaje_debug' => $e->getMessage()
            ], 500);
        }
    }
}