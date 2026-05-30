<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class BienvenidaMail extends Mailable
{
    public function __construct(
        private User $usuario
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenido a la familia CarZone'
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
        $nombre = $this->usuario->name;
        $email = $this->usuario->email;
        $anio = date('Y');
        $urlCatalogo = config('app.frontend_url') . '/catalogo';

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
                <td style='background:#22c55e;padding:20px;text-align:center;'>
                    <p style='margin:0;color:#fff;font-size:18px;font-weight:700;letter-spacing:1px;'>
                        Cuenta verificada correctamente
                    </p>
                </td>
            </tr>

            <!-- Cuerpo -->
            <tr>
                <td style='padding:40px 40px 32px;'>

                    <p style='margin:0 0 16px;font-size:18px;color:#1a1a1a;font-weight:700;'>
                        Hola, {$nombre}.
                    </p>

                    <p style='margin:0 0 24px;font-size:14px;color:#555;line-height:1.7;'>
                        Tu cuenta ha sido verificada y ya formas parte de CarZone. 
                        A partir de ahora puedes explorar nuestro catálogo de vehículos de alta gama, 
                        solicitar citas, gestionar financiaciones y mucho más.
                    </p>

                    <!-- Separador -->
                    <hr style='border:none;border-top:1px solid #eee;margin:28px 0;'>

                    <!-- Datos de la cuenta -->
                    <p style='margin:0 0 12px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;'>
                        Tu cuenta
                    </p>
                    <table width='100%' cellpadding='0' cellspacing='0' style='border-top:1px solid #eee;'>
                        <tr>
                            <td style='padding:10px 0;color:#888;font-size:14px;'>Nombre</td>
                            <td style='padding:10px 0;font-size:14px;font-weight:600;'>{$nombre}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:10px 0;color:#888;font-size:14px;'>Email</td>
                            <td style='padding:10px 0;font-size:14px;font-weight:600;'>{$email}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:10px 0;color:#888;font-size:14px;'>Rol</td>
                            <td style='padding:10px 0;'>
                                <span style='background:#22c55e;color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;'>
                                    Cliente
                                </span>
                            </td>
                        </tr>
                    </table>

                    <!-- Separador -->
                    <hr style='border:none;border-top:1px solid #eee;margin:28px 0;'>

                    <!-- Botón al catálogo -->
                    <p style='margin:0 0 20px;font-size:14px;color:#555;'>
                        Empieza explorando nuestra selección de vehículos premium:
                    </p>
                    <div style='text-align:center;'>
                        <a href='{$urlCatalogo}' style='display:inline-block;padding:14px 32px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;'>
                            Ver catálogo
                        </a>
                    </div>

                </td>
            </tr>

            <!-- Pie -->
            <tr>
                <td style='background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee;text-align:center;'>
                    <p style='margin:0;font-size:12px;color:#aaa;'>© {$anio} CarZone · Todos los derechos reservados</p>
                </td>
            </tr>

        </table>
        </td></tr>
        </table>
        </body>
        </html>";
    }
}