<?php

namespace App\Mail;

use App\Models\Financiacion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class FinanciacionSolicitadaMail extends Mailable
{
    public function __construct(
        private Financiacion $financiacion
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu solicitud de financiación en CarZone ha sido recibida'
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
        $nombre = $this->financiacion->user->name;
        $coche  = $this->financiacion->coche->marca->nombre . ' ' . $this->financiacion->coche->modelo;
        $meses  = $this->financiacion->meses;
        $cuota  = number_format($this->financiacion->cuota_mensual, 0, ',', '.') . ' €';
        $entrada= number_format($this->financiacion->entrada, 0, ',', '.') . ' €';
        $interes= $this->financiacion->interes . '%';
        $anio   = date('Y');

        return "
        <!DOCTYPE html>
        <html lang='es'>
        <head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'></head>
        <body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>
        <table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;background:#f4f4f4;'>
        <tr><td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;'>

            <tr>
                <td style='background:#1a1a1a;padding:32px;text-align:center;'>
                    <h1 style='margin:0;color:#fff;font-size:28px;letter-spacing:4px;font-weight:700;'>
                        CAR<span style='color:#3b82f6;'>ZONE</span>
                    </h1>
                    <p style='margin:8px 0 0;color:#999;font-size:13px;letter-spacing:2px;text-transform:uppercase;'>Concesionario Premium</p>
                </td>
            </tr>

            <tr>
                <td style='background:#3b82f6;padding:16px;text-align:center;'>
                    <p style='margin:0;color:#fff;font-size:15px;font-weight:600;'>Tu solicitud de financiación ha sido recibida y está pendiente de revisión.</p>
                </td>
            </tr>

            <tr>
                <td style='padding:36px 40px;'>
                    <p style='margin:0 0 24px;font-size:16px;color:#333;'>Hola, <strong>{$nombre}</strong>.</p>
                    <p style='margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;'>
                        Hemos recibido tu solicitud de financiación. Nuestro equipo la revisará y te responderá lo antes posible.
                    </p>

                    <table width='100%' cellpadding='0' cellspacing='0' style='border-top:1px solid #eee;'>
                        <tr>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Vehículo</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$coche}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Entrada</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$entrada}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Plazo</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$meses} meses</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Interés TAE</td>
                            <td style='padding:8px 0;font-size:14px;font-weight:600;'>{$interes}</td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Cuota mensual</td>
                            <td style='padding:8px 0;'>
                                <span style='background:#3b82f6;color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;'>{$cuota}/mes</span>
                            </td>
                        </tr>
                        <tr style='border-top:1px solid #f0f0f0;'>
                            <td style='padding:8px 0;color:#888;font-size:14px;'>Estado</td>
                            <td style='padding:8px 0;'>
                                <span style='background:#f59e0b;color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;'>Pendiente</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

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