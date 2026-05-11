import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})

export class Hero implements AfterViewInit {
  // Accedemos al elemento de video del HTML
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    
    // Forzamos la carga y reproducción
    video.muted = true;
    video.play().catch(error => {
      console.warn("El autoplay fue bloqueado o falló, reintentando...", error);
    });

    // cuando termine se queda parado en el último frame
    video.addEventListener('ended', () => {
        video.pause();
    });
  }
}
