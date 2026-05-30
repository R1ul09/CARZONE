<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class VerificacionEmailMail extends Mailable
{
    public function __construct(
        private string $nombre,
        private string $urlVerificacion
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenido a CarZone — Verifica tu cuenta'
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml()
        );
    }

    private function buildHtml(): string
    {
        $nombre = $this->nombre;
        $url = $this->urlVerificacion;
        $anio = date('Y');

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

            <!-- Cabecera -->
            <tr>
                <td style='background:#1a1a1a;padding:32px;text-align:center;'>
                    <h1 style='margin:0;color:#fff;font-size:28px;letter-spacing:4px;font-weight:700;'>
                        CAR<span style='color:#22c55e;'>ZONE</span>
                    </h1>
                    <p style='margin:8px 0 0;color:#999;font-size:13px;letter-spacing:2px;text-transform:uppercase;'>
                        Concesionario Premium
                    </p>
                </td>
            </tr>

            <!-- Banda de color -->
            <tr>
                <td style='background:#22c55e;padding:16px;text-align:center;'>
                    <p style='margin:0;color:#fff;font-size:15px;font-weight:600;'>
                        Bienvenido a CarZone. Verifica tu cuenta para empezar.
                    </p>
                </td>
            </tr>

            <!-- Cuerpo -->
            <tr>
                <td style='padding:36px 40px;'>
                    <p style='margin:0 0 16px;font-size:16px;color:#333;'>Hola, <strong>{$nombre}</strong>.</p>
                    <p style='margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;'>
                        Gracias por registrarte en CarZone. Para activar tu cuenta y acceder 
                        a todos nuestros servicios, haz clic en el botón de abajo.
                    </p>
                    <div style='text-align:center;'>
                        <a href='{$url}' style='display:inline-block;padding:14px 32px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;'>
                            Verificar mi cuenta
                        </a>
                    </div>
                    <p style='margin:28px 0 0;font-size:13px;color:#aaa;text-align:center;'>
                        Este enlace caduca en 60 minutos.
                    </p>
                </td>
            </tr>

            <!-- Pie -->
            <tr>
                <td style='background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee;text-align:center;'>
                    <p style='margin:0;font-size:12px;color:#aaa;'>© {$anio} CarZone · Todos los derechos reservados</p>
                    <p style='margin:8px 0 0;font-size:12px;color:#aaa;'>Si no fuiste tú quien se registró, ignora este correo.</p>
                </td>
            </tr>

        </table>
        </td></tr>
        </table>
        </body>
        </html>";
    }
}