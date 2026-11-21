import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgresoService } from '../../services/progreso';
import { ValidadorService } from '../../services/validador';
import gsap from 'gsap';

@Component({
  selector: 'app-prueba-genevieve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-genevieve.html',
  styleUrls: ['./prueba-genevieve.css']
})
export class PruebaGenevieve implements AfterViewInit {
  fase: 'intro' | 'reto' = 'intro';

  // Datos del reto de Cifrado Afín
  mensajeCifrado = 'CD RCDUF FZGD KDOX CD JFZD';
  alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  claveA = 7;
  claveB = 3;

  // Herramienta interactiva de aritmética modular
  inversoProbado = 1;
  letraSeleccionada = 2; // Por defecto 'C' (valor 2)

  // Pistas progresivas
  pistas = [
    'Pista 1: Para encontrar el inverso multiplicativo de a = 7 módulo 26, busca un número x tal que (7 · x) mod 26 = 1.',
    'Pista 2: Como 7 · 15 = 105, y 105 = 26 · 4 + 1, el inverso multiplicativo es a⁻¹ = 15.',
    'Pista 3: Aplica D(y) = 15 · (y - 3) mod 26 a cada letra cifrada (si el resultado es negativo, súmale 26 hasta que quede entre 0 y 25).'
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

  // Cálculos en tiempo real para la herramienta de ayuda modular
  get productoModular(): number {
    return (this.claveA * this.inversoProbado) % 26;
  }

  get resultadoDescifradoLetra(): number {
    const raw = this.inversoProbado * (this.letraSeleccionada - this.claveB);
    return ((raw % 26) + 26) % 26;
  }

  pedirPista(): void {
    if (this.pistasDesbloqueadas < this.pistas.length) {
      this.pistasDesbloqueadas++;
    }
  }

  comprobarRespuesta(): void {
    const esCorrecta = this.validador.verificarRespuesta(3, this.respuestaUsuario);

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
      this.mensajeError = 'El código introducido no es correcto. Calcula D(y) = a⁻¹(y - 3) mod 26 y traduce los números a letras.';
      this.cdr.detectChanges();
      gsap.fromTo('.error-msg', { x: -8 }, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    }
  }

  irASiguientePrueba(): void {
    const palabras = this.respuestaUsuario.trim().toUpperCase().split(/\s+/);
    const fragmento = palabras[palabras.length - 1] || 'FRAGMENTO 3';

    this.progreso.completarNivel(3, fragmento);

    gsap.to('.page-container', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.router.navigate(['/mapa']);
      }
    });
  }
}