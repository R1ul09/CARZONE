import { Component, signal, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Mensaje {
  texto: string;
  esUsuario: boolean;
  cargando?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class Chatbot implements AfterViewChecked {

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  abierto = signal(false);
  textoUsuario = '';
  mensajes: Mensaje[] = [
    {
      texto: '¡Hola! Soy el asistente virtual de CarZone. ¿En qué puedo ayudarte hoy?',
      esUsuario: false
    }
  ];

  chipsSugeridos = [
    { label: 'Ver coches', texto: '¿Qué coches tenéis disponibles?' },
    { label: 'Financiación', texto: '¿Cómo funciona la financiación?' },
    { label: 'Ubicación', texto: '¿Dónde estáis ubicados?' },
    { label: 'Contacto', texto: '¿Cómo puedo contactar con vosotros?' },
  ];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private ngZone: NgZone) {}

  ngAfterViewChecked() {
    // Solo hacemos scroll, sin detectChanges aquí para evitar bucles
    this.scrollAlFinal();
  }

  toggleChat() {
    this.abierto.update(v => !v);
  }

  enviarChip(texto: string) {
    this.textoUsuario = texto;
    this.enviar();
  }

  enviar() {
    const texto = this.textoUsuario.trim();
    if (!texto) return;

    this.mensajes.push({ texto, esUsuario: true });
    this.textoUsuario = '';

    // Mensaje de "escribiendo..."
    const idx = this.mensajes.length;
    this.mensajes.push({ texto: '', esUsuario: false, cargando: true });

    // Enviamos el historial completo (sin el mensaje de cargando que acabamos de añadir)
    const historialParaEnviar = this.mensajes.slice(0, -1).filter(m => !m.cargando);

    this.http.post<{ respuesta: string }>(
      `${this.apiUrl}/chatbot`,
      { mensaje: texto, historial: historialParaEnviar },
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.mensajes[idx] = { texto: res.respuesta, esUsuario: false };
          this.cd.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.mensajes[idx] = {
            texto: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo en unos momentos.',
            esUsuario: false
          };
          this.cd.detectChanges();
        });
      }
    });
  }

  private scrollAlFinal() {
    if (this.mensajesContainer) {
      const el = this.mensajesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}