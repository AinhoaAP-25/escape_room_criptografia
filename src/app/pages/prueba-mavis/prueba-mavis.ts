import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgresoService } from '../../services/progreso';
import { ValidadorService } from '../../services/validador';
import gsap from 'gsap';

@Component({
  selector: 'app-prueba-mavis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-mavis.html',
  styleUrls: ['./prueba-mavis.css']
})
export class PruebaMavis implements AfterViewInit {

  fase: 'intro' | 'reto' = 'intro';

  // Datos del reto Vigenère
  mensajeCifrado = 'EIKMEFTXEJBTHVPFNHVRF';
  clave = 'BATEY';
  alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Pistas progresivas
  pistas = [
    'Pista 1: La clave que debes utilizar está relacionada con el nombre de la criptógrafa: BATEY.',
    'Pista 2: Repite la clave BATEY tantas veces como sea necesario para que tenga la misma longitud que el mensaje cifrado. Cada letra de la clave indica un desplazamiento diferente.',
    'Pista 3: Para descifrar, utiliza la fórmula P = (C - K) mod 26. Recuerda que A = 0, B = 1, ..., Z = 25. Si el resultado es negativo, suma 26.'
  ];

  pistasDesbloqueadas = 0;

  // Validación
  respuestaUsuario = '';
  mensajeError = '';
  pruebaSuperada = false;

  // Tabla de Vigenère
  mostrarTabla = true;
  filaSeleccionada: number | null = null;
  celdaSeleccionada: string | null = null;

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

  // Genera las 26 filas de la tabla de Vigenère
  get tablaVigenere(): string[][] {
    return this.alfabeto.map((_, fila) =>
      this.alfabeto.map((_, columna) =>
        this.alfabeto[(fila + columna) % 26]
      )
    );
  }

  // Selecciona la fila correspondiente a una letra de la clave
  seleccionarFila(index: number): void {
    this.filaSeleccionada =
      this.filaSeleccionada === index ? null : index;

    this.celdaSeleccionada = null;
  }

  // Marca una casilla de la tabla para facilitar la consulta
  marcarCelda(fila: number, columna: number): void {
    const id = `${fila}-${columna}`;

    this.celdaSeleccionada =
      this.celdaSeleccionada === id ? null : id;
  }

  // Comprueba si una casilla está seleccionada
  esCeldaSeleccionada(fila: number, columna: number): boolean {
    return this.celdaSeleccionada === `${fila}-${columna}`;
  }

  pedirPista(): void {
    if (this.pistasDesbloqueadas < this.pistas.length) {
      this.pistasDesbloqueadas++;
    }
  }

  comprobarRespuesta(): void {
    const esCorrecta = this.validador.verificarRespuesta(
      4,
      this.respuestaUsuario
    );

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
      this.mensajeError =
        'El código introducido no es correcto. Revisa la clave BATEY y realiza los cálculos de Vigenère.';

      this.cdr.detectChanges();

      gsap.fromTo(
        '.error-msg',
        { x: -8 },
        { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
      );
    }
  }

  irASiguientePrueba(): void {
    const palabras = this.respuestaUsuario
      .trim()
      .toUpperCase()
      .split(/\s+/);

    const fragmento = palabras[palabras.length - 1] || 'NORTE';

    this.progreso.completarNivel(4, fragmento);

    gsap.to('.page-container', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.router.navigate(['/mapa']);
      }
    });
  }

  limpiarSeleccion(): void {
    this.filaSeleccionada = null;
    this.celdaSeleccionada = null;
  }
}