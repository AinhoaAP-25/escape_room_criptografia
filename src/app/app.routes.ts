import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PruebaAgnes } from './pages/prueba-agnes/prueba-agnes';
import { PruebaElizebeth } from './pages/prueba-elizebeth/prueba-elizebeth';
import { PruebaGenevieve } from './pages/prueba-genevieve/prueba-genevieve';
import { PruebaMavis } from './pages/prueba-mavis/prueba-mavis';
import { PruebaJoan } from './pages/prueba-joan/prueba-joan';
import { Final } from './pages/final/final';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'prueba-1', component: PruebaAgnes },
  { path: 'prueba-2', component: PruebaElizebeth },
  { path: 'prueba-3', component: PruebaGenevieve },
  { path: 'prueba-4', component: PruebaMavis },
  { path: 'prueba-5', component: PruebaJoan },
  { path: 'final', component: Final },
  { path: '**', redirectTo: '' }
];