import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
  mostrarCarta = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    gsap.from('.hero-element', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.25,
      ease: 'power3.out'
    });
  }

  abrirExpediente(): void {
    gsap.to('.hero-content', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        this.mostrarCarta = true;
        // Forzamos a Angular a pintar la carta en el DOM inmediatamente
        this.cdr.detectChanges();

        gsap.fromTo(
          '.dossier-paper',
          { scale: 0.9, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }
        );
      }
    });
  }

  empezarJuego(): void {
    gsap.to('.home-container', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.router.navigate(['/mapa']);
      }
    });
  }
}