
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgresoService } from '../../services/progreso';
import { ValidadorService } from '../../services/validador';

type Fase = 'intro' | 'aprendizaje' | 'mision';

@Component({
  selector: 'app-prueba-joan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-joan.html',
  styleUrl: './prueba-joan.css'
})
export class PruebaJoan {

  fase: Fase = 'intro';

  alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  filasTeclado: string[] = [
    'QWERTZUIO',
    'ASDFGHJK',
    'PYXCVBNML'
  ];

  // Cableados históricos de Enigma I
  rotores: Record<string, { cableado: string; muesca: number }> = {
    I: {
      cableado: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
      muesca: 16 // Q
    },
    II: {
      cableado: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
      muesca: 4 // E
    },
    III: {
      cableado: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
      muesca: 21 // V
    }
  };

  reflectorB = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

  // Posiciones de izquierda a derecha
  posiciones = [0, 0, 0];
  primeraLetraProcesada = false;
  ajusteInicialRealizado = false;

  // Configuración seleccionada para la misión
  rotorIzquierdo = '';
  rotorCentral = '';
  rotorDerecho = '';
  reflectorSeleccionado = '';
  posicionInicial = '';

  // Mensaje de entrenamiento
  letraEntrada = '';
  letraSalida = '';
  mensajeEntrenamiento = '';

  // Misión final
  mensajeCifrado = 'PDEUDUHQYXKBRTMPPZAXYQEON';
  mensajeDescifrado = '';
  indiceMensaje = 0;
  misionIniciada = false;
  pruebaSuperada = false;

  mensajeError = '';
  mensajeSistema = 'Sistema preparado. Esperando una entrada.';
  mostrarExplicacion = false;

  constructor(
    private router: Router,
    private progreso: ProgresoService,
    private validador: ValidadorService
  ) {}

  get posicionesTexto(): string[] {
    return this.posiciones.map(posicion => this.alfabeto[posicion]);
  }

  get progresoMision(): number {
    return (this.indiceMensaje / this.mensajeCifrado.length) * 100;
  }

  get misionTerminada(): boolean {
    return this.indiceMensaje >= this.mensajeCifrado.length;
  }

  empezarAprendizaje(): void {
    this.fase = 'aprendizaje';
    this.reiniciarMaquina();
  }

  empezarMision(): void {
    this.fase = 'mision';
    this.reiniciarMaquina();
    this.mensajeDescifrado = '';
    this.indiceMensaje = 0;
    this.misionIniciada = false;
    this.pruebaSuperada = false;
    this.mensajeError = '';
  }

  reiniciarMaquina(): void {
    this.posiciones = [0, 0, 0];
    this.letraEntrada = '';
    this.letraSalida = '';
    this.mensajeEntrenamiento = '';
    this.mensajeSistema = 'Sistema preparado. Esperando una entrada.';
    this.primeraLetraProcesada = false;
    this.ajusteInicialRealizado = false;
  }

  volverAlInicio(): void {
    this.fase = 'intro';
  }

  // Avance de los rotores antes de cada pulsación.
  avanzarRotores(): void {
    const muescaCentral = this.rotores['II'].muesca;
    const muescaDerecha = this.rotores['III'].muesca;

    // Mecanismo de doble paso de Enigma.
    if (this.posiciones[1] === muescaCentral) {
      this.posiciones[0] = (this.posiciones[0] + 1) % 26;
      this.posiciones[1] = (this.posiciones[1] + 1) % 26;
    } else if (this.posiciones[2] === muescaDerecha) {
      this.posiciones[1] = (this.posiciones[1] + 1) % 26;
    }

    this.posiciones[2] = (this.posiciones[2] + 1) % 26;
  }

