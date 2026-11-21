import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgresoService } from '../../services/progreso';
import gsap from 'gsap';

interface PuntoMapa {
  id: number;
  titulo: string;
  criptografa: string;
  sector: string;
  ruta: string;
  x: number; // Porcentaje horizontal en el mapa
  y: number; // Porcentaje vertical en el mapa
}

@Component({
  selector: 'app-mapa-recorrido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-recorrido.html',
  styleUrls: ['./mapa-recorrido.css']
})
export class MapaRecorrido implements AfterViewInit {
  puntos: PuntoMapa[] = [
    {
      id: 1,
      titulo: 'ARCHIVO 01',
      criptografa: 'Agnes Meyer Driscoll',
      sector: 'Cuartel Naval // Transposición',
      ruta: '/prueba-1',
      x: 15,
      y: 72
    },
    {
      id: 2,
      titulo: 'ARCHIVO 02',
      criptografa: 'Elizebeth Smith Friedman',
      sector: 'Estación de Escucha // César',
      ruta: '/prueba-2',
      x: 34,
      y: 35
    },
    {
      id: 3,
      titulo: 'ARCHIVO 03',
      criptografa: 'Genevieve Grotjan',
      sector: 'Sala Diplomática // Cifrado Afín',
      ruta: '/prueba-3',
      x: 54,
      y: 65
    },
    {
      id: 4,
      titulo: 'ARCHIVO 04',
      criptografa: 'Mavis Batey',
      sector: 'Torre Norte // Vigenère',
      ruta: '/prueba-4',
      x: 72,
      y: 28
    },
    {
      id: 5,
      titulo: 'ARCHIVO 05',
      criptografa: 'Joan Clarke',
      sector: 'Hut 8 Bletchley // Enigma',
      ruta: '/prueba-5',
      x: 88,
      y: 58
    }
  ];

  constructor(
    public progreso: ProgresoService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    gsap.from('.map-node', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'back.out(1.7)'
    });
  }

  estadoPunto(id: number): 'completado' | 'activo' | 'bloqueado' {
    if (id < this.progreso.nivelActual) return 'completado';
    if (id === this.progreso.nivelActual) return 'activo';
    return 'bloqueado';
  }

  entrarAPunto(punto: PuntoMapa): void {
    if (this.estadoPunto(punto.id) === 'bloqueado') return;

    gsap.to('.map-screen', {
      opacity: 0,
      scale: 1.03,
      duration: 0.45,
      onComplete: () => {
        this.router.navigate([punto.ruta]);
      }
    });
  }

  irAlFinal(): void {
    this.router.navigate(['/final']);
  }
}