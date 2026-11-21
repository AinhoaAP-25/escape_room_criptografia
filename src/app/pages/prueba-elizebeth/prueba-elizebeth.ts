import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgresoService } from '../../services/progreso';
import { ValidadorService } from '../../services/validador';
import gsap from 'gsap';

@Component({
  selector: 'app-prueba-elizebeth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-elizebeth.html',
  styleUrls: ['./prueba-elizebeth.css']
})
export class PruebaElizebeth implements AfterViewInit {
  fase: 'intro' | 'reto' = 'intro';

  // Datos del reto César
  mensajeCifrado = 'QF HQFAJ JXYF JS JQ WJQTO';
  alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  desplazamiento = 0; // Valor k controlado por el jugador en la rueda virtual

  // Pistas progresivas
  pistas = [
    'Pista 1: En el alfabeto inglés (A=0, B=1, ..., Z=25), la letra E ocupa la posición 4 y la letra J ocupa la posición 9.',
    'Pista 2: Si C(x) = (x + k) mod 26 y la E (4) se transforma en J (9), entonces el desplazamiento es k = 9 - 4 = 5.',
    'Pista 3: Gira la rueda virtual hasta k = 5 y busca cada letra del mensaje cifrado en el anillo exterior/cifrado para leer su letra original.'
  ];
  pistasDesbloqueadas = 0;

  // Validación
  respuestaUsuario = '';
  mensajeError = '';
  pruebaSuperada = false;

  constructor(
    private router: Router,
    private progreso: ProgresoService,
    private validador: ValidadorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    gsap.from('.anim-in', {
      y: 25,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  pasarAlReto(): void {
    gsap.to('.dossier-card', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        this.fase = 'reto';
        this.cdr.detectChanges();

        gsap.from('.reto-anim', {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out'
        });
      }
    });
  }

  // Controles de la Rueda César Interactiva
  girarRueda(delta: number): void {
    this.desplazamiento = (this.desplazamiento + delta + 26) % 26;
  }

  obtenerLetraCifrada(indexOriginal: number): string {
    return this.alfabeto[(indexOriginal + this.desplazamiento) % 26];
  }

  // Coordenadas para dibujar los 26 sectores circulares de la rueda SVG
  getAnguloSector(index: number): number {
    return index * (360 / 26);
  }

  pedirPista(): void {
    if (this.pistasDesbloqueadas < this.pistas.length) {
      this.pistasDesbloqueadas++;
    }
  }

  comprobarRespuesta(): void {
    const esCorrecta = this.validador.verificarRespuesta(2, this.respuestaUsuario);

    if (esCorrecta) {
      this.mensajeError = '';
      this.pruebaSuperada = true;
      this.cdr.detectChanges();

      gsap.from('.success-banner', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.5)'
      });
    } else {
      this.mensajeError = 'El código introducido no es correcto. Calcula el desplazamiento k entre E y J y retrocede k posiciones.';
      this.cdr.detectChanges();
      gsap.fromTo('.error-msg', { x: -8 }, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    }
  }

  irASiguientePrueba(): void {
    const palabras = this.respuestaUsuario.trim().toUpperCase().split(/\s+/);
    const fragmento = palabras[palabras.length - 1] || 'FRAGMENTO 2';

    this.progreso.completarNivel(2, fragmento);

    gsap.to('.page-container', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.router.navigate(['/mapa']);
      }
    });
  }
}