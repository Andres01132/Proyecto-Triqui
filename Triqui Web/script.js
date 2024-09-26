let tablero = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
let turnoJugador = null;
let eleccion = null; // 1 para 1v1, 2 para vs máquina
let jugadorX = '';
let jugadorO = '';
let movimientosRealizados = 0;

const consola = document.getElementById('consola');
const entrada = document.getElementById('entrada');
const btnEnviar = document.getElementById('btn-enviar');
const celdasTablero = document.querySelectorAll('#tablero td');

// Función para imprimir en la consola
function imprimirConsola(texto) {
    consola.innerHTML += texto + '\n';
    consola.scrollTop = consola.scrollHeight;
}

// Función para inicializar el juego
function iniciarJuego() {
    tablero = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
    turnoJugador = null;
    eleccion = null;
    jugadorX = '';
    jugadorO = '';
    movimientosRealizados = 0;
    actualizarTablero();

    consola.innerHTML = '';
    imprimirConsola('Jugar 1 vs 1: 1\nJugar 1 vs Algoritmo Máquina: 2');
    imprimirConsola('');
    imprimirConsola('Elige el modo de juego:');
}

// Función para manejar la entrada del usuario
function manejarEntrada() {
    const comando = entrada.value.trim();
    entrada.value = '';
    manejarJuego(comando);
}

// Función para manejar las etapas del juego
function manejarJuego(comando) {
    if (!eleccion) {
        if (comando === '1' || comando === '2') {
            eleccion = parseInt(comando);
            imprimirConsola(`\nModo elegido: ${eleccion === 1 ? '1 vs 1' : '1 vs Máquina'}`);
            imprimirConsola('');
            imprimirConsola('Ingresa el nombre del Jugador X:');
        } else {
            imprimirConsola('Por favor, elige una opción válida: 1 o 2');
        }
    } else if (!jugadorX) {
        jugadorX = comando;
        if (eleccion === 2) {
            jugadorO = 'Máquina';
            imprimirConsola(`\nJugador X: ${jugadorX}`);
            imprimirConsola('');
            imprimirConsola(`Jugador O: ${jugadorO}`);
            iniciarTurno();
        } else {
            imprimirConsola(`\nJugador X: ${jugadorX}`);
            imprimirConsola('');
            imprimirConsola('Ingresa el nombre del Jugador O:');
        }
    } else if (!jugadorO && eleccion === 1) {
        jugadorO = comando;
        imprimirConsola(`\nJugador O: ${jugadorO}`);
        iniciarTurno();
    }
}

// Función para iniciar el turno de juego
function iniciarTurno() {
    turnoJugador = Math.random() < 0.5;
    imprimirConsola(`\nTurno inicial: ${turnoJugador ? jugadorX : jugadorO}`);
    imprimirConsola('');
    mostrarTablero();
}

// Función para mostrar el tablero
function mostrarTablero() {
    if (movimientosRealizados === 9) {
        imprimirConsola('\n¡Es un empate!\n');
        imprimirConsola("Reinicia la página para volver a jugar.");
        return;
    }
    if (turnoJugador) {
        imprimirConsola(`${jugadorX}, elige una posición para X:`);
    } else if (jugadorO === 'Máquina') {
        movimientoMaquina();
    } else {
        imprimirConsola(`${jugadorO}, elige una posición para O:`);
    }
}

// Función para actualizar el tablero visual
function actualizarTablero() {
    tablero.forEach((val, index) => {
        celdasTablero[index].textContent = val !== '.' ? val : '';
        celdasTablero[index].className = val === 'X' ? 'jugador-x' : val === 'O' ? 'jugador-o' : '';
    });
}

// Función para realizar el movimiento del jugador
function realizarMovimiento(index) {
    if (tablero[index] !== '.') {
        imprimirConsola('¡Posición ocupada!');
        return;
    }
    const jugadorActual = turnoJugador ? 'X' : 'O';
    tablero[index] = jugadorActual;
    movimientosRealizados++;
    actualizarTablero();
    if (verificarGanador(jugadorActual)) {
        imprimirConsola(`\n¡${turnoJugador ? jugadorX : jugadorO} ha ganado!\n`);
        imprimirConsola("Reinicia la página para volver a jugar.");
        return;
    }
    turnoJugador = !turnoJugador;
    mostrarTablero();
}

// Función para verificar si hay un ganador
function verificarGanador(jugador) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];
    return combinacionesGanadoras.some(combinacion => {
        return combinacion.every(index => tablero[index] === jugador);
    });
}

// Función para el movimiento de la máquina
function movimientoMaquina() {
    let index;
    do {
        index = Math.floor(Math.random() * 9);
    } while (tablero[index] !== '.');
    tablero[index] = 'O';
    movimientosRealizados++;
    actualizarTablero();
    if (verificarGanador('O')) {
        imprimirConsola('\n¡La Máquina ha ganado!\n');
        imprimirConsola("Reinicia la página para volver a jugar.");
        return;
    }
    turnoJugador = !turnoJugador;
    mostrarTablero();
}

// Manejador de clic en el tablero
celdasTablero.forEach((celda, index) => {
    celda.addEventListener('click', () => {
        // Verifica si es el turno de un jugador humano y permite la jugada en el modo 1 vs 1
        if (eleccion === 1 && turnoJugador !== null && tablero[index] === '.') {
            realizarMovimiento(index);
        }
        // Para modo 1 vs máquina, solo permite jugada del humano y no de la máquina
        else if (eleccion === 2 && turnoJugador && tablero[index] === '.') {
            realizarMovimiento(index);
        }
    });
});

// Manejador de clic para el botón de enviar
btnEnviar.addEventListener('click', manejarEntrada);

// Manejador de tecla Enter en el campo de entrada
entrada.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        manejarEntrada();
    }
});

// Iniciar el juego
iniciarJuego();