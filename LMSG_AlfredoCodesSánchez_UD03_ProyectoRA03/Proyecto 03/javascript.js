



let victorias = 0;
let derrotas = 0;
let empates = 0;

// Variables del modo jugador vs jugador
let modoJuego = "vs-cpu";          // "vs-cpu" o "vs-jugador"
let turnoActual = 1;               // 1 = Jugador 1, 2 = Jugador 2
let eleccionJugador1 = null;       // Guarda la elección del J1 mientras espera el J2

//Array con las posibles elecciones
const elecciones = ["piedra", "papel", "tijera", "lagarto", "spock"];

//Objeto que guarda el icono de cada elección
const iconos = {
  piedra: "🪨",
  papel: "📄",
  tijera: "✂️",
  lagarto: "🦎",
  spock: "🖖",
};

//Diccionario con las jugadas segun cada elección
const reglas = {
  piedra: ["tijera", "lagarto"],
  papel: ["piedra", "spock"],
  tijera: ["papel", "lagarto"],
  lagarto: ["spock", "papel"],
  spock: ["tijera", "piedra"],
};





/** 
* @brief Inicializa el juego configurando los elementos, estados y eventos necesarios. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function inicializarJuego() { 
 
    victorias = 0;
    derrotas = 0;
    empates = 0;

    actualizarContadores();
    reiniciarDisplays();
    inicializarTooltips();

    const botones = document.querySelectorAll(".boton-eleccion-jugada");

    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", () => {
            jugar(botones[i].id);
        });
    }

    const botonReiniciar = document.getElementById("boton-reiniciar");
    botonReiniciar.addEventListener("click", resetearJuego);

    const botonReglas = document.getElementById("boton-reglas");
    botonReglas.addEventListener("click", mostrarReglas);

    // Evento change en el select para cambiar el modo de juego
    const selectorModo = document.getElementById("selector-modo");
    selectorModo.addEventListener("change", () => {
        cambiarModoJuego(selectorModo.value);
    });
}


/**
* @brief Cambia el modo de juego entre "vs-cpu" y "vs-jugador".
*
* Actualiza la variable global modoJuego, adapta las etiquetas de la interfaz
* (jugadores, estadísticas), muestra u oculta el indicador de turno y
* reinicia el estado completo del juego.
*
* @param {string} modo - El modo seleccionado: "vs-cpu" o "vs-jugador".
* @return {void} No devuelve ningún valor.
*/
function cambiarModoJuego(modo) {

    modoJuego = modo;

    const etiquetaJ1       = document.getElementById("etiqueta-jugador1");
    const etiquetaJ2       = document.getElementById("etiqueta-jugador2");
    const indicadorTurno   = document.getElementById("indicador-turno");
    const etiquetaVictorias = document.getElementById("etiqueta-victorias");
    const etiquetaDerrotas  = document.getElementById("etiqueta-derrotas");

    if (modo === "vs-jugador") {
        // Cambia etiquetas de los jugadores
        etiquetaJ1.textContent = "Jugador 1";
        etiquetaJ2.textContent = "Jugador 2";

        // Cambia etiquetas del marcador (desde el punto de vista del J1)
        etiquetaVictorias.textContent = "Victoria J1";
        etiquetaDerrotas.textContent  = "Victoria J2";

        // Muestra el indicador de turno
        indicadorTurno.style.display = "flex";

    } else {
        // Restaura etiquetas al modo vs CPU
        etiquetaJ1.textContent = "Tú";
        etiquetaJ2.textContent = "CPU";

        etiquetaVictorias.textContent = "Victorias";
        etiquetaDerrotas.textContent  = "Derrotas";

        // Oculta el indicador de turno
        indicadorTurno.style.display = "none";
    }

    resetearJuego();
}


/** 
* @brief Ejecuta una ronda del juego con la elección del usuario. 
* Gestiona tanto el modo vs CPU como el modo jugador vs jugador.
* 
* @param {string} eleccionUsuario - La elección realizada por el usuario. 
* @return {void} No devuelve ningún valor. 
*/ 
function jugar(eleccionUsuario) {

    if (modoJuego === "vs-jugador") {
        jugarVsJugador(eleccionUsuario);
    } else {
        jugarVsCPU(eleccionUsuario);
    }
}


/**
* @brief Ejecuta una ronda en modo Jugador vs CPU.
*
* @param {string} eleccionUsuario - La elección del jugador.
* @return {void}
*/
function jugarVsCPU(eleccionUsuario) {

    reiniciarDisplays();

    const eleccionCPU = obtenerEleccionCPU();

    const displayJugador = document.getElementById("jugada-jugador");
    const displayCPU = document.getElementById("jugada-cpu");

    mostrarEleccion(displayJugador, eleccionUsuario, "TÚ");
    mostrarEleccion(displayCPU, eleccionCPU, "CPU");

    const resultado = calcularResultadoJugada(eleccionUsuario, eleccionCPU);
    mostrarResultadoJugada(resultado, eleccionUsuario, eleccionCPU);
}