  // Transformación de una letra mediante Enigma.
  transformarLetra(letra: string): string {
    let valor = this.alfabeto.indexOf(letra.toUpperCase());

    if (valor < 0) {
      return '';
    }

    this.avanzarRotores();

    const orden = [
      { nombre: 'III', posicion: this.posiciones[2] },
      { nombre: 'II', posicion: this.posiciones[1] },
      { nombre: 'I', posicion: this.posiciones[0] }
    ];

    // Ida: de derecha a izquierda.
    for (const rotor of orden) {
      const cableado = this.rotores[rotor.nombre].cableado;
      valor = this.alfabeto.indexOf(
        cableado[(valor + rotor.posicion) % 26]
      );
      valor = (valor - rotor.posicion + 26) % 26;
    }

    // Reflector B.
    valor = this.alfabeto.indexOf(this.reflectorB[valor]);

    // Vuelta: de izquierda a derecha.
    const ordenVuelta = [
      { nombre: 'I', posicion: this.posiciones[0] },
      { nombre: 'II', posicion: this.posiciones[1] },
      { nombre: 'III', posicion: this.posiciones[2] }
    ];

    for (const rotor of ordenVuelta) {
      const cableado = this.rotores[rotor.nombre].cableado;
      const indice = (valor + rotor.posicion) % 26;
      valor = (cableado.indexOf(this.alfabeto[indice]) - rotor.posicion + 26) % 26;
    }

    return this.alfabeto[valor];
  }

  
  pulsarTecla(letra: string): void {

  // FASE DE APRENDIZAJE
  if (this.fase === 'aprendizaje') {

    // En el aprendizaje sí avanzamos automáticamente.
    this.avanzarRotores();

    this.letraEntrada = letra;
    this.letraSalida = this.transformarLetra(letra);
    this.mensajeEntrenamiento += this.letraSalida;

    this.mensajeSistema =
      `Has pulsado ${letra}. La máquina ha devuelto ${this.letraSalida}.`;

    return;
  }

  // FASE DE MISIÓN
  if (
    this.fase !== 'mision' ||
    !this.misionIniciada ||
    this.misionTerminada ||
    this.pruebaSuperada
  ) {
    return;
  }

  // Comprobamos que se introduce la siguiente letra interceptada.
  const letraEsperada = this.mensajeCifrado[this.indiceMensaje];

  if (letra !== letraEsperada) {
    this.mensajeError =
      'Esa no es la siguiente letra del mensaje interceptado.';

    return;
  }

  this.mensajeError = '';

  // A partir de la segunda letra, los rotores avanzan automáticamente.
  // La primera letra utiliza la posición que haya preparado el participante.
  if (this.primeraLetraProcesada) {
    this.avanzarRotores();
  }

  this.letraEntrada = letra;
  this.letraSalida = this.transformarLetra(letra);

  this.mensajeDescifrado += this.letraSalida;
  this.indiceMensaje++;

  this.primeraLetraProcesada = true;

  this.mensajeSistema =
    `Letra ${this.indiceMensaje} de ${this.mensajeCifrado.length} procesada.`;

  if (this.misionTerminada) {
    this.finalizarMision();
  }
}


  borrarEntrenamiento(): void {
    this.reiniciarMaquina();
  }

  comprobarConfiguracion(): void {
    this.mensajeError = '';

    const configuracionCorrecta =
      this.rotorIzquierdo === 'I' &&
      this.rotorCentral === 'II' &&
      this.rotorDerecho === 'III' &&
      this.reflectorSeleccionado === 'B' &&
      this.posicionInicial.trim().toUpperCase() === 'AAA';

    if (!configuracionCorrecta) {
      this.mensajeError =
        'La configuración no es correcta. Revisa el orden de los rotores, el reflector y la posición inicial.';
      return;
    }

    this.posiciones = [0, 0, 0];
    this.primeraLetraProcesada = false;
    this.ajusteInicialRealizado = false;  
    this.indiceMensaje = 0;
    this.mensajeDescifrado = '';
    this.misionIniciada = true;
    this.mensajeSistema =
      'Configuración aceptada. Puedes comenzar a procesar el mensaje.';
  }

  procesarSiguienteLetra(): void {
    if (!this.misionIniciada || this.misionTerminada) {
      return;
    }

    const letra = this.mensajeCifrado[this.indiceMensaje];
    const resultado = this.transformarLetra(letra);

    this.mensajeDescifrado += resultado;
    this.indiceMensaje++;

    this.mensajeSistema =
      `Letra ${this.indiceMensaje} de ${this.mensajeCifrado.length} procesada.`;

    if (this.misionTerminada) {
      this.finalizarMision();
    }
  }

  
  finalizarMision(): void {
    const mensajeConEspacios =
      this.mensajeDescifrado === 'LACRIPTOGRAFIAABREPUERTAS'
        ? 'LA CRIPTOGRAFIA ABRE PUERTAS'
        : this.mensajeDescifrado;

    const respuestaCorrecta =
      this.validador.verificarRespuesta(5, mensajeConEspacios);

    if (respuestaCorrecta) {
      this.pruebaSuperada = true;
      this.mensajeSistema =
        'Mensaje recuperado. Has comprendido el funcionamiento de Enigma.';
    } else {
      this.mensajeError =
        'El mensaje obtenido no coincide con la solución esperada. Revisa la configuración de la máquina.';
    }
  }


  reiniciarMision(): void {
    this.posiciones = [0, 0, 0];
    this.mensajeDescifrado = '';
    this.indiceMensaje = 0;
    this.misionIniciada = false;
    this.pruebaSuperada = false;
    this.mensajeError = '';
    this.mensajeSistema = 'Sistema preparado. Esperando configuración.';
  }

  pedirExplicacion(): void {
    this.mostrarExplicacion = !this.mostrarExplicacion;
  }

  irASiguientePrueba(): void {
    this.progreso.completarNivel(5, 'PUERTAS');
    this.router.navigate(['/final']);
  }

  avanzarRotorInicial(): void {

    // Solo se permite antes de introducir la primera letra.
    if (
      this.fase !== 'mision' ||
      !this.misionIniciada ||
      this.indiceMensaje > 0 ||
      this.ajusteInicialRealizado
    ) {
      return;
    }

    // Avanzamos únicamente el rotor derecho.
    this.posiciones[2] = (this.posiciones[2] + 1) % 26;

    this.ajusteInicialRealizado = true;

    this.mensajeSistema =
      'Rotor derecho avanzado. La máquina está preparada en AAB.';
  }
}

