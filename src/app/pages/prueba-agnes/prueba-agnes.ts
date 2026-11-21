import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgresoService } from '../../services/progreso';
import { ValidadorService } from '../../services/validador';
import gsap from 'gsap';

@Component({
  selector: 'app-prueba-agnes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-agnes.html',
  styleUrls: ['./prueba-agnes.css']
})
export class PruebaAgnes implements AfterViewInit {
  fase: 'intro' | 'reto' = 'intro';

  // Datos del reto de transposición por columnas
  mensajeCifrado = 'LATLIEEEROESSEHNENCXMJAAV';
  bloquesCifrados = ['LATLI', 'EEERO', 'ESSEH', 'NENCX', 'MJAAV'];
  ordenColumnas = [3, 1, 5, 2, 4];

  // Cuadrícula interactiva de 5 filas x 5 columnas
  grid: string[][] = Array.from({ length: 5 }, () => Array(5).fill(''));

  // Pistas progresivas
  pistas = [
    'Pista 1: No tienes que cambiar ninguna letra. Solamente necesitas descubrir dónde va cada una.',
    'Pista 2: El primer grupo de cinco letras (LATLI) pertenece a la columna cuyo número es 1 (la segunda columna empezando por la izquierda).',
    'Pista 3: Cuando hayas colocado los 5 bloques en sus columnas correspondientes (1 al 5), lee las filas de izquierda a derecha.'
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

  // Herramienta rápida: volcar un bloque de 5 letras en una columna de la cuadrícula
  colocarBloqueEnColumna(bloque: string, colIndex: number): void {
    const letras = bloque.split('');
    for (let fila = 0; fila < 5; fila++) {
      this.grid[fila][colIndex] = letras[fila] || '';
    }
  }

  limpiarCuadricula(): void {
    this.grid = Array.from({ length: 5 }, () => Array(5).fill(''));
  }

  // Asegura que en cada celda haya solo 1 letra en mayúscula
  onCellInput(fila: number, col: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    this.grid[fila][col] = val.slice(-1);
    input.value = this.grid[fila][col];
  }

  pedirPista(): void {
    if (this.pistasDesbloqueadas < this.pistas.length) {
      this.pistasDesbloqueadas++;
    }
  }

  comprobarRespuesta(): void {
    const esCorrecta = this.validador.verificarRespuesta(1, this.respuestaUsuario);

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
      this.mensajeError = 'El código introducido no es correcto. Revisa el orden de las columnas (1 al 5) y lee por filas.';
      this.cdr.detectChanges();
      gsap.fromTo('.error-msg', { x: -8 }, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
    }
  }

  irASiguientePrueba(): void {
    // Extrae la última palabra que escribió el jugador (el fragmento) sin tenerla escrita en el código
    const palabras = this.respuestaUsuario.trim().toUpperCase().split(/\s+/);
    const fragmento = palabras[palabras.length - 1] || 'FRAGMENTO 1';

    this.progreso.completarNivel(1, fragmento);

    gsap.to('.page-container', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.router.navigate(['/mapa']);
      }
    });
  }
}