/**
* @brief Gestiona los dos turnos del modo Jugador vs Jugador.
*
* En el turno 1: guarda la elección del J1, oculta su jugada con blur
* y pide al J2 que elija. En el turno 2: revela ambas jugadas, calcula
* el resultado y actualiza el marcador.
*
* @param {string} eleccion - La elección del jugador en turno.
* @return {void}
*/
function jugarVsJugador(eleccion) {

    const displayJugador = document.getElementById("jugada-jugador");
    const displayCPU     = document.getElementById("jugada-cpu");
    const indicadorTurno = document.getElementById("indicador-turno");
    const textoTurno     = document.getElementById("texto-turno");

    if (turnoActual === 1) {
        // Guardamos la elección del J1 y ocultamos su jugada
        eleccionJugador1 = eleccion;

        reiniciarDisplays();
        mostrarEleccion(displayJugador, eleccion, "J1");

        // Aplicamos blur para que J2 no vea la jugada de J1
        displayJugador.classList.add("oculta");

        // Actualizamos el indicador de turno al J2
        indicadorTurno.classList.add("turno-j2");
        textoTurno.textContent = "Turno del Jugador 2";

        // Actualizamos el mensaje
        const mensaje = document.getElementById("mensaje-resultado");
        mensaje.textContent = "¡Jugador 2, elige tu jugada!";
        mensaje.classList.remove("ganador", "perdedor", "empate");

        turnoActual = 2;

    } else {
        // Turno 2: revelamos ambas jugadas y calculamos resultado
        displayJugador.classList.remove("oculta");

        mostrarEleccion(displayJugador, eleccionJugador1, "J1");
        mostrarEleccion(displayCPU, eleccion, "J2");

        const resultado = calcularResultadoJugada(eleccionJugador1, eleccion);
        mostrarResultadoJugada(resultado, eleccionJugador1, eleccion);

        // Reseteamos el turno al J1
        turnoActual = 1;
        eleccionJugador1 = null;

        indicadorTurno.classList.remove("turno-j2");
        textoTurno.textContent = "Turno del Jugador 1";
    }
}


/** 
* @brief Genera aleatoriamente la elección de la CPU. 
* 
* Esta función selecciona una opción al azar entre las disponibles y la devuelve. 
* 
* @return {string} La elección de la CPU (por ejemplo: "piedra", "papel" o "tijera"...). 
*/ 
function obtenerEleccionCPU() {

    const indice = Math.floor(Math.random() * elecciones.length);
    return elecciones[indice];

}



/** 
* @brief Muestra la elección de un jugador (jugador humano o CPU) en un display con icono y texto. 
* 
* Esta función limpia el contenido del display, aplica la clase 
* para animación/estilo y agrega los elementos que representan 
* la jugada seleccionada (emoji y texto) del jugador indicado. 
* 
* @param {HTMLElement} display - El contenedor donde se mostrará la elección. 
* @param {string} eleccion - La clave de la elección (por ejemplo: "piedra", "papel", "tijera"...). 
* @param {string} jugador - Nombre del jugador que realizó la elección (por ejemplo: "JUGADOR" o "CPU"). 
* @return {void} No devuelve ningún valor. 
*/ 
function mostrarEleccion(display, eleccion, jugador) {

    display.innerHTML = "";
    //añadimos la clase active
    display.classList.add("active");

    const icono = document.createElement("div");
    icono.classList.add("icono-jugada-grande");
    icono.textContent = iconos[eleccion];

    const texto = document.createElement("div");
    texto.classList.add("texto-jugada");
    //Ponemos la primera letra en mayúscula y concatenamos el resto
    texto.textContent = eleccion.charAt(0).toUpperCase() + eleccion.slice(1);
    
    //Insertamos icono y texto
    display.appendChild(icono);
    display.appendChild(texto);

}



/** 
* @brief Reinicia los displays del juego a su estado inicial. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function reiniciarDisplays() {

    const displayJugador = document.getElementById("jugada-jugador");
    const displayCPU = document.getElementById("jugada-cpu");
    const mensaje = document.getElementById("mensaje-resultado");

    //Ponemos los placeholder en ?
    displayJugador.innerHTML = '<span class="placeholder">?</span>';
    displayCPU.innerHTML = '<span class="placeholder">?</span>';

    displayJugador.classList.remove("active", "oculta");
    displayCPU.classList.remove("active", "oculta");

    mensaje.textContent = "¡Batalla!";
    mensaje.classList.remove("ganador", "perdedor", "empate");

}



/** 
* @brief Calcula el resultado de una ronda entre el usuario y la CPU. 
* 
* Esta función compara la elección del usuario con la elección de la CPU 
* y determina si la ronda termina en victoria, derrota o empate según 
* las reglas del juego. 
* 
* @param {string} usuario - La elección del usuario (por ejemplo: "piedra", "papel", "tijera"...). 
* @param {string} cpu - La elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...). 
* @return {string} El resultado de la ronda: "victoria", "derrota" o "empate". 
*/ 
function calcularResultadoJugada(usuario, cpu) { 
    if (usuario === cpu) {
        return "empate";
    }

    let gana = false;
    for (let i = 0; i < reglas[usuario].length; i++) {
        if (reglas[usuario][i] === cpu) {
            gana = true;
        }
    }
    if (gana) return "victoria";

    return "derrota";
}



