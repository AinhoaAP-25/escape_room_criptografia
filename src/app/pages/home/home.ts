import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('dossierCard') dossierCard!: ElementRef;

  mostrarCarta = false;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Animación inicial de entrada de los elementos de portada
    gsap.from('.hero-element', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.25,
      ease: 'power3.out'
    });
  }

  abrirExpediente(): void {
    // Oculta la portada suavemente con GSAP
    gsap.to(this.heroSection.nativeElement, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        this.mostrarCarta = true;
        // Espera un instante para que Angular renderice la carta y la anima
        setTimeout(() => {
          gsap.fromTo(this.dossierCard.nativeElement,
            { scale: 0.9, opacity: 0, rotationX: 15 },
            { scale: 1, opacity: 1, rotationX: 0, duration: 0.8, ease: 'back.out(1.4)' }
          );
        }, 10);
      }
    });
  }

  empezarJuego(): void {
    // Transición de salida hacia la Prueba 1 (Agnes Meyer Driscoll)
    gsap.to('.home-container', {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        this.router.navigate(['/prueba-1']);
      }
    });
  }
}