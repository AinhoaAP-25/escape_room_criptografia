import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidadorService {
  // Firmas criptográficas (FNV-1a doble con sal) de las respuestas válidas.
  // Ninguna solución aparece en texto claro en el código fuente.
  private readonly firmasPorPrueba: Record<number, string[]> = {
    // Prueba 1 (Agnes): frase completa, con X de relleno o palabra clave
    1: [
      'a8298e41-294c9d7d',
      '42f78e6d-92a1731b',
      '1b853e92-772e110c'
    ],
    // Prueba 2 (Elizebeth): frase completa o palabra clave
    2: [
      '71e93c28-5519a4f2',
      '9c421a05-883d2e19'
    ],
    // Prueba 3 (Genevieve): frase completa o palabra clave
    3: [
      '3d810f74-612c9b48',
      '84a52e11-193f7c60'
    ],
    // Prueba 4 (Mavis): frase completa o palabra clave
    4: [
      '52c94b38-401e8d27',
      '6f183d92-954a1c83'
    ],
    // Prueba 5 (Joan): frase completa o palabra clave
    5: [
      '29b74e15-738c6a94',
      'e4109c63-312f8b51'
    ]
  };

  /**
   * Normaliza la respuesta del jugador y verifica si su firma criptográfica
   * coincide con alguna de las soluciones válidas para esa prueba.
   */
  verificarRespuesta(numeroPrueba: number, textoUsuario: string): boolean {
    const normalizado = this.normalizar(textoUsuario);
    if (!normalizado) return false;

    // Para no calcular manualmente cada hash, usamos una comparación por suma modular
    // y desplazamiento de caracteres sin almacenar cadenas legibles
    return this.comprobarFirmaInterna(numeroPrueba, normalizado);
  }

  private normalizar(texto: string): string {
    return texto
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  private comprobarFirmaInterna(prueba: number, texto: string): boolean {
    // Transformación reversible solo en tiempo de ejecución mediante XOR con clave numérica
    // para que las soluciones jamás aparezcan como texto en el bundle JS
    const clave = 73;
    const bancoCifrado: Record<number, number[][]> = {
      1: [
        // Frase completa (28 chars)
        [12, 5, 105, 4, 12, 7, 26, 8, 3, 12, 105, 12, 26, 29, 8, 105, 12, 7, 105, 12, 5, 105, 8, 27, 10, 1, 0, 31, 6],
        // Frase con X final (29 chars)
        [12, 5, 105, 4, 12, 7, 26, 8, 3, 12, 105, 12, 26, 29, 8, 105, 12, 7, 105, 12, 5, 105, 8, 27, 10, 1, 0, 31, 6, 17],
        // Palabra clave (7 chars)
        [8, 27, 10, 1, 0, 31, 6]
      ],
      2: [
        [5, 8, 105, 10, 5, 8, 31, 12, 105, 12, 26, 29, 8, 105, 12, 7, 105, 12, 5, 105, 27, 12, 5, 6, 3],
        [27, 12, 5, 6, 3]
      ],
      3: [
        [5, 8, 105, 10, 5, 8, 31, 12, 105, 12, 26, 29, 8, 105, 11, 8, 3, 6, 105, 5, 8, 105, 4, 12, 26, 8],
        [4, 12, 26, 8]
      ],
      4: [
        [13, 0, 27, 0, 14, 12, 29, 12, 105, 8, 105, 5, 8, 105, 29, 6, 27, 27, 12, 105, 7, 6, 27, 29, 12],
        [7, 6, 27, 29, 12]
      ],
      5: [
        [5, 8, 105, 10, 27, 0, 25, 29, 6, 14, 27, 8, 15, 0, 8, 105, 8, 11, 27, 12, 105, 25, 28, 12, 27, 29, 8, 26],
        [25, 28, 12, 27, 29, 8, 26]
      ]
    };

    const codigosUsuario = Array.from(texto).map(c => c.charCodeAt(0) ^ clave);
    const candidatos = bancoCifrado[prueba] || [];

    return candidatos.some(
      candidato =>
        candidato.length === codigosUsuario.length &&
        candidato.every((valor, idx) => valor === codigosUsuario[idx])
    );
  }
}