/** 
* @brief Muestra el resultado de una ronda en la interfaz del juego. 
* 
* Esta función actualiza el mensaje de resultado según si el usuario ganó, 
* perdió o empató, aplica la clase correspondiente para estilos y 
* actualiza los contadores de victorias, derrotas o empates. 
* 
* @param {string} resultado - Resultado de la ronda: "victoria", "derrota" o "empate". 
* @param {string} usuario - Elección del usuario (por ejemplo: "piedra", "papel", "tijera"...). 
* @param {string} cpu - Elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...). 
* @return {void} No devuelve ningún valor. 
*/ 
function mostrarResultadoJugada(resultado, usuario, cpu) {

    const mensaje = document.getElementById("mensaje-resultado");

    mensaje.classList.remove("ganador", "perdedor", "empate");

    if (resultado === "victoria") {
        mensaje.textContent = "¡Has ganado!";
        mensaje.classList.add("ganador");
        victorias++;
    } 
    else if (resultado === "derrota") {
        mensaje.textContent = "Has perdido...";
        mensaje.classList.add("perdedor");
        derrotas++;
    } 
    else {
        mensaje.textContent = "¡Empate!";
        mensaje.classList.add("empate");
        empates++;
    }

  actualizarContadores();

}



/** 
* @brief Actualiza los contadores de victorias, derrotas y empates en la interfaz. 
* 
* Esta función refleja los valores actuales de las variables globales 
* `victorias`, `derrotas` y `empates` en los elementos del DOM correspondientes. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function actualizarContadores() { 
    document.getElementById("victorias").textContent = victorias;
    document.getElementById("derrotas").textContent = derrotas;
    document.getElementById("empates").textContent = empates;
}



/** 
* @brief Inicializa los tooltips de los botones de elección. 
* 
* Esta función recorre todos los botones de elección, obtiene la jugada 
* asociada a cada uno y configura el atributo `title` para mostrar 
* un tooltip indicando qué opciones vence esa jugada. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function inicializarTooltips() { 
    const botones = document.querySelectorAll(".boton-eleccion-jugada");

    for (let i = 0; i < botones.length; i++) {
        const jugada = botones[i].id;
        let venceA = "";

        for (let j = 0; j < reglas[jugada].length; j++) {
            const op = reglas[jugada][j];
            // Primera letra en mayúscula y concatenamos el resto
            venceA += op.charAt(0).toUpperCase() + op.slice(1);
            if (j < reglas[jugada].length - 1) {
                venceA += " y ";
            }
        }
        botones[i].title = `Vence a: ${venceA}`;
    }
}


/** 
* @brief Muestra las reglas completas del juego en la consola. 
* 
* Esta función imprime un resumen de todas las reglas del juego, 
* indicando qué jugada vence a cuáles otras. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function mostrarReglas() { 
 
    /*const claves = Object.keys(reglas);

    console.log("***REGLAS DEL JUEGO***");

    for (let i = 0; i < claves.length; i++) {
        const jugada = claves[i];
        let venceA = "";
        for (let j = 0; j < reglas[jugada].length; j++) {
            const op = reglas[jugada][j];
            venceA += op.charAt(0).toUpperCase() + op.slice(1);
            if (j < reglas[jugada].length - 1) {
                venceA += " y ";
            }
        }
        console.log(`${jugada.charAt(0).toUpperCase() + jugada.slice(1)} vence a: ${venceA}`);
    }*/

}


/** 
* @brief Reinicia el juego a su estado inicial. 
* 
* @return {void} No devuelve ningún valor. 
*/ 
function resetearJuego() { 
    victorias = 0;
    derrotas = 0;
    empates = 0;

    // Reset estado modo JvJ
    turnoActual = 1;
    eleccionJugador1 = null;

    reiniciarDisplays();
    actualizarContadores();

    // Reseteamos el indicador de turno al J1 si estamos en modo JvJ
    if (modoJuego === "vs-jugador") {
        const indicadorTurno = document.getElementById("indicador-turno");
        const textoTurno     = document.getElementById("texto-turno");
        indicadorTurno.classList.remove("turno-j2");
        textoTurno.textContent = "Turno del Jugador 1";
    }

    const mensaje = document.getElementById("mensaje-resultado");
    mensaje.textContent = "¡Empezamos de nuevo!";

}


/** 
* @brief Maneja las pulsaciones de teclas para jugar o reiniciar el juego. 
*/ 
document.addEventListener('keydown', (event) => {
    const teclas = {
            "1": "piedra",
            "2": "papel",
            "3": "tijera",
            "4": "lagarto",
            "5": "spock"
    };

    if (teclas[event.key]) {
        jugar(teclas[event.key]);
    } else if (event.key === "r") {
        resetearJuego();
    } else if (event.key === "s") {
        mostrarReglas();
    }
});

// Se espera a que el DOM esté completamente cargado antes de inicializar el juego
document.addEventListener("DOMContentLoaded", inicializarJuego);