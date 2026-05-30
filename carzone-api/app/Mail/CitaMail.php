<?php

namespace App\Mail;

use App\Models\Cita;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CitaMail extends Mailable
{
    use Queueable, SerializesModels;

    // Los cuatro tipos posibles de correo que enviamos
    const CREADA = 'creada';
    const CONFIRMADA = 'confirmada';
    const CANCELADA = 'cancelada';
    const MODIFICADA = 'modificada';

    public function __construct(
        public Cita $cita,
        public string $tipo
    ) {}

    // Asunto del correo según el tipo
    // deveuelve un objeto envelope, si devolvieramos un envelope con subject vacío, 
    // laravel usaría el asunto por defecto (que no queremos)
    public function envelope(): Envelope
    {
        $asuntos = [
            self::CREADA => 'Tu cita en CarZone ha sido registrada',
            self::CONFIRMADA => 'Tu cita en CarZone ha sido confirmada',
            self::CANCELADA => 'Tu cita en CarZone ha sido cancelada',
            self::MODIFICADA => 'Tu cita en CarZone ha sido modificada',
        ];

        return new Envelope(
            subject: $asuntos[$this->tipo] ?? 'Información sobre tu cita en CarZone'
        );
    }

    // Contenido del correo: devolvemos el HTML generado por buildHtml
    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml()
        );
    }

    private function buildHtml(): string
    {
        // Datos de la cita
        $nombre   = $this->cita->user->name;
        $servicio = $this->cita->servicio->nombre;
        $fecha    = Carbon::parse($this->cita->fecha)->locale('es')->isoFormat('dddd, D [de] MMMM [de] YYYY');
        $hora     = substr($this->cita->hora, 0, 5) . 'h';
        $estado   = ucfirst($this->cita->estado);
        $coche    = $this->cita->coche
                        ? $this->cita->coche->marca->nombre . ' ' . $this->cita->coche->modelo
                        : null;

        // Color de acento según el tipo de correo
        $color = match($this->tipo) {
            self::CREADA => '#22c55e',
            self::CONFIRMADA => '#f59e0b',
            self::CANCELADA => '#ef4444',
            self::MODIFICADA => '#3b82f6',
            default => '#1a1a1a',
        };

        // Texto descriptivo según el tipo
        $descripcion = match($this->tipo) {
            self::CREADA => 'Tu cita ha sido registrada correctamente.',
            self::CONFIRMADA => 'Tu cita ha sido confirmada por nuestro equipo.',
            self::CANCELADA => 'Tu cita ha sido cancelada.',
            self::MODIFICADA => 'Los detalles de tu cita han sido actualizados.',
            default => '',
        };

        // Fila del vehículo (solo si la cita tiene un coche asociado)
        $filaCoche = $coche ? "
            <tr style='border-top:1px solid #f0f0f0;'>
                <td style='padding:8px 0;color:#888;font-size:14px;'>Vehículo</td>
                <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$coche}</td>
            </tr>" : '';

        // Bloque del mensaje del empleado (solo si existe)
        $bloqueEmpleado = $this->cita->mensaje_empleado ? "
            <div style='margin-top:24px;padding:16px;background:#fafafa;border-left:4px solid {$color};border-radius:4px;'>
                <p style='margin:0 0 6px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;'>Mensaje de CarZone</p>
                <p style='margin:0;font-size:14px;color:#333;'>{$this->cita->mensaje_empleado}</p>
            </div>" : '';

        // Botón de Google Calendar (solo en citas creadas o confirmadas)
        $botonCalendar = '';
        if (in_array($this->tipo, [self::CREADA, self::CONFIRMADA])) {
            $url = $this->googleCalendarUrl($servicio, $coche);
            $botonCalendar = "
            <div style='text-align:center;margin-top:28px;'>
                <a href='{$url}' style='display:inline-block;padding:12px 28px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;'>
                    Añadir a Google Calendar
                </a>
            </div>";
        }

        // Año actual para el pie del correo
        $anio = date('Y');

        // HTML del correo
        return "
        <!DOCTYPE html>
        <html lang='es'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width,initial-scale=1.0'>
        </head>
        <body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>
        <table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;background:#f4f4f4;'>
        <tr><td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;'>

            <!-- Cabecera con el logo -->
            <tr>
                <td style='background:#1a1a1a;padding:32px;text-align:center;'>
                    <h1 style='margin:0;color:#fff;font-size:28px;letter-spacing:4px;font-weight:700;'>
                        CAR<span style='color:{$color};'>ZONE</span>
                    </h1>
                    <p style='margin:8px 0 0;color:#999;font-size:13px;letter-spacing:2px;text-transform:uppercase;'>
                        Concesionario Premium
                    </p>
                </td>
            </tr>

            <!-- Banda de color con el mensaje principal -->
            <tr>
                <td style='background:{$color};padding:16px;text-align:center;'>
                    <p style='margin:0;color:#fff;font-size:15px;font-weight:600;'>{$descripcion}</p>
                </td>
            </tr>

            <!-- Cuerpo del correo -->
            <tr>
                <td style='padding:36px 40px;'>
                    <p style='margin:0 0 24px;font-size:16px;color:#333;'>Hola, <strong>{$nombre}</strong>.</p>

                    <!-- Tabla con los detalles de la cita -->
                    <table width='100%' cellpadding='0' cellspacing='0' style='border-top:1px solid #eee;'>
                        <tr>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Servicio</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$servicio}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Fecha</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$fecha}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Hora</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$hora}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Estado</td>
                            <td style='padding:8px 0;'>
                                <span style='background:{$color};color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;'>
                                    {$estado}
                                </span>
                            </td>
                        </tr>
                        {$filaCoche}
                    </table>

                    {$bloqueEmpleado}
                    {$botonCalendar}
                </td>
            </tr>

            <!-- Pie del correo -->
            <tr>
                <td style='background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee;text-align:center;'>
                    <p style='margin:0;font-size:12px;color:#aaa;'>© {$anio} CarZone · Todos los derechos reservados</p>
                    <p style='margin:8px 0 0;font-size:12px;color:#aaa;'>Si no realizaste esta acción, ignora este correo.</p>
                </td>
            </tr>

        </table>
        </td></tr>
        </table>
        </body>
        </html>";
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Genera la URL de Google Calendar sin necesitar ninguna API ni clave.
    // Google acepta esta URL especial y abre el evento ya rellenado.
    // ─────────────────────────────────────────────────────────────────────────
    private function googleCalendarUrl(string $servicio, ?string $coche): string
    {
        $inicio = Carbon::parse($this->cita->fecha . ' ' . $this->cita->hora)->format('Ymd\THis\Z');
        $fin    = Carbon::parse($this->cita->fecha . ' ' . $this->cita->hora)->addHour()->format('Ymd\THis\Z');

        return 'https://calendar.google.com/calendar/render?' . http_build_query([
            'action'   => 'TEMPLATE',
            'text'     => 'Cita CarZone: ' . $servicio,
            'dates'    => $inicio . '/' . $fin,
            'details'  => $coche ? 'Vehículo: ' . $coche : $servicio,
            'location' => 'CarZone Concesionario',
        ]);
    }
}