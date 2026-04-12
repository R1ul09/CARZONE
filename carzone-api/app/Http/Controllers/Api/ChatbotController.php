<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coche;
// Importamos el Facade del paquete instalado para usar Gemini
use Gemini\Laravel\Facades\Gemini; 

class ChatbotController extends Controller
{
    public function procesarMensaje(Request $request)
    {
        // cojemos el texto que el usuario envía
        $mensajeUsuario = $request->input('mensaje');

        // consultamos la base de datos para obtener los coches y sus marcas relacionadas
        // Esto evita que la IA se invente el stock
        $coches = Coche::with('marca')->get(); 
        
        $catalogoTexto = "Stock disponible en CarZone:\n";

        // Convertimos la colección de la BD en un string de texto plano que la IA pueda leer
        foreach ($coches as $coche) {
            $nombreMarca = $coche->marca ? $coche->marca->nombre : 'Marca Desconocida';
            $catalogoTexto .= "- " . $nombreMarca . " " . $coche->modelo . " (" . $coche->precio . "€)\n";
        }

        // construimos el prompt, las instrucciones de personalidad y el contexto de datos
        $prompt = "Eres un asistente de ventas virtual del concesionario CarZone. Eres amable, profesional y conciso.
        Aquí tienes la lista EXACTA de los coches que tenemos a la venta ahora mismo:
        
        " . $catalogoTexto . "
        
        Reglas IMPORTANTES: 
        - NUNCA inventes coches que no estén en esa lista. 
        - Si el cliente pregunta por un coche que no tenemos, dile amablemente que no hay stock e invítale a ver los que sí tenemos.
        
        El cliente te acaba de decir esto: '" . $mensajeUsuario . "'
        
        Responde al cliente:";

        try {
            // definimos el modelo específico. Usamos gemini-2.5-flash por ser el más actual y estable
            $modeloGemini = 'gemini-2.5-flash';

            // realizamos la llamada a la API de Google a través del SDK (Software Development Kit, igual que breeze de laravel pero para Google Gemini)
            $result = Gemini::generativeModel(model: $modeloGemini)
                ->generateContent($prompt);

            // extraemos únicamente el texto de la respuesta generada
            $respuestaIA = $result->text();

            // devolvemos la respuesta al cliente en formato JSON con código 200
            return response()->json([
                'respuesta' => $respuestaIA, 
            ], 200);

        } catch (\Exception $e) {
            // si hay un error (API key mal, modelo caído, etc.), lo registramos en storage/logs/laravel.log
            \Log::error("Error en el Chatbot: " . $e->getMessage());
            
            return response()->json([
                'error_real' => 'Ocurrió un error al contactar con la IA.',
                'mensaje_debug' => $e->getMessage()
            ], 500);
        }
    }
}