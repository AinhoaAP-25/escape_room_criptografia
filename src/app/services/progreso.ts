import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgresoService {
  // Nivel actual desbloqueado (del 1 al 5; 6 significa que todas están completas)
  nivelActual = 1;
  fragmentos: string[] = [];

  completarNivel(nivel: number, fragmento: string): void {
    if (!this.fragmentos.includes(fragmento)) {
      this.fragmentos.push(fragmento);
    }
    if (nivel >= this.nivelActual) {
      this.nivelActual = nivel + 1;
    }
  }

  reiniciar(): void {
    this.nivelActual = 1;
    this.fragmentos = [];
  }